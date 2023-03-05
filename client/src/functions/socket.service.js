import { io } from "socket.io-client";
import EventEmitter from 'events'

class TorrentSocketService extends EventEmitter {
    constructor(user_token) {
      super()

      this.user_token       = user_token
      this.socket           = null;
      this.refresh_state()
    }

    create_socket() {
			this.socket = io("http://localhost:5173", {
				path: "/socketo/",
				auth: {
						token: this.user_token
					}
			});
      this.socket.on('connect_error', (err) => {
        console.log('connect_error', err.message, err.data)
        this.delete_socket()
        this.refresh_state()
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

			this.socket.once('torrent_ready', (torrent_status) => {
				console.log("torrent_ready: ", torrent_status)
				this.torrent_status = torrent_status
        this.torrent_status = {...this.torrent_status}
			})

			this.socket.on('download', (torrent_status) => {
				console.log("download: ", torrent_status)
				this.torrent_status = torrent_status
        this.torrent_status = {...this.torrent_status}
			})

			this.socket.on('file_done', (file_status) => {
				console.log("file_done: ", file_status)
				if (file_status.type == 'SUBTITLE_FILE') {
					this.subs.push(file_status)
          this.subs = [...this.subs]
				}
			})

			this.socket.once('ready_to_watch'), () => {
				console.log("\n\nready_to_watch\n\n")
			}

      this.socket.once('torrent_added'), () => {
				console.log("torrent_added")
        this.torrent_added = true;
			}

			this.socket.emit('add_torrent', torrent_id)
		}

  }

export default TorrentSocketService;