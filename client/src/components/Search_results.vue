<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"
import { Get_Formatted_Time } from "../functions/utils.js"
import { Remove_From_Favorites, Add_To_Favorites } from "../functions/movies.js"
import fallbackUrll from '/src/assets/missing_cover.jpeg'

export default {
	props: {
		movie_list : Array,
		error      : Boolean,
		profile    : Boolean
	},
	data() {
		return {
			text_content : textContent.MOVIES,
			Get_Formatted_Time  : Get_Formatted_Time,
			fallbackUrl: fallbackUrll
		}
	},
	methods: {
		async update_favorite(movie) {
			let res = null
			try {
				if (movie.is_fav) {
					res = await Remove_From_Favorites(movie.id, this.user_token)
				}
				else {
					res = await Add_To_Favorites(movie.id, this.user_token)
				}
				if (res.data.code == "SUCCESS") {
					movie.is_fav = !movie.is_fav
					this.$emit("updating", {"type" : "favorites", "id" : movie.id})
					console.log("[search_results]: Successfully updated favorites for movie: ", movie.id)
				}
				else {
					console.log("ERROR [search_results]: in update_favorite :", res)
				}
			}
			catch(e) {
				// throw (e)
				console.log("Favourite update failed with err", e)
			}

		},
		handle_image_error(event, movie) {
			try {
				const nextIndex = parseInt(event.target.dataset.nextIndex)
				// console.log("nextIndex", nextIndex)
				const nextImage = movie.images_list[nextIndex];
				console.log(movie.images_list)
				// console.log("nextImage", nextImage)
				if (nextImage) {
					event.target.src = nextImage;
				} else {
					event.target.src = this.fallbackUrl;
				}
			}
			catch (e) {
				console.log("image loopy error handled", e)
				event.target.src = this.fallbackUrl;
			}
			// console.log("movie", movie.title, movie.images_list)

		}
	},
	computed: mapState({
		lang_nb    : state =>  state.lang_nb,
		user_token : state =>  state.user_token,
    }),

	created() {
		console.log("profile: ", this.profile)
	}
}
</script>

<template>
	<div class="row movies justify-content-md-center">
		<div v-if="movie_list == null && error == false" class = "col-md-auto">
			<b-spinner label="Loading..." variant="success" class="mt-5"></b-spinner>
		</div>
		<div v-if="movie_list == null && error == true" class = "col-md-auto">
			<p class="error text-center">Server not responding...</p>
			<img src="https://media.giphy.com/media/W0c3xcZ3F1d0EYYb0f/giphy.gif">
		</div>
			<div v-else :class="profile ? 'col-md-4 movie-card profile' :'col-md-4 movie-card'" v-for="movie, index in movie_list" :key="movie.id" style="text-decoration: none">
				<router-link :to="'/movie/' + movie.id">
				<div class="movie-header">
					<img :class="movie.is_watched ? 'movie-image seen' : 'movie-image'" :src="movie.images_list[1]" alt="movie_image" :data-next-index="6" @error="handle_image_error($event, movie)"/>
						<b-icon-play-circle-fill v-if="movie.is_watched" class="h2 header-icon seen"></b-icon-play-circle-fill>
						<b-icon-info-circle-fill v-else class="h2 header-icon"></b-icon-info-circle-fill>
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
							<div v-if="movie.is_fav" class="btn-group heart" role="group" aria-label="Basic example"  data-toggle="tooltip" data-placement="top" title="Remove from favorites">
								<b-icon-heart-fill class="h2 favorites" @click="update_favorite(movie)"></b-icon-heart-fill>
							</div>
							<div v-else class="btn-group heart" role="group" aria-label="Basic example"  data-toggle="tooltip" data-placement="top" title="Add to favorites">
								<b-icon-heart class="h2 favorites" @click="update_favorite(movie)"></b-icon-heart>
							</div>
						</div>
						<div class="info-section">
							<label>{{text_content.year[lang_nb]}}</label>
							<span class="detail">{{movie.year}}</span>
						</div>
						<div class="info-section">
							<label>{{text_content.time[lang_nb]}}</label>
							<span class="time detail">{{Get_Formatted_Time(movie.length_minutes)}}</span>
						</div>
						<div class="info-section">
							<label>{{text_content.rating[lang_nb]}}</label>
							<span class="detail">{{movie.imdb_rating}}/10</span>
						</div>
						<div class="info-section">
							<label>{{text_content.seeds[lang_nb]}}</label>
							<span class="detail">{{movie.max_seeds}}</span>
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

.error {
	font-family: Roboto, sans-serif;
 	color: #f6f8fc;
	text-transform: uppercase;
	margin-top: 10%;
	color: pink;
}

</style>