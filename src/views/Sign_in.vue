<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { mapState } from 'vuex';

export default {
  data() {
    const store = useStore()
    return {
      visible: false,
      username: '',
      password: '',
    }
  },
  computed: mapState({
      wesh: state => state.wesh,
      connection_error: state => state.connection_error,
  }),
  methods: {
    password_visibility() {
    this.visible = !this.visible
    // this.$store.commit('SET_WESH', 42)
  },
  },
}
  </script>
  

<template>
   <div class="container">
    <form>
      <h2 class="mb-4 text-center">Sign in:</h2>
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
          <button class="btn" v-on:click="password_visibility" type="button">
            <b-icon-eye-fill v-if="!visible"></b-icon-eye-fill>
            <b-icon-eye-slash-fill v-else></b-icon-eye-slash-fill>
          </button>
        </span>
        </div>
      </div>
      <div class="col-md-12 text-center" :class="{ 'mt-4' : connection_error, 'mt-5' : !connection_error }">
      <p class="error_msg" v-show="connection_error">Wrong username or password</p>
      <button class="submit_button" type="submit">Sign in</button>
      </div>
      <div class="change_page mt-3 text-center">
      <router-link to="/reset_pwd">Forgot your password?</router-link>
    </div>
      <div class="change_page mt-2 text-center">
      <router-link to="/sign_up">Don't have an account ? Sign up</router-link>
    </div>
    </form>
   </div>
</template>


<style >
@import "../assets/shared_scss/login.scss";

</style>
