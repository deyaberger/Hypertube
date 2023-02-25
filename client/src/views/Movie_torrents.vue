<script>
import { mapState } from 'vuex';
import { Get_torrents_for_movie } from '../functions/streaming'

export default {
	props: {
		movie_id: String,
	},


	data() {
		return {
			torrents : [],
			selected_torrent : null
		}
	},


	components: {
	},


	computed: mapState({
		lang_nb    : state => state.lang_nb,
		user_token : state =>  state.user_token,
	}),


	methods: {
		Choose_Torrent(arg) {
			console.log("Chose torrent", arg)
			this.selected_torrent = arg
		}
	},


	async mounted() {
		console.log("mounted torrent page")
		try {
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
}
</script>

<template>
	<div class="homemade-container">
		<div class="card b-1 hover-shadow mb-20" v-for="(torrent, index) in torrents" :key="index">
			  <div class="media card-body">
				<span @click="Choose_Torrent(torrent)"> {{index}} url : {{torrent.url}} quality : {{torrent.quality}} size : {{torrent.size}} seeds : {{torrent.seeds}} peers : {{torrent.peers}} </span>
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