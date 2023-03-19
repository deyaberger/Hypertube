<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json";
import { Get_torrents_for_movie } from "../functions/streaming";


export default {
	props: {
		movie_id: String,
	},

	data() {
		return {
			text_content        : textContent.MOVIES,
			torrent_button_text : textContent.MOVIES["see_torrents"],
			torrents            : [],
		}
	},

	computed: mapState({
		lang_nb: state => state.lang_nb,
		user_token : state =>  state.user_token,
	}),

	methods: {
		choose_torrent(torrent) {
			this.$emit("choosing_torrent", {"torrent" : torrent})
		},

		async get_torrents() {
			try {
				console.log("[single_movie]: getting torrents list...")
				const res = await Get_torrents_for_movie(this.movie_id, this.user_token)
				if (res.status == 200 && res.data.code == "SUCCESS") {
					this.torrents = res.data.torrents
					console.log("[single_movie]: Successfully got torrents! ", this.torrents)
				}
				else {
					this.movie_error = true
					console.log("ERROR [single_movie]: ", res)
				}
			}
			catch (e) {
				this.movie_error = true
				console.log("UNKNOWN ERROR [single_movie]: in get_torrents")
				// throw(e)
			}
		},

		get_torrent_quality(torrent) {
			let quality = torrent['quality']
			if (quality == '720') {
				return ('720 p')
			}
			if (quality == '1080') {
				return ('1080 p')
			}
			if (quality == '2160') {
				return ('4K')
			}
		},

		onShow() {
			this.torrent_button_text = this.text_content["hide_torrents"];
		},
		onHide() {
			this.torrent_button_text = this.text_content["see_torrents"];
		},
	},

	mounted() {
		this.get_torrents();
	}

}
</script>


<template>
	<div>
		<hr class="solid">
		<div id="target-element" >
			<b-button v-b-toggle="'collapse'" class="collapse-torrents torrent_button">{{torrent_button_text[lang_nb]}}</b-button>
			<a class="link_torrent" href="#video_container">
			<b-collapse id="collapse" ref="collapse" @show="onShow" @hide="onHide">
				<div class="row torrent_button_container" v-if="torrents != null" v-for="torrent in torrents" :key="torrent"  @click="choose_torrent(torrent)">
					<button class="bn30 row align-items-center">
						<div class="col play">
							<b-icon-play-circle-fill class="h3 torrent_icon play_button"/>
						</div>
						<div class="col quality">
							<b-icon-trophy-fill class="torrent_icon"/>
							<span class="names">{{get_torrent_quality(torrent)}}</span>
						</div>
						<div class="col seeds">
							seeds:
							<span class="names">{{ torrent["seeds"] }}</span>
						</div>
						<div class="col peers">
							peers:
							<span class="names">{{ torrent["peers"] }}</span>
						</div>
						<div class="col size">
							<b-icon-cloud-upload-fill class="torrent_icon"/>
							<span class="names">{{ torrent["size"] }}</span>
						</div>
					</button>
				</div>
			</b-collapse>
			</a>
		</div>
	</div>
</template>



<style lang="scss" scoped>
@import "../assets/shared_scss/single_movie.scss";
@import "../assets/shared_scss/torrent_buttons.scss";

</style>