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
<b-navbar toggleable="lg" class="navbar navbar-dark horizontal">
    <b-navbar-brand href="#"><routerLink to="/" class="navbar-brand"><span class = "brand_text">HYPERTUBE</span><img class="logo" src="../assets/logo_white.png"/></routerLink></b-navbar-brand>
    <b-navbar-toggle class="toggle" target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ms-auto" v-if="!user_connected">
        <b-nav-item>
			<router-link v-if="is_english()" to="/sign_in" class="nav-link">Sign in</router-link>
			<router-link v-else to="/sign_in" class="nav-link">Se connecter</router-link>
		</b-nav-item>
		<b-nav-item>
			<router-link v-if="is_english()" to="/sign_up" class="nav-link">Sign up</router-link>
			<router-link v-else to="/sign_up" class="nav-link">S'inscrire</router-link>
		</b-nav-item>
		<b-nav-item>
			<b-dropdown variant="link" class="dropdown_menu">
				<template #button-content>
					<b-icon-gear-fill/>
				</template>
				<b-dropdown-item class="dropdown_item" v-for="option in language_options" :key="option" @click="change_language(option)">{{option}}</b-dropdown-item>
			</b-dropdown>
		</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ms-auto" v-else>
		<b-nav-item>
			<router-link v-if="is_english()" to="/search" class="nav-link">Movies <b-icon-search/></router-link>
			<router-link v-else to="/search" class="nav-link">Films <b-icon-search/></router-link>
		</b-nav-item>
        <b-nav-item>
			<router-link v-if="is_english()" to="/profile" class="nav-link">Profile <b-icon-person-circle/></router-link>
			<router-link v-else to="/profile" class="nav-link">Profil <b-icon-person-circle/></router-link>
		</b-nav-item>
		<b-nav-item>
			<b-dropdown variant="link" class="dropdown_menu">
				<template #button-content>
					<b-icon-gear-fill/>
				</template>
				<b-dropdown-item class="dropdown_item" v-for="option in language_options" :key="option" @click="change_language(option)">{{option}}</b-dropdown-item>
			</b-dropdown>
		</b-nav-item>
		<b-nav-item>
			<router-link v-if="is_english()" to="/" class="nav-link">Logout <b-icon-arrow-bar-right /></router-link>
			<router-link v-else to="/" class="nav-link">Se deconnecter <b-icon-arrow-bar-right /></router-link>
		</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
</b-navbar>
</template>

<style scoped lang="scss">
@import url("./../assets/shared_scss/navbars.scss");

</style>