<script>
import { mapState } from 'vuex';
import fakeData from "../assets/fake_library/fake_data_search_results.json";
import textContent from "../assets/language_dict/language_dict.json";
import SearchResults from '../components/Search_results.vue'


export default {
	components: {
		SearchResults
	},
	data() {
		return {
			text_content : textContent.MOVIES,
			movie_list   : fakeData.movie_list,
			own_profile : true,
			followed : false,
		}
	},
	computed: mapState({
      	lang_nb  : state =>  state.lang_nb,
    }),
	methods: {
		update_follow() {
			this.followed = !this.followed
		}
	}
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
					<button v-if="own_profile" type="button" class="btn btn-outline-dark" data-mdb-ripple-color="dark"
						style="z-index: 1;">
						<router-link to="/edit_profile" class="nav-link">Edit profile</router-link>
					</button>
					<button v-else type="button" class="btn btn-outline-dark" :class="{'btn-dark': followed}" @click="update_follow" data-mdb-ripple-color="dark"
						style="z-index: 1;">
						<span v-if="!followed">Follow</span>
						<span v-else>Unfollow</span>
					</button>
					</div>
					<div class="ms-3 main_info" style="margin-top: 130px;">
					<h5>Andy Horwitz</h5>
					<p>New York</p>
					</div>
				</div>
				<div class="p-4 text-black" style="background-color: #f8f9fa;">
					<div class="d-flex justify-content-end text-center py-1">
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
					<div>
					<p class="lead fw-normal mb-1">About</p>
					<div class="p-4" style="background-color: #f8f9fa;">
						<p class="font-italic mb-1">Web Developer</p>
						<p class="font-italic mb-1">Lives in New York</p>
						<p class="font-italic mb-0">Photographer</p>
					</div>
					</div>
				</div>
				<div class="card-body p-4 text-black">
					<p class="lead fw-normal mb-1">Favorite Movies</p>
					<SearchResults :movie_list="movie_list"/>
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
	width: 80%;
}

.main_info > *
{
	color: white;
}


.movie-content, .movie-image {
	box-shadow: 0.5px 0px 2px rgba(0, 0, 0, 0.813);
}


.btn-dark > *, .btn-outline-dark:hover > * {
	color: white;
}

.btn-dark:hover {
	background: rgba(0, 0, 0, 0.642);
}


.gradient-custom-2 {
/* fallback for old browsers */
background: #fbc2eb;

background: -webkit-linear-gradient(to right, rgba(251, 194, 235, 1), rgba(166, 193, 238, 1));

background: linear-gradient(to right, rgba(251, 194, 235, 1), rgba(166, 193, 238, 1));
}
</style>