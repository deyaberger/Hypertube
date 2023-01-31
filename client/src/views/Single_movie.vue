<script>
import { mapState } from 'vuex';
import vue3StarRatings from "vue3-star-ratings";
import {parseMovies, get_movie_by_imdb_id} from "../functions/get_movies";
import { timeConvert } from "../functions/utils.js";
import StarRating from 'vue-star-rating';


export default {
	props: {
		imdb_id: String,
	},
	data() {
		return {
			movie : [],
			user_comment: "",
			user_rating : 0,
			timeConvert  : timeConvert,
	}
	},
	components: {
		vue3StarRatings,
		StarRating
	},
	computed: mapState({
		lang_nb: state => state.lang_nb,
	}),
	methods: {
		async get_movie_details() {
			try {
				console.log("IMDB ID: ", this.imdb_id)
				console.log("TOKEN = ", this.$cookies.get('token'))
				let res = await get_movie_by_imdb_id(this.imdb_id, this.$cookies.get('token'));
				console.log("MOVIE RES = ", res)
				if (res.status == 200) {
					this.movie = parseMovies([res.data.movie])[0];
				}
				else {
					console.log(res.code, res.data)
					throw("Unknow error code getting movies")
				}
			}
			catch (e) {
				throw(e)
			}
		},
		addReview(comment, rating) {
			const d = new Date();
			const complete_info = {
				"name"    : "test",
				"date"    : d.toDateString(),
				"hour"    : d.toLocaleTimeString(),
				"rating"  : rating,
				"comment" : comment,
			}
			this.movie.list_comments.unshift(complete_info);
		},

		reviewComplete() {
			if (this.user_rating != 0 && this.user_comment.length > 0) {
				console.log("review complete")
				return true
			}
			console.log("review incomplete")
			return false
		}

	},
	mounted() {
		this.get_movie_details();
	},
}
</script>

<template>
	<div class="homemade-container">
		<div class="row justify-content-md-center">
			<div v-if="movie.length == 0" class="col-md-auto">
						<b-spinner label="Loading..." variant="success" class="mt-5"></b-spinner>
				</div>
			<div v-else class="col video_container">
				<img class="movie_image" :src="movie.large_cover_image" alt="movie_image"  onerror="this.src='../src/assets/missing_cover.jpeg';"/>
			</div>
		</div>
		<div class="row movie_name_container">
			<div class="col">
				<h1>{{movie.title}}</h1>
			</div>
		</div>
		<div class="row general_infos-container align-items-center">
			<div class="col infos">
				<b-icon-camera-reels-fill class="icon genre"></b-icon-camera-reels-fill>
				<span class="infos_content">{{movie.genres}}</span>
			</div>
			<div class="col infos">
				<b-icon-calendar2-minus-fill class="icon year"></b-icon-calendar2-minus-fill>
				<span class="infos_content">{{movie.year}}</span>
			</div>
			<div class="col infos">
				<b-icon-clock-fill class="icon time"></b-icon-clock-fill>
				<span class="infos_content">{{timeConvert(movie.runtime)}}</span>
			</div>
			<div class="col infos">
				<span class="infos_content"><b-icon-star-fill class="icon score"></b-icon-star-fill></span>
				<span class="infos_content"><span class="big">{{movie.rating}}</span>/10</span>
			</div>
		</div>
		<div class="row summary_container">
			<div class="col">
				<p class="summary">{{movie.description_full}}</p>
			</div>
		</div>
		<div class="row cast_container">
			<div class="col">
				<span class="infos_title_horizontal">Director: </span>
				<span class="names">director name</span>
			</div>
		</div>
		<div class="row cast_container">
			<div class="col">
				<span class="infos_title_horizontal">Actors: </span>
				<span class="names" v-for="actor in movie.cast" :key="actor">{{actor.name}}, </span>
			</div>
		</div>
		<hr class="solid">
		<div class="row my_review">
			<div class="infos_title">Add a review:</div>
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
			<button @click="addReview(user_comment, user_rating)"
				:disabled="!reviewComplete()"
				class="submit_button"
				type = "submit">
				Send review
			</button>
		</div>
		<div v-for="comment in movie.list_comments" :key="comment" class="row people_reviews">
			<hr class="solid">
			<div class="col-3 rating">
				<b-icon-star-fill class="icon score"></b-icon-star-fill>
				<span><span class="big">{{comment.rating}}</span>/10</span>
			</div>
			<div class="col-3 username">
				@{{comment.name}}
			</div>
			<div class="col time">
				<span>{{comment.date}} {{comment.hour}}</span>
			</div>
			<div class="comment">'{{comment.comment}}'</div>
		</div>
	</div>
</template>



<style lang="scss" scoped>
@import "../assets/shared_scss/single_movie.scss";

</style>