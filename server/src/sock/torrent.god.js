const EventEmitter                  = require('events')
const fs                            = require("fs");

const { hash_title_to_magnet_link } = require('../utils/hash_title_to_magnet')
const torrent_functions_factory     = require('../controllers/torrent')
const event_names                   = require('../utils/events')
const fixtures                      = require('../utils/fixtures')
const throw_err_with_code           = require('../utils/error_throw')


DOWLOAD_SPAM_LIMIT_MS = 10000

class TorrentWatcher extends EventEmitter {
  constructor(torrent, torrent_db_data) {
    super()

    this.torrent              = torrent
    this.movie_length_minutes = torrent_db_data.length_minutes
    this.title                = torrent_db_data.title
    this.hash                 = torrent_db_data.hash
    this.ready_to_watch       = false

    this.setOnTorrentReady()
  }

  safetyWrapper(func) {
    // let this_tmp = this
    let wrapped = function() {
      try {
        func.apply(this, arguments)
      }
      catch (e) {
        console.log("error caught by safety wrapper", e)
        this.emit(event_names.TOR_WATCHER_ERROR)
      }
    }
    wrapped = wrapped.bind(this)
    return wrapped
  }

  setOnTorrentReady() {
    this.torrent.once('ready', this.safetyWrapper(() => {
        console.log("TORRENT REDY", this.torrent.name)
        if (this.getFileType(this.getLargestFile()) != "MOVIE_FILE") {
          console.log("Largest", this.getLargestFile(), "type" , this.getFileType(this.getLargestFile()), this.getStatus())
          this.emit(event_names.NO_STREAMABLE_FILE)
        }
        else {
          this.setOnFileDone()
          this.setOnDownloadEmitStatus()
          this.setOnDownloadCheckETA()
          this.emit('torrent_ready', this.getStatus())
        }
    }))
  }

  setOnFileDone() {
    for(const file of this.torrent.files) {
      file.once('done', this.safetyWrapper(() => {
        console.log(`${file.name} is done`)
        this.emit('file_done', this.getFileStatus(file))
      }))
    }
  }

  setOnDownloadEmitStatus() {
    let last_emit = new Date()
    this.torrent.on('download', this.safetyWrapper((dl) => {
      if (new Date() - last_emit > DOWLOAD_SPAM_LIMIT_MS) {
        last_emit = new Date()
        console.log("down", this.torrent.progress, dl, `ETA: ${Math.round(this.torrent.timeRemaining / 1000) / 60} min`)
        this.emit('download', this.getStatus())
      }
    }))
  }

  sizePrint(num) {
    return `${Math.round(num / (1000 * 1000 * 10)) / 100} Gb`
  }

  setOnDownloadCheckETA() {
    let dl_start = new Date()
    let handler = this.safetyWrapper(() => {
      let ETA_minutes    = this.torrent.timeRemaining / 1000 / 60
      // console.log( this.torrent.progress, this.movie_length_minutes)
      let loaded_minutes = this.torrent.progress * this.movie_length_minutes
      // console.log(`ETA_minutes ${Math.round(ETA_minutes)} loaded_minutes ${Math.round(loaded_minutes)}`)
      // if (fs.existsSync(`./torrents/${this.getLargestFile().path}`)) {
        // console.log(this.sizePrint(this.torrent.downloaded),  this.sizePrint(this.getLargestFile().length), this.sizePrint(fs.statSync(`./torrents/${this.getLargestFile().path}`).size), new Date(fs.statSync(`./torrents/${this.getLargestFile().path}`).mtime.getTime()), new Date())
      // }

      if (this.getLargestFile().name.endsWith('.mkv') && this.getLargestFile().done) {
        console.log("ITS READYYYY TO WATCH MKV")
        this.torrent.removeListener('download', handler);
        this.ready_to_watch = true
        this.emit('ready_to_watch')
      }
      else if (this.getLargestFile().name.endsWith('.mp4')
                && new Date() - dl_start > fixtures.MIN_TORRENT_TIME_S * 1000
                && ETA_minutes * fixtures.SAFETY_FACTOR < loaded_minutes)
                {
        console.log("ITS READYYYY TO WATCH BABY")
        this.ready_to_watch = true
        this.emit('ready_to_watch')
        this.torrent.removeListener('download', handler);
      }
    })
    this.torrent.on('download', handler)
  }

  getStatus() {
    let status = {
      name           : this.torrent.name,
      downloaded     : this.torrent.downloaded,
      hash           : this.hash,
      title          : this.title,
      size           : this.torrent.length,
      video_file_type: this.getLargestFile().name.slice(-4),
      metadata_ready : this.torrent.ready,
      ready_to_watch : this.ready_to_watch,
      downloadSpeed  : this.torrent.downloadSpeed,
      uploadSpeed    : this.torrent.uploadSpeed,
      files          : {},
    }

    for(const file of this.torrent.files) {
      status.files[file.name] = this.getFileStatus(file)
    }
    return status
  }

  getLargestFile() {
    return this.torrent.files.reduce(function(prev, current) {
      return (prev.length > current.length) ? prev : current
    })
  }

  getFileStatus(file) {
    return {
      done      : file.done,
      name      : file.name,
      path      : file.path,
      // TODO: fix negative downloaded values ?
      downloaded: file.downloaded < 0 ? 0: file.downloaded,
      size      : file.length,
      type      : this.getFileType(file)
    }
  }

  getFileType(file) {
    if (file.name.endsWith('.srt')) {
      return 'SUBTITLE_FILE'
    }

    if (file.name.endsWith('.mkv') || file.name.endsWith('.mp4')) {
      return 'MOVIE_FILE'
    }
  }
}


