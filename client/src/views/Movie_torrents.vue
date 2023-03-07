<script>
import { mapState } from 'vuex';
import { Get_torrents_for_movie } from '../functions/streaming'
import { Get_Single_Movie_Details } from '../functions/movies'
import TorrentSocketService from '../functions/socket.service.js';

export default {
	props: {
		movie_id: String,
	},


	data() {
		return {
			torrents         : [],
			movie_details    : null,
			torrent_service  : null,
		}
	},


	computed: {
		torrent_status() {
			if (this.torrent_service) {
				return this.torrent_service.torrent_status
			}
			return null
		},

		subs() {
			if (this.torrent_service) {
				return this.torrent_service.subs
			}
			return []
		},

		movie_source() {
			if (this.torrent_service && this.torrent_service.torrent_status) {
				return `http://localhost:8071/api/torrents/stream_magnet/${encodeURIComponent(this.torrent_service.torrent_status.hash)}/${encodeURIComponent(this.torrent_service.torrent_status.title)}`
			}
			return null
		},

		movie_ready_to_watch() {
			if (this.torrent_service && this.torrent_service.torrent_status) {
				return this.torrent_service.torrent_status.ready_to_watch
			}
			return false
		},

		...mapState({
			lang_nb    : state => state.lang_nb,
			user_token : state =>  state.user_token,
		})
	},


	methods: {
		async Choose_Torrent(torrent) {
			try {
				this.torrent_service.choose_torrent(torrent.id)
			}
			catch (e) {
				if (e.code == 'SOCKET_CREATION_ERROR') {
					console.log("Error in socket creation !@")
				}
			}
		},


		async get_movie_details() {
			console.log("gettings details")
			try {
				let res = await Get_Single_Movie_Details(this.movie_id, this.user_token)
				if (res.status == 200 && res.code == "SUCCESS") {
					console.log(res.data.movie)
					this.movie_details = res.data.movie
					console.log("deets", this.movie_details)
				}
				else {
					console.log("non sucess movie deets: ", res)
				}
			}
			catch (e) {
				if (e.code = 'EXPIRED_TOKEN' || e.code == 'CORRUPTED_TOKEN') {
					this.$store.commit('LOGOUT_USER')
					this.$router.push('/sign_in')
					return alert("Session expired")
				}
				console.log("erro in movie details", e.code)
				throw(e)
			}
		},

		videoErrorHandler(e) {
			console.log("Viderr:",e )
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
		this.torrent_service = new TorrentSocketService(this.user_token)
		this.torrent_service.on('TOKEN_ERROR', () => {
			this.$store.commit('LOGOUT_USER')
			this.$router.push('/sign_in')
			alert("Session expired")
		})
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
		<div v-if="torrent_service && torrent_service.torrent_status">
			<h1>Contents</h1>
			<h3 v-if="!torrent_service.torrent_status.metadata_ready">Loading</h3>
			<div v-else>
				<h2>Files</h2>
				<div v-for="file in torrent_service.torrent_status.files" v-bind:key="file.name">
					<span> {{ file }} </span>
				</div>

				<h2>Subs</h2>
				<div v-for="sub in subs" v-bind:key="sub.path">
					<span> {{ sub }} </span>
				</div>

				<div v-if="movie_ready_to_watch" >
					<video ref="movieplayer" controls loop id="videoPlayer" width="500" height="500" muted="muted" autoplay onerror="videoErrorHandler(e)">
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