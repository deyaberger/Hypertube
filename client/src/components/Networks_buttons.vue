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
		<a href="https://gitlab.com/oauth/authorize?client_id=7e963f1d3f439befc5db0b044bb52e51512694e03db68e43ce9956070e9bbdf8&redirect_uri=http%3A%2F%2Flocalhost%3A8071%2Fapi%2Fauth%2Foauth%2Fgitlab&response_type=code&scope=read_user+email">
			<button class="mt-3 loginBtn loginBtn--gitlab">
				{{get_button_content()}}gitlab
			</button>
		</a>
		<a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=300857859557-a6c3bqfbif2nasir07jjuqequcpqbm0p.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A8071%2Fapi%2Fauth%2Foauth%2Fgoogle&scope=openid profile email&response_type=code&access_type=offline&prompt=consent">
		<button class="loginBtn loginBtn--google">
			{{get_button_content()}}Google
		</button>
		</a>
		<a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-d9dacf000ec83ce78969bfcecc2f140477302481ff4eb6f746eea81b16b00e75&redirect_uri=http%3A%2F%2Flocalhost%3A8071%2Fapi%2Fauth%2Foauth&response_type=code">
			<button class="mt-3 loginBtn loginBtn--42" >
				{{get_button_content()}}42
			</button>
		</a>
		<a href="https://github.com/login/oauth/authorize?client_id=1e15ab7141b3c31a3fee&redirect_uri=http%3A%2F%2Flocalhost%3A8071%2Fapi%2Fauth%2Foauth%2Fgithub">
			<button class="mt-3 loginBtn loginBtn--github">
				{{get_button_content()}}github
			</button>
		</a>
	</div>
</template>

<style scoped>
@import "../assets/shared_scss/login.scss";

</style>