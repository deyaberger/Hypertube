<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"
import { timeConvert } from "../functions/utils.js"

export default {
	props: {
		movie_list: Object
	},
	data() {
		return {
			text_content : textContent.MOVIES,
			timeConvert  : timeConvert,
		}
	},
	computed: mapState({
      	lang_nb  : state =>  state.lang_nb,
    }),

}
</script>

<template>
	<div class="row movies justify-content-md-center">
		<div v-if="movie_list == null" class = "col-md-auto">
			<b-spinner label="Loading..." variant="success" class="mt-5"></b-spinner>
		</div>
			<router-link v-else :to="'/movie/' + movie.imdb_code" class="col-md-4 movie-card" v-for="movie in movie_list" :key="movie" style="text-decoration: none">
				<div class="movie-header">
						<img class="movie-image" :src="movie.images_list[1]" alt="movie_image"  onerror="this.src='../src/assets/missing_cover.jpeg';"/>
						<b-icon-info-circle-fill class="h2 header-icon"></b-icon-info-circle-fill>
				</div>
				<div class="movie-content">
					<div class="movie-content-header">
						<h3 class="movie-title text-truncate">{{movie.title}}</h3>
					</div>
					<hr class="solid">
					<div class="movie-info">
						<div class="info-section">
							<label>{{text_content.genre[lang_nb]}}</label>
							<span>{{movie.genres_list[0]}}</span>
						</div>
						<div class="info-section">
							<label>{{text_content.year[lang_nb]}}</label>
							<span>{{movie.year}}</span>
						</div>
						<div class="info-section">
							<label>{{text_content.time[lang_nb]}}</label>
							<span class="time">{{timeConvert(movie.length_minutes)}}</span>
						</div>
						<div class="info-section">
							<label>{{text_content.rating[lang_nb]}}</label>
							<span>{{movie.imdb_rating}}/10</span>
						</div>
					</div>
				</div>
			</router-link>
		</div>
</template>



<style lang="scss" scoped>
@import "../assets/shared_scss/search_results.scss";

</style>

<style lang="css">


.page-link.active, .active > .page-link {
	background-color: black;
	border-color: rgb(99, 97, 97);
}

</style>