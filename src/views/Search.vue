<script>
import SearchBar from '../components/Search_bar.vue'
import SearchResults from '../components/Search_results.vue'

export default {
	components: {
		SearchBar,
		SearchResults
	},
	data() {
		return {
			form : '',
		}
	},
	methods: {
		getForm(value) {
			const form = JSON.parse(JSON.stringify(value));
			this.form = form
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