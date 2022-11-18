<script>
import { mapState } from 'vuex';
import fakeData from "../assets/fake_library/fake_data_search_results.json";
import textContent from "../assets/language_dict/language_dict.json"


export default {
	data() {
		return {
			text_content : textContent.MOVIES,
			nb_results	 : fakeData.results,
			movie_list   : fakeData.movie_list,
			currentPage  : 1,
			rows         : 0,
			perPage      : 0,
		}
	},
	computed: mapState({
      	lang_nb  : state =>  state.lang_nb,
    })
}
</script>

<template>
	<div class="results_container">
		<div class="search_header">
			<div class="title">{{text_content.recommendations[lang_nb]}}:</div>
			<div class="number_of_results">{{nb_results}} {{text_content.results[lang_nb]}}</div>
		</div>
		<div class="row movies">
			<router-link :to="'/movie/' + movie.title" class="col-md-auto movie-card" v-for="movie in movie_list" :key="movie" style="text-decoration: none">
				<div class="movie-header">
						<img class="movie-image" :src="movie.path"/>
						<b-icon-info-circle-fill class="h2 header-icon"></b-icon-info-circle-fill>
				</div>
				<div class="movie-content">
					<div class="movie-content-header">
						<h3 class="movie-title">{{movie.title}}</h3>
					</div>
					<hr class="solid">
					<div class="movie-info">
						<div class="info-section">
							<label>{{text_content.genre[lang_nb]}}</label>
							<span>{{movie.genre}}</span>
						</div>
						<div class="info-section">
							<label>{{text_content.year[lang_nb]}}</label>
							<span>{{movie.year}}</span>
						</div>
						<div class="info-section">
							<label>{{text_content.time[lang_nb]}}</label>
							<span class="time">{{movie.time}}</span>
						</div>
						<div class="info-section">
							<label>{{text_content.rating[lang_nb]}}</label>
							<span>{{movie.rating}}/10</span>
						</div>
					</div>
				</div>
			</router-link>
		</div>
		<div class="pagination overflow-auto">
			<div>
				<b-pagination
					v-model="currentPage"
					:total-rows="rows"
					:per-page="perPage"
					first-number
					class="custom_pagination"
				></b-pagination>
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

</style>