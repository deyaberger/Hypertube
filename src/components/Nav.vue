<script>
import { ref, computed } from 'vue'
import { mapState, useStore } from 'vuex';

export default {
	data() {
      const store = useStore()
      return {
      }
    },
	computed: mapState({
      user_connected: state =>  state.user_connected,
      language: state =>  state.language,
      language_options: state =>  state.language_options,
    }),
	methods: {
		change_language(new_language) {
			console.log("Changing language to: " + new_language)
			this.$store.commit('SET_LANGUAGE', new_language)
		},
		is_english() {
			return (this.language == 'eng')
		}
	}
}
</script>


<template>
	<nav class="navbar navbar-expand-sm navbar-dark">
		<routerLink to="/" class="navbar-brand"><span class = "brand_text">HYPERTUBE</span><img class="logo" src="../assets/logo_white.png"/></routerLink>
		<ul class="navbar-nav ms-auto" v-if = "!user_connected">
			<li class="nav-item">
				<router-link to="/sign_in" class="nav-link">
					<span v-if="is_english()" class="nav_text">Sign in </span>
					<span v-else class="nav_text">Se connecter </span>
				</router-link>
			</li>
			<li class="nav-item">
				<router-link to="/sign_up" class="nav-link" >
					<span v-if="is_english()" class="nav_text">Sign up </span>
					<span v-else class="nav_text">S'inscrire </span>
				</router-link>
			</li>
			<li class="nav-item">
				<b-dropdown :text="language" class="dropdown_menu">
					<b-dropdown-item class="dropdown_item" v-for="option in language_options" :key="option" @click="change_language(option)">{{option}}</b-dropdown-item>
				</b-dropdown>
			</li>
		</ul>
		<ul class="navbar-nav ms-auto" v-if = "user_connected">
			
			<li class="nav-item">
				<router-link to="/search" class="nav-link">
					<span v-if="is_english()" class="nav_text">movies </span>
					<span v-else class="nav_text">films </span>
					<b-icon-search/>
				</router-link>
			</li>
			<li class="nav-item">
				<router-link to="/profile" class="nav-link">
					<span v-if="is_english()" class="nav_text">Profile </span>
					<span v-else class="nav_text">Profil </span>
					<b-icon-person-circle/>
				</router-link>
			</li>
			<li class="nav-item">
				<b-dropdown :text="language" class="dropdown_menu">
					<b-dropdown-item class="dropdown_item" v-for="option in language_options" :key="option" @click="change_language(option)">{{option}}</b-dropdown-item>
				</b-dropdown>
			</li>
			<li class="nav-item">
				<router-link to="/" class="nav-link">
					<span v-if="is_english()" class="nav_text">Quit </span>
					<span v-else class="nav_text">Quitter </span>
					<b-icon-arrow-bar-right />
				</router-link>
			</li>
	</ul>
</nav>

</template>

<style scoped lang="scss">
@import url("./../assets/shared_scss/navbars.scss");

</style>