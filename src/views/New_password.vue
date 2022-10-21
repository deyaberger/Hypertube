<script>
import { ref, computed } from 'vue'
import { mapState, useStore } from 'vuex';

export default {
	data() {
		const store = useStore()
		return {
			visible        : false,
			username       : '',
			password       : '',
			lang_nb        : 0,
			text_content   : {
				reset      : ["Reset Password                                                                                                        :", "Créer un nouveau mot de passe                                                                                :"],
				new_pwd    : ["New password                                                                                                          :", "nouveau mot de passe                                                                                         :"],
				pwd        : ["password", "motdepasse"],
				confirm    : ["Confirm", "Confirmer"],
				error      : [
					"Error : a password should contain at least                                                                                      : 8 character, including at least an alphabetical character, a numeric charater and an uppercase and a lowercase",
					"Erreur: le mot de passe doit contenir au moins 8 characteres, numeriques et alphabetiques, en lettre majuscules et minuscules.",
				],
			}
		}
	},
	computed: mapState({
		language: state => state.language,
		mdp_error: state => state.mdp_error,
	}),
	methods: {
		password_visibility() {
			this.visible = !this.visible
		},
	},
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
	<div class="container home_made">
		<form>
			<h2 class="mb-4 text-center">{{text_content.reset[lang_nb]}}</h2>
			<div class="input mt-5">
				<label class = "mb-2" for="password">{{text_content.new_pwd[lang_nb]}}</label>
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
						<button class="btn" v-on:click="password_visibility" type="button">
							<b-icon-eye-fill v-if="!visible"></b-icon-eye-fill>
							<b-icon-eye-slash-fill v-else></b-icon-eye-slash-fill>
						</button>
					</span>
				</div>
				<p class="error_msg" v-show="mdp_error">{{text_content.error[lang_nb]}}</p>
			</div>
			<div class="col-md-12 text-center mt-5">
				<button class="submit_button" type="submit">{{text_content.confirm[lang_nb]}}</button>
			</div>
		</form>
	</div>
</template>


<style >
	@import "../assets/shared_scss/login.scss";
	
</style>
