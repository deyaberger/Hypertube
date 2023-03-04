const EventEmitter = require('events')
const { Server } = require('http')
const { hash_title_to_magnet_link } = require('../utils/hash_title_to_magnet')
const torrent_functions_factory     = require('../controllers/torrent')
const return_codes = require('../utils/return_codes')


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

  setOnTorrentReady() {
    this.torrent.once('ready', () => {
      console.log("TORRENT REDY", this.torrent.name)
      this.setOnFileDone()
      this.setOnDownloadEmitStatus()
      this.setOnDownloadCheckETA()
      this.emit('torrent_ready', this.getStatus())
    })
  }

  setOnFileDone() {
    for(const file of this.torrent.files) {
      file.once('done', () => {
        console.log(`${file.name} is done`)
        this.emit('file_done', this.getFileStatus(file))
      })
    }
  }

  setOnDownloadEmitStatus() {
    let last_emit = new Date()
    this.torrent.on('download', (dl) => {
      if (new Date() - last_emit > DOWLOAD_SPAM_LIMIT_MS) {
        last_emit = new Date()
        console.log("down", this.torrent.progress, dl, `ETA: ${Math.round(this.torrent.timeRemaining / 1000) / 60} min`)
        this.emit('download', this.getStatus())
      }
    })
  }

  setOnDownloadCheckETA() {
    let handler = () => {
      let ETA_minutes    = this.torrent.timeRemaining / 1000 / 60
      // console.log( this.torrent.progress, this.movie_length_minutes)
      let loaded_minutes = this.torrent.progress * this.movie_length_minutes
      // console.log(`ETA_minutes ${Math.round(ETA_minutes)} loaded_minutes ${Math.round(loaded_minutes)}`)
      if (ETA_minutes * 3 < loaded_minutes) {
        console.log("ITS READYYYY TO WATCH BABY")
        this.ready_to_watch = true
        this.emit('ready_to_watch')
        this.torrent.removeListener('download', handler);
      }
    }
    this.torrent.on('download', handler)
  }

  getStatus() {
    let status = {
      name          : this.torrent.name,
      downloaded    : this.torrent.downloaded,
      hash          : this.hash,
      title         : this.title,
      size          : this.torrent.length,
      metadata_ready: this.torrent.ready,
      ready_to_watch: this.ready_to_watch,
      downloadSpeed : this.torrent.downloadSpeed,
      uploadSpeed   : this.torrent.uploadSpeed,
      files         : {},
    }

    for(const file of this.torrent.files) {
      status.files[file.name] = this.getFileStatus(file)
    }
    return status
  }

  getFileStatus(file) {
    return {
      done      : file.done,
      name      : file.name,
      path      : file.path,
      // TODO: fix negative downloaded values ?
      downloaded: file.downloaded,
      size      : file.length,
      type      : this.getFileType(file)
    }
  }

  getFileType(file) {
    if (file.name.endsWith('.srt')) {
      return 'SUBTITLE_FILE'
    }
    
    if (file.name.endsWith('.avi') || file.name.endsWith('.mp4')) {
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
      this.io.to(torrent_id).emit('torrent_added')
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
      if (e.code == return_codes.TORRENT_NOT_EXIST) {
        console.log("Torrent not exists", id)
        return this.io.to(torrent_id).emit(return_codes.TORRENT_NOT_EXIST)
      }
      console.log("error in add torrent socket")
      throw(e)
    }
  }

  addTorrentWatcher(torrent, torrent_db_data) {
    let torrent_id = torrent_db_data.id
    this.torrentWatchers[torrent_id] = new TorrentWatcher(torrent, torrent_db_data)
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

    this.io.to(torrent_id).emit('torrent_added')
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
