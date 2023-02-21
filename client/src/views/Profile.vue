<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json";
import SearchResults from '../components/Search_results.vue';
import { Get_Other_User_Details,
	Get_User_Fav_Movies,
	Get_User_Watched_Movies,
	Get_Current_User_Fav_Movies_ID,
	Get_Current_User_Watched_Movies_ID } from "../functions/user"

export default {
	props: {
		user_id: String,
	},
	components: {
		SearchResults
	},
	data() {
		return {
			text_content		: textContent.PROFILE,
			user                : null,

			request_error		: false,
			network_error		: false,
			error_text			: '',

			watched_movies      : null,
			watched_movies_ids  : [],
			fav_movies		    : null,
			fav_movies_ids	    : [],

			followed			: false
		}
	},
	computed: mapState({
      	lang_nb  : state =>  state.lang_nb,
		user_token : state =>  state.user_token,
    }),
	methods: {
		set_movie_props(movies) {
			return {
				'data'    : movies,
				'profile' : true,
				'error'   : false,
				'favs'    : this.fav_movies_ids,
				'watched' : this.watched_movies_ids,
			}
		},
		exists(movies) {
			if (movies == null || (movies != null && movies.length == 0)) {
				return false
			}
			return true
		},
		async get_user_fav_and_co() {
			console.log("getting favvsss")
			let res = await Get_Current_User_Fav_Movies_ID(this.user_token);
			this.fav_movies_ids = res.data.map(item => item.movie_id);
			res = await Get_Current_User_Watched_Movies_ID(this.user_token);
			this.watched_movies_ids = res.data.map(item => item.movie_id);
		},
		update_follow() {
			this.followed = !this.followed
		},
		async get_user_data() {
			console.log("getting other user data:")
			this.watched_movies = null
			this.fav_movies = null
			let res = await Get_Other_User_Details(this.user_token, this.user_id);
			if (res.status == 200) {
				this.user = res.data
				console.log("USER: ", this.user)
				res = await Get_User_Fav_Movies(this.user_token, this.user_id);
				this.fav_movies = res.data
				res = await Get_User_Watched_Movies(this.user_token, this.user_id);
				this.watched_movies = res.data
			}
			else if (res.status == 404 || res.status == 201) {
				this.request_error = true
				this.error_text = res.status == 404 ?
					this.text_content.request_error[this.lang_nb] : this.text_content.no_user_found[this.lang_nb]
				console.log("Error: ", res.message)
			}
			else if (res.code == 'ERR_NETWORK') {
				this.network_error = true
				this.error_text = this.text_content.network_error[this.lang_nb]
			}
		},
		async updating_movies(value) {
			let update_info = JSON.parse(JSON.stringify(value));
			let movie_type = update_info['type']
			let id = update_info['id']
			if (movie_type == "favorites") {
				if (this.fav_movies_ids.includes(id)) {
					delete this.fav_movies_ids[this.fav_movies_ids.indexOf(id)]
				}
				else {
					this.fav_movies_ids.push(id)
				}
			}
			if (movie_type == "watched") {
				if (this.watched_movies_ids.includes(id)) {
					delete this.watched_movies_ids[this.fav_movies_ids.indexOf(id)]
				}
				else {
					this.watched_movies_ids.push(id)
				}
			}
		},
	},
	mounted() {
		this.get_user_data();
		this.get_user_fav_and_co();
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
								<p class="lead fw-normal mb-1">{{error_text}}</p>
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
						<img :src="user.picture" alt="profile pic" class="img-fluid img-thumbnail profile_pic" onerror="this.src='../src/assets/generic_profile_pic.jpg';">
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
						<div class="col">
							<button v-if="followed" class="btn check_button followed" @click="update_follow()" type="button" data-toggle="tooltip" data-placement="top" :title="text_content.unfollow[lang_nb]">{{text_content.followed[lang_nb]}}</button>
							<button v-else class="btn check_button follow" type="button" @click="update_follow()">{{text_content.follow[lang_nb]}}</button>
						</div>
						<div class="col-7">
						</div>
						<div class="col">
							<p class="small text-muted mb-0">{{text_content.followers[lang_nb]}}</p>
							<p class="mb-1 h5">{{user.followers}}</p>
						</div>
						<div class="col">
							<p class="small text-muted mb-0">{{text_content.followed[lang_nb]}}</p>
							<p class="mb-1 h5">{{user.followed}}</p>
						</div>
						</div>
					</div>
					</div>
				</div>
				<div class="card-body p-4 text-black">
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
	background-color: black;
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
	margin-left: 1%;
	margin: 0px;
	margin-top: 10px;
	padding: 5px;
	width: 200px;
	color: rgb(48, 47, 47);
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