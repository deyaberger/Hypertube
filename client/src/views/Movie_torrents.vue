<script>
import { mapState } from 'vuex';
import { Get_torrents_for_movie } from '../functions/streaming'
import { Get_Single_Movie_Details } from '../functions/movies'
import { io } from 'socket.io-client';
// import SocketioService from '../functions/socket.service.js';

export default {
	props: {
		movie_id: String,
	},


	data() {
		return {
			torrents         : [],
			selected_torrent : null,
			movie_details    : null,
			torrent_status   : null,
			movie_ready      : false,
			subs             : [],
			socket           :null,
		}
	},


	components: {
	},


	computed: {
		movie_source() {
			return 'http://localhost:8071/api/torrents/stream_magnet/${encodeURIComponent(this.selected_torrent.hash)}/${encodeURIComponent(this.movie_details.title)}`'
		},

		...mapState({
			lang_nb    : state => state.lang_nb,
			user_token : state =>  state.user_token,
		})
	},


	methods: {
		async Choose_Torrent(arg) {
			this.movie_ready    = false
			this.torrent_status = null

			if (this.socket) {
				this.socket.disconnect()
			}
			this.create_socket()

			this.socket.once('torrent_ready', (torrent_status) => {
				console.log("torrent_ready: ", torrent_status)
				this.torrent_status = torrent_status
			})

			this.socket.on('download', (torrent_status) => {
				console.log("download: ", torrent_status)
				this.torrent_status = torrent_status
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

			this.socket.emit('add_torrent', arg.id)
		},


		async get_movie_details() {
			console.log("gettings details")
			try {
				let res = await Get_Single_Movie_Details(this.movie_id, this.user_token)
				// TODO: && res.code == "SUCCESS"
				if (res.status == 200) {
					console.log(res.data.movie)
					this.movie_details = res.data.movie
					console.log("deets", this.movie_details)
				}
				else {
					console.log("non sucess movie deets: ", res)
				}
			}
			catch (e) {
				console.log("erro in movie details", e)
			}
		},

		supervise() {
			console.log("bortsa")
			console.log(this.$refs.movieplayer)
			this.$refs.movieplayer.onseeking = (lol) => {
				console.log("seekeing:", lol)
			}
			console.log(this.$refs.movieplayer.networkState)
		},

		create_socket() {
			console.log("socket connect", this.user_token)
			this.socket = io("http://localhost:5173", {
				path: "/socketo/",
				auth: {
						token: this.user_token
					}
			});
		}
	},


	async mounted() {
		console.log("mounted torrent page")
		try {
			await this.get_movie_details()
			let response
			console.log(this.movie_id, this.user_token)
			response = await Get_torrents_for_movie(this.movie_id, this.user_token)

			if (response.status == 200 && response.data.code == "SUCCESS") {
				this.torrents = response.data.torrents
				console.log("Got: ", this.torrents)
			}
			else {
				console.log("Non 200 in mount get torrents", response)
			}
		}
		catch (e) {
				console.log("error in mount get torrents", e)
		}
	},

	created() {
		this.create_socket()
	}
}
</script>

<template>
	<div class="homemade-container">
		<h1>Torrents</h1>
		<div class="card b-1 hover-shadow mb-20" v-for="(torrent, index) in torrents" :key="index">
			  <div class="media card-body">
				<span @click="Choose_Torrent(torrent)"> {{ torrent }}</span>
			</div>
		</div>
		
		<h1>Selected Torrent</h1>
		<div v-if="selected_torrent">
			{{selected_torrent}}
		</div>
		
		<h1>Contents</h1>
		<h3 v-if="!torrent_status">Loading</h3>
		<div v-else>
			<h2>Files</h2>
			<div v-for="file in torrent_status.files" v-bind:key="file.name">
				<span> {{ file }} </span>
			</div>

			<h2>Subs</h2>
			<div v-for="sub in subs" v-bind:key="sub.path">
				<span> {{ sub }} </span>
			</div>

			<div v-if="movie_ready" >
				<button @click="supervise">Supervise</button>
				<video ref="movieplayer" controls loop id="videoPlayer" width="500" height="500" muted="muted" autoplay>
					<source :src='movie_source' type="video/mp4" />
						<track v-for="sub in subs" v-bind:key="sub.path"
							:label="sub.name"
							kind="subtitles"
							:src="'/api/torrents/subtitles/get/' + encodeURIComponent(sub.path)"
						/>
				</video>
			</div>
		</div>

		
	</div>
</template>



<style lang="scss" scoped>

.media {
	display: -ms-flexbox;
	display: flex;
	-ms-flex-align: start;
	align-items: flex-start;
	padding: 16px 12px;
	-webkit-transition: background-color .2s linear;
	transition: background-color .2s linear;
	background-color: black;
}

.card-body {
	-ms-flex: 1 1 auto;
	flex: 1 1 auto;
	padding: 1.25rem;
}

.time {
	text-align: end;
}

.icon.score.bof {
	color: rgba(255, 196, 0, 0.671)
}

.icon.score.bad {
	color: rgba(255, 0, 0, 0.671)
}

</style>