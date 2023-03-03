const EventEmitter = require('events')
const { Server } = require('http')
const { hash_title_to_magnet_link } = require('../utils/hash_title_to_magnet')
const torrent_functions_factory     = require('../controllers/torrent')
const return_codes = require('../utils/return_codes')


class TorrentWatcher extends EventEmitter {
  constructor(torrent) {
    super()

    this.torrent = torrent
    this.setOnTorrentReady()
  }

  setOnTorrentReady() {
    this.torrent.once('ready', () => {
      console.log("TORRENT REDY", this.torrent.name)
      this.setOnFileDone()
      this.setOnDownload()
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

  setOnDownload() {
    this.torrent.on('download', (dl) => {
      // console.log("down", this.torrent.progress)
      this.emit('download', this.torrent._downloadSpeed(), this.torrent.downloaded)
    })
  }

  getStatus() {
    let status = {
      name          : this.torrent.name,
      downloaded    : this.torrent.downloaded,
      downloadSpeed : this.torrent.downloadSpeed,
      ready         : this.torrent.ready,
      files         : {},
    }

    if (status.ready) {
      for(const file of this.torrent.files) {
        status.files[file.name] = this.getFileStatus(file)
      }
    }

    return status
  }

  getFileStatus(file) {
    return {
      done      : file.done,
      name      : file.name,
      path      : file.path,
      downloaded: file.downloaded,
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

  addTorrenLOL(torrent, torrent_id) {
    console.log("add torrent to god", torrent.name, torrent_id)
    this.torrentWatchers[torrent_id] = new TorrentWatcher(torrent)

    this.torrentWatchers[torrent_id].once('torrent_ready', (files) => {
      console.log("Emit ready to room", torrent_id, files)
    }),

    this.torrentWatchers[torrent_id].on('file_done', (filename) => {
      console.log(`Emit done ${filename} to room, ${torrent_id}`)
    })

    this.torrentWatchers[torrent_id].on('download', (dlSpeed, dlTotal) => {
      this.io.to(torrent_id).emit('dowload', dlSpeed, dlTotal)

      console.log(`Download, ${torrent_id} ${dlSpeed} ${dlTotal}`)
    })
  }

  torrent_ready_callback(torrent, torrent_id) {
    let files = [];
    console.log("torrent ready", torrent.name)
    torrent.files.forEach(function(data) {
        files.push({
            name  : data.name,
            length: data.length
        });
    });
    console.log("sending torrent contents", files.length, torrent_id)
    // io.emit('torrent_ready', files)
    io.to(torrent_id).emit('torrent_ready', files)
  }

  async add_torrent(torrent_id) {
    try {
      let torrent_db_data = await this.torrent_functions.get_torrent_from_id(torrent_id)


      let magnet_uri = hash_title_to_magnet_link(torrent_db_data.hash, torrent_db_data.title)
      if (this.torrentWatchers[torrent_id] != undefined) {
        // TODO send this guy something !
        return console.log("torrent watcher already exists", torrent_id)
      }
      if (this.torrent_client.get(magnet_uri)) {
        console.log("\n\n\nWTF DOUBLE TROUBLE THIS SHOULD NEVER PRINT\n\n\n", torrent_id, this.torrentWatchers)
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
      this.addTorrentWatcher(torrent, torrent_id)
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

  addTorrentWatcher(torrent, torrent_id) {
    this.torrentWatchers[torrent_id] = new TorrentWatcher(torrent)
    this.torrentWatchers[torrent_id].once('torrent_ready', (torrent_status) => {
      console.log("emit tor ready", torrent_status)
      this.io.to(torrent_id).emit('torrent_ready', torrent_status)
    })

    this.torrentWatchers[torrent_id].once('file_done', (file_status) => {
      console.log("emit file done", file_status)
      this.io.to(torrent_id).emit('file_done', file_status)
    })

  }
}

module.exports = GodEventHandler
