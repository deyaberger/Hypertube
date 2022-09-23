<script>
	export default {
	  props: {
		user_connected : Boolean
	  }
	}
</script>


<template>
	<b-navbar id = "nav" toggleable type="dark" variant="dark">
		<b-navbar-brand :to="{ path: '/' }">Hypertube</b-navbar-brand>
			<b-nav-item v-if="!user_connected" :to="{ path: '/sign_in'}">Sign in</b-nav-item>
			<b-nav-item v-if="!user_connected" :to="{ path: '/'}">Sign up</b-nav-item>
			
			<b-nav-item v-if="user_connected" :to="{ path: '/'}">Search</b-nav-item>
			<b-nav-item v-if="user_connected" :to="{ path: '/'}">Profile</b-nav-item>
			<b-nav-item v-if="user_connected" :to="{ path: '/'}">Exit</b-nav-item>
	</b-navbar>
</template>

<style scoped >

.nav-item{
	list-style-type: none;
}

</style>