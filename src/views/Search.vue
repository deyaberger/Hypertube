<script>
import SearchBar from '../components/Search_bar.vue'

export default {
	components: {
		SearchBar
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
			console.log(form);
			console.log(form.name);
		}
	}
}


</script>

<template>
	<SearchBar @search_form="getForm"/>
</template>


<style lang="scss">

</style>