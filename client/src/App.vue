<script>
import Nav from './components/Nav.vue'
// import SocketioService from './functions/socket.service.js';

export default {
	components: {
		Nav
	},


	data() {
		return {
			test : false,
		}
	},

	computed: {
		store() {
			return this.$store.state
		}
	},

	created() {
		console.log("created app")
		// SocketioService.setupSocketConnection();
	}
}
</script>

<template>
	<div>
		<Nav />
		<router-view />
	</div>
</template>


<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap");



body {
 	font-family: Roboto, sans-serif;
 	color: #f6f8fc;
 	background-color:  rgba(34, 35, 40);
 	background-image: linear-gradient(to bottom, transparent, rgba(34, 35, 40, 1), rgba(34, 35, 40, 1)), url("/src/assets/background2.jpg");
 	background-size: cover;
 	background-repeat: no-repeat;
 	background-position: center;
 	width: 100%;
	height: 170vh;
}


</style>