class GodEventHandler {
  constructor(io, db_pool, torrent_client) {
    this.io                = io
    this.rooms             = {}
    this.db_pool           = db_pool
    this.torrent_client    = torrent_client
    this.torrentWatchers   = {}
    this.torrent_functions = torrent_functions_factory(db_pool)
  }

  handle_add_torrent_event(torrent_id) {
    console.log("handling add tor for", torrent_id)
    if (this.torrentWatchers[torrent_id] != undefined) {
      this.io.to(torrent_id).emit('torrent_added', torrent_id)
      return console.log("torrent watcher already exists", torrent_id)
    }
    else {
      this.add_torrent(torrent_id)
    }

  }

  async add_torrent(torrent_id) {
    try {
      let torrent_db_data = await this.torrent_functions.get_torrent_from_id(torrent_id)
      let magnet_uri = hash_title_to_magnet_link(torrent_db_data.hash, torrent_db_data.title)

      if (this.torrent_client.get(magnet_uri)) {
        console.log("\n\n\nWTF DOUBLE TROUBLE THIS SHOULD NEVER PRINT\n\n\n", torrent_id, Object.keys(this.torrentWatchers))
        throw_err_with_code("You tried adding a torrent that's already present!", return_codes.BAD_ERROR)
      }

      console.log("adding magnete")
      let torrent = this.torrent_client.add(
        magnet_uri,
        {
            path      : "./torrents",
            strategy  : "sequential"
        }
      )

      console.log("adding tor watcher")
      this.addTorrentWatcher(torrent, torrent_db_data)
      // console.log(this.torrentWatchers[torrent_id])
    }
    catch (e) {
      if (e.code == event_names.TORRENT_NOT_EXIST) {
        console.log("Torrent not exists", id)
        return this.io.to(torrent_id).emit(event_names.TORRENT_NOT_EXIST)
      }

      if (e.code == event_names.BAD_ERROR) {
        console.log("Torrent client availability error", id)
        return this.io.to(torrent_id).emit(event_names.BAD_ERROR)
      }

      console.log("error in add torrent socket")
      throw(e)
      return this.io.to(torrent_id).emit(event_names.UNKNOWN_ERROR)
    }
  }

  remove_torrent(torrent_id) {
    try {
      console.log("\n\n\nremoving torrent", torrent_id)
      if (this.torrentWatchers[torrent_id]) {
        let magnet_uri = hash_title_to_magnet_link(this.torrentWatchers[torrent_id].hash, this.torrentWatchers[torrent_id].title)
        this.torrent_client.remove(magnet_uri)
        delete this.torrentWatchers[torrent_id]
      }
      else {
        throw(new Error("Removing unexisting torrent from client"))
      }

    }
    catch (e) {
      console.log("err in remove torrent on disconnect")
      throw(e)
    }
  }

  remove_torrent(torrent_id) {
    try {
      console.log("\n\n\nremoving torrent", torrent_id)
      if (this.torrentWatchers[torrent_id]) {
        let magnet_uri = hash_title_to_magnet_link(this.torrentWatchers[torrent_id].hash, this.torrentWatchers[torrent_id].title)
        this.torrent_client.remove(magnet_uri)
        delete this.torrentWatchers[torrent_id]
      }
      else {
        throw(new Error("Removing unexisting torrent from client"))
      }

    }
    catch (e) {
      console.log("err in remove torrent on disconnect")
      throw(e)
    }
  }

  addTorrentWatcher(torrent, torrent_db_data) {
    let torrent_id = torrent_db_data.id
    this.torrentWatchers[torrent_id] = new TorrentWatcher(torrent, torrent_db_data)

    this.torrentWatchers[torrent_id].on(event_names.TOR_WATCHER_ERROR, () => {
      console.log("\n\nemit tor watcher error\n\n")
      this.io.to(torrent_id).emit(event_names.TOR_WATCHER_ERROR)
    })

    // TODO: test NO_STREAMABLE_FILE on front and back
    this.torrentWatchers[torrent_id].once(event_names.NO_STREAMABLE_FILE, () => {
      console.log("emit no streamable")
      this.io.to(torrent_id).emit(event_names.NO_STREAMABLE_FILE)
      this.remove_torrent(torrent_id)
    })

    this.torrentWatchers[torrent_id].once('torrent_ready', (torrent_status) => {
      // console.log("emit tor ready", torrent_status)
      console.log("Subs set high prio")
      this.torrent_functions.set_subtitles_high_priority(torrent)
      this.io.to(torrent_id).emit('torrent_ready', torrent_status)
    })


    this.torrentWatchers[torrent_id].on('download', (torrent_status) => {
      console.log("emit dl")
      this.io.to(torrent_id).emit('download', torrent_status)
    })

    this.torrentWatchers[torrent_id].on('file_done', (file_status) => {
      // console.log("emit file done", file_status)
      this.io.to(torrent_id).emit('file_done', file_status)
    })

    this.io.to(torrent_id).emit('torrent_added', torrent_id)
  }

  bringNewcomerUpToDate(socket, torrent_id) {
    console.log("bring up to date")
    let torrent_watcher = this.torrentWatchers[torrent_id]

    if (torrent_watcher == undefined) return

    if (torrent_watcher.torrent.ready) {
      console.log("up to date: ready", torrent_watcher.getStatus())
      socket.emit('torrent_ready', torrent_watcher.getStatus())
    }

    for (const file of torrent_watcher.torrent.files) {
      if (file.done) {
        console.log("up to date: file done", file.name)
        socket.emit('file_done', torrent_watcher.getFileStatus(file))
      }
    }

    // if (torrent_watcher.ready_to_watch) {
    //   console.log("up to date: movie ready")
    //   socket.emit('ready_to_watch', 1)
    // }
  }
}

module.exports = GodEventHandler
