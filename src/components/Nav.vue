<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
	setup() {
		const store = useStore()
		
		return {
			user_connected: computed(() => store.state.user_connected),
			language : computed(() => store.state.language),
			language_options : computed(() => store.state.language_options),
		}
	},
	data() {
		return {
			language: this.language,
		}
	},
	methods: {
		change_language(language) {
			console.log("language:" + language)
			this.$store.commit('SET_LANGUAGE', language)
		},
		is_english() {
			if (this.language == 'eng') {
				console.log("hey")
				return true
			}
				console.log("hos")
			return false
		}
	}
}
</script>


<template>
	<nav class="navbar navbar-expand-sm navbar-dark">
		<routerLink to="/" class="navbar-brand"><span class = "brand_text">HYPERTUBE</span><img class="logo" src="../assets/logo_white.png"/></routerLink>
		<ul class="navbar-nav ms-auto" v-if = "!user_connected">
			<li class="nav-item">
				<router-link to="/sign_in" cass="nav-link"><span class="nav_text">Sign in</span></router-link>
			</li>
			<li class="nav-item">
				<router-link to="/sign_up" class="nav-link" ><span class="nav_text">Sign up</span></router-link>
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
				<router-link to="/profile" class="nav-link"><span class="nav_text">Profile </span><b-icon-person-circle/></router-link>
			</li>
			<li class="nav-item">
				<b-dropdown :text="language" class="dropdown_menu">
					<b-dropdown-item class="dropdown_item" v-for="option in language_options" :key="option" @click="language = option">{{option}}</b-dropdown-item>
				</b-dropdown>
			</li>
			<li class="nav-item">
				<router-link to="/" class="nav-link"><span class="nav_text">Exit </span><b-icon-arrow-bar-right /></router-link>
			</li>
	</ul>
</nav>

</template>

<style scoped lang="scss">
@import url("./../assets/shared_scss/navbars.scss");

:deep .dropdown_menu  > * {
   color: white;
   background-color: inherit;
	--bs-dropdown-min-width: 0rem;
	--bs-dropdown-padding-y: 0rem;
	--bs-dropdown-spacer: 0.1rem;
	font-size: inherit;
	letter-spacing: inherit;
	font-family: inherit;
	text-transform: inherit;
	margin: inherit;
}

:deep .dropdown_item  > * {
   color: white;
   background-color: black;
   letter-spacing: inherit;
	font-family: inherit;
	text-transform: inherit;
}

:deep .dropdown_menu.show  > * {
	position: absolute
}


</style>