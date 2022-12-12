<script>
import { mapState } from 'vuex';
import fakeData from "../assets/fake_library/fake_data_search_results.json";
import textContent from "../assets/language_dict/language_dict.json"


export default {
	data() {
		return {
			text_content : textContent.MOVIES,
			movie_list   : fakeData.movie_list,
		}
	},
	computed: mapState({
      	lang_nb  : state =>  state.lang_nb,
    })
}
</script>

<template>
	<section class="h-100 gradient-custom-2">
		<div class="container py-5 h-100">
			<div class="row d-flex justify-content-center align-items-center h-100">
			<div class="col col-lg-9 col-xl-7">
				<div class="card">
				<div class="rounded-top text-white d-flex flex-row" style="background-color: #000; height:200px;">
					<div class="ms-4 mt-5 d-flex flex-column" style="width: 150px;">
					<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
						alt="Generic placeholder image" class="img-fluid img-thumbnail mt-4 mb-2"
						style="width: 150px; z-index: 1">
					<button type="button" class="btn btn-outline-dark" data-mdb-ripple-color="dark"
						style="z-index: 1;">
						Edit profile
					</button>
					</div>
					<div class="ms-3" style="margin-top: 130px;">
					<h5>Andy Horwitz</h5>
					<p>New York</p>
					</div>
				</div>
				<div class="p-4 text-black" style="background-color: #f8f9fa;">
					<div class="d-flex justify-content-end text-center py-1">
					<div>
						<p class="mb-1 h5">253</p>
						<p class="small text-muted mb-0">Photos</p>
					</div>
					<div class="px-3">
						<p class="mb-1 h5">1026</p>
						<p class="small text-muted mb-0">Followers</p>
					</div>
					<div>
						<p class="mb-1 h5">478</p>
						<p class="small text-muted mb-0">Following</p>
					</div>
					</div>
				</div>
				<div class="card-body p-4 text-black">
					<div class="mb-5">
					<p class="lead fw-normal mb-1">About</p>
					<div class="p-4" style="background-color: #f8f9fa;">
						<p class="font-italic mb-1">Web Developer</p>
						<p class="font-italic mb-1">Lives in New York</p>
						<p class="font-italic mb-0">Photographer</p>
					</div>
					</div>

					<div class="row movies justify-content-md-center">
							<router-link :to="'/movie/' + movie.title" class="col-md-4 movie-card" v-for="movie in movie_list" :key="movie" style="text-decoration: none">
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

					</div>
				</div>
			</div>
		</div>
			</div>
	</section>
</template>


<style lang="scss" scoped>
@import "../assets/shared_scss/search_results.scss";

</style>

<style lang="css" scoped>

.page-link.active, .active > .page-link {
	background-color: black;
	border-color: rgb(99, 97, 97);
}

</style>


<style scoped>

.col {
	padding: 0px;
	width: 70%;
}

.col-mb-2 {
	margin-right: 5%;
	padding: 0px;

}



.movies .col {
	background: blue;
}

.gradient-custom-2 {
/* fallback for old browsers */
background: #fbc2eb;

background: -webkit-linear-gradient(to right, rgba(251, 194, 235, 1), rgba(166, 193, 238, 1));

background: linear-gradient(to right, rgba(251, 194, 235, 1), rgba(166, 193, 238, 1));
}
</style>