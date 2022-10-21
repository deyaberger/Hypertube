<script>
import { mapState, useStore } from 'vuex';

export default {
	data() {
		const store = useStore()
		return {
			eng_content : [
			"Forgot your password?", // 0
			"Enter your email adress. If you have an account, you will receive a link to reset your password", // 1
			"email address:", // 2
			"Send" // 2
			],
			fr_content : [
			"Mot de passe oublié?", // 0
			"Entrez votre adresse email. Si vous avez un compte, vous recevrez un lien pour recréer votre mot de passe", // 1
			"adresse email:", // 2
			"Envoyer" // 3
			],
		}
	},
	computed: mapState({
		language: state => state.language,
	}),
	methods: {
		is_english() {
			return (this.language == 'eng')
		},
		content(index) {
			if (this.is_english()) {
				return (this.eng_content[index])
			}
			else return (this.fr_content[index])
		}
	},
}
</script>

<template>
	<div class="container home_made">
		<form>
			<h2 class="text-center">{{content(0)}}</h2>
			<p class="text-center">{{content(1)}}</p>
			<div class="input mt-5">
				<label class = "mb-2" for="email">{{content(2)}}</label>
				<input
				class="form-control"
				type="text"
				name="email"
				placeholder="email@adress.com"
				/>
			</div>
			<div class="col-md-12 text-center mt-4">
				<button class="submit_button" type="submit">{{content(3)}}</button>
			</div>
		</form>
	</div>
</template>



<style >
@import "../assets/shared_scss/login.scss";

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
