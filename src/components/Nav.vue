<script>
    import { ref, computed } from 'vue'
  	import { useStore } from 'vuex'

  export default {
    setup() {
      const store = useStore()

      return {
        user_connected: computed(() => store.state.user_connected)
      }
    }
  }
</script>


<template>
	<nav class="navbar navbar-expand-sm navbar-dark">
    <routerLink to="/" class="navbar-brand">HYPERTUBE</routerLink>
    <ul class="navbar-nav ms-auto" v-if = "!user_connected">
        <li class="nav-item">
			<router-link to="/sign_in" class="nav-link">Sign in</router-link>
        </li>
        <li class="nav-item">
            <router-link to="/sign_up" class="nav-link" >Sign up</router-link>
        </li>
    </ul>
	<ul class="navbar-nav ms-auto" v-if = "user_connected">
        <li class="nav-item">
            <router-link to="/search" class="nav-link">Search movies <b-icon-search/></router-link>
        </li>
        <li class="nav-item">
            <router-link to="/profile" class="nav-link">Profile <b-icon-person-circle/></router-link>
        </li>
		<li class="nav-item">
            <router-link to="/" class="nav-link">Exit <b-icon-arrow-bar-right /></router-link>
        </li>
    </ul>
</nav>

</template>

<style scoped lang="scss">
@import url("./../assets/shared_scss/navbars.scss");


</style>