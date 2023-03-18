import { io } from "socket.io-client";
import EventEmitter from 'events'

function formatSizeUnits(bytes){
  try {
    if      (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB/s"; }
    else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(2) + " MB/s"; }
    else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2) + " KB/s"; }
    else if (bytes >= 1)          { bytes = bytes.toFixed(0) + " b/s"; }
    else                          { bytes = "0 b/s"; }
    return bytes;
  }
  catch (e) {
    throw(e)
    return ''
  }
  
}

class TorrentSocketService extends EventEmitter {
    constructor(user_token) {
      super()

      this.user_token       = user_token
      this.socket           = null;
      this.refresh_state()
    }

    create_socket() {
      console.log("create connetion socket")
			this.socket = io("", {
				path: "/socketo/",
				auth: {
						token: this.user_token
					}
			});
      this.socket.on('connect_error', (err) => {
        console.log('connect_error', err.message, err.data)
        this.delete_socket()
        this.refresh_state()
        if (err && err.data == 'EXPIRED_TOKEN' || err.data == 'CORRUPTED_TOKEN') {
          return this.emit("TOKEN_ERROR")
        }
        this.emit("TOKEN_ERROR")
        throw(err)
      })
    }

    delete_socket() {
      console.log("close connetion socket")
      if (this.socket) {
        this.socket.close()
        this.socket == null
      }
    }

    refresh_state() {
      this.torrent_status   = null;
      this.subs             = [];
      this.torrent_added    = false;
    }

    refresh_socket() {
      try {
        if (this.socket) {
          this.delete_socket()
        }
        this.create_socket()
      }
      catch (e) {
        console.log("error in create socket", e)
        let err = new Error("Error in socket creation")
        err.code = "SOCKET_CREATION_ERROR"
        throw(err)
      }
    }

    async choose_torrent(torrent_id) {
      this.refresh_state()
      this.refresh_socket()

			this.socket.once('TOR_WATCHER_ERROR', (err) => {
        console.log('TOR_WATCHER_ERROR')
        this.refresh_state()
        this.delete_socket()
        this.emit('TOR_WATCHER_ERROR')
      })

      this.socket.once('NO_STREAMABLE_FILE', () => {
        console.log('NO_STREAMABLE_FILE')
        this.refresh_state()
        this.delete_socket()
        this.emit('NO_STREAMABLE_FILE')
      })

			this.socket.once('torrent_ready', (torrent_status) => {
				console.log("torrent_ready: ", torrent_status)
				this.torrent_status = torrent_status
        this.torrent_status = {...this.torrent_status}
        this.emit('torrent_ready', torrent_status)
			})

			this.socket.on('download', (torrent_status) => {
				torrent_status.downloadSpeed = formatSizeUnits(torrent_status.downloadSpeed / 10)
        console.log("download: ", torrent_status)
				this.torrent_status = torrent_status
        this.torrent_status = {...this.torrent_status}
        this.emit('download', torrent_status)
			})

			this.socket.on('file_done', (file_status) => {
				console.log("file_done: ", file_status)
				if (file_status.type == 'SUBTITLE_FILE') {
					this.subs.push(file_status)
          this.subs = [...this.subs]
				}
			})

			this.socket.on('ready_to_watch'), () => {
				console.log("ready_to_watch event recieved")
			}

			this.socket.emit('add_torrent', torrent_id)
		}

  }
export default TorrentSocketService;