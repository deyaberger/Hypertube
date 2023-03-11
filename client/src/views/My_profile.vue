<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json";
import SearchResults from '../components/Search_results.vue';
import { Get_User_Fav_Movies, Get_User_Watched_Movies} from '../functions/movies';
import { copy, is_empty } from '../functions/utils'
import { Get_User_Details,
		 Update_Username,
		 Update_First_Name,
		 Update_Last_Name,
		 Update_Bio,
		 Update_Email,
		 Upload_Image} from "../functions/user";
import store from '../stores/store';
import fallbackUrll from '/src/assets/generic_profile_pic.png'


export default {
	name: "My_profile",

	beforeRouteEnter(to, from, next) {
		const isAuthenticated = store.state.user_token != null // check if the user is authenticated
		if (!isAuthenticated) {
			console.log("[my_profile]: not logged in yeat, redirecting to sign in")
			next("/sign_in") // redirect to sign-in page if the user is not authenticated
		} else {
			next() // continue with navigation
		}
	},

	components: {
		SearchResults
	},


	data() {
		return {
			text_content          : textContent.PROFILE,
			is_empty			  : is_empty,
			user                  : null,

			username              : null,
			first_name            : null,
			last_name             : null,
			email                 : null,
			bio                   : null,

			request_error         : false,
			network_error         : false,
			error_text            : '',
			image_error_text      : '',

			watched_movies        : null,
			fav_movies            : null,

			profile_pic           : null,
			pic_prefix            : "/api/image/get/",
			fallbackUrl           : fallbackUrll,

			username_is_saved     : true,
			first_name_is_saved   : true,
			last_name_is_saved    : true,
			bio_is_saved          : true,
			email_is_saved        : true,

			username_error        : false,
			first_name_error      : false,
			last_name_error       : false,
			email_error           : false,
			image_error           : false,

			username_error_text   : textContent.PROFILE.username_error,
			last_name_error_text  : textContent.PROFILE.last_name_error,
			first_name_error_text : textContent.PROFILE.first_name_error,
			email_error_text      : textContent.PROFILE.email_error,

			regex_whitespace      : /^\S*$/,
			regex_mail            : /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
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

		parse_modifiable_data(user) {
			this.username   = copy(user.username)
			this.first_name = copy(user.first_name)
			this.last_name  = copy(user.last_name)
			this.email      = copy(user.mail)
			this.bio        = this.user.bio ? copy(this.user.bio) : ''
		},

		async get_user_fav_movies() { // SAME
			console.log("[my_profile]: getting user fav movies...")
			try {
				let res = await Get_User_Fav_Movies(this.user_token);
				if (res && res.data && res.data.code == "SUCCESS") {
					this.fav_movies = res.data.favorites
					console.log("[my_profile]: Successfully got user fav movies!", this.fav_movies)
				}
				else {
					console.log("ERROR [my_profile]: in get_user_fav_movies ", res)
				}
			}
			catch (e) {
				console.log("wierd erro in get use favourites")
				throw(e)
				this.fav_movies = null
			}
		},

		async get_user_watched_movies() { // SAME
			console.log("[my_profile]: getting user watched movies...")
			try {
				let res = await Get_User_Watched_Movies(this.user_token);
				if (res.data.code == "SUCCESS") {
					this.watched_movies = res.data.watched;
					console.log("[my_profile]: Successfully got user watched movies!", this.watched_movies)
				}
				else {
					console.log("ERROR [my_profile]: in get_user_watched_movies ", res)
				}
			}
			catch (e) {
				console.log("wierd erro in get user watched")
				throw(e)
				this.watched_movies = null
			}
		},

		async get_user_data() { // ALMOST SAME
			try {
				console.log("[my_profile]: getting user data...")
				let res = await Get_User_Details(this.user_token);
				if (res.code == 'ERR_NETWORK') {
					this.network_error = true
					this.error_text = this.text_content.network_error[this.lang_nb]
					console.log("ERROR [my_profile]: server down")
				}
				else if (res.data != null && res.data.code == "SUCCESS") {
					this.user = res.data.user
					this.parse_modifiable_data(this.user);
					console.log("[my_profile]: Successfully got user data! ", this.user)
				}
				else if (res.data != null && (res.data.code == "NO_USER_WITH_THIS_ID" || res.data.code == "FAILURE")) {
					this.request_error = true
					this.error_text = this.text_content.no_user_found[this.lang_nb]
					console.log("ERROR [my_profile]: get_user_data", {msg: res.data.msg})
				}
				else {
					console.log("UNKOWN ERROR [my_profile]: ", res)
				}
			}
			catch(e) {
				throw(e)
				this.parse_modifiable_data(res.data.user);
			}
		},

		get_user_profile_pic() { // SAME
			try {
				if (!is_empty(this.user.picture)) {
					if (this.user.picture.startsWith('http')) {
						return (this.user.picture)
					}
					return `${this.pic_prefix}${this.user.picture}`
				}
				return null
			}
			catch (e) {
				throw(e)
				return null
			}
		},

		async updating_movies(value) {  // SAME
			this.get_user_fav_movies();
			this.get_user_watched_movies();
		},

		handle_image_error(event) {  // SAME
			event.target.src = this.fallbackUrl;
		},

		modify_first_name() {
			this.first_name_is_saved = !this.first_name_is_saved
		},

		async save_first_name() {
			try {
				if (this.first_name_error) {
					return
				}
				if (is_empty(this.first_name)) {
					this.first_name = null
				}
				let res = await Update_First_Name(this.user_token, this.first_name)
				if (res && res.data && res.data.code == "SUCCESS") {
					this.first_name_is_saved = !this.first_name_is_saved
					this.first_name_error = false
					this.user.first_name = this.first_name;
					console.log("[my_profile] Succesfully updated firstname to", {first_name : this.first_name})
				}
				else {
					this.first_name_error = true;
					if (res && res.data && (res.data.code == "FAILURE")) {
						this.first_name_error_text = this.text_content.first_name_error
						console.log("ERROR [my_profile] in save_first_name : ", res.data.msg)
					}
					else if (res && res.data && (res.data.code == "TOO_LONG")) {
						this.first_name_error_text = this.text_content.first_name_error_long
						console.log("ERROR [my_profile] in save_first_name : ", res.data.msg)
					}
					else {
						this.first_name_error_text = this.text_content.firstname_unkown_err;
						console.log("UNKOWN ERROR [my_profile] in save_first_name ")
					}
				}

			}
			catch(e) {
				console.log("UNKOWN ERROR [my_profile] in save_first_name ")
				throw(e)
				this.first_name = this.user.first_name
				this.first_name_error = true;
				this.first_name_error_text = this.text_content.first_name_error
			}

		},

		reset_first_name() {
			this.first_name_is_saved = !this.first_name_is_saved
			this.first_name_error = false
			this.first_name = this.user.first_name
		},

		modify_last_name() {
			this.last_name_is_saved = !this.last_name_is_saved
		},

		async save_last_name() {
			try {
				if (this.last_name_error) {
					return
				}
				if (is_empty(this.last_name)) {
					this.last_name = null
				}
				let res = await Update_Last_Name(this.user_token, this.last_name)
				if (res && res.data && res.data.code == "SUCCESS") {
					this.last_name_is_saved = !this.last_name_is_saved
					this.last_name_error = false
					this.user.last_name = this.last_name;
					console.log("[my_profile] Succesfully updated lastname to", {last_name : this.last_name})
				}
				else {
					this.last_name_error = true;
					if (res && res.data && res.data.code == "FAILURE") {
						this.last_name_error_text = this.text_content.last_name_error
						console.log("ERROR [my_profile] in save_last_name : ", res.data.msg)
					}
					else if (res && res.data && res.data.code == "TOO_LONG") {
						this.last_name_error_text = this.text_content.last_name_error_long
						console.log("ERROR [my_profile] in save_last_name : ", res.data.msg)
					}
					else {
						this.last_name_error_text = this.text_content.lastname_unkown_err;
						console.log("UNKOWN ERROR [my_profile] in save_first_name ")
					}
				}

			}
			catch(e) {
				console.log("UNKOWN ERROR [my_profile] in save_last_name ")
				this.last_name_error = true;
				this.last_name_error_text = this.text_content.last_name_error
				throw(e)
			}

		},

		reset_last_name() {
			this.last_name_is_saved = !this.last_name_is_saved
			this.last_name_error    = false
			this.last_name          = copy(this.user.last_name)
		},

		modify_bio() {
			this.bio_is_saved = !this.bio_is_saved
		},

		async save_bio() {
			try {
				if (this.bio_error) {
					return
				}
				if (is_empty(this.bio)) {
					this.bio = null
				}
				let res = await Update_Bio(this.user_token, this.bio)
				if (res && res.data && res.data.code == "SUCCESS") {
					this.bio_is_saved = !this.bio_is_saved;
					this.bio_error = false;
					this.user.bio = this.bio;
					console.log("[my_profile] Succesfully updated bio to", {bio : this.bio})
				}
				else {
					console.log("UNKOWN ERROR [my_profile] in save_bio ")
					this.bio_error = true;
				}
			}
			catch(e) {
				console.log("UNKOWN ERROR [my_profile] in save_bio ")
				throw(e)
			}
		},

		reset_bio() {
			this.bio_is_saved = !this.bio_is_saved
			this.bio_error = false
			this.bio = copy(this.user.bio)
		},

		modify_username() {
			this.username_is_saved = !this.username_is_saved
		},

		async save_username() {
			try {
				if (this.username_error) {
					return
				}
				if (this.username == this.user.username) {
					this.username_is_saved = !this.username_is_saved
					this.username_error = false;
					this.username_error_text = this.text_content.username_error;
					return
				}
				if (is_empty(this.username)) {
					this.username = null
				}
				let res = await Update_Username(this.user_token, this.username)
				if (res && res.data && res.data.code == "SUCCESS") {
					this.username_is_saved = !this.username_is_saved
					this.username_error = false;
					this.user.username = this.username;
					console.log("[my_profile] Succesfully updated username to", {username : this.username})
				}
				else {
					this.username_error = true;
					if (res && res.data && res.data.code == "FAILURE") {
						this.username_error_text = this.text_content.username_error;
						console.log("ERROR [my_profile] in save_username : ", res.data.msg)
					}
					else if (res && res.data && res.data.code == "TOO_LONG") {
						this.username_error_text = this.text_content.username_error_long;
						console.log("ERROR [my_profile] in save_username : ", res.data.msg)
					}
					else if (res && res.data && res.data.code == "USERNAME_TAKEN") {
						this.username_error_text = this.text_content.username_error_dup;
						console.log("ERROR [my_profile] in save_username : ", res.data.msg)
					}
					else {
						this.username_error_text = this.text_content.username_unkown_err;
						console.log("UNKOWN ERROR [my_profile] in save_username ")
					}
				}

			}
			catch(e) {
				console.log("UNKOWN ERROR [my_profile] in save_username ")
				throw(e)
				this.username_error = true;
				this.username_error_text = this.text_content.username_unkown_err;
			}
		},

		reset_username() {
			this.username_is_saved = !this.username_is_saved
			this.username_error = false
			this.username = copy(this.user.username)
		},

		modify_mail() {
			this.email_is_saved = !this.email_is_saved
		},

		async save_mail() {
			try {
				if (this.email_error) {
					return
				}
				if (is_empty(this.email)) {
					this.email = null
				}
				let res = await Update_Email(this.user_token, this.email)
				console.log("res: ", res)
				if (res && res.data && res.data.code == "SUCCESS") {
					this.email_is_saved = !this.email_is_saved
					this.email_error = false;
					this.email_error_text = this.text_content.email_error;
					this.user.mail = this.email;
					console.log("[my_profile] Succesfully updated mail to", {mail : this.email})

				}
				else {
					this.email_error = true;
					if (res && res.data && res.data.code == "FAILURE") {
						this.email_error_text = this.text_content.email_error;
						console.log("ERROR [my_profile] in save_mail : ", res.data.msg)
					}
					else if (res && res.data && res.data.code == "TOO_LONG") {
						this.email_error_text = this.text_content.email_error_long;
						console.log("ERROR [my_profile] in save_mail : ", res.data.msg)
					}
					else if (res && res.data && res.data.code == "EMAIL_TAKEN") {
						this.email_error_text = this.text_content.email_error_dup;
						console.log("ERROR [my_profile] in save_mail : ", res.data.msg)
					}
					else {
						this.email_error_text = this.text_content.email_unkown_err;
						console.log("UNKOWN ERROR [my_profile] in save_mail ")
					}
				}

			}
			catch(e) {
				console.log("UNKOWN ERROR [my_profile] in save_mail ")
				throw(e)
				this.email_error = true;
				this.email_error_text = this.text_content.email_unkown_err;
			}
		},

		reset_mail() {
			this.email_is_saved = !this.email_is_saved
			this.email_error = false
			this.email = JSON.parse(JSON.stringify(this.user.mail))
		},

		async upload_image(event) {
			let file = event.target.files[0];
			try {
				console.log("[my_profile]: Uploading image....")
				let res = await Upload_Image(this.user_token, file)
				if (res && res.data && res.data.code == "SUCCESS") {
					this.user.picture = `${res.data.filename}`
					this.image_error = false
					console.log("[my_profile]: Successfully uploaded image ", this.user.picture)
				}
				else if (res && res.data && res.data.code == "LIMIT_FILE_SIZE") {
					this.image_error = true
					this.image_error_text = this.text_content.image_size_error[this.lang_nb]
					console.log("ERROR [my_profile]: in upload_image ", res.data.message)
				}
				else if (res && res.data && res.data.code == "FILE_TYPE_ERROR") {
					this.image_error = true
					this.image_error_text = this.text_content.image_type_error[this.lang_nb]
					console.log("ERROR [my_profile]: in upload_image ", res.data.message)
				}
			}
			catch(e) {
				throw(e)
				this.image_error = true
				this.image_error_text = "Unexpected error with your image. Try another."
			}
		},

		mimic_click() {
			this.$refs.fileInput.click();
		}
	},


	computed: mapState({  // SAME
      	lang_nb  : state =>  state.lang_nb,
		user_token : state =>  state.user_token,
    }),


	async mounted() {  // SAME
		await this.get_user_data();
		await this.get_user_fav_movies();
		await this.get_user_watched_movies();
	},

	watch: {
		username: {
			handler:function() {
				if (!is_empty(this.username)  && this.username.match(this.regex_whitespace) == null){
					this.username_error = true
				}
				else if (is_empty(this.username)) {
					this.username_error = true
				}
				else {
					this.username_error = false
				}
			},
			deep:true
		},

		first_name: {
			handler:function() {
				if (!is_empty(this.first_name) && this.first_name.match(this.regex_whitespace) == null){
					this.first_name_error = true
				}
				else {
					this.first_name_error = false
				}
			},
			deep:true
		},

		last_name: {
			handler:function() {
				if (!is_empty(this.last_name) && this.last_name.match(this.regex_whitespace) == null){
					this.last_name_error = true
				}
				else {
					this.last_name_error = false
				}
			},
			deep:true
		},

		email: {
			handler:function() {
				console.log("handling mail")
				if (!is_empty(this.email) && this.email.match(this.regex_mail) == null){
				console.log("handling mail err")
					this.email_error_text = this.text_content.email_error;
					this.email_error = true
				}
				else {
				console.log("handling mail good")
					this.email_error = false
				}
			},
			deep:true
		}
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
				<div class="rounded-top text-white d-flex flex-row black_rectangle">
					<div class="ms-4 d-flex flex-column pic_container">
					<div class="profile_header mt-4" >
						<img :src="get_user_profile_pic()" alt="profile pic" class="profile_pic" @error="handle_image_error"/>
						<input type="file" ref="fileInput" @change="upload_image"/>
						<b-icon-arrow-repeat  class="h2 change_icon" @click="mimic_click"></b-icon-arrow-repeat>
						<p class="error_msg" v-if="image_error">{{image_error_text}}</p>
					</div>
					</div>
					<div class="main_info">
						<div v-if="first_name_is_saved">
							<span v-if="!is_empty(first_name)" class ="h3 name">{{ first_name }}
								<b-icon-pen class="modify h5" @click="modify_first_name()"></b-icon-pen>
							</span>
							<span v-else class ="h3 name tmp">{{ text_content.first_name[lang_nb] }}
								<b-icon-pen class="modify h5" @click="modify_first_name()"></b-icon-pen>
							</span>
						</div>
						<div  v-else class="input-group">
							<input
								v-model = "first_name"
								class="form-control"
								:class="{ error_input : first_name_error}"
								name="fname"
								:maxlength="20"
								:placeholder="first_name"
							>
							<span class="input-group-btn align-items-center">
								<button class="btn check_button" type="button">
									<b-icon-check class="h2 m-1 check" @click="save_first_name()"></b-icon-check >
								</button>
							</span>
							<span class="input-group-btn align-items-center">
								<button class="btn check_button" type="button">
									<b-icon-x class="h2 m-1 reset" @click="reset_first_name()"></b-icon-x >
								</button>
							</span>
						</div>
						<p class="error_msg" v-show="first_name_error">{{first_name_error_text[lang_nb]}}</p>
						<div class="mt-3">
						<div v-if="last_name_is_saved">
							<span v-if="last_name != null && last_name.length > 0" class ="h3 name">{{ last_name }}
								<b-icon-pen class="modify h5" @click="modify_last_name()"></b-icon-pen>
							</span>
							<span v-else class ="h3 name tmp">{{ text_content.last_name[lang_nb] }}
								<b-icon-pen class="modify h5" @click="modify_last_name()"></b-icon-pen>
							</span>
						</div>
						<div  v-else class="input-group">
							<input
								v-model = "last_name"
								class="form-control"
								:class="{ error_input : last_name_error}"
								name="l_name"
								:maxlength="20"
								:placeholder="last_name"
							>
							<span class="input-group-btn align-items-center">
								<button class="btn check_button" type="button">
									<b-icon-check class="h2 m-1 check" @click="save_last_name()"></b-icon-check >
								</button>
							</span>
							<span class="input-group-btn align-items-center">
								<button class="btn check_button" type="button">
									<b-icon-x class="h2 m-1 reset" @click="reset_last_name()"></b-icon-x >
								</button>
							</span>
						</div>
						<p class="error_msg" v-show="last_name_error">{{last_name_error_text[lang_nb]}}</p>
						</div>
					</div>
				</div>

				<div class="p-4 pt-5 text-black pseudo_and_co_container" style="background-color: #f8f9fa;">
					<div class="justify-content-center text-center py-1">
					<div>
						<div class="row pseudo_and_co">
						<div class="col-3 username_container">
							<div>
							<p class="small text-muted mb-0">{{text_content.username[lang_nb]}}</p>
							<p v-if="username_is_saved && username != null && username.length > 0" class="mb-1 h5">@{{username}}<b-icon-pen class="modify h5 mail" @click="modify_username()"></b-icon-pen></p>
							<div  v-if="!username_is_saved" class="input-group username">
								<input
									v-model = "username"
									class="form-control"
									:class="{ error_input : username_error}"
									name="username"
									:maxlength="20"
									:placeholder="username"
								>
								<span class="input-group-btn align-items-center">
									<button class="btn check_button username" type="button">
										<b-icon-check class="h2 m-1 check" @click="save_username()"></b-icon-check >
									</button>
								</span>
								<span class="input-group-btn align-items-center">
									<button class="btn check_button username" type="button">
										<b-icon-x class="h2 m-1 reset" @click="reset_username()"></b-icon-x >
									</button>
								</span>
							</div>
								<p class="error_msg next_line" v-show="username_error">{{username_error_text[lang_nb]}}</p>
							</div>
						</div>
						<div class="col email_container">
							<div>
								<p class="small text-muted mb-0 ">email</p>
									<p v-if="email_is_saved && email != null && email.length > 0" class="mb-1 h5 email">{{email}}<b-icon-pen class="modify h5 mail" @click="modify_mail()"></b-icon-pen></p>
									<p v-if="email_is_saved && (email == null || email.length == 0)" class="mb-1 h5 email tmp">{{text_content.missing_email[lang_nb]}}<b-icon-pen class="modify h5 mail" @click="modify_mail()"></b-icon-pen></p>
									<div  v-if="!email_is_saved" class="input-group email">
										<input
											v-model = "email"
											class="form-control"
											:class="{ error_input : email_error}"
											name="email"
											:maxlength="50"
											:placeholder="email"
										>
										<span class="input-group-btn align-items-center">
											<button class="btn check_button  email" type="button">
												<b-icon-check class="h2 m-1 check" @click="save_mail()"></b-icon-check >
											</button>
										</span>
										<span class="input-group-btn align-items-center">
										<button class="btn check_button email" type="button">
											<b-icon-x class="h2 m-1 reset" @click="reset_mail()"></b-icon-x >
										</button>
									</span>
							</div>
							<p class="error_msg" v-show="email_error">{{email_error_text[lang_nb]}}</p>
							</div>

						</div>
						<div class="col-2 follows_container">
							<p class="small text-muted mb-0">{{text_content.followers[lang_nb]}}</p>
							<p class="mb-1 h5">{{user.followers}}</p>
						</div>
						<div class="col-2 follows_container">
							<p class="small text-muted mb-0">{{text_content.followings[lang_nb]}}</p>
							<p class="mb-1 h5">{{user.followings}}</p>
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
						<p class="font-italic mb-1 about">{{bio}}<b-icon-pen class="modify h5 bio" :class="bio == null || bio.length == 0 ? 'empty' : ''" @click="modify_bio()"></b-icon-pen></p>
						</div>
						<div v-else>
							<b-form-textarea
								id="textarea"
								v-model = "bio"
								name="bio_form"
								:placeholder="bio"
								:maxlength=499
							></b-form-textarea>
							<p :class="bio.length >= 499 ? 'max_length reset' : 'max_length'">{{text_content.bio_max_length[lang_nb]}}: 500</p>
								<button class="btn check_button bio" type="button" @click="save_bio()">{{text_content.save[lang_nb]}}</button>
								<span class="input-group-btn align-items-center">
								<button class="btn check_button" type="button">
									<b-icon-x class="h2 m-1 reset" @click="reset_bio()"></b-icon-x >
								</button>
							</span>
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

</style>
