<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
	data() {
		// const store = useStore()
		return {
			visible: false,
			username: '',
			password: ''
			// wesh: computed(() => store.state.wesh),
		}
	},
	methods: {
		password_visibility() {
			this.visible = !this.visible
			// this.$store.commit('SET_WESH', 56)
		},
	},
}
</script>


<template>
	<div class="container">
		<form>
			<h2 class="mb-4 text-center">Reset Password:</h2>
			<div class="input mt-5">
				<label class = "mb-2" for="password">New password:</label>
				<div class="input-group">
					<input
					v-model = "password"
					class="form-control"
					:type="visible ? 'text' : 'password'"
					name="password"
					placeholder="password"
					>
					<span class="input-group-btn">
						<button class="btn" v-on:click="password_visibility" type="button">
							<b-icon-eye-fill v-if="!visible"></b-icon-eye-fill>
							<b-icon-eye-slash-fill v-else></b-icon-eye-slash-fill>
						</button>
					</span>
				</div>
			</div>
			<div class="col-md-12 text-center mt-5">
				<button class="submit_button" type="submit">Confirm</button>
			</div>
		</form>
	</div>
</template>


<style >
	@import "../assets/shared_scss/login.scss";
	
</style>
