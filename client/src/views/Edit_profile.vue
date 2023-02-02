<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json";
import SearchResults from '../components/Search_results.vue';
import { Get_User_Details,
	Get_User_Fav_Movies,
	Get_User_Watched_Movies,
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
			fav_movies		    : null,

			first_name			: null,
			last_name			: null,
			email				: null,
			bio					: null,


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
		parse_modifiable_data() {
			this.first_name	= this.user.first_name;
			this.last_name	= this.user.last_name;
			this.email		= this.user.email;
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
		}
	},
	mounted() {
		this.get_user_data()
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
						<b-icon-arrow-repeat  class="h2 change_icon"></b-icon-arrow-repeat>
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
								<p v-if="email_is_saved" class="mb-1 h5  email">{{ email }}<b-icon-pen class="modify h5 mail" @click="modify_mail()"></b-icon-pen></p>
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
							<p class="mb-1 h5  email">{{user.followers}}</p>
						</div>
						<div class="col">
							<p class="small text-muted mb-0">{{text_content.followed[lang_nb]}}</p>
							<p class="mb-1 h5  email">{{user.followed}}</p>
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
							></b-form-textarea>
							<button class="btn check_button bio" type="button" @click="save_bio()">{{text_content.save[lang_nb]}}
							</button>
						</div>
					</div>
					</div>
				</div>
				<div class="card-body p-4 text-black movies">
					<p class="lead fw-normal mb-4">{{text_content.favorites[lang_nb]}}:</p>
					<SearchResults :movie_list="{'profile' : true, 'data' : fav_movies}"/>
				</div>
				<div class="card-body p-4 text-black movies">
					<p class="lead fw-normal mb-4">{{text_content.watched[lang_nb]}}:</p>
					<SearchResults :movie_list="{'profile' : true, 'data' : watched_movies}"/>
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

.movies {
	margin-top: 0px;
	margin-bottom: 0px;
}

.modify {
	color: white;
	margin-bottom: 3%;
	cursor: pointer
}

.about, .email {
	position: relative;
}

.modify.mail {
	color: black;
	position: absolute;
	margin-top: -1%;
	margin-left: 1%;
}

.modify.bio {
	color: black;
	position: absolute;
	right: 0;
	top: 0px;
}
.modify.bio.empty {
	top : -15px;
}


.modify:hover {
	transform: scale(1.3);
}
.check_button {
	border-color: white;
	padding: 0
}

.check_button.bio {
	color: rgb(48, 47, 47);
	margin-left: 1%;
	margin: 0px;
	margin-top: 10px;
	padding: 5px;
	padding-right : 20px;
	padding-left : 20px;
	background :linear-gradient(to right, rgba(251, 194, 235, 1), rgba(166, 193, 238, 1));
}

.check_button:hover .check {
	transform: scale(1.2);
	color: rgb(113, 238, 113);
}
.input-group > * {
	background-color: black;
	color: white;
}

.input-group.email > * {
	background-color: white;
	color: black;
	margin-left : 15%
}
.check_button.email {
	border-color: rgb(190, 189, 189);
}

.check {
	color: green
}


.profile_header {
	width: 200px;
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

.name
{
	text-transform: capitalize;
	color: white;
	margin-right: 5%;

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
	background: linear-gradient(to right, rgba(251, 194, 235, 1), rgba(166, 193, 238, 1));
	height: 100vw;
}

.remove_pic {
	position: absolute;
	top: 240px;
	left: 190px;
	z-index: 2;
	background-color: black;
	color: red;
}

.error_input {
	border: 2px solid rgb(193, 6, 6);
}

.error_msg {
	padding-left: 2%;
	color: rgb(235, 44, 44);;
	white-space: pre;
	text-transform: none;
  }

</style>