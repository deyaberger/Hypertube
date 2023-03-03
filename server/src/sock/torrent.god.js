const EventEmitter = require('events')
const { Server } = require('http')
const { hash_title_to_magnet_link } = require('../utils/hash_title_to_magnet')


class TorrentWatcher extends EventEmitter {
  constructor(torrent) {
    super()

    this.torrent = torrent
    this.setOnTorrentReady()
  }

  setOnTorrentReady() {
    this.torrent.once('ready', () => {
      this.setOnFileDone()
      this.setOnDownload() 
      this.emit('torrent_ready', (this.files))
    })
  }

  setOnFileDone() {
    for(file of this.torrent.files) {
      file.once('done', () => {
        console.log(`${file.name} is done`)
        this.files[file.name].status = "DOWNLOADED"
        this.emit('file_done', (file.name))
      })
    }
  }

  setOnDownload() {
    this.torrent.on('download', (dl) => {
      console.log("down", this.torrent.progress)
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
      for(file of this.torrent.files) {
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
    if (file.name.endWith('.srt')) {
      return 'SUBTITLE_FILE'
    }
    
    if (file.name.endWith('.avi') || file.name.endWith('.mp4')) {
      return 'MOVIE_FILE'
    }
  }
}


class GodEventHandler {
  constructor(io, db_pool, torrent_client) {
    this.torrentWatchers = {}
    this.rooms = {}
    this.io = io
    this.db_pool = db_pool
    this.torrent_client = torrent_client
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
      let [torrent_res, ] = await this.db_pool.query(
        `
        SELECT
          title,
          hash
        FROM
          torrents
        LEFT JOIN
          movies
        ON
          movies.id = torrents.movie_id
        WHERE
        torrents.id=?
        `,
        torrent_id
      )
      console.log("tores", torrent_res)
      if (torrent_res.length == 0) {
        return this.io.to(torrent_id).emit('wrong_torrent_id')
      }

      let magnet_uri = hash_title_to_magnet_link(torrent_res[0].hash, torrent_res[0].title)
      let torrent = this.torrent_client.get(magnet_uri)
      if (torrent != null && torrent.ready) {
        console.log("already tor")
        return torrent_ready_callback(torrent, torrent_id)
      }
      console.log("adding magnete")
      torrent = this.torrent_client.add(magnet_uri,
        {
            path      : "./torrents",                            
            strategy  : "sequential"
        },
        (tor) => this.torrent_ready_callback(tor, torrent_id))
    }
    catch (e) {
      console.log("error in add torrent socket")
      throw(e)
    }
  }

  addTorrentListener(user_id, torrent_id) {
    console.log("Add user_id to torrent_id room")
  }
}

module.exports = GodEventHandler
