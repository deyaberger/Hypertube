import { io } from 'socket.io-client';

class TorrentSocketService {
    constructor(user_token) {
      this.user_token = user_token
      this.socket     = null;
      this.state      = null;

      this.refresh_state()
    }
    
    create_socket() {
			this.socket = io("http://localhost:5173", {
				path: "/socketo/",
				auth: {
						token: this.user_token
					}
			});
      console.log("SOKE:",this.socket)
    }

    delete_socket() {
      this.socket.close()
      this.socket == null
    }

    refresh_state() {
      this.state = {
        subs             : [],
        torrent_status   : null,
      }
    }

    refresh_socket() {
      try {
        if (this.socket) {
          this.socket.disconnect()
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

			this.socket.once('torrent_ready', (torrent_status) => {
				console.log("torrent_ready: ", torrent_status)
				this.state.torrent_status = torrent_status
        this.state = {...this.state}
			})

			this.socket.on('download', (torrent_status) => {
				console.log("download: ", torrent_status)
				this.state.torrent_status = torrent_status
        this.state = {...this.state}
			})

			this.socket.on('file_done', (file_status) => {
				console.log("file_done: ", file_status)
				if (file_status.type == 'SUBTITLE_FILE') {
					this.state.subs.push(file_status)
          this.state = {...this.state}
				}
			})

			this.socket.once('ready_to_watch'), () => {
				console.log("\n\nready_to_watch\n\n")
			}

			this.socket.emit('add_torrent', torrent_id)
		}

  }
  
export default TorrentSocketService;