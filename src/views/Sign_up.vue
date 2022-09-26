<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { mapState } from 'vuex';


export default {
  data() {
    const store = useStore()
    return {
      visible: false,
    }
  },
  computed: mapState({
      username_error: state => state.username_error,
      firstname_error: state => state.firstname_error,
      lastname_error: state => state.lastname_error,
      email_error: state => state.email_error,
      connection_error: state => state.connection_error,
  }),
  methods: {
    password_visibility() {
    this.visible = !this.visible
    this.$store.commit('SET_WESH', 42)
  },
  },
}
  </script>
  

<template>
   <div class="container">
    <form>
      <h2 class="mb-4 text-center">Sign up:</h2>
      <div class="input mb-2">
        <label class = "mb-2" for="username">Create username:</label>
        <input
          class="form-control"
          :class="{ error_input : username_error}"
          type="text"
          name="username"
          placeholder="username"
        />
        <p class="error_msg" v-show="username_error">Username already in use</p>
      </div>
      <div class="input mb-2">
        <label class = "mb-2" for="firstname">Your first Name:</label>
        <input
          class="form-control"
          :class="{ error_input : firstname_error}"
          type="text"
          name="firstname"
          placeholder="firstname"
        />
        <p class="error_msg" v-show="firstname_error">Please enter a first name</p>
      </div>
      <div class="input mb-2">
        <label class = "mb-2" for="lastname">Your Last Name:</label>
        <input
          class="form-control"
          :class="{ error_input : lastname_error}"
          type="text"
          name="lastname"
          placeholder="lastname"
        />
        <p class="error_msg" v-show="lastname_error">Please enter a last name</p>
      </div>
      <div class="input mt-5">
        <label class = "mb-2" for="email">Your email address:</label>
        <input
          class="form-control"
          :class="{ error_input : email_error}"
          type="text"
          name="email"
          placeholder="email@adress.com"
        />
        <p class="error_msg" v-show="email_error">Please enter a valid email address</p>
      </div>
      <div class="input mt-2">
        <label class = "mb-2" for="password">Create password:</label>
        <div class="input-group">
        <input
          v-model = "password"
        class="form-control"
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
      <div class="col-md-12 text-center mt-5">
        <p class="error_msg" v-show="connection_error">Error: please follow the instructions</p>
      <button class="submit_button" type="submit">Sign up</button>
      </div>
      <div class="change_page mt-3 text-center">
      <router-link to="/sign_in">Already have an account? Sign in</router-link>
    </div>
    </form>
   </div>
</template>


<style scoped>

@import "../assets/shared_scss/login.scss"

</style>
