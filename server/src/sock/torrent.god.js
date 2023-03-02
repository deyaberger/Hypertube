const EventEmitter = require('events')


class TorrentWatcher extends EventEmitter {
  constructor(torrent) {
    super()

    this.torrent = torrent
    this.files = {}
    this.torrent.once('ready', () => {
      for(file of this.torrent.files) {
        this.files[file.name] = {
          status    : 'STARTED',
          fileObject: file,
        }

        file.once('done', () => {
          console.log(`${file.name} is done`)
          this.files[file.name].status = "DOWNLOADED"
          this.emit('file_done', (file.name))
        })
      }
      this.emit('torrent_ready', (this.files))
    })
    this.torrent.on('download', (dl) => {
      console.log("down", this.torrent.progress)
      this.emit('download', this.torrent._downloadSpeed(), this.torrent.downloaded)
    })

  }
}


class GodEventHandler {
  constructor(io) {
    this.torrentWatchers = {}
    this.rooms = {}
    this.io = io
  }

  addTorrent(torrent, torrent_id) {
    console.log("add torrent to god", torrent.name, torrent_id)
    this.torrentWatchers[torrent_id] = new TorrentWatcher(torrent)

    this.torrentWatchers[torrent_id].once('torrent_ready', (files) => {
      console.log("Emit ready to room", torrent_id, files)
    }),

    this.torrentWatchers[torrent_id].on('dowloaded', (bytes) => {
      console.log("Emit downloaded",bytes, "to room", torrent_id)
    })

    this.torrentWatchers[torrent_id].on('file_done', (filename) => {
      console.log(`Emit done ${filename} to room, ${torrent_id}`)
    })

    this.torrentWatchers[torrent_id].on('download', (dlSpeed, dlTotal) => {
      console.log(`Download, ${torrent_id} ${dlSpeed} ${dlTotal}`)
    })
  }

  addTorrentListener(user_id, torrent_id) {
    console.log("Add user_id to torrent_id room")
  }
}

module.exports = GodEventHandler
