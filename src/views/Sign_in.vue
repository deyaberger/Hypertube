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
      }
    },
    computed: mapState({
      wesh: state => state.wesh,
      user_connected: state =>  state.user_connected,
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
      }
    },
  }
</script>


<template>
  <div class="container home_made">
    <form @submit="onSubmit">
      <h2 class="mb-4 text-center">Sign in:{{this.mq}}</h2>
      <div class="input mb-3">
        <label class = "mb-2" for="username">Username:</label>
        <input
        v-model = "username"
        class = "form-control"
        :class="{ error_input : connection_error}"
        type="text"
        name="username"
        placeholder="username"
        />
      </div>
      <div class="input mt-5">
        <label class = "mb-2" for="password">Password:</label>
        <div class="input-group">
          <input
          v-model = "password"
          class="form-control"
          :class="{ error_input : connection_error}"
          :type="visible ? 'text' : 'password'"
          name="password"
          placeholder="password"
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
        <router-link to="/reset_pwd">Forgot your password?</router-link>
      </div>
      <div class="col-md-12 text-center" :class="{ 'mt-4' : connection_error, 'mt-4' : !connection_error }">
        <p class="error_msg" v-show="connection_error">Wrong username or password</p>
        <button class="submit_button" type = "submit">Sign in</button>
        <div class = "m-3">OR</div>
      </div>
      <button class="mt-3 loginBtn loginBtn--facebook">
		<span class = "button_text">Login with Facebook</span>
      </button>
      <span>
        <button class="loginBtn loginBtn--google">
			<span class = "button_text">Login with Google</span>
        </button>
      </span>
      <button class="mt-3 loginBtn loginBtn--42">
		<span class = "button_text">Login with 42</span>
      </button>
      <span>
        <button class="mt-3 loginBtn loginBtn--twitter">
			<span class = "button_text">Login with twitter</span>
        </button>
      </span>
      
      <div class="change_page mt-3 text-center">
        <router-link to="/sign_up">Don't have an account ? Sign up</router-link>
      </div>
    </form>
  </div>
  
</template>


<style >
@import "../assets/shared_scss/login.scss";
  
  
</style>
