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
			<router-link to="/Sign_in" class="nav-link">Sign in</router-link>
        </li>
        <li class="nav-item">
            <router-link to="/Sign_up" class="nav-link" >Sign up</router-link>
        </li>
    </ul>
	<ul class="navbar-nav ms-auto" v-if = "user_connected">
        <li class="nav-item">
            <router-link to="/" class="nav-link">Search movies <b-icon-search/></router-link>
        </li>
        <li class="nav-item">
            <router-link to="/" class="nav-link">Profile <b-icon-person-circle/></router-link>
        </li>
		<li class="nav-item">
            <router-link to="/" class="nav-link">Exit <b-icon-arrow-bar-right /></router-link>
        </li>
    </ul>
</nav>

</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');

.navbar {
    font-size: 120%;
    padding: 10px;
    background-color: rgb(34, 35, 40);
}
.navbar-brand {
    font-family: 'Michroma', sans-serif;
}
.nav-item {
    margin: 0 0 0 30px;
    letter-spacing: 2.5px;
	font-family: 'Roboto', sans-serif;
	text-transform: uppercase;
	font-size: 15px;
}
.nav-link {
    color: white
}


</style>