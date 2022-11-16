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
		language: state =>  state.language,
		}),
		methods: {
			is_english() {
				return (this.language == 'eng')
			}
		}
	}
</script>

<template>
	<div>HEY </div>
</template>
