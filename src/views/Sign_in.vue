<script>
  import { ref, computed } from 'vue'
  import { mapState, useStore } from 'vuex';
  import check_sign_in_form from "../stores/login_validation"
  import textContent from "../assets/language_dict/language_dict.json"
  
  export default {
    data() {
      const store = useStore()
      return {
        visible: false,
        username: '',
        password: '',
        connection_error : false,
		lang_nb: 0,
		text_content : textContent.SIGNIN
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
        const sign_in_res = check_sign_in_form(form);
        this.connection_error = sign_in_res.connection_error;
        if (!this.connection_error) {
          console.log("ALL good") /* Connect to website */
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
      <button class="mt-3 loginBtn loginBtn--facebook">
		<span class = "button_text">{{text_content.log_with[lang_nb]}}Facebook</span>
      </button>
      <span>
        <button class="loginBtn loginBtn--google">
			<span class = "button_text">{{text_content.log_with[lang_nb]}}Google</span>
        </button>
      </span>
      <button class="mt-3 loginBtn loginBtn--42">
		<span class = "button_text">{{text_content.log_with[lang_nb]}}42</span>
      </button>
      <span>
        <button class="mt-3 loginBtn loginBtn--twitter">
			<span class = "button_text">{{text_content.log_with[lang_nb]}}twitter</span>
        </button>
      </span>
      
      <div class="change_page mt-3 text-center">
        <router-link to="/sign_up">{{text_content.no_account[lang_nb]}}</router-link>
      </div>
    </form>
  </div>
  
</template>


<style scoped>
@import "../assets/shared_scss/login.scss";
@import "../assets/shared_scss/shared.scss";

  
</style>
