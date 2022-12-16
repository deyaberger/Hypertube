<script>
import { RouterLink, RouterView } from 'vue-router'
import Nav from './components/Nav.vue'

export default {
	components: {
		Nav
	},
	data() {
		return {
			test : false
		}
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
 	background-color: black;
 	// background-image: linear-gradient(to bottom, transparent 80%, black, black), url("/src/assets/background.jpg");
 	background-image: url("/src/assets/background2.jpg");
 	background-size: cover;
 	background-repeat: no-repeat;
 	background-position: center;
 	width: 100%;
	height: 100vh;
}


</style>
