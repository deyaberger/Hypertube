<script>
	import { ref, computed } from 'vue'
	import { mapState, useStore } from 'vuex';
	import fakeData from "../assets/fake_library/fake_data_movie.json";
	import vue3StarRatings from "vue3-star-ratings";

	export default {
		props: {
			moviename: String,
		},
		data() {
			const store = useStore()
			return {
				movie: fakeData,
				user_comment: "",
				user_rating : 0
		}
		},
		components: {
			vue3StarRatings
		},
		computed: mapState({
			language: state =>  state.language,
		}),
		methods: {
			is_english() {
				return (this.language == 'eng')
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

		}
	}
</script>

<template>
	<div class="homemade-container">
		<div class="row">
			<div class="col video_container">
				<img class="movie_image" :src="movie.image"/>
			</div>
		</div>
		<div class="row movie_name_container">
			<div class="col">
				<h1>{{movie.name}}</h1>
			</div>
		</div>
		<div class="row general_infos-container align-items-center">
			<div class="col infos">
				<b-icon-camera-reels-fill class="icon genre"></b-icon-camera-reels-fill>
				<span class="infos_content">{{movie.genre}}</span>
			</div>
			<div class="col infos">
				<b-icon-calendar2-minus-fill class="icon year"></b-icon-calendar2-minus-fill>
				<span class="infos_content">{{movie.year}}</span>
			</div>
			<div class="col infos">
				<b-icon-clock-fill class="icon time"></b-icon-clock-fill>
				<span class="infos_content">{{movie.duration}}</span>
			</div>
			<div class="col infos">
				<span class="infos_content"><b-icon-star-fill class="icon score"></b-icon-star-fill></span>
				<span class="infos_content"><span class="big">{{movie.score}}</span>/10</span>
			</div>
		</div>
		<div class="row summary_container">
			<div class="col">
				<p class="summary">{{movie.summary}}</p>
			</div>
		</div>
		<div class="row cast_container">
			<div class="col">
				<span class="infos_title_horizontal">Director: </span>
				<span class="names">{{movie.director}}</span>
			</div>
		</div>
		<div class="row cast_container">
			<div class="col">
				<span class="infos_title_horizontal">Actors: </span>
				<span class="names" v-for="actor_name in movie.actors" :key="actor_name">{{actor_name}}, </span>
			</div>
		</div>
		<hr class="solid">
		<div class="row my_review">
			<div class="infos_title">Add a review:</div>
			<vue3-star-ratings
				v-model="user_rating"
				class="stars_container"
				:showControl="false"
				:numberOfStars=10
				starSize="20"
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