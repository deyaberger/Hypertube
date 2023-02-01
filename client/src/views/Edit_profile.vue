<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"
import { Get_User_Details} from "../functions/user"


export default {
	data() {
		return {
			text_content : textContent.MOVIES,
			user                : null,
			own_profile         : true,
			first_name_is_saved : false,
			last_name_is_saved  : false,
			first_name_error    : false,
			last_name_error     : false,
			bio_is_saved        : true,
		}
	},
	computed: mapState({
      	lang_nb  : state =>  state.lang_nb,
		user_token : state =>  state.user_token,
    }),
	methods: {
		async get_user_data() {
			console.log("getting user data:")
			this.watched_movies = null
			this.fav_movies = null
			let res = null
			res = await Get_User_Details(this.user_token);
			this.user = res.data
			console.log("USER: ", this.user)
		},
		save_first_name() {
			this.first_name_is_saved = true
		},
		modify_first_name() {
			this.first_name_is_saved = !this.first_name_is_saved
		},
		save_last_name() {
			this.last_name_is_saved = true
		},
		modify_last_name() {
			this.last_name_is_saved = !this.last_name_is_saved
		},
		save_bio() {
			this.bio_is_saved = !this.bio_is_saved
		},
		modify_bio() {
			this.bio_is_saved = !this.bio_is_saved
		}
	},
	mounted() {
		this.get_user_data()
	}
}
</script>

<template>
	<section v-if="user" class="h-100 gradient-custom-2">
		<div class="container py-5 h-100">
			<div class="row d-flex justify-content-center align-items-center h-100">
			<div class="col col-lg-9 col-xl-7">
				<div class="card">
				<div class="rounded-top text-white d-flex flex-row" style="background-color: #000; height:200px;">
					<div class="ms-4 mt-5 d-flex flex-column" style="width: 150px;">
					<div class="profile_header mt-4" >
						<img :src="user.picture"	alt="profile pic" class="img-fluid img-thumbnail profile_pic" onerror="this.src='../src/assets/generic_profile_pic.jpg';">
						<b-icon-arrow-repeat  class="h2 change_icon"></b-icon-arrow-repeat>
					</div>
					<span><button class="btn btn-dark remove_pic"><b-icon-trash/></button></span>
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
						</div>
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
						<div v-if="bio_is_saved">
							<b-form-textarea
								id="textarea"
								v-model = "user.bio"
								name="password"
								:placeholder="user.bio"
							></b-form-textarea>
							<button class="btn check_button bio" type="button" @click="save_bio()">Save
							</button>
						</div>
						<div v-else>
						<p class="font-italic mb-1 about">{{ user.bio }}<b-icon-pen class="modify h5 bio" @click="modify_bio()"></b-icon-pen></p>
						</div>
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


.modify {
	color: white;
	margin-bottom: 3%;
	cursor: pointer
}

.about {
	position: relative;
}

.modify.bio {
	color: black;
	position: absolute;
	right: 0;
	top: 0;
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

.check {
	color: green
}


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
/* fallback for old browsers */
	background: #fbc2eb;
	background: -webkit-linear-gradient(to right, rgba(251, 194, 235, 1), rgba(166, 193, 238, 1));
	background: linear-gradient(to right, rgba(251, 194, 235, 1), rgba(166, 193, 238, 1));
}

.remove_pic {
	position: absolute;
	top: 180px;
	left: 150px;
	z-index: 2;
	background-color: black;
	color: red;
}

.error_input {
	border: 2px solid rgb(193, 6, 6);
}

</style>