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
	methods: {
		getForm(value) {
			const form = JSON.parse(JSON.stringify(value));
			this.form = form
		},
	}
}


</script>

<template>
	<SearchBar @search_form="getForm"/>
	<p class="home_made">{{form}}</p>
	<!-- <SearchResults></SearchResults> -->
</template>


<style lang="scss" scoped>

</style>