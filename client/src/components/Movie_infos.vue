<script>
import { createDOMCompilerError } from '@vue/compiler-dom';
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json";
import { Get_Formatted_Time, Get_Separator, Get_Rating_Level, Get_Genres_String } from "../functions/utils.js";

export default {
	props: {
		movie: Object,
	},

	data() {
		return {
			text_content       : textContent.MOVIES,
			Get_Rating_Level    : Get_Rating_Level,
			Get_Separator       : Get_Separator,
			Get_Genres_String       : Get_Genres_String,
			Get_Formatted_Time  : Get_Formatted_Time,
			comments           : [],
			user_rating        : 0,
			user_comment 	   : ''
		}
	},

	computed: mapState({
		lang_nb: state => state.lang_nb,
		user_token : state =>  state.user_token,
	}),

	methods: {
		update_fav() {
			this.$emit("updating_fav")
		},
	},
}
</script>


<template>
<div v-if="movie && !Array.isArray((JSON.parse(JSON.stringify(this.movie))))">
	<div class="row movie_name_container">
		<div class="col">
			<h1>{{movie.title}}</h1>
		</div>
	</div>
	<div class="row general_infos-container align-items-center">
		<div class="col infos infos-genre">
			<b-icon-camera-reels-fill class="icon genre"></b-icon-camera-reels-fill>
			<span v-if="movie && movie.genres">{{ Get_Genres_String(movie.genres)}}</span>
		</div>
		<div class="col infos infos-year">
			<b-icon-calendar2-minus-fill class="icon year"></b-icon-calendar2-minus-fill>
			<span v-if="movie.year" class="infos_content">{{movie.year}}</span>
		</div>
		<div class="col infos infos-time">
			<b-icon-clock-fill class="icon time"></b-icon-clock-fill>
			<span class="infos_content">{{Get_Formatted_Time(movie.runtime)}}</span>
		</div>
		<div class="col infos infos-time">
			<span class="infos_content"><b-icon-star-fill class="icon score" :class="Get_Rating_Level(movie.rating)"></b-icon-star-fill></span>
			<span class="infos_content"><span class="big">{{movie.rating}}</span>/10</span>
		</div>
		<div class="col infos infos-fav">
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
</div>
</template>



<style lang="scss" scoped>
@import "../assets/shared_scss/single_movie.scss";
@import "../assets/shared_scss/movie_infos.scss";


</style>