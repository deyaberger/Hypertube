<script>
import { mapState } from 'vuex';
import { Get_Single_Movie_Details,
		 Parse_Single_Movie,
		 Set_Watched,
		 Set_UnWatched,
		 Remove_From_Favorites, Add_To_Favorites } from "../functions/movies";
import textContent from "../assets/language_dict/language_dict.json";
import { io } from 'socket.io-client';
import TorrentSocketService from '../functions/socket.service.js';
import store from '../stores/store';
import Comments from '../components/Comments.vue'
import Torrents_buttons from '../components/Torrents_buttons.vue'
import Movie_infos from '../components/Movie_infos.vue'

export default {
	name: "SingleMovie",

	beforeRouteEnter(to, from, next) {
		const isAuthenticated = store.state.user_token != null // check if the user is authenticated
		if (!isAuthenticated) {
			console.log("[single_movie]: not logged in yeat, redirecting to sign in")
			next("/sign_in") // redirect to sign-in page if the user is not authenticated
		} else {
			next() // continue with navigation
		}
	},

	props: {
		movie_id: String,
	},

	components: {
		Comments,
		Torrents_buttons,
		Movie_infos
	},

	data() {
		return {
			text_content        : textContent.MOVIES,
			movie               : [],
			movie_error         : false,
			fallbackUrl         : '../src/assets/missing_cover.jpeg',
			on_video            : false,
			torrent_service     : null,
			torrent_loading     : false,
			torrent_error       : false,
			download_speed      : ''
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
				return `/api/torrents/stream_magnet/${encodeURIComponent(this.torrent_service.torrent_status.hash)}/${encodeURIComponent(this.torrent_service.torrent_status.title)}`
			}
			return null
		},

		movie_ready_to_watch() {
			if (this.torrent_service && this.torrent_service.torrent_status) {
				if (this.torrent_service.torrent_status.ready_to_watch == true) {
					this.torrent_loading = false;
				}
				return this.torrent_service.torrent_status.ready_to_watch
			}
			return false
		},

		movie_file_type_ok() {
			if (this.torrent_service && this.torrent_service.torrent_status) {
				return this.isVideoFormatCompatible(this.torrent_service.torrent_status.video_file_type)
			}
			return false
		},


		...mapState({
			lang_nb    : state => state.lang_nb,
			user_token : state =>  state.user_token,
		})
	},


	methods: {
		Choose_Torrent(value) {
			this.torrent_error = false
			const torrent = JSON.parse(JSON.stringify((value.torrent)));
			this.torrent_loading = true;
			this.download_speed = ''
			try {
				this.torrent_service.choose_torrent(torrent.id)
			}
			catch (e) {
				console.log("choose_torrent error", e)
				if (e.code == 'SOCKET_CREATION_ERROR') {
					this.torrent_loading = false
					this.torrent_error = true
					console.log("SOCKET_CREATION_ERROR")
				}
			}
		},

		async set_watched() {
			try {
				console.log("[single_movie]: Setting movie to watched: ...", {id: this.movie_id})
				let res = await Set_Watched(this.movie_id, this.user_token)
				this.movie.is_watched = true
				if (res.data.code == "SUCCESS") {
					console.log("[single_movie]: Successfully updated watched!")
				}
				else {
					console.log("ERROR: [single_movie] in set_watched: ", res)
				}
			}
			catch(e) {
				console.log("UNKNOWN ERROR [single_movie]: in set_watched")
			}
		},

		async update_fav() {
			let res = null
			try {
				if (this.movie.is_fav) {
					res = await Remove_From_Favorites(this.movie_id, this.user_token)
				}
				else {
					res = await Add_To_Favorites(this.movie_id, this.user_token)
				}
				this.movie.is_fav = !this.movie.is_fav
				if (res.data && res.data.code == "SUCCESS") {
					console.log("[single_movie]: Successfully updated fav!")
				}
				else {
					console.log("ERROR: [single_movie] in update_fav: ", res)
				}
			}
			catch(e) {
				console.log("UNKNOWN ERROR [single_movie]: in update_fav")
			}
		},

		async get_movie_details() {
			try {
				console.log("[single_movie]: getting movie details...")
				let res = await Get_Single_Movie_Details(this.movie_id, this.user_token);
				if (res && res.data && res.data.code == "SUCCESS") {
					this.movie = Parse_Single_Movie(res.data.movie);
					console.log("[single_movie]: Successfully got movie details! ", this.movie)
					return
				}
				else if (res && res.data && res.data.code == "MISSING_MOVIE") {
					this.movie_error = true
					console.log("ERROR [single_movie]: No Movie found with id: ", this.movie_id)
					return
				}
				else if (res && res.data && res.data.code == "FAILURE") {
					this.movie_error = true
					console.log("ERROR [single_movie]: ", res.data.msg)
					return
				}
				this.movie_error = true
				console.log("WTF in get movie deets", res.status, res.data)
			}
			catch (e) {
				if (e.code == 'EXPIRED_TOKEN' || e.code == 'CORRUPTED_TOKEN') {
					return alert("Session expired")
				}
				if (e.code == "ER_BAD_FIELD_ERROR") {
					console.log("ER_BAD_FIELD_ERROR [single_movie]: in get_movie_details, make sure the DB is up to date")
				}
				this.movie_error = true
				if (e.code == 'EXPIRED_TOKEN' || e.code == 'CORRUPTED_TOKEN') {
					this.$store.commit('LOGOUT_USER')
					this.$router.push('/sign_in')
					return alert("Session expired")
				}
				if (e.code == "ER_BAD_FIELD_ERROR") {
					console.log("ER_BAD_FIELD_ERROR [single_movie]: in get_movie_details, make sure the DB is up to date")
				}
				console.log("UNKNOWN ERROR [single_movie]: in get_movie_details")
			}
		},

		videoErrorHandler(e) {
			console.log("Viderr:",e )
		},

		isVideoFormatCompatible(format) {
			if (format == ".mp4") {
				return true
			}
			if (format == '.mkv' && navigator.userAgent.includes("Chrome")) {
				return true
			}
			return false
		},

		handle_image_error(event, movie) {
			try {
				const nextIndex = parseInt(event.target.dataset.nextIndex)
				const nextImage = movie.images_list[nextIndex];
				if (nextImage) {
					event.target.src = nextImage;
				} else {
					event.target.src = this.fallbackUrl;
				}
			}
			catch (e) {
				event.target.src = this.fallbackUrl;
			}
		},
	},
	async mounted() {
		await this.get_movie_details();
	},

	created() {
		this.torrent_service = new TorrentSocketService(this.user_token)
		this.torrent_service.on('torrent_ready', (torrent_status) => {
			let okidoki = this.isVideoFormatCompatible(torrent_status.video_file_type)
			if (!okidoki) {
				this.torrent_loading = false
				this.torrent_error = true
				console.log("NO_STREAMABLE_FILE")
				return alert("The torrent does not contain a video file compatible with your browser.")
				// throw(new Error("PLAYING MKV ON FIREFOX WILL CAUSE ERROR"))
			}
			this.set_watched()
		});

		this.torrent_service.on('download', (status) => {
			console.log("download handle")
			try {
				this.download_speed = status.downloadSpeed
			}
			catch {
				this.download_speed = 0
			}
		})

		this.torrent_service.on('TOR_WATCHER_ERROR', () => {
			this.torrent_loading = false
			this.torrent_error = true
			alert("The movie file is corrupted")
			console.log("TOR_WATCHER_ERROR")
		})

		this.torrent_service.on('TORRENT_NOT_EXIST', () => {
			this.torrent_loading = false
			this.torrent_error = true
			alert("The torrent is broken")
			console.log("TORRENT_NOT_EXIST")
		})

		this.torrent_service.on('NO_STREAMABLE_FILE', (status) => {
			this.torrent_loading = false
			this.torrent_error = true
			alert("The torrent does not contain a video file compatible with your browser.")
			console.log("NO_STREAMABLE_FILE")
		})
	},

	unmounted () {
		console.log("unmounting")
		if (this.torrent_service) {
			this.torrent_service.delete_socket()
		}
	}

}
</script>

