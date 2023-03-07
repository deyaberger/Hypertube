<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"


export default {
	data() {
		return {
			text_content : textContent.RESETPASS
		}
	},
	computed: mapState({
		lang_nb    : state => state.lang_nb,
		user_token : state =>  state.user_token,
	})
}
</script>

<template>
	<div class="homemade-container">
		<h2 class="text-center">Page not found</h2>
		<img src="https://media.giphy.com/media/VfyC5j7sR4cso/giphy.gif">
	</div>
</template>



<style scoped>
@import "../assets/shared_scss/login.scss";
@import "../assets/shared_scss/shared.scss";


.homemade-container {
	margin: 0px;
	margin: 0px;
	top: 300px;
}

h2 {
	font-size: 25px;
}

img {
	width: 300px;
	contain: cover;
	margin-left: 10%;
}

@media (max-width: 593px) {
	img {
		width: 200px;
		margin-left: -10%;
	}
}

@media (max-width: 300px) {
	img {
		width: 0px;
	}
}

</style>
