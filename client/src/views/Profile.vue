<script>
import { url } from 'inspector';
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json";
import SearchResults from '../components/Search_results.vue';
import { Get_User_Fav_Movies,
	     Get_User_Watched_Movies} from '../functions/movies';
import { Get_Other_User_Details,
		 Is_Following,
		 Follow,
		 UnFollow } from "../functions/user";
import store from '../stores/store';
import fallbackUrll from '/src/assets/generic_profile_pic.png'

export default {
	name: "Profile",

	beforeRouteEnter(to, from, next) {
		const isAuthenticated = store.state.user_token != null // check if the user is authenticated
		if (!isAuthenticated) {
			console.log("[profile]: not logged in yeat, redirecting to sign in")
			next("/sign_in") // redirect to sign-in page if the user is not authenticated
		} else {
			next() // continue with navigation
		}
	},

	props: {
		user_id: String,
	},


	components: {
		SearchResults
	},


	data() {
		return {
			text_content   : textContent.PROFILE, // SAME
			user           : null, // SAME
			my_id          : null,

			request_error  : false, // SAME
			network_error  : false, // SAME
			error_text     : '', // SAME

			watched_movies : null, // SAME
			fav_movies     : null, // SAME

			pic_prefix			: "http://127.0.0.1:8071/api/image/get/", // SAME
			fallbackUrl			: fallbackUrll,

			followed       : false,
		}
	},

	methods: {
		set_movie_props(movies) {
			return { // SAME
				'data'    : movies,
				'profile' : true,
				'error'   : false
			}
		},

		exists(movies) { // SAME
			if (movies == null || (movies != null && movies.length == 0)) {
				return false
			}
			return true
		},

		async get_user_fav_movies() { // ALMOST SAME
			console.log("[my_profile]: getting user fav movies...")
			let res = await Get_User_Fav_Movies(this.user_token, this.user_id);
			if (res.data.code == "SUCCESS") {
				this.fav_movies = res.data.favorites
				console.log("[my_profile]: Successfully got user fav movies!", this.fav_movies)
			}
			else {
				console.log("ERROR [my_profile]: in get_user_fav_movies ", res)
			}
		},

		async get_user_watched_movies() { // SAME
			console.log("[my_profile]: getting user watched movies...")
			let res = await Get_User_Watched_Movies(this.user_token, this.user_id);
			if (res.data.code == "SUCCESS") {
				this.watched_movies = res.data.watched;
				console.log("[my_profile]: Successfully got user watched movies!", this.watched_movies)
			}
			else {
				console.log("ERROR [my_profile]: in get_user_watched_movies ", res)
			}
		},

		async get_user_data() { // SAME IN BOTH
			try {
				console.log("[my_profile]: getting user data...")
				let res = await Get_Other_User_Details(this.user_token, this.user_id);
				if (res.code == 'ERR_NETWORK') {
					this.network_error = true
					this.error_text = this.text_content.network_error
					console.log("ERROR [my_profile]: server down")
				}
				else if (res.data != null && res.data.code == "SUCCESS") {
					this.user = res.data.user
					this.my_id = res.data.connected_user_id
					this.user.bio = this.user.bio ? this.user.bio : ''
					console.log("[my_profile]: Successfully got user data! ", {user: this.user, my_id: this.my_id})
				}
				else if (res.data != null && (res.data.code == "NO_USER_WITH_THIS_ID" || res.data.code == "FAILURE")) {
					this.request_error = true
					this.error_text = this.text_content.no_user_found
					console.log("ERROR [my_profile]: get_user_data", {msg: res.data.msg})
				}
				else {
					console.log("UNKOWN ERROR [my_profile]: ", res)
				}
			}
			catch(e) {
				throw(e)
			}
		},

		get_user_profile_pic() { // SAME
			if (this.user.picture != null) {
				if (this.user.picture.includes("cdn.intra.42") || this.user.picture.includes("github")) {
					return (this.user.picture)
				}
				return `${this.pic_prefix}${this.user.picture}`
			}
			return null
		},

		async updating_movies(value) { // SAME
			this.get_user_fav_movies();
			this.get_user_watched_movies();
		},


		handle_image_error(event) {  // SAME
			event.target.src = this.fallbackUrl;
		},

		async is_following() {
			try {
				let res = await Is_Following(this.user_token, this.user_id);
				if (res != null && res.data.code == "SUCCESS") {
					this.followed = res.data.message;
				}
			}
			catch(e) {
				throw(e)
			}

		},

		async update_follow() {
			let res = null
			try {
				if (this.followed == true) {
					res = await UnFollow(this.user_token, this.user_id);
				}
				else {
					res = await Follow(this.user_token, this.user_id);
				}
				if (res != null && res.data.code == "SUCCESS") {
					this.get_user_data();
					this.followed = !this.followed
					console.log("[profile] Succesfully updated follow: ", {followed: this.followed})
				}
				else {
					console.log("UNKNOWN ERROR [update_follow]: ", res)
				}
			}
			catch(e) {
				console.log("UNKNOWN ERROR [update_follow]: ")
				throw(e)
			}

		},
	},


	computed: mapState({  // SAME
      lang_nb  : state =>  state.lang_nb,
			user_token : state =>  state.user_token,
    }),


	async mounted() {  // SAME
		await this.get_user_data();
		await this.get_user_fav_movies();
		await this.get_user_watched_movies();
		await this.is_following();
	}
}
</script>

