<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"
import NetworkButtons from "../components/Networks_buttons.vue"
import { Sign_In }        from '../functions/auth'


export default {
	components: {
		NetworkButtons
	},


  props: {
		oauth_token: {type: String,
						default: null},
	},


	data() {
		return {
			visible: false,
			username: '',
			password: '',
			connection_error : false,
			text_content : textContent.SIGNIN
		}
	},


	computed: mapState({
		user_connected: state =>  state.user_connected,
		lang_nb       : state => state.lang_nb,
		user_token    : state =>  state.user_token,
	}),


	methods: {
		password_visibility() {
			this.visible = !this.visible
		},

		async onSubmit(e){
			e.preventDefault();
			const form = {
				"username" : this.username,
				"password" : this.password
			}
			try {
				let sign_in_res = await Sign_In(form)
				console.log("Sign in res:", sign_in_res)
				if (sign_in_res.status == 200) {
					console.log("Adding token to state")
					this.$store.commit('SET_USER_TOKEN', sign_in_res.data.token)
					this.$store.commit('SET_CONNECTION', true)
					this.$router.push('/search')
				}
				else {
					this.connection_error = true
					console.log("error in signin")
				}
			}
			catch (e) {
				this.connection_error = true
				console.log("error in signin: \n", e)
			}
		}
	},

  async mounted() {
		if (this.oauth_token != null) {
  			console.log("Oauth signin: ", this.oauth_token)
			try {
				this.$store.commit('SET_USER_TOKEN', this.oauth_token)
				this.$store.commit('SET_CONNECTION', true)
				this.$router.push('/search')
			}
			catch (e) {
				console.log("Oauth signup issue")
			}
		}
	}
}
</script>


<template>
  <div class="container homemade-container ">
    <form @submit="onSubmit">
      <h2 class="mb-4 text-center">{{text_content.sign_in[lang_nb]}}:</h2>
      <div class="input mb-3">
        <label class = "mb-2" for="username">{{text_content.username[lang_nb]}}:</label>
        <input
        v-model = "username"
        class = "form-control"
        :class="{ error_input : connection_error}"
        type="text"
        name="username"
        :placeholder='text_content.username[lang_nb]'
        />
      </div>
      <div class="input mt-5">
        <label class = "mb-2" for="password">{{text_content.password[lang_nb]}}:</label>
        <div class="input-group">
          <input
          v-model = "password"
          class="form-control"
          :class="{ error_input : connection_error}"
          :type="visible ? 'text' : 'password'"
          name="password"
          :placeholder="text_content.password[lang_nb]"
          >
          <span class="input-group-btn">
            <button class="btn btn-md" v-on:click="password_visibility" type="button">
              <b-icon-eye-fill v-if="!visible"></b-icon-eye-fill>
              <b-icon-eye-slash-fill v-else></b-icon-eye-slash-fill>
            </button>
          </span>
        </div>
      </div>
      <div class="mt-2 change_page">
        <router-link to="/reset_pwd">{{text_content.forgot_pwd[lang_nb]}}</router-link>
      </div>
      <div class="col-md-12 text-center" :class="{ 'mt-4' : connection_error, 'mt-4' : !connection_error }">
        <p class="error_msg" v-show="connection_error">{{text_content.error[lang_nb]}}</p>
        <button class="submit_button" type = "submit">{{text_content.sign_in[lang_nb]}}</button>
        <div class = "m-3">{{text_content.or[lang_nb]}}</div>
      </div>
    </form>
    <NetworkButtons type="signin"></NetworkButtons>
    <div class="change_page mt-3 text-center">
      <router-link to="/sign_up">{{text_content.no_account[lang_nb]}}</router-link>
    </div>
  </div>

</template>


<style scoped>
@import "../assets/shared_scss/login.scss";
@import "../assets/shared_scss/shared.scss";

</style>
