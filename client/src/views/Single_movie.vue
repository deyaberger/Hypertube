<script>
import { mapState } from 'vuex';
import vue3StarRatings from "vue3-star-ratings";
import { Get_Single_Movie_Details,
		 Parse_Single_Movie,
		 Set_Watched,
		 Set_UnWatched,
		 Remove_From_Favorites, Add_To_Favorites } from "../functions/movies";
import { Get_Comments_By_Movie_ID, Parse_Comments, Post_Comment } from "../functions/comments";
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
			movie              : [],
			comments           : [],
			user_comment       : "",
			user_rating        : 0,
			Get_Formatted_Time : Get_Formatted_Time,
			fallbackUrl        : '../src/assets/missing_cover.jpeg',
			movie_error        : false
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
					return true
				}
				else if (res.data.code == "MISSING_MOVIE") {
					this.movie_error = true
					console.log("ERROR [single_movie]: No Movie found with id: ", this.movie_id)
					return false
				}
				else if (res.data.code == "FAILURE") {
					this.movie_error = true
					console.log("ERROR [single_movie]: ", res.data.msg)
					return false
				}
			}
			catch (e) {
				this.movie_error = true
				console.log("UNKNOWN ERROR [single_movie]: in get_movie_details")
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
		}

	},
	async mounted() {
		await this.get_movie_details();
		if (!this.movie_error) {
			this.get_comments();
		}
	},
}
</script>

<template>
	<div class="homemade-container" v-if="!movie_error">
		<div class="row justify-content-md-center">
			<div v-if="movie.length == 0" class="col-md-auto">
						<b-spinner label="Loading..." variant="success" class="mt-5"></b-spinner>
				</div>
			<div v-else class="col video_container">
				<img class="movie_image" :src="movie.images_list[6]" alt="movie_image" :data-next-index="1" @error="handle_image_error($event, movie)"/>
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
				<!-- <span class="names" v-for="actor in movie.cast" :key="actor">{{actor.name}}, </span> -->
			</div>
		</div>
		<hr class="solid">
		<div class="row my_review">
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



<style lang="scss" scoped>
@import "../assets/shared_scss/single_movie.scss";

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

</style>