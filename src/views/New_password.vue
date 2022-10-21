<script>
import { ref, computed } from 'vue'
import { mapState, useStore } from 'vuex';

export default {
	data() {
		const store = useStore()
		return {
			visible: false,
			username: '',
			password: '',
			eng_content : [
			"Reset Password:", // 0
			"New password:", // 1
			"password", // 2
			"Confirm", // 3
			"Error: a password should contain at least: 8 character, including at least an alphabetical character, a numeric charater and an uppercase and a lowercase", // 4
			],
			fr_content : [
			"Créer un nouveau mot de passe:", // 0
			"nouveau mot de passe:", // 1
			"motdepasse", // 2
			"Confirmer", // 3
			"Erreur: le mot de passe doit contenir au moins 8 characteres, numeriques et alphabetiques, en lettre majuscules et minuscules.", // 4
			],
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
			<h2 class="mb-4 text-center">{{content(0)}}</h2>
			<div class="input mt-5">
				<label class = "mb-2" for="password">{{content(1)}}</label>
				<div class="input-group">
					<input
					v-model = "password"
					class="form-control"
					:class="{ error_input : mdp_error}"
					:type="visible ? 'text' : 'password'"
					name="password"
					:placeholder="content(2)"
					>
					<span class="input-group-btn">
						<button class="btn" v-on:click="password_visibility" type="button">
							<b-icon-eye-fill v-if="!visible"></b-icon-eye-fill>
							<b-icon-eye-slash-fill v-else></b-icon-eye-slash-fill>
						</button>
					</span>
				</div>
				<p class="error_msg" v-show="mdp_error">{{content(4)}}</p>
			</div>
			<div class="col-md-12 text-center mt-5">
				<button class="submit_button" type="submit">{{content(3)}}</button>
			</div>
		</form>
	</div>
</template>


<style >
	@import "../assets/shared_scss/login.scss";
	
</style>
