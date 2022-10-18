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
    <routerLink to="/" class="navbar-brand"><span class = "brand_text">HYPERTUBE</span><img class="logo" src="../assets/logo_white.png"/></routerLink>
    <ul class="navbar-nav ms-auto" v-if = "!user_connected">
        <li class="nav-item">
			<router-link to="/sign_in" cass="nav-link"><span class="nav_text">Sign in</span></router-link>
        </li>
        <li class="nav-item">
            <router-link to="/sign_up" class="nav-link" ><span class="nav_text">Sign up</span></router-link>
        </li>
    </ul>
	<ul class="navbar-nav ms-auto" v-if = "user_connected">
        <li class="nav-item">
            <router-link to="/search" class="nav-link"><span class="nav_text">Search movies </span><b-icon-search/></router-link>
        </li>
        <li class="nav-item">
            <router-link to="/profile" class="nav-link"><span class="nav_text">Profile </span><b-icon-person-circle/></router-link>
        </li>
		<li class="nav-item">
            <router-link to="/" class="nav-link"><span class="nav_text">Exit </span><b-icon-arrow-bar-right /></router-link>
        </li>
    </ul>
</nav>

</template>

<style scoped lang="scss">
@import url("./../assets/shared_scss/navbars.scss");

</style>