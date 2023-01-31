<script>
import { mapState, useStore } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"


export default {
	data() {
		return {
			text_content : textContent.RESETPASS
		}
	},
	computed: mapState({
		lang_nb		    : state => state.lang_nb
	})
}
</script>

<template>
	<div class="container homemade-container ">
		<form>
			<h2 class="text-center">{{text_content.forgot_pwd[lang_nb]}}</h2>
			<p class="text-center">{{text_content.sentence[lang_nb]}}</p>
			<div class="input mt-5">
				<label class = "mb-2" for="email">{{text_content.email[lang_nb]}}</label>
				<input
				class="form-control"
				type="text"
				name="email"
				placeholder="email@adress.com"
				/>
			</div>
			<div class="col-md-12 text-center mt-4">
				<button class="submit_button" type="submit">{{text_content.send[lang_nb]}}</button>
			</div>
		</form>
	</div>
</template>



<style scoped>
@import "../assets/shared_scss/login.scss";
@import "../assets/shared_scss/shared.scss";


.container {
	width: 500px;
}

h2 {
	font-size: 25px;
}

p {
	letter-spacing: 0px;
	text-transform: none;
	font-size: 15px;
}

</style>
