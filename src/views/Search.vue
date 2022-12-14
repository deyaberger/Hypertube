<script>
import SearchBar from '../components/Search_bar.vue'
import SearchResults from '../components/Search_results.vue'
import { mapState, useStore } from 'vuex';
import fakeData from "../assets/fake_library/fake_data_search_results.json";
import textContent from "../assets/language_dict/language_dict.json"

export default {
	components: {
		SearchBar,
		SearchResults
	},
	data() {
		const store = useStore()
		return {
			form : '',
			text_content : textContent.MOVIES,
			nb_results	 : fakeData.results,
			movie_list   : fakeData.movie_list,
			currentPage  : 1,
			rows         : 0,
			perPage      : 0,
		}
	},
	methods: {
		getForm(value) {
			const form = JSON.parse(JSON.stringify(value));
			this.form = form
		},
	},
	computed: mapState({
      	lang_nb  : state =>  state.lang_nb,
    })
}


</script>

<template>
		<SearchBar @search_form="getForm"/>
		<div class="results_container">
			<div class="search_header">
				<div class="title">{{text_content.recommendations[lang_nb]}}:</div>
				<div class="number_of_results">{{nb_results}} {{text_content.results[lang_nb]}}</div>
			</div>
			<SearchResults></SearchResults>
			<div class="pagination overflow-auto">
			<div>
				<b-pagination
					v-model="currentPage"
					:total-rows="rows"
					:per-page="perPage"
					first-number
					class="custom_pagination"
				></b-pagination>
			</div>
		</div>
		</div>

</template>


<style lang="scss" scoped>

.results_container {
	position: absolute;
	width: calc(100% - 300px);
	margin-left: 300px;
	transition : none;
	background-color: rgba(34, 35, 40, 0.864);
}

.small_sidebar + .results_container {
	margin-left: 70px;
	width: calc(100% - 70px);
}

.search_header {
	height: 30px;
	margin: 5%;
	letter-spacing: 3.5px;
	font-family: 'Roboto', sans-serif;
	text-transform: uppercase;
	text-align: center;
}


.number_of_results {
	color: rgba(255, 255, 255, 0.644);
	margin-top: 3%;
	text-align: left;
}


@media screen and (max-width: 590px) {
	.number_of_results {
		font-size: 12px;
		letter-spacing: 2.5px;
		margin-top: 7%;
	}
}


@media screen and (max-width: 690px) {
	.results_container {
		margin-left: 250px;
		width: calc(100% - 250px);
	}
}


@media screen and (max-width: 590px) {
	.results_container {
		margin-left: 150px;
		width: calc(100% - 150px);
	}

}

.pagination {
	justify-content: center;
}

</style>
