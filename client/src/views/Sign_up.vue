<script>
import { mapState }      from 'vuex';
import textContent       from "../assets/language_dict/language_dict.json"
import NetworkButtons    from "../components/Networks_buttons.vue"
import { Sign_Up }        from '../functions/auth'

export default {
	components: {
		NetworkButtons
	},

	data() {
		return {
			visible          : false,
			text_content     : textContent.SIGNUP,
			username         : '',
			firstname        : '',
			lastname         : '',
			email            : '',
			password         : '',
			username_error   : false,
			firstname_error  : false,
			lastname_error   : false,
			email_error      : false,
			email_error_text : textContent.SIGNUP.error_email,
			mdp_error        : false,
			connection_error : false
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
				let sign_up_res = await Sign_Up(form)
				console.log("sign_up res: ", sign_up_res)
				if (sign_up_res.status == 200) {
					console.log("Adding token to state")
					this.$store.commit('SET_USER_TOKEN', sign_up_res.data.token)
					this.$store.commit('SET_CONNECTION', true)
					this.$router.push('/search')
				}
				else {
					this.connection_error = true
					this.username_error = sign_up_res.data.username_error
					this.firstname_error = sign_up_res.data.firstName_error
					this.lastname_error = sign_up_res.data.lastName_error
					this.email_error = sign_up_res.data.mail_error
					this.email_error_text = this.text_content.error_email_dup
					this.mdp_error = sign_up_res.data.password_error
					console.log("error in signuiiip")
				}
			}
			catch (e) {
				this.connection_error = true
				console.log("error in signup: \n", e)
			}
		},
	},
}
</script>


<template>
	<div class="container homemade-container ">
		<form @submit="on_submit">
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
				<p class="error_msg" v-show="email_error">{{email_error_text[lang_nb]}}</p>
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
			<NetworkButtons type="signup"></NetworkButtons>
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
