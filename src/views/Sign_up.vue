<script>
  export default {
    data() {
      return {
        visible: false
      }
    },
    methods: {
    password_visibility() {
      this.visible = !this.visible
    },
  },
  computed: {
    currentRouteName() {
        return this.$route.name;
    }
}
  }
  </script>
  

<template>
   <div class="container">
    <form>
      <h2 class="mb-4 text-center">Sign up:</h2>
      <div class="input mb-2">
        <label class = "mb-2" for="username">Username:</label>
        <input
          class="form-control"
          type="text"
          name="username"
          placeholder="username"
        />
      </div>
      <div class="input mb-2">
        <label class = "mb-2" for="firstname">First Name:</label>
        <input
          class="form-control"
          type="text"
          name="firstname"
          placeholder="firstname"
        />
      </div>
      <div class="input mb-2">
        <label class = "mb-2" for="lastname">Last Name:</label>
        <input
          class="form-control"
          type="text"
          name="lastname"
          placeholder="lastname"
        />
      </div>
      <div class="input mt-5">
        <label class = "mb-2" for="email">Your email address:</label>
        <input
          class="form-control"
          type="text"
          name="email"
          placeholder="email@adress.com"
        />
      </div>
      <div class="input mt-2">
        <label class = "mb-2" for="password">Create password:</label>
        <div class="input-group">
        <input v-if="visible" type="password" class="form-control pwd" placeholder="password">
        <input v-else type="text" class="form-control pwd" placeholder="password">
        <span class="input-group-btn">
          <button class="btn btn-default reveal" v-on:click="password_visibility" type="button">
            <b-icon-eye-fill v-if="visible"></b-icon-eye-fill>
            <b-icon-eye-slash-fill v-else></b-icon-eye-slash-fill>
          </button>
        </span>
        </div>
      </div>
      <div class="col-md-12 text-center mt-5">
      <button class="submit_button" type="submit">Sign up</button>
      </div>
    </form>
   </div>
</template>


<style scoped>

@import "../assets/shared_scss/login.scss"

</style>
