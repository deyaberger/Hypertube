<script>
	import { ref, computed } from 'vue'
	import { mapState, useStore } from 'vuex';
	import fakeData from "./fake_data.json";
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
		<div class="row general_infos-container">
			<div class="col infos">
				<h3 class="infos_title"><b-icon-camera-reels-fill class="icon-genre"></b-icon-camera-reels-fill> GENRE</h3>
				<span class="infos_content">{{movie.genre}}</span>
			</div>
			<div class="col infos">
				<h3 class="infos_title"><b-icon-calendar2-minus-fill class="icon-year"></b-icon-calendar2-minus-fill> YEAR</h3>
				<span class="infos_content">{{movie.year}}</span>
			</div>
			<div class="col infos">
				<h3 class="infos_title"><b-icon-clock-fill class="icon-time"></b-icon-clock-fill> DURATION</h3>
				<span class="infos_content">{{movie.duration}}</span>
			</div>
			<div class="col infos">
				<h3 class="infos_title"><b-icon-star-fill class="icon-score"></b-icon-star-fill> SCORE</h3>
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
				<b-icon-star-fill class="icon-score"></b-icon-star-fill>
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



<style lang="css" scoped>
@import "../assets/shared_scss/shared.scss";

@import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');



.homemade-container {
	width         : 80%;
    margin        : auto;
	margin-top    : 5%;
	font-size     : 15px;
}

.video_container {
	width         : 100%;
	height        : 500px;
}

h1, h3 {
	text-transform: uppercase;
}

h1 {
	font-size     : 30px;
}

h3 {
	font-size     : 15px;
}

.big {
	font-weight   : bold;
	font-size     : 15px;
}

.icon-score {
	color         : rgb(255, 255, 81);
}

.icon-genre {
	color         : rgb(100, 195, 106);
}

.icon-year {
	color         : rgb(112, 114, 219);
}

.icon-time {
	color         : rgb(210, 102, 201)}
.row {
	margin-top    : 2%;
}

.general_infos-container {
	text-align    :center;
}

.movie_image {
	margin        : 0px;
	width         : 100%;
	height        : 100%;
	object-fit    : cover;
}

#textarea {
	width         : 100%;
	margin-top    : 1%;
	margin-bottom : 2%;
	margin-left   : 1%;
	margin-right  : 1%;
	color         : white;
	background    : black;
}

.infos_title svg {
	margin-bottom : 5px;
}

.infos_content {
	font-size     : 11px;
}

.summary_container {
	margin-top    : 5%;
	margin-bottom : 5%;
}
.summary {
	font-size     : 18px;
	font-weight   : lighter;
}

.infos_title_horizontal {
	font-weight   : bold;
}

.names {
	font-weight   : lighter;
}

.my_review {
	margin-top    : 5%;
}

.stars_container {
	margin: 0px;
	padding: 0px;
}

:deep(.stars) {
	margin-top    : 1%;
	margin-bottom : 2%;
	margin-left   : 1%;
	margin-right  : 1%;
}

.people_reviews {
	margin-top: 3%;
	margin-bottom: 3%;
}
.rating .big {
	margin-left: 5px;
}

.rating .icon-score {
	margin-top: 0px;
}

</style>