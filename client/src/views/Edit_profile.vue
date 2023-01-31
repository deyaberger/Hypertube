<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"

export default {
	data() {
		return {
			text_content : textContent.MOVIES,
			name: 'Andy Horwitz',
			city: 'New York',
			profile_pic : 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp'
		}
	},
	computed: mapState({
      	lang_nb  : state =>  state.lang_nb,
		user_token : state =>  state.user_token,
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
					<div class="profile_header mt-4" >
						<img :src="profile_pic" id="test"
							alt="Generic placeholder image" class="img-fluid img-thumbnail profile_pic">
						<b-icon-arrow-repeat  class="h2 change_icon"></b-icon-arrow-repeat>
					</div>
					<span><button class="btn btn-dark remove_pic"><b-icon-trash/></button></span>
					</div>
					<div class="ms-3 main_info" >
						<b-form-input
							v-model="name"
							placeholder="Enter your name"
							class="dark_input"
						></b-form-input>
						<b-form-input
							v-model="city"
							placeholder="Enter your city"
							class="dark_input"
						></b-form-input>
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

.profile_header {
	width: 150px;
	z-index: 1;
	position: relative;
	cursor: pointer;
}

.profile_header:hover {
	transform:scale(1.03);
}

.profile_header:hover .profile_pic {
	background: linear-gradient(to bottom, transparent 10%, black, black);
}

.profile_header:hover .change_icon {
	visibility: visible;
}

.change_icon {
	visibility: hidden;
	color: rgba(0, 0, 0, 0.878);
	border-radius: 35px;
	background-color: white;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto auto auto auto;
	font-size: 50px;
	opacity: .85;
	transition: none;
}



.col {
	width: 80%;
}

.dark_input {
	background-color:rgb(0, 0, 0);
	color:white;
	margin-top:5%;
}

.main_info {
	margin-top: 90px;
}

.remove {
	color:white;
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

.remove_pic {
	position: absolute;
	top: 37%;
	left: 150px;
	z-index: 2;
	background-color: black;
	color: red;
}

</style>