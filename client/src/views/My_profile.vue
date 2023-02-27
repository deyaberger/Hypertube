<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json";
import SearchResults from '../components/Search_results.vue';
import { Get_User_Fav_Movies,
	     Get_User_Watched_Movies} from '../functions/movies';
import { Get_User_Details,
		 Update_First_Name,
		 Update_Last_Name,
		 Update_Bio,
		 Update_Email,
		 Upload_Image} from "../functions/user"

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
			image_error_text	: '',

			watched_movies      : null,
			fav_movies		    : null,

			profile_pic			: null,
			pic_prefix			: "http://127.0.0.1:8071/api/image/get/",
			fallbackUrl			: '../src/assets/generic_profile_pic.jpg',

			first_name_is_saved : true,
			last_name_is_saved  : true,
			bio_is_saved        : true,
			email_is_saved		: true,

			first_name_error    : false,
			last_name_error     : false,
			email_error		    : false,
			image_error			: false,
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


		async get_user_fav_movies() { // SAME
			console.log("[my_profile]: getting user fav movies...")
			let res = await Get_User_Fav_Movies(this.user_token);
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
			let res = await Get_User_Watched_Movies(this.user_token);
			if (res.data.code == "SUCCESS") {
				this.watched_movies = res.data.watched;
				console.log("[my_profile]: Successfully got user watched movies!", this.watched_movies)
			}
			else {
				console.log("ERROR [my_profile]: in get_user_watched_movies ", res)
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
					this.user.bio = this.user.bio ? this.user.bio : ''
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
				let res = await Update_First_Name(this.user_token, this.user.first_name)
				if (res && res.data.code == "SUCCESS") {
					this.first_name_is_saved = !this.first_name_is_saved
					this.first_name_error = false
					console.log("[my_profile] Succesfully updated firstname to", {first_name : this.user.first_name})

				}
				else if (res && res.data.code == "FAILURE") {
					this.first_name_error = true;
					console.log("ERROR [my_profile] in save_first_name : ", res.data.msg)
				}
			}
			catch(e) {
				console.log("UNKOWN ERROR [my_profile] in save_first_name ")
				throw(e)
			}

		},

		modify_last_name() {
			this.last_name_is_saved = !this.last_name_is_saved
		},

		async save_last_name() {
			try {
				let res = await Update_Last_Name(this.user_token, this.user.last_name)
				if (res && res.data.code == "SUCCESS") {
					this.last_name_is_saved = !this.last_name_is_saved
					this.last_name_error = false
					console.log("[my_profile] Succesfully updated lastname to", {last_name : this.user.last_name})

				}
				else if (res && res.data.code == "FAILURE") {
					this.last_name_error = true;
					console.log("ERROR [my_profile] in save_last_name : ", res.data.msg)
				}
			}
			catch(e) {
				console.log("UNKOWN ERROR [my_profile] in save_last_name ")
				throw(e)
			}

		},

		modify_bio() {
			this.bio_is_saved = !this.bio_is_saved
		},

		async save_bio() {
			try {
				let res = await Update_Bio(this.user_token, this.user.bio)
				if (res.status == 200) {
					this.bio_is_saved = !this.bio_is_saved
					this.bio_error = false
					console.log("[my_profile] Succesfully updated bio to", {bio : this.user.bio})
				}
			}
			catch(e) {
				console.log("UNKOWN ERROR [my_profile] in save_bio ")
				throw(e)
			}

		},

		modify_mail() {
			this.email_is_saved = !this.email_is_saved
		},

		async save_mail() {
			try {
				let res = await Update_Email(this.user_token, this.user.mail)
				if (res && res.data.code == "SUCCESS") {
					this.email_is_saved = !this.email_is_saved
					this.email_error = false
					console.log("[my_profile] Succesfully updated mail to", {mail : this.user.mail})

				}
				else if (res && res.data.code == "FAILURE") {
					this.email_error = true;
					console.log("ERROR [my_profile] in save_mail : ", res.data.msg)
				}
			}
			catch(e) {
				console.log("UNKOWN ERROR [my_profile] in save_mail ")
				throw(e)
			}
		},

		async upload_image(event) {
			let file = event.target.files[0];
			try {
				console.log("[my_profile]: Uploading image....")
				let res = await Upload_Image(this.user_token, file)
				if (res.data.code == "SUCCESS") {
					this.user.picture = `${res.data.filename}`
					this.image_error = false
					console.log("[my_profile]: Successfully uploaded image ", this.user.picture)
				}
				else if (res.data.code == "FILE_TYPE_ERROR") {
					this.image_error = true
					this.image_error_text = this.text_content.image_type_error[this.lang_nb]
					console.log("ERROR [my_profile]: in upload_image ", res.data.message)
				}
			}
			catch(e) {
				throw(e)
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
						<img :src="get_user_profile_pic()" alt="profile pic" class="profile_pic" @error="handle_image_error"/>
						<input type="file" ref="fileInput" @change="upload_image"/>
						<b-icon-arrow-repeat  class="h2 change_icon" @click="mimic_click"></b-icon-arrow-repeat>
						<p class="error_msg" v-if="image_error">{{image_error_text}}</p>
					</div>
					</div>
					<div class="ms-3 main_info" >
						<div v-if="first_name_is_saved">
							<span class ="h3 name">{{ user.first_name }}
							<b-icon-pen class="modify h5" @click="modify_first_name()"></b-icon-pen>
							</span>
						</div>
						<div  v-else class="input-group">
							<input
								v-model = "user.first_name"
								class="form-control"
								:class="{ error_input : first_name_error}"
								name="password"
								:placeholder="user.first_name"
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
							<span class ="h3 name">{{ user.last_name }}
								<b-icon-pen class="modify h5" @click="modify_last_name()"></b-icon-pen>
							</span>
						</div>
						<div  v-else class="input-group">
							<input
								v-model = "user.last_name"
								class="form-control"
								:class="{ error_input : last_name_error}"
								name="password"
								:placeholder="user.last_name"
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

				<div class="p-4 pt-5 text-black" style="background-color: #f8f9fa;">
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
								<p v-if="email_is_saved" class="mb-1 h5  email">{{user.mail}}<b-icon-pen class="modify h5 mail" @click="modify_mail()"></b-icon-pen></p>
								<div  v-else class="input-group email">
								<input
									v-model = "user.mail"
									class="form-control"
									:class="{ error_input : email_error}"
									name="password"
									:placeholder="user.mail"
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
						<p class="font-italic mb-1 about">{{ user.bio }}<b-icon-pen class="modify h5 bio" :class="user.bio.length == 0 ? 'empty' : ''" @click="modify_bio()"></b-icon-pen></p>
						</div>
						<div v-else>
							<b-form-textarea
								id="textarea"
								v-model = "user.bio"
								name="password"
								:placeholder="user.bio"
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