<template>
	<div class="homemade-container" v-if="!movie_error && movie">
		<div class="row movie_container justify-content-md-center">
			<div v-if="movie && movie.length == 0" class="col-md-auto">
					<b-spinner label="Loading..." variant="success" class="mt-5"></b-spinner>
				</div>
			<div v-else class="col video_container" id="video_container">
				<div v-if="movie_ready_to_watch && movie_file_type_ok" class="image_container">
					<video ref="movieplayer" controls loop id="videoPlayer" muted="muted" autoplay onerror="videoErrorHandler(e)">
						<source :src="movie_source" type="video/mp4" />
						<track v-for="sub in subs" v-bind:key="sub.path"
							:label="sub.name"
							kind="subtitles"
							:src="'/api/torrents/subtitles/get/' + encodeURIComponent(sub.path)"
						/>
					</video>
				</div>
				<div v-else >
					<div v-if="!torrent_loading && !torrent_error">
						<img class="movie_image not_ready" :src="movie.images_list[6]" alt="movie_image" :data-next-index="1" @error="handle_image_error($event, movie)"/>
						<a class="see_movie" href="#target-element" data-toggle="tooltip" data-placement="top" title="See & select torrents"><b-icon-eye-fill class="on_image"></b-icon-eye-fill></a>
					</div>
					<div v-else>
						<img class="movie_image loading" :src="movie.images_list[6]" alt="movie_image" :data-next-index="1" @error="handle_image_error($event, movie)"/>
						<b-spinner v-if="torrent_loading" label="Loading..." variant="success" class="loading_video"></b-spinner>
						<p v-if="torrent_loading" class="loading_video text">File is loading... {{download_speed}}</p>
						<a v-if="torrent_error" class="see_movie" href="#target-element" data-toggle="tooltip" data-placement="top" title="See & select torrents"><b-icon-exclamation-circle class="on_image error"></b-icon-exclamation-circle></a>
						<p v-if="torrent_error" class="Error text">{{ text_content.error_torrents[lang_nb] }}</p>
					</div>
				</div>
			</div>
		</div>
		<Movie_infos :movie="movie" @updating_fav="update_fav"></Movie_infos>
		<Torrents_buttons v-if="!movie_error" :movie_id="movie_id" @choosing_torrent="Choose_Torrent"></Torrents_buttons>
		<Comments v-if="!movie_error" :movie_id="movie_id"></Comments>
	</div>
	<div class="homemade-container" v-else>
		<div class="row movie_name_container">
			<div class="col text-center">
				<h1>No movie with this id</h1>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "../assets/shared_scss/single_movie.scss";


</style>