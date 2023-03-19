<script>
import { mapState }      from 'vuex';
import textContent       from "../assets/language_dict/language_dict.json"
import NetworkButtons    from "../components/Networks_buttons.vue"
import { Sign_Up }       from '../functions/auth';
import store from '../stores/store';


export default {
	name: "Sign_up",

	beforeRouteEnter(to, from, next) {
		const isAuthenticated = store.state.user_token != null // check if the user is authenticated
		if (isAuthenticated) {
			console.log("[sign_up]: already logged in, you need to logout if you want to sign up again")
			next("/search") // redirect to search page
		} else {
			next() // continue with navigation
		}
	},

	components: {
		NetworkButtons
	},

	data() {
		return {
			visible             : false,
			text_content        : textContent.SIGNUP,
			username            : '',
			firstname           : '',
			lastname            : '',
			email               : '',
			password            : '',
			username_error      : false,
			firstname_error     : false,
			lastname_error      : false,
			email_error         : false,
			email_error_text    : textContent.SIGNUP.error_email,
			username_error_text : textContent.SIGNUP.error_username,
			mdp_error           : false,
			connection_error    : false,
			regex_whitespace 	: /^\S*$/,
			regex_mail 			: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
			regex_pwd 			: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
			deactivate_button	: false
		}
	},

	computed: mapState({
		lang_nb    : state => state.lang_nb,
		user_token : state =>  state.user_token,
	}),

	methods: {
		password_visibility() {
			this.visible = !this.visible
		},

		async on_submit(e){
			e.preventDefault();
			const form = {
				"username"             : this.username,
				"firstname"            : this.firstname,
				"lastname"             : this.lastname,
				"email"                : this.email,
				"password"             : this.password,
				"connect_with_fb"      : false,
				"connect_with_google"  : false,
				"connect_with_42"      : false,
				"connect_with_twitter" : false,
			}
			try {
				console.log("[Sign_up]: on_submit, ", {form})
				let sign_up_res = await Sign_Up(form)
				console.log("[Sign_up]: sign up res ", {data : sign_up_res.data, code : sign_up_res.code})
				if (sign_up_res.status == 200) {
					console.log("[Sign_up]: Succesfully signed up and adding token to state...")
					this.$store.commit('SET_USER_TOKEN', sign_up_res.data.token)
					this.$store.commit('SET_CONNECTION', true)
					this.$router.push('/search')
				}
				else if (sign_up_res != null && sign_up_res.data) {
					this.deactivate_button = true
					let errors = sign_up_res.data.specific_errors
					this.connection_error = true
					this.username_error = errors.username_error
					if (this.username_error == true && sign_up_res.data.code == "ER_DUP_ENTRY") {
						this.username_error_text = this.text_content.error_username_dup
					}
					else if (this.username_error == true && sign_up_res.data.code == "ER_DATA_TOO_LONG") {
						this.username_error_text = this.text_content.error_username_long
					}
					else {
						this.username_error_text = this.text_content.error_username
					}
					this.firstname_error = errors.firstName_error
					this.lastname_error = errors.lastName_error
					this.email_error = errors.mail_error
					this.email_error_text = this.text_content.error_email
					this.mdp_error = errors.password_error
					console.log("ERROR [sign up]: ", sign_up_res.data)
				}
			}
			catch (e) {
				console.log("[Sign Up] : UNKOWN ERROR ", e)
				this.connection_error = true
			}
		}
	},

	watch: {
		username: {
			handler:function() {
				if (this.username.length == 0 || this.username.match(this.regex_whitespace) == null){
					this.deactivate_button = true
					this.username_error = true
				}
				else {
					this.username_error = false
					if (!this.username_error && !this.firstname_error && !this.lastname_error && !this.email_error && !this.mdp_error) {
						this.deactivate_button = false
					}
				}
			},
			deep:true
		},

		firstname: {
			handler:function() {
				if (this.firstname.match(this.regex_whitespace) == null){
					this.deactivate_button = true
					this.firstname_error = true
				}
				else {
					this.firstname_error = false
					if (!this.username_error && !this.firstname_error && !this.lastname_error && !this.email_error && !this.mdp_error) {
						this.deactivate_button = false
					}
				}
			},
			deep:true
		},

		lastname: {
			handler:function() {
				if (this.lastname.match(this.regex_whitespace) == null){
					this.deactivate_button = true
					this.lastname_error = true
				}
				else {
					this.lastname_error = false
					if (!this.username_error && !this.firstname_error && !this.lastname_error && !this.email_error && !this.mdp_error) {
						this.deactivate_button = false
					}
				}
			},
			deep:true
		},

		email: {
			handler:function() {
				if (this.email.length == 0 || this.email.match(this.regex_mail) == null){
					this.deactivate_button = true
					this.email_error = true
				}
				else {
					this.email_error = false
					if (!this.username_error && !this.firstname_error && !this.lastname_error && !this.email_error && !this.mdp_error) {
						this.deactivate_button = false
					}
				}
			},
			deep:true
		},
		password: {
			handler:function() {
				if (this.password.length == 0 || this.password.match(this.regex_pwd) == null){
					this.deactivate_button = true
					this.mdp_error = true
				}
				else {
					this.mdp_error = false
					if (!this.username_error && !this.firstname_error && !this.lastname_error && !this.email_error && !this.mdp_error) {
						this.deactivate_button = false
					}
				}
			},
			deep:true
		},

		deactivate_button: {
			handler: function() {
				if (this.deactivate_button == false) {
					this.connection_error = false
				}
				else {
					this.connection_error = true
				}
			}
		}
	}
}
</script>


