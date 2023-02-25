<script>
import { mapState } from 'vuex';
import { Get_torrents_for_movie } from '../functions/streaming'

export default {
	props: {
		movie_id: String,
	},


	data() {
		return {
			torrents : []
		}
	},


	components: {
	},


	computed: mapState({
		lang_nb    : state => state.lang_nb,
		user_token : state =>  state.user_token,
	}),


	methods: {
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
		<div v-for="(torrent, index) in torrents" :key="index">
			<span> {{index}}, {{torrent.url}} </span>
		</div>
	</div>
</template>



<style lang="scss" scoped>

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