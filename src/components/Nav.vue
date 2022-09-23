<script>
	export default {
	  props: {
		user_connected : Boolean
	  }
	}
</script>


<template>
	<nav class="navbar navbar-expand-sm bg-dark navbar-dark">
    <routerLink to="/" class="navbar-brand">Hypertube</routerLink>
    <ul class="navbar-nav ms-auto" v-if = "!user_connected">
        <li class="nav-item">
			<router-link to="/sign_in" class="nav-link">Sign in</router-link>
        </li>
        <li class="nav-item">
            <router-link to="/" class="nav-link" >Sign up</router-link>
        </li>
    </ul>
	<ul class="navbar-nav ms-auto" v-if = "user_connected">
        <li class="nav-item">
            <router-link to="/" class="nav-link">Search</router-link>
        </li>
        <li class="nav-item">
            <router-link to="/" class="nav-link">Profile</router-link>
        </li>
		<li class="nav-item">
            <router-link to="/" class="nav-link">Exit</router-link>
        </li>
    </ul>
</nav>

</template>

<style scoped >

/* .nav-item{
	list-style-type: none;
} */

</style>