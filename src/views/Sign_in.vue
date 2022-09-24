<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  data() {
    const store = useStore()
    return {
      visible: false,
      wesh: computed(() => store.state.wesh),
    }
  },
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
      <h2 class="mb-4 text-center">Sign in: {{wesh}}</h2>
      <div class="input mb-3">
        <label class = "mb-2" for="username">Username:</label>
        <input
          class="form-control"
          type="text"
          name="username"
          placeholder="username"
        />
      </div>
      <div class="input mt-5">
        <label class = "mb-2" for="password">Password:</label>
        <div class="input-group">
        <input v-if="visible" type="password" class="form-control pwd" placeholder="password">
        <input v-else type="text" class="form-control pwd" placeholder="password">
        <span class="input-group-btn">
          <button class="btn btn-default reveal" v-on:click="password_visibility" type="button">{{visible}}
            <b-icon-eye-fill v-if="visible"></b-icon-eye-fill>
            <b-icon-eye-slash-fill v-else></b-icon-eye-slash-fill>
          </button>
        </span>
        </div>
      </div>
      <div class="col-md-12 text-center mt-5">
      <button class="submit_button" type="submit">Sign in</button>
      </div>
    </form>
   </div>
</template>


<style >
@import "../assets/shared_scss/login.scss";

</style>
