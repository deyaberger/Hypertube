<script>
  import { ref, computed } from 'vue'
  import { mapState, useStore } from 'vuex';
  import check_form from "../stores/login_validation"
  
  export default {
    data() {
      const store = useStore()
      return {
        visible: false,
        username: '',
        password: '',
        connection_error : false,
		eng_content : [
			"sign in", // 0
			"username", // 1
			"password", // 2
			"Forgot your password ?", // 3
			"Or", // 4
			"Don't have av account? Sign up", // 5
			"Wrong username or password", // 6
			"Login with ", // 7
		],
		fr_content : [
			"se connecter", // 0
			"pseudo", // 1
			"mot de passe", // 2
			"Mot de passe oublié ?", // 3
			"Ou", // 4
			"Pas de compte? S'inscrire", // 5
			"Mauvais pseudo ou mot de passe", // 6
			"Co. avec ", // 7
		],
      }
    },
    computed: mapState({
      user_connected: state =>  state.user_connected,
	  language: state => state.language,
    }),
    methods: {
      password_visibility() {
        this.visible = !this.visible
      },
      onSubmit(e){
        e.preventDefault();
        const form = {
          "username" : this.username,
          "password" : this.password
        }
        const sign_in_res = check_form(form);
        this.connection_error = sign_in_res.connection_error;
        if (!this.connection_error) {
          this.$store.commit('SET_CONNECTION', true)
          console.log("ALL good") /* Connect to website */
        }
      },
	  is_english() {
		return (this.language == 'eng')
		},
		content(index) {
			if (this.is_english()) {
				return (this.eng_content[index])
			}
			else return (this.fr_content[index])
		}
    },

  }
</script>


<template>
  <div class="container home_made">
    <form @submit="onSubmit">
      <h2 class="mb-4 text-center">{{content(0)}}:</h2>
      <div class="input mb-3">
        <label class = "mb-2" for="username">{{content(1)}}:</label>
        <input
        v-model = "username"
        class = "form-control"
        :class="{ error_input : connection_error}"
        type="text"
        name="username"
        :placeholder="content(1)"
        />
      </div>
      <div class="input mt-5">
        <label class = "mb-2" for="password">{{content(2)}}:</label>
        <div class="input-group">
          <input
          v-model = "password"
          class="form-control"
          :class="{ error_input : connection_error}"
          :type="visible ? 'text' : 'password'"
          name="password"
          :placeholder="content(2)"
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
        <router-link to="/reset_pwd">{{content(3)}}</router-link>
      </div>
      <div class="col-md-12 text-center" :class="{ 'mt-4' : connection_error, 'mt-4' : !connection_error }">
        <p class="error_msg" v-show="connection_error">{{content(6)}}</p>
        <button class="submit_button" type = "submit">{{content(0)}}</button>
        <div class = "m-3">{{content(4)}}</div>
      </div>
      <button class="mt-3 loginBtn loginBtn--facebook">
		<span class = "button_text">{{content(7)}}Facebook</span>
      </button>
      <span>
        <button class="loginBtn loginBtn--google">
			<span class = "button_text">{{content(7)}}Google</span>
        </button>
      </span>
      <button class="mt-3 loginBtn loginBtn--42">
		<span class = "button_text">{{content(7)}}42</span>
      </button>
      <span>
        <button class="mt-3 loginBtn loginBtn--twitter">
			<span class = "button_text">{{content(7)}}twitter</span>
        </button>
      </span>
      
      <div class="change_page mt-3 text-center">
        <router-link to="/sign_up">{{content(5)}}</router-link>
      </div>
    </form>
  </div>
  
</template>


<style >
@import "../assets/shared_scss/login.scss";
  
  
</style>
