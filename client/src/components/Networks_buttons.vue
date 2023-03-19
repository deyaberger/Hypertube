<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"
import { Get_Oauth_Urls } from "../functions/auth"

export default {
	props: {
		type : String,
	},

	data() {
		return {
			url_github : null,
			url_gitlab : null,
			url_42 : null,
			url_google : null
		}
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
		},
	},

	async mounted() {
		try {
			const res = await Get_Oauth_Urls()
			if (res.status == 200 ){
				this.url_github = res.data.urls.url_github,
				this.url_gitlab = res.data.urls.url_gitlab,
				this.url_42 	= res.data.urls.url_42,
				this.url_google = res.data.urls.url_google
			}
		}
		catch (e) {
			console.log("Caught Get oauth urls failure", e)
		}
	}
}
</script>

<template>
	<div>
		<a :href="url_gitlab">
			<button class="mt-3 loginBtn loginBtn--gitlab">
				{{get_button_content()}}gitlab
			</button>
		</a>
		<a :href="url_google">
		<button class="loginBtn loginBtn--google">
			{{get_button_content()}}Google
		</button>
		</a>
		<a :href="url_42">
			<button class="mt-3 loginBtn loginBtn--42" >
				{{get_button_content()}}42
			</button>
		</a>
		<a :href="url_github">
			<button class="mt-3 loginBtn loginBtn--github">
				{{get_button_content()}}github
			</button>
		</a>
	</div>
</template>

<style scoped>
@import "../assets/shared_scss/login.scss";

</style>