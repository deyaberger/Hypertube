<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json";
import { Request_Pass_Reset } from "../functions/auth";


export default {
	props: {
		email: {
		type: String,
		default: ""
		},
	},

	data() {
		return {
			text_content : textContent.RESETPASS,
			requestSent : false,
			error       : false,
			mail        : "",
			mail_in_use : this.email == "taken"
		}
	},

	methods: {
		async onSubmit(e) {
			console.log("[forgot pwd]: Requesting reset...");
			e.preventDefault();
			try {
				let res = await Request_Pass_Reset(this.mail)
				if (res && res.data && res.data.code == "SUCCESS") {
					console.log("[forgot pwd]: Successfully requested reset pwd!")
					this.requestSent = true;
				}
				else if (res && res.data && res.data.code == "FAILURE") {
					console.log("[forgot pwd]: ", res.data.msg)
				}
				else {
					console.log("[forgot pwd]: UNKOWN ERROR in forgot pwd!", res)
				}
			}
			catch (e) {
				console.log("[forgot pwd]: UNKOWN ERROR in forgot pwd!", e)
				this.error = true
			}
		},
	},

	computed: mapState({
		lang_nb    : state => state.lang_nb,
		user_token : state =>  state.user_token,
	})
}
</script>

<template>
	<div class="homemade-container ">
		<div v-if="!requestSent">
			<form @submit="onSubmit">
				<h2 class="text-center">{{text_content.forgot_pwd[lang_nb]}}</h2>
				<p class="text-center">{{text_content.sentence[lang_nb]}}</p>
				<div class="input mt-5">
					<label class = "mb-2" for="email">{{text_content.email[lang_nb]}}</label>
					<input
					class="form-control"
					type="text"
					name="email"
					v-model="mail"
					placeholder="email@adress.com"
					/>
				</div>
				<div class="col-md-12 text-center mt-4">
					<button class="submit_button" type="submit">{{text_content.send[lang_nb]}}</button>
				</div>
			</form>
		</div>
		<div v-else>
			<div v-if="error">
				{{text_content.error[lang_nb]}}
			</div>
			<div v-else class="text-center">
				<p class="infos" v-if="mail && mail.length > 0">
					{{text_content.email_sent[lang_nb]}}<br>{{ mail }}
				</p>
				<p class="infos">{{text_content.infos[lang_nb]}}</p>
			</div>
			</div>
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

p {
	letter-spacing: 0px;
	text-transform: none;
	font-size: 15px;
}

.infos {
	letter-spacing: 2px;
	font-size: 18px;
}

</style>
