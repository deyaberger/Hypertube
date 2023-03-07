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
			text_content       : textContent.MOVIES,
			torrent_button_text : textContent.MOVIES["see_torrents"],
			torrents		   : [],
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
					return false
				}
			}
			catch (e) {
				this.movie_error = true
				console.log("UNKNOWN ERROR [single_movie]: in get_torrents")
				throw(e)
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
			<b-button v-b-toggle="'collapse'" class="collapse-torrents">{{torrent_button_text[lang_nb]}}</b-button>
			<a class="torrent_button" href="#video_container">
			<b-collapse id="collapse" ref="collapse" @show="onShow" @hide="onHide">
				<div class="row torrent_container" v-if="torrents != null" v-for="torrent in torrents" :key="torrent"  @click="choose_torrent(torrent)">
					<button class="bn30 row align-items-center justify-content-center">
						<div class="col col-5">
							<span class="torrent_infos"><b-icon-play-circle-fill class="h3 play_button"/></span>
						</div>
						<div class="col">
							<span class="torrent_infos"><b-icon-trophy-fill class="torrent_icon"/></span>
							<span class="names">{{get_torrent_quality(torrent)}}</span>
						</div>
						<div class="col">
							<span class="torrent_infos">seeds: </span>
							<span class="names">{{ torrent["seeds"] }}</span>
						</div>
						<div class="col">
							<span class="torrent_infos">peers: </span>
							<span class="names">{{ torrent["peers"] }}</span>
						</div>
						<div class="col">
							<span class="torrent_infos"><b-icon-cloud-upload-fill class="torrent_icon"/></span>
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

</style>

<style lang="css">
.bn30 {
	margin-left: 0.5%;
	width: 99%;
	min-height: 50px;
	border: 5em;
	cursor: pointer;
	outline: none;
	font-size: 16px;
	-webkit-transform: translate(0);
	transform: translate(0);
	background-image: linear-gradient(45deg, #152e80ce, #59005cc0);
	padding: 0.7em 2em;
	border-radius: 5px;
	/* box-shadow: 1px 1px 10px rgba(255, 255, 255, 0.438); */
	box-shadow: 0 12px 24px rgba(128, 128, 128, 0.1);
	-webkit-transition: box-shadow 0.25s;
	transition: box-shadow 0.25s;
	color: white;
}

.bn30 .text {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(45deg, #152e80ce, #59005cc0);
}

.bn30:after {
  content: "";
  border-radius: 5px;
  position: absolute;
  margin: 4px;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -1;
  background: #0e0e10;
}

.bn30:hover {
  background-image: linear-gradient(45deg, #4568dc, #b06ab3);
  box-shadow: 1px 1px 10px rgba(255, 255, 255, 0.438);
}

.bn30:hover .text {
  background-image: linear-gradient(-45deg, #4568dc, #b06ab3);
}

</style>