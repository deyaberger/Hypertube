<script>
import { mapState, useStore } from 'vuex';

export default {
	data() {
		const store = useStore()
		return {
			lang_nb : 0,
			text_content : {
				forgot_pwd : ["Forgot your password?", "Mot de passe oublié?"],
				sentence   : [
					"Enter your email adress. If you have an account, you will receive a link to reset your password",
					"Entrez votre adresse email. Si vous avez un compte, vous recevrez un lien pour recréer votre mot de passe",
				],
				email      : ["email address:", "adresse email:"],
				send       : ["Send", "Envoyer"],
			}
		}
	},
	computed: mapState({
		language: state => state.language,
	}),
	watch: {
		language: {
			handler:function(newVal) {
				this.lang_nb = newVal == "eng" ? 0 : 1
			},
			deep:true
		},
	},
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
