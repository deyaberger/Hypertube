<script>
import { ref, computed } from 'vue'
import { mapState, useStore } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"

export default {
	data() {
      const store = useStore()
      return {
		text_content : textContent.NAV
      }
    },
	computed: mapState({
      user_connected  : state =>  state.user_connected,
      lang_nb         : state =>  state.lang_nb,
      language         : state =>  state.language,
      language_options: state =>  state.language_options,
    }),
	methods: {
		change_language(new_language) {
			console.log("Changing language to: " + new_language)
			this.$store.commit('SET_LANGUAGE', new_language)
		},
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
			<router-link to="/sign_in" class="nav-link">{{text_content.sign_in[lang_nb]}}</router-link>
		</b-nav-item>
		<b-nav-item>
			<router-link to="/sign_up" class="nav-link">{{text_content.sign_up[lang_nb]}}</router-link>
		</b-nav-item>
		<b-nav-item>
			<b-dropdown variant="link" class="dropdown_menu">
				<template #button-content>
					<b-icon-gear-fill/>
				</template>
				<b-dropdown-item :class="option==language ? 'dropdown_item disabled' : 'dropdown_item'" v-for="option in language_options" :key="option" @click="change_language(option)" :disabled="option==language ? true : false">{{option}}</b-dropdown-item>
			</b-dropdown>
		</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ms-auto" v-else>
		<b-nav-item>
			<router-link to="/search" class="nav-link">{{text_content.movies[lang_nb]}} <b-icon-search/></router-link>
		</b-nav-item>
        <b-nav-item>
			<router-link to="/profile" class="nav-link">{{text_content.profile[lang_nb]}} <b-icon-person-circle/></router-link>
		</b-nav-item>
		<b-nav-item>
			<b-dropdown variant="link" class="dropdown_menu">
				<template #button-content>
					<b-icon-gear-fill/>
				</template>
				<b-dropdown-item :class="option==language ? 'dropdown_item disabled' : 'dropdown_item'" v-for="option in language_options" :key="option" @click="change_language(option)" :disabled="option==language ? true : false">{{option}}</b-dropdown-item>
			</b-dropdown>
		</b-nav-item>
		<b-nav-item>
			<router-link to="/" class="nav-link">{{text_content.logout[lang_nb]}} <b-icon-arrow-bar-right /></router-link>
		</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
</b-navbar>
</template>

<style scoped lang="scss">
@import url("./../assets/shared_scss/navbars.scss");

</style>

<style scoped lang="css">


</style>