<template>
	<section v-if="network_error || request_error" class="gradient-custom-2">
		<div class="container py-5 h-100">
			<div class="row d-flex justify-content-center align-items-start h-100">
				<div class="col col-lg-9 col-xl-7">
					<div class="card">
						<div class="p-4 text-black" style="background-color: #f8f9fa;">
							<div class="justify-content-center text-center py-1">
								<p class="lead fw-normal mb-1">{{error_text[lang_nb]}}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<section v-if="user" class="gradient-custom-2">
		<div class="container py-5 h-100">
			<div class="row d-flex justify-content-center align-items-start h-100">
			<div class="col col-lg-9 col-xl-7">
				<div class="card">
				<div class="rounded-top text-white d-flex flex-row" style="background-color: #000; height:250px;">
					<div class="ms-4 mt-5 d-flex flex-column" style="width: 200px;">
					<div class="profile_header mt-4" >
						<img :src="get_user_profile_pic()" alt="profile pic" class="profile_pic" @error="handle_image_error"/>
					</div>
					</div>
					<div class="ms-3 main_info" >
						<div>
							<span class ="h3 name">{{ user.first_name }} {{ user.last_name }}
							</span>
						</div>
						<p class="username">@{{user.username}}</p>
					</div>
				</div>

				<div class="p-4 text-black" style="background-color: #f8f9fa;">
					<div class="justify-content-center text-center py-1">
					<div>
						<div class="row">
						<div class="col-9 button_container" v-if="user.id != my_id">
							<button v-if="followed" class="btn check_button followed" @click="update_follow()" type="button" data-toggle="tooltip" data-placement="top" :title="text_content.unfollow[lang_nb]">{{text_content.followed[lang_nb]}}</button>
							<button v-else class="btn check_button follow" type="button" @click="update_follow()">{{text_content.follow[lang_nb]}}</button>
						</div>
						<div class="col-9 button_container" v-else>
							Hey there, narcissist
						</div>
						<div class="col">
							<p class="small text-muted mb-0">{{text_content.followers[lang_nb]}}</p>
							<p class="mb-1 h5">{{user.followers}}</p>
						</div>
						<div class="col">
							<p class="small text-muted mb-0">{{text_content.followings[lang_nb]}}</p>
							<p class="mb-1 h5">{{user.followings}}</p>
						</div>
						</div>
					</div>
					</div>
				</div>
				<div class="card-body p-4 text-black" v-if="user.bio && user.bio.length > 0">
					<div>
					<p class="lead fw-normal mb-1">{{text_content.about[lang_nb]}}</p>
					<div class="p-4" style="background-color: #f8f9fa;">
						<p class="font-italic mb-1 about">{{ user.bio }}</p>
					</div>
					</div>
				</div>
				<div class="card-body p-4 text-black movies" v-if="exists(fav_movies)">
					<p class="lead fw-normal mb-4">{{text_content.favorites[lang_nb]}}:</p>
					<SearchResults  :movie_list="set_movie_props(fav_movies)" @updating="updating_movies"/>
				</div>
				<div class="card-body p-4 text-black movies"  v-if="exists(watched_movies)">
					<p class="lead fw-normal mb-4">{{text_content.watched[lang_nb]}}:</p>
					<SearchResults :movie_list="set_movie_props(watched_movies)" @updating="updating_movies"/>
				</div>
				</div>
			</div>
		</div>
			</div>
	</section>
</template>


<style lang="scss" scoped>
@import "../assets/shared_scss/search_results.scss";
@import "../assets/shared_scss/profile.scss";



.profile_header, .profile_pic {
	cursor: unset;
}

.profile_header:hover, .profile_pic:hover {
	transform: none;
}

.username {
	margin-top: 10%;
	color: rgb(212, 211, 211)
}

.check_button {
	margin-top: 10px;
	padding: 5px;
	width: 200px;
	color: rgb(48, 47, 47);
	position: absolute;
	left: 2%;
}

@media (max-width: 750px) {
	.check_button {
		left: 4%;
	}
	.button_container {
		width: 50%;
	}
}

@media (max-width: 470px) {
	.check_button {
		left: 6%;
		width: 100px;
	}
	.button_container {
		width: 40%;
	}
}



.check_button.followed {
	background :linear-gradient(to right, rgba(251, 194, 235, 1), rgba(166, 193, 238, 1));
}

.check_button.follow {
	border: 1px solid rgb(102, 102, 102);
	background : white;
}


.check_button.followed:hover {
	transform: scale(0.9);
	opacity: 0.9;
}

</style>

<style lang="css" scoped>

.page-link.active, .active > .page-link {
	background-color: black;
	border-color: rgb(99, 97, 97);
}

</style>