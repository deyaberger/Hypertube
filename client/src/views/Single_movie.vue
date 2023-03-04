<script>
import { mapState } from 'vuex';
import vue3StarRatings from "vue3-star-ratings";
import { Get_Single_Movie_Details,
		 Parse_Single_Movie,
		 Set_Watched,
		 Set_UnWatched,
		 Remove_From_Favorites, Add_To_Favorites } from "../functions/movies";
import { Get_Comments_By_Movie_ID, Parse_Comments, Post_Comment } from "../functions/comments";
import { Get_torrents_for_movie } from "../functions/streaming";
import { Get_Formatted_Time } from "../functions/utils.js";
import StarRating from 'vue-star-rating';
import textContent from "../assets/language_dict/language_dict.json"


export default {
	props: {
		movie_id: String,
	},


	data() {
		return {
			text_content       : textContent.MOVIES,
			torrents		   : null,
			movie              : [],
			comments           : [],
			user_comment       : "",
			user_rating        : 0,
			Get_Formatted_Time : Get_Formatted_Time,
			fallbackUrl        : '../src/assets/missing_cover.jpeg',
			movie_error        : false,
			torrent_button_text: textContent.MOVIES["see_torrents"]
		}
	},


	components: {
		vue3StarRatings,
		StarRating
	},


	computed: mapState({
		lang_nb    : state => state.lang_nb,
		user_token : state =>  state.user_token,
	}),


	methods: {
		async update_watched() {
			let res = null
			try {
				if (this.movie.is_watched == false) {
					res = await Set_Watched(this.this._id, this.user_token)
				}
				else {
					res = await Set_UnWatched(this.movie_id, this.user_token)
				}
				if (res.data.code == "SUCCESS") {
					console.log("[single_movie]: Successfully updated watched!")
					this.movie.is_watched = !this.movie.is_watched
				}
				else {
					console.log("ERROR: [single_movie] in update_watched: ", res)
				}
			}
			catch(e) {
				console.log("UNKNOWN ERROR [single_movie]: in update_watched")
				throw(e)
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
				if (res.data.code == "SUCCESS") {
					console.log("[single_movie]: Successfully updated fav!")
					this.movie.is_fav = !this.movie.is_fav
				}
				else {
					console.log("ERROR: [single_movie] in update_fav: ", res)
				}
			}
			catch(e) {
				console.log("UNKNOWN ERROR [single_movie]: in update_fav")
				throw(e)
			}
		},

		async get_comments() {
			try {
				console.log("[single_movie]: getting movie comments...")
				let res = await Get_Comments_By_Movie_ID(this.movie_id, this.user_token);
				if (res.data.code == "SUCCESS") {
					this.comments = Parse_Comments(res.data.comments);
					console.log("[single_movie]: Successfully got movie comments! ", this.comments)
				}
				else {
					console.log("ERROR [single_movie]: in get comments: ", res)
				}
			}
			catch (e) {
				console.log("UNKNOWN ERROR [single_movie]: in get_comments")
				throw(e)
			}
		},

		async get_movie_details() {
			try {
				console.log("[single_movie]: getting movie details...")
				let res = await Get_Single_Movie_Details(this.movie_id, this.user_token);
				if (res.data.code == "SUCCESS") {
					this.movie = Parse_Single_Movie(res.data.movie);
					console.log("[single_movie]: Successfully got movie details! ", this.movie)
				}
				else if (res.data.code == "MISSING_MOVIE") {
					this.movie_error = true
					console.log("ERROR [single_movie]: No Movie found with id: ", this.movie_id)
				}
				else if (res.data.code == "FAILURE") {
					this.movie_error = true
					console.log("ERROR [single_movie]: ", res.data.msg)
				}
			}
			catch (e) {
				this.movie_error = true
				console.log("UNKNOWN ERROR [single_movie]: in get_movie_details")
				throw(e)
			}
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

		reset_comment_input() {
			this.user_comment = ''
			this.user_rating = 0
		},

		async post_comment(content, rating) {
			try {
				let res = await Post_Comment(this.movie_id, content, rating, this.user_token)
				if (res.data.code == "SUCCESS") {
					this.get_comments();
					this.reset_comment_input();
					console.log("[single_movie]: Succesfully added comment to db!")
				}
			}
			catch (e) {
				throw(e)
			}
		},

		reviewComplete() {
			if (this.user_rating != 0 && this.user_comment.length > 0) {
				console.log("[single_movie]: review complete!")
				return true
			}
			return false
		},

		get_separator(index, text_list) {
			return (index < text_list.length - 1 ? ", " : "")
		},

		get_rating_level(rating) {
			if (rating <= 3.5) {
				return "bad"
			}
			if (rating <= 7) {
				return "bof"
			}
			return null
		},

		handle_image_error(event, movie) {
			const nextIndex = parseInt(event.target.dataset.nextIndex)
			const nextImage = movie.images_list[nextIndex];
			if (nextImage) {
				event.target.src = nextImage;
			} else {
				event.target.src = this.fallbackUrl;
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
	async mounted() {
		await this.get_movie_details();
		if (!this.movie_error) {
			this.get_comments();
			this.get_torrents();
		}
		console.log("refs collapes:");
		console.log(this.$refs.collapse);
	},
}
</script>

<template>
	<div class="homemade-container" v-if="!movie_error && movie">
		<div class="row justify-content-md-center">
			<div v-if="movie.length == 0" class="col-md-auto">
						<b-spinner label="Loading..." variant="success" class="mt-5"></b-spinner>
				</div>
			<div v-else class="col video_container">
				<div class="image_container">
					<img class="movie_image not_ready" :src="movie.images_list[6]" alt="movie_image" :data-next-index="1" @error="handle_image_error($event, movie)"/>
					<a class="see_movie" href="#target-element" data-toggle="tooltip" data-placement="top" title="See & select torrents"><b-icon-eye-fill class="on_image"></b-icon-eye-fill></a>
				</div>
			</div>
		</div>
		<button v-if="movie.is_watched"
			@click="update_watched()"
			class="submit_button"
			type = "submit">
			Fake tmp Unwatch button
		</button>
		<button v-else
			@click="update_watched()"
			class="submit_button"
			type = "submit">
			Fake temporary watched button
		</button>
		<div class="row movie_name_container">
			<div class="col">
				<h1>{{movie.title}}</h1>
			</div>
		</div>
		<div class="row general_infos-container align-items-center">
			<div class="col infos">
				<b-icon-camera-reels-fill class="icon genre"></b-icon-camera-reels-fill>
				<span v-for="(genre, index) in movie.genres" :key="index" class="infos_content">{{genre}}{{get_separator(index, movie.genres)}}</span>
			</div>
			<div class="col infos">
				<b-icon-calendar2-minus-fill class="icon year"></b-icon-calendar2-minus-fill>
				<span class="infos_content">{{movie.year}}</span>
			</div>
			<div class="col infos">
				<b-icon-clock-fill class="icon time"></b-icon-clock-fill>
				<span class="infos_content">{{Get_Formatted_Time(movie.runtime)}}</span>
			</div>
			<div class="col infos">
				<span class="infos_content"><b-icon-star-fill class="icon score" :class="get_rating_level(movie.rating)"></b-icon-star-fill></span>
				<span class="infos_content"><span class="big">{{movie.rating}}</span>/10</span>
			</div>
			<div class="col-1 infos">
				<span v-if="movie.is_fav" class="btn-group" role="group" aria-label="Basic example"  data-toggle="tooltip" data-placement="top" title="Remove from favorites">
					<b-icon-heart-fill class="h2 favorites" @click="update_fav()"></b-icon-heart-fill>
				</span>
				<span v-else class="btn-group" role="group" aria-label="Basic example"  data-toggle="tooltip" data-placement="top" title="Add to favorites">
					<b-icon-heart class="h2 favorites" @click="update_fav()"></b-icon-heart>
				</span>
			</div>
		</div>
		<div class="row summary_container">
			<div class="col">
				<p class="summary">{{movie.summary}}</p>
			</div>
		</div>
		<div class="row cast_container">
			<div class="col">
				<span class="infos_title_horizontal">{{text_content["director"][lang_nb]}}: </span>
				<span class="names">{{ movie.director ? movie.director : text_content["not_specified"][lang_nb]}}</span>
			</div>
		</div>
		<div class="row cast_container">
			<div class="col">
				<span class="infos_title_horizontal">{{text_content["actors"][lang_nb]}}: </span>
				<span class="names">{{ movie.actors ? movie.actors : text_content["not_specified"][lang_nb]}}</span>
			</div>
		</div>
		<hr class="solid">
		<div id="target-element" >
			<b-button v-b-toggle="'collapse'" class="collapse-torrents">{{torrent_button_text[lang_nb]}}</b-button>
			<b-collapse id="collapse" ref="collapse" @show="onShow" @hide="onHide">
				<div class="row torrent_container" v-if="torrents != null" v-for="torrent in torrents" :key="torrent">
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
		</div>
		<div class="row my_review">
			<hr class="solid">
			<div class="infos_title">{{ text_content["add_review"][lang_nb] }}:</div>
			<star-rating
				v-model:rating="user_rating"
				class="stars_container"
				inactive-color="#474848"
				:numberOfStars=10
				:increment="1"
				:star-size="20"
				:max-rating="10"
			/>
			<b-form-textarea
				id="textarea"
				v-model="user_comment"
				placeholder="Enter something..."
				rows="3"
				max-rows="6"
				></b-form-textarea>
			<button @click="post_comment(user_comment, user_rating)"
				:disabled="!reviewComplete()"
				class="submit_button"
				type = "submit">
				{{ text_content['send_review'][lang_nb] }}
			</button>
		</div>
		<div v-for="comment in comments" :key="comment" class="row people_reviews">
			<hr class="solid">
			<div class="col-3 rating">
				<b-icon-star-fill class="icon score" :class="get_rating_level(comment.rating)"></b-icon-star-fill>
				<span><span class="big">{{comment.rating}}</span>/10</span>
			</div>
			<div class="col username">
				@{{comment.username}}
			</div>
			<div class="col-3 time">
				<span>{{comment.date}}</span>
			</div>
			<div class="comment">'{{comment.content}}'</div>
		</div>
	</div>
	<div class="homemade-container" v-else>
		<div class="row movie_name_container">
			<div class="col text-center">
				<h1>No movie with this id</h1>
			</div>
		</div>
	</div>
</template>

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

<style lang="scss" scoped>
@import "../assets/shared_scss/single_movie.scss";

.collapse-torrents {
	margin: 0px;
	height: 50px;
	border: black;
	background-image: linear-gradient(-45deg, #4568dc, #b753bb);
}

.collapse-torrents:hover {
	margin: 0px;
	transform: scale(1.1);
	transition: 0.8s;
	background-image: linear-gradient(-45deg, #587bee, #e370e7);
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

.favorites {
	cursor: pointer;
}

.torrent_container {
	height: 80px;
	margin-top: 0.5%;
}

.torrent_container > * {
	font-size: 18px;
}

.torrent_infos {
	font-weight: bold;
}

.torrent_icon {
	margin-top: -1%;
	margin-right: 3%;
}

.play_button {
	border-right: 1px;
	border-color: white;
}

.bn30 > .col:first-of-type {
	text-align:left;
}

.bn30 > .col {
	text-align:right;
}

.image_container {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 500px;
}

.not_ready {
	opacity: 0.5;
	position: absolute;
}

.on_image {
	z-index: 1;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	top: 50%;
	cursor: pointer;
	font-size: 150px;
	margin-top: calc(-0.5 * 150px);
}

.see_movie {
	height: 500px;
	text-decoration: none;
	color: white;
}

</style>