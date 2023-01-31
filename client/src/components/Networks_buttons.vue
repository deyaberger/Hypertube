<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"


export default {
	props: {
		type : String,
	},
	computed: mapState({
		lang_nb: state => state.lang_nb,
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
	<button class="mt-3 loginBtn loginBtn--facebook">
		{{get_button_content()}}Facebook
	</button>
	<span>
		<button class="loginBtn loginBtn--google">
			{{get_button_content()}}Google
		</button>
	</span>
	<button class="mt-3 loginBtn loginBtn--42">
		{{get_button_content()}}42
	</button>
	<span>
		<button class="mt-3 loginBtn loginBtn--twitter">
			{{get_button_content()}}twitter
		</button>
	</span>
</template>

<style scoped>
@import "../assets/shared_scss/login.scss";

</style>