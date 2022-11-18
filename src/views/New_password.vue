<script>
import { ref, computed } from 'vue'
import { mapState, useStore } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"


export default {
	data() {
		const store = useStore()
		return {
			visible        : false,
			username       : '',
			password       : '',
			text_content   : textContent.NEWPASS
		}
	},
	computed: mapState({
		lang_nb: state => state.lang_nb,
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
	<div class="container homemade-container ">
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


<style scoped>
	@import "../assets/shared_scss/login.scss";
	@import "../assets/shared_scss/shared.scss";

	
</style>
