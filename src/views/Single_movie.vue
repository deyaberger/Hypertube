<script>
	import { ref, computed } from 'vue'
	import { mapState, useStore } from 'vuex';
	import fakeData from "./fake_data.json";

	export default {
		props: {
			moviename: String,
		},
		data() {
			const store = useStore()
			return {
				movie: fakeData,
			}
		},
		computed: mapState({
			language: state =>  state.language,
		}),
		methods: {
			is_english() {
				return (this.language == 'eng')
			}
		}
	}
</script>

<template>
	<b-container fluid="sm">
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
			<div class="col">
				<h3 class="infos_title">GENRE</h3>
				<span class="infos_content">{{movie.genre}}</span>
			</div>
			<div class="col">
				<h3 class="infos_title">YEAR</h3>
				<span class="infos_content">{{movie.year}}</span>
			</div>
			<div class="col">
				<h3 class="infos_title">DURATION</h3>
				<span class="infos_content">{{movie.duration}}</span>
			</div>
			<div class="col">
				<h3 class="infos_title">SCORE</h3>
				<span class="infos_content">{{movie.score}}</span>
			</div>
		</div>
		<div class="row summary_container">
			<div class="col">
				<p class="summary">{{movie.summary}}</p>
			</div>
		</div>
		<div class="row director_container">
			<div class="col">
				<span class="infos_title_horizontal">Director: </span>
				<span>{{movie.director}}</span>
			</div>
		</div>
		<div class="row actors_container">
			<div class="col">
				<span class="infos_title_horizontal">Actors: </span>
				<span v-for="actor_name in movie.actors" :key="actor_name">{{actor_name}}, </span>
			</div>
		</div>
		<div class="row my_comment">
			<div class="infos_title">Leave a comment:</div>
			<b-form-textarea
				id="textarea"
				v-model="text"
				placeholder="Enter something..."
				rows="3"
				max-rows="6"
				></b-form-textarea>
		</div>
		<div v-for="comment in movie.list_comments" :key="comment" class="row people_comments">
			<div class="col-3 username">
				@{{comment.name}}
			</div>
			<div class="col-3 time">
				<span>{{comment.date}} {{comment.hour}}</span>
			</div>
			<div class="comment">'{{comment.comment}}'</div>
		</div>
	</b-container>
</template>



<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

.container-sm {
	position        : flex;
	margin-top      : 50%;
	margin-left     : 50%;
	padding         : 3%;
	transform       : translate(-50%, -50%);
	background-color: rgb(0, 0, 0);
	border-radius   : 1%;
	font-family     : 'Montserrat', sans-serif;
}

.video_container {
	width           : 100%;
	height          : 500px;
}

.row {
	margin-top      : 2%;
}

.movie_image {
	margin          : 0px;
	width           : 100%;
	height          : 100%;
	object-fit      : cover;
}

#textarea {
	width           : 100%;
	margin-top      : 1%;
	color           : white;
	background      : black;
}

</style>