<template>
	<div class="container homemade-container ">
		<form @submit="on_submit">
			<h2 class="mb-4 text-center">{{text_content.sign_up[lang_nb]}}:</h2>
			<div class="input mb-2">
				<label class = "mb-2" for="username">{{text_content.create_user[lang_nb]}} *</label>
				<input
				v-model="username"
				class="form-control"
				:class="{ error_input : username_error}"
				type="text"
				name="username"
				:maxlength="49"
				:placeholder="text_content.username[lang_nb]"
				/>
				<p class="error_msg" v-show="username_error">{{username_error_text[lang_nb]}}</p>
			</div>
			<div class="input mb-2">
				<label class = "mb-2" for="firstname">{{text_content.create_first_name[lang_nb]}}</label>
				<input
				v-model="firstname"
				class="form-control"
				:class="{ error_input : firstname_error}"
				type="text"
				name="firstname"
				:maxlength="49"
				:placeholder="text_content.first_name[lang_nb]"
				/>
				<p class="error_msg" v-show="firstname_error">{{text_content.error_first_name[lang_nb]}}</p>
			</div>
			<div class="input mb-2">
				<label class = "mb-2" for="lastname">{{text_content.create_last_name[lang_nb]}}</label>
				<input
				v-model="lastname"
				class="form-control"
				:class="{ error_input : lastname_error}"
				type="text"
				name="lastname"
				:maxlength="49"
				:placeholder="text_content.last_name[lang_nb]"
				/>
				<p class="error_msg" v-show="lastname_error">{{text_content.error_last_name[lang_nb]}}</p>
			</div>
			<div class="input mt-5">
				<label class = "mb-2" for="email">{{text_content.create_email[lang_nb]}} *</label>
				<input
				v-model = "email"
				class="form-control"
				:class="{ error_input : email_error}"
				type="text"
				name="email"
				:maxlength="99"
				placeholder="email@adress.com"
				/>
				<p class="error_msg" v-show="email_error">{{email_error_text[lang_nb]}}</p>
			</div>
			<div class="input mt-2">
				<label class = "mb-2" for="password">{{text_content.create_pwd[lang_nb]}} *</label>
				<div class="input-group">
					<input
					v-model = "password"
					class="form-control"
					:class="{ error_input : mdp_error}"
					:type="visible ? 'text' : 'password'"
					name="password"
					:maxlength="49"
					:placeholder="text_content.pwd[lang_nb]"
					>
					<span class="input-group-btn">
						<button class="btn" v-on:click="password_visibility" type="button">
							<b-icon-eye-fill v-if="!visible"></b-icon-eye-fill>
							<b-icon-eye-slash-fill v-else></b-icon-eye-slash-fill>
						</button>
					</span>
				</div>
				<p class="error_msg" v-show="mdp_error">{{text_content.error_pwd[lang_nb]}}</p>

			</div>
			<div class="col-md-12 text-center mt-5">
				<p class="error_msg" v-show="connection_error">{{text_content.error_co[lang_nb]}}</p>
				<button v-if="deactivate_button" class="submit_button" type="submit" disabled>{{text_content.sign_up[lang_nb]}} </button>
				<button v-else class="submit_button" type="submit">{{text_content.sign_up[lang_nb]}}</button>
				<div class = "m-3">{{text_content.or[lang_nb]}}</div>
			</div>
		</form>
		<NetworkButtons type="signup"></NetworkButtons>
		<div class="change_page mt-4 text-center">
			<router-link to="/sign_in">{{text_content.already_account[lang_nb]}}</router-link>
		</div>
	</div>
</template>


<style scoped>

@import "../assets/shared_scss/login.scss";
@import "../assets/shared_scss/shared.scss";

.container {
	width: 530px;
}

.homemade-container  {
	top: 450px;
}

</style>
