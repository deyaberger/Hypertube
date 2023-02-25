<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"


export default {
	props: {
		type : String,
	},
	computed: mapState({
		lang_nb    : state => state.lang_nb,
		user_token : state =>  state.user_token,
	}),
	methods: {
		get_button_content() {
			if (this.type == "signup") {
				return textContent.SIGNUP.sign_up_with[this.lang_nb]
			}
			return textContent.SIGNIN.log_with[this.lang_nb]
		}
	}
}
</script>

<template>
	<div>
		<button class="mt-3 loginBtn loginBtn--facebook">
			{{get_button_content()}}Facebook
		</button>
		<button class="loginBtn loginBtn--google">
			{{get_button_content()}}Google
		</button>
		<b-button class="mt-3 loginBtn loginBtn--42" href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-d9dacf000ec83ce78969bfcecc2f140477302481ff4eb6f746eea81b16b00e75&redirect_uri=http%3A%2F%2Flocalhost%3A8071%2Fapi%2Fauth%2Foauth&response_type=code">
			{{get_button_content()}}42
		</b-button>
		<button class="mt-3 loginBtn loginBtn--twitter">
			{{get_button_content()}}twitter
		</button>
	</div>
</template>

<style scoped>
@import "../assets/shared_scss/login.scss";

</style>