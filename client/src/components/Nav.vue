<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"
import LangDrop from '../components/Lang_drop.vue';

export default {
  components: { LangDrop },
	data() {
      return {
		text_content : textContent.NAV
      }
    },
	computed: mapState({
      user_connected  : state =>  state.user_connected,
      lang_nb         : state =>  state.lang_nb,
    })
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
		<LangDrop></LangDrop>
      </b-navbar-nav>

      <b-navbar-nav class="ms-auto" v-else>
		<b-nav-item>
			<router-link to="/search" class="nav-link">{{text_content.movies[lang_nb]}} <b-icon-search/></router-link>
		</b-nav-item>
        <b-nav-item>
			<router-link to="/profile" class="nav-link">{{text_content.profile[lang_nb]}} <b-icon-person-circle/></router-link>
		</b-nav-item>
		<LangDrop></LangDrop>
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