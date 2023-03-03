const EventEmitter = require('events')
const { Server } = require('http')
const { hash_title_to_magnet_link } = require('../utils/hash_title_to_magnet')
const torrent_functions_factory     = require('../controllers/torrent')
const return_codes = require('../utils/return_codes')


DOWLOAD_SPAM_LIMIT_MS = 1000

class TorrentWatcher extends EventEmitter {
  constructor(torrent, torrent_db_data) {
    super()

    this.torrent              = torrent
    this.movie_length_minutes = torrent_db_data.length_minutes
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
        console.log("down", this.torrent.progress, dl)
        this.emit('download', this.getStatus())
      }
    })
  }

  isMovieReadyHandler() {

  }

  setOnDownloadCheckETA() {
    let handler = () => {
      let ETA_minutes    = this.torrent.timeRemaining / 1000 / 60
      console.log( this.torrent.progress, this.movie_length_minutes)
      let loaded_minutes = this.torrent.progress * this.movie_length_minutes
      console.log(`ETA_minutes ${Math.round(ETA_minutes)} loaded_minutes ${Math.round(loaded_minutes)}`)
      if (ETA_minutes * 3 < loaded_minutes) {
        console.log("ITS READYYYY BABY")
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
      downloadSpeed : this.torrent.downloadSpeed,
      metadata_ready: this.torrent.ready,
      size          : this.torrent.size,
      ready_to_watch: this.ready_to_watch,
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


  async add_torrent(torrent_id) {
    try {
      let torrent_db_data = await this.torrent_functions.get_torrent_from_id(torrent_id)

      console.log(torrent_db_data)
      let magnet_uri = hash_title_to_magnet_link(torrent_db_data.hash, torrent_db_data.title)
      if (this.torrentWatchers[torrent_id] != undefined) {
        // TODO send this guy something !
        this.io.to(torrent_id).emit('torrent_added', this.torrentWatchers[torrent_id].getStatus())
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
      this.addTorrentWatcher(torrent, torrent_db_data)
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
      console.log("emit tor ready", torrent_status)
      this.io.to(torrent_id).emit('torrent_ready', torrent_status)
    })
    

    this.torrentWatchers[torrent_id].on('download', (torrent_status) => {
      console.log("emit dl")
      this.io.to(torrent_id).emit('download', torrent_status)
    })

    this.torrentWatchers[torrent_id].on('file_done', (file_status) => {
      console.log("emit file done", file_status)
      this.io.to(torrent_id).emit('file_done', file_status)
    })

    this.io.to(torrent_id).emit('torrent_added', this.torrentWatchers[torrent_id].getStatus())
  }
}

module.exports = GodEventHandler
