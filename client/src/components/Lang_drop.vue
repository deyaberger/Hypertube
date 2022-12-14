<script>
import { mapState } from 'vuex';

export default {
	computed : mapState({
      lang_nb         : state =>  state.lang_nb,
      language        : state =>  state.language,
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
	<b-nav-item>
		<b-dropdown variant="link" class="dropdown_menu">
			<template #button-content>
				<b-icon-gear-fill/>
			</template>
			<b-dropdown-item :class="option==language ? 'dropdown_item disabled' : 'dropdown_item'" v-for="option in language_options" :key="option" @click="change_language(option)" :disabled="option==language ? true : false">{{option}}</b-dropdown-item>
		</b-dropdown>
	</b-nav-item>
</template>