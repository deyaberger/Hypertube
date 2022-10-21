<script>
import SearchBar from '../components/Search_bar.vue'
import SearchResults from '../components/Search_results.vue'
import { mapState, useStore } from 'vuex';

export default {
	components: {
		SearchBar,
		SearchResults
	},
	data() {
		const store = useStore()
		return {
			form : '',
		}
	},
	computed: mapState({
		language: state => state.language,
	}),
	methods: {
		getForm(value) {
			const form = JSON.parse(JSON.stringify(value));
			this.form = form
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
	}
}


</script>

<template>
	<SearchBar @search_form="getForm"/>
	<SearchResults></SearchResults>
</template>


<style lang="scss" scoped>

</style>