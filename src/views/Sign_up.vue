<script>
import { ref, computed } from 'vue'
import { mapState, useStore } from 'vuex';
import check_signup_form from "../stores/login_validation"

export default {
	data() {
		const store = useStore()
		return {
			visible: false,
			lang_nb : 0,
			text_content : {
				sign_up          :["sign up", "s'enregistrer"],
				create_user      :["create a username:", "créer un pseudo:"],
				username         :["username", "pseudo"],
				error_username   :["Username already in use", "Pseudo déjà pris"],
				create_first_name:["Your First Name:", "Votre prénom:"],
				first_name       :["firstname", "prénom"],
				error_first_name :["Please enter a first name", "Merci d'indiquer votre prénom"],
				create_last_name :["Your last Name:", "Votre nom de famille:"],
				last_name        :["lastname", "nomdefamille"],
				error_last_name  :["Please enter a last name", "Merci d'indiquer votre nom de famille"],
				create_email     :["Your email address:", "Adresse email:"],
				error_email      :["Please enter a valid email address", "Adresse invalide"],
				create_pwd       :["Create a password:", "Créer un mot de passe:"],
				pwd              :["password", "motdepasse"],
				error_pwd        :[
				"Error         : a password should contain at least 8 character, including at least an alphabetical character, a numeric charater and an uppercase and a lowercase",
				"Erreur        : le mot de passe doit contenir au moins 8 characteres, numeriques et alphabetiques, en lettre majuscules et minuscules."
				],
				or               :["Or", "Ou"],
				sign_up_with     :["Sign up with ", "S'inscrire via "],
				already_account  :["Already have an account? Sign in", "Déjà un compte? Se connecter"],
				error_co         :["Error: please follow the instructions", "Erreur: merci de suivre les instructions"],
			},
			username  : '',
			firstname : '',
			lastname  : '',
			email     : '',
			password  : '',
		}
	},
	computed: mapState({
		username_error  : state => state.username_error,
		firstname_error : state => state.firstname_error,
		lastname_error  : state => state.lastname_error,
		email_error     : state => state.email_error,
		mdp_error       : state => state.mdp_error,
		connection_error: state => state.connection_error,
		language        : state => state.language,
	}),
	methods: {
		password_visibility() {
			this.visible = !this.visible
		},
		onSubmit(e){
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
			const sign_in_res = check_signup_form(form);
			if (!sign_in_res.connection_error) {
				console.log("ALL good") /* Connect to website */
				console.log(form)
			}
		},
	},
	watch: {
		language: {
			handler:function(newVal) {
				this.lang_nb = newVal == "eng" ? 0 : 1
			},
			deep:true
		},
	},
}
</script>


<template>
	<div class="container homemade-container ">
		<form @submit="onSubmit">
			<h2 class="mb-4 text-center">{{text_content.sign_up[lang_nb]}}:</h2>
			<div class="input mb-2">
				<label class = "mb-2" for="username">{{text_content.create_user[lang_nb]}}</label>
				<input
				v-model="username"
				class="form-control"
				:class="{ error_input : username_error}"
				type="text"
				name="username"
				:placeholder="text_content.username[lang_nb]"
				/>
				<p class="error_msg" v-show="username_error">{{text_content.error_username[lang_nb]}}</p>
			</div>
			<div class="input mb-2">
				<label class = "mb-2" for="firstname">{{text_content.create_first_name[lang_nb]}}</label>
				<input
				v-model="firstname"
				class="form-control"
				:class="{ error_input : firstname_error}"
				type="text"
				name="firstname"
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
				:placeholder="text_content.last_name[lang_nb]"
				/>
				<p class="error_msg" v-show="lastname_error">{{text_content.error_last_name[lang_nb]}}</p>
			</div>
			<div class="input mt-5">
				<label class = "mb-2" for="email">{{text_content.create_email[lang_nb]}}</label>
				<input
				v-model = "email"
				class="form-control"
				:class="{ error_input : email_error}"
				type="text"
				name="email"
				placeholder="email@adress.com"
				/>
				<p class="error_msg" v-show="email_error">{{text_content.error_email[lang_nb]}}</p>
			</div>
			<div class="input mt-2">
				<label class = "mb-2" for="password">{{text_content.create_pwd[lang_nb]}}</label>
				<div class="input-group">
					<input
					v-model = "password"
					class="form-control"
					:class="{ error_input : mdp_error}"
					:type="visible ? 'text' : 'password'"
					name="password"
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
				<button class="submit_button" type="submit">{{text_content.sign_up[lang_nb]}}</button>
				<div class = "m-3">{{text_content.or[lang_nb]}}</div>
			</div>
			<button class="mt-3 loginBtn loginBtn--facebook">
				{{text_content.sign_up_with[lang_nb]}}Facebook
			</button>
			<span>
				<button class="loginBtn loginBtn--google">
					{{text_content.sign_up_with[lang_nb]}}Google
				</button>
			</span>
			<button class="mt-3 loginBtn loginBtn--42">
				{{text_content.sign_up_with[lang_nb]}}42
			</button>
			<span>
				<button class="mt-3 loginBtn loginBtn--twitter">
					{{text_content.sign_up_with[lang_nb]}}twitter
				</button>
			</span>
			<div class="change_page mt-4 text-center">
				<router-link to="/sign_in">{{text_content.already_account[lang_nb]}}</router-link>
			</div>
		</form>
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
