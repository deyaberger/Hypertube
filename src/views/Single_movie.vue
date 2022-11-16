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
			<div class="col video">
				THIS IS THE VIDEO {{moviename}}
			</div>
		</div>
		<div class="row movie_name">
			<div class="col">
				THIS IS THE MOVIE NAME
			</div>
		</div>
		<div class="row general_infos">
			<div class="col type">
				TYPE
			</div>
			<div class="col year">
				YEAR {{movie.year}}
			</div>
			<div class="col duration">
				DURATION
			</div>
			<div class="col score">
				SCORE
			</div>
		</div>
		<div class="row summary">
			<div class="col">
				THIS IS THE LOOOOOOOOOOOOONG SUMMARY
			</div>
		</div>
		<div class="row director">
			<div class="col">
				THIS IS THE DIRECTOR NAME
			</div>
		</div>
		<div class="row actors">
			<div class="col">
				THIS IS THE ACTORS NAMES
			</div>
		</div>
		100% wide until small breakpoint
	</b-container>
</template>


<style lang="css">

#app {
	background:linear-gradient(
		rgba(30, 27, 38, 0.687), 
		rgba(30,27,38, 0.95)),
	url("https://i.ibb.co/FDGqCmM/papers-co-ag74-interstellar-wide-space-film-movie-art-33-iphone6-wallpaper.jpg");
	background-position: center;
	background-size: cover;
	background-repeat: repeat;
}


</style>

<style lang="scss" scoped>

.container-sm {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: rgb(238, 255, 0);
}

.video {
	background-color: green;
	height: 300px;
}

.movie_name {
	background-color: red;
}


.general_infos {
	background-color: blue;
}

.summary {
	background-color: pink;
	height: 200px;
}

.director {
	background-color: rgb(192, 255, 254);
}

.actors {
	background-color: rgb(39, 225, 25);
}

</style>