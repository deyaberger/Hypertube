<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"
import { Get_Formatted_Time } from "../functions/utils.js"

export default {
	props: {
		movie_list: Object
	},
	data() {
		return {
			text_content : textContent.MOVIES,
			Get_Formatted_Time  : Get_Formatted_Time,
		}
	},
	methods: {
		update_favorite(movie) {
			// Do something
			return true
		},
		test() {
			// Do something
			return true
		}

	},
	computed: mapState({
		lang_nb    : state =>  state.lang_nb,
		user_token : state =>  state.user_token,
    }),

}
</script>

<template>
	<div class="row movies justify-content-md-center">
		<div v-if="movie_list == null" class = "col-md-auto">
			<b-spinner label="Loading..." variant="success" class="mt-5"></b-spinner>
		</div>
			<div v-else class="col-md-4 movie-card" v-for="movie in movie_list" :key="movie" style="text-decoration: none">
				<router-link :to="'/movie/' + movie.id">
				<div class="movie-header">
						<img class="movie-image" :src="movie.images_list[1]" alt="movie_image"  onerror="this.src='../src/assets/missing_cover.jpeg';"/>
						<b-icon-info-circle-fill class="h2 header-icon"></b-icon-info-circle-fill>
				</div>
				</router-link>
				<div class="movie-content">
					<div class="movie-content-header">
						<h3 class="movie-title text-truncate">{{movie.title}}</h3>
					</div>
					<hr class="solid">
					<div class="movie-info">
						<div class="info-section">
							<label class="fav_label">Fav</label>
							<div v-if="test() == true" class="btn-group" role="group" aria-label="Basic example"  data-toggle="tooltip" data-placement="top" title="Remove from favorites">
								<b-icon-heart-fill class="h2 favorites" @click="update_favorite(movie)"></b-icon-heart-fill>
							</div>
							<div v-else class="btn-group" role="group" aria-label="Basic example"  data-toggle="tooltip" data-placement="top" title="Add to favorites">
								<b-icon-heart class="h2 favorites" @click="update_favorite(movie)"></b-icon-heart>
							</div>
						</div>
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
							<span class="time">{{Get_Formatted_Time(movie.length_minutes)}}</span>
						</div>
						<div class="info-section">
							<label>{{text_content.rating[lang_nb]}}</label>
							<span>{{movie.imdb_rating}}/10</span>
						</div>
					</div>
				</div>
			</div>
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

.fav_label {
	margin-left: 15%;
}

.favorites {
	color: red
}

</style>