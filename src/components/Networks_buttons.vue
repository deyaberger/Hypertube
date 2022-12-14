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
		ButtonContent() {
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
		{{ButtonContent()}}Facebook
	</button>
	<span>
		<button class="loginBtn loginBtn--google">
			{{ButtonContent()}}Google
		</button>
	</span>
	<button class="mt-3 loginBtn loginBtn--42">
		{{ButtonContent()}}42
	</button>
	<span>
		<button class="mt-3 loginBtn loginBtn--twitter">
			{{ButtonContent()}}twitter
		</button>
	</span>
</template>

<style scoped>
@import "../assets/shared_scss/login.scss";

</style>