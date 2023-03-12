<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"
import { New_Pass } from "../functions/auth"


export default {
	props : {
		hash: {
			type: String,
			default: ""
		},
	},
	data() {
		return {
			visible        : false,
			password       : null,
			text_content   : textContent.NEWPASS,
			mdp_error	   : false,
			error		   : false,
			regex_pwd 	   : /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/
		}
	},

	computed: mapState({
		lang_nb: state => state.lang_nb,
		user_token : state =>  state.user_token,
	}),

	methods: {
		update_password_visibility() {
			this.visible = !this.visible
		},

		async onSubmit(e) {
			console.log("[forgot pwd]: Sendin new password...");
			e.preventDefault();
			try {
				let res = await New_Pass(this.hash, this.password)
				if (res && res.data && res.data.code == "SUCCESS") {
					console.log("[forgot pwd]: Reset pwd successfull!")
					this.$router.push('/sign_in')
					return true
				}
				this.error = true
				this.mdp_error = false
				if (res && res.data && res.data.code == "FAILURE") {
					console.log("[reset pwd]: FAILURE", res.data.msg)
				}
			}
			catch (e) {
				console.log("[reset pwd]: UNKOWN ERROR in reset pwd!", e)
				this.error = true
			}
			return false
		},
	},

	watch : {
		password: {
			handler:function() {
				if (this.password == null || this.password.length == 0 || this.password.match(this.regex_pwd) == null){
					this.mdp_error = true
				}
				else {
					this.mdp_error = false
				}
			},
			deep:true
		},
	},

	mounted() {
		console.log("[reset_pwd]")
	}

}
</script>


<template>
	<div class="container homemade-container ">
		<form @submit="onSubmit">
			<h2 class="mb-4 text-center">{{text_content.reset[lang_nb]}}</h2>
			<div class="input mt-5">
				<label class = "mb-2" for="password">{{text_content.reset_pwd[lang_nb]}}</label>
				<div class="input-group">
					<input
					v-model = "password"
					class="form-control"
					:class="{ error_input : mdp_error}"
					:type="visible ? 'text' : 'password'"
					name="password"
					:placeholder="text_content.pwd[lang_nb]"
					>
					<span class="input-group-btn">
						<button class="btn" v-on:click="update_password_visibility" type="button">
							<b-icon-eye-fill v-if="!visible"></b-icon-eye-fill>
							<b-icon-eye-slash-fill v-else></b-icon-eye-slash-fill>
						</button>
					</span>
				</div>
				<p class="error_msg" v-show="mdp_error">{{text_content.mdp_error[lang_nb]}}</p>
				<p class="error_msg mt-3" v-show="error">{{text_content.error[lang_nb]}}</p>
			</div>
			<div class="col-md-12 text-center mt-5">
				<button v-if="mdp_error" class="submit_button" type="submit" disabled>{{text_content.confirm[lang_nb]}}</button>
				<button v-else class="submit_button" type="submit">{{text_content.confirm[lang_nb]}}</button>
			</div>
		</form>
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

</style>
