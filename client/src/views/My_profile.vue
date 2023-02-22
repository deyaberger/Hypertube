<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json";
import SearchResults from '../components/Search_results.vue';
import { Get_User_Fav_Movies,
	     Get_User_Watched_Movies,
	     Get_Current_User_Fav_Movies_ID,
	     Get_Current_User_Watched_Movies_ID } from '../functions/movies';
import { Get_User_Details,
		 Update_First_Name,
		 Update_Last_Name,
		 Update_Bio,
		 Update_Email } from "../functions/user"

export default {
	components: {
		SearchResults
	},
	data() {
		return {
			text_content		: textContent.PROFILE,
			own_profile         : true,

			user                : null,
			request_error		: false,
			network_error		: false,
			error_text			: '',

			watched_movies      : null,
			watched_movies_ids  : [],
			fav_movies		    : null,
			fav_movies_ids	    : [],

			first_name			: null,
			last_name			: null,
			email				: null,
			bio					: null,
			profile_pic			: null,


			first_name_is_saved : true,
			last_name_is_saved  : true,
			bio_is_saved        : true,
			email_is_saved		: true,

			first_name_error    : false,
			last_name_error     : false,
			email_error		    : false,
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
			console.log("user favs movies: ", this.fav_movies_ids)
			res = await Get_Current_User_Watched_Movies_ID(this.user_token);
			this.watched_movies_ids = res.data.map(item => item.movie_id);
		},
		parse_modifiable_data() {
			this.first_name	= this.user.first_name;
			this.last_name	= this.user.last_name;
			this.email		= this.user.mail;
			this.bio		= this.user.bio ? this.user.bio : '';
		},
		async get_user_data() {
			console.log("getting user data:")
			this.watched_movies = null
			this.fav_movies = null
			let res = await Get_User_Details(this.user_token);
			if (res.status == 200) {
				this.user = res.data
				console.log("USER: ", this.user)
				this.parse_modifiable_data();
				res = await Get_User_Fav_Movies(this.user_token);
				this.fav_movies = res.data
				res = await Get_User_Watched_Movies(this.user_token);
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
		modify_first_name() {
			this.first_name_is_saved = !this.first_name_is_saved
		},
		async save_first_name() {
			let res = await Update_First_Name(this.user_token, this.first_name)
			if (res.status == 200) {
				this.first_name_is_saved = !this.first_name_is_saved
				this.first_name_error = false
			}
			else if (res.status == 404){
				console.log("Error: ", res.message)
			}
			else if (res.status == 201) {
				this.first_name_error = true;
				console.log("Error: ", res.data.message, res.data.details)
			}
		},
		modify_last_name() {
			this.last_name_is_saved = !this.last_name_is_saved
		},
		async save_last_name() {
			let res = await Update_Last_Name(this.user_token, this.last_name)
			if (res.status == 200) {
				this.last_name_is_saved = !this.last_name_is_saved
				this.last_name_error = false
			}
			else if (res.status == 404){
				console.log("Error: ", res.message)
			}
			else if (res.status == 201) {
				this.last_name_error = true;
				console.log("Error: ", res.data.message, res.data.details)
			}
		},
		modify_bio() {
			this.bio_is_saved = !this.bio_is_saved
		},
		async save_bio() {
			let res = await Update_Bio(this.user_token, this.bio)
			if (res.status == 200) {
				this.bio_is_saved = !this.bio_is_saved
				this.bio_error = false
			}
			else if (res.status == 404){
				console.log("Error: ", res.message)
			}
		},
		modify_mail() {
			this.email_is_saved = !this.email_is_saved
		},
		async save_mail() {
			let res = await Update_Email(this.user_token, this.email)
			if (res.status == 200) {
				this.email_is_saved = !this.email_is_saved
				this.email_error = false
			}
			else if (res.status == 404){
				console.log("Error: ", res.message)
			}
			else if (res.status == 201) {
				this.email_error = true;
				console.log("Error: ", res.data.message, res.data.details)
			}
		},
		async updating_movies(value) {
			let update_info = JSON.parse(JSON.stringify(value));
			let movie_type = update_info['type']
			let id = update_info['id']
			if (movie_type == "favorites") {
				let res = await Get_User_Fav_Movies(this.user_token);
				this.fav_movies = res.data
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
		uploadImage(event) {
			let file = event.target.files[0];
			const reader = new FileReader();
			reader.addEventListener("load", () => {
				this.user.picture = reader.result;
				console.log("USER piC: ", this.user.picture)
			});
			if (file) {
				reader.readAsDataURL(file);
			}
		},
		mimic_click() {
			this.$refs.fileInput.click();
		}
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
						<img :src="user.picture" alt="profile pic" class="profile_pic" onerror="this.src='../src/assets/generic_profile_pic.jpg';">
						<input type="file" ref="fileInput" @change="uploadImage"/>
						<b-icon-arrow-repeat  class="h2 change_icon" @click="mimic_click"></b-icon-arrow-repeat>
					</div>
					<span><button class="btn btn-dark remove_pic"><b-icon-trash/></button></span>
					</div>
					<div class="ms-3 main_info" >
						<div v-if="first_name_is_saved">
							<span class ="h3 name">{{ first_name }}
							<b-icon-pen class="modify h5" @click="modify_first_name()"></b-icon-pen>
							</span>
						</div>
						<div  v-else class="input-group">
							<input
								v-model = "first_name"
								class="form-control"
								:class="{ error_input : first_name_error}"
								name="password"
								:placeholder="first_name"
							>
							<span class="input-group-btn align-items-center">
								<button class="btn check_button" type="button">
									<b-icon-check class="h2 m-1 check" @click="save_first_name()"></b-icon-check >
								</button>
							</span>
						</div>
						<p class="error_msg" v-show="first_name_error">{{text_content.first_name_error[lang_nb]}}</p>
						<div class="mt-3">
						<div v-if="last_name_is_saved">
							<span class ="h3 name">{{ last_name }}
								<b-icon-pen class="modify h5" @click="modify_last_name()"></b-icon-pen>
							</span>
						</div>
						<div  v-else class="input-group">
							<input
								v-model = "last_name"
								class="form-control"
								:class="{ error_input : last_name_error}"
								name="password"
								:placeholder="last_name"
							>
							<span class="input-group-btn align-items-center">
								<button class="btn check_button" type="button">
									<b-icon-check class="h2 m-1 check" @click="save_last_name()"></b-icon-check >
								</button>
							</span>
						</div>
						<p class="error_msg" v-show="last_name_error">{{text_content.last_name_error[lang_nb]}}</p>
						</div>
					</div>
				</div>

				<div class="p-4 text-black" style="background-color: #f8f9fa;">
					<div class="justify-content-center text-center py-1">
					<div>
						<div class="row">
						<div class="col">
							<p class="small text-muted mb-0">{{text_content.username[lang_nb]}}</p>
							<p>@{{user.username}}</p>
						</div>
						<div class="col-7">
							<div>
								<p class="small text-muted mb-0">email</p>
								<p v-if="email_is_saved" class="mb-1 h5  email">{{email}}<b-icon-pen class="modify h5 mail" @click="modify_mail()"></b-icon-pen></p>
								<div  v-else class="input-group email">
								<input
									v-model = "email"
									class="form-control"
									:class="{ error_input : email_error}"
									name="password"
									:placeholder="email"
								>
								<span class="input-group-btn align-items-center">
									<button class="btn check_button  email" type="button">
										<b-icon-check class="h2 m-1 check" @click="save_mail()"></b-icon-check >
									</button>
								</span>
							</div>
							<p class="error_msg" v-show="email_error">{{text_content.email_error[lang_nb]}}</p>
							</div>

						</div>
						<div class="col">
							<p class="small text-muted mb-0">{{text_content.followers[lang_nb]}}</p>
							<p class="mb-1 h5">{{user.followers}}</p>
						</div>
						<div class="col">
							<p class="small text-muted mb-0">{{text_content.followings[lang_nb]}}</p>
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
						<div v-if="bio_is_saved">
						<p class="font-italic mb-1 about">{{ bio }}<b-icon-pen class="modify h5 bio" :class="bio.length == 0 ? 'empty' : ''" @click="modify_bio()"></b-icon-pen></p>
						</div>
						<div v-else>
							<b-form-textarea
								id="textarea"
								v-model = "bio"
								name="password"
								:placeholder="bio"
								:maxlength=499
							></b-form-textarea>
							<p class="max_length">{{text_content.bio_max_length[lang_nb]}}: 500</p>
							<button class="btn check_button bio" type="button" @click="save_bio()">{{text_content.save[lang_nb]}}
							</button>
						</div>
					</div>
					</div>
				</div>
				<div class="card-body p-4 text-black movies" v-if="exists(fav_movies)">
					<p class="lead fw-normal mb-4">{{text_content.favorites[lang_nb]}}:</p>
					<SearchResults :movie_list="set_movie_props(fav_movies)" @updating="updating_movies"/>
				</div>
				<div class="card-body p-4 text-black movies" v-if="exists(watched_movies)">
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

</style>

<style lang="css" scoped>

input[type="file"] {
	display: none;
}

.page-link.active, .active > .page-link {
	background-color: black;
	border-color: rgb(99, 97, 97);
}

</style>
