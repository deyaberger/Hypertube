<script>
import SearchBar from '../components/Search_bar.vue'
import SearchResults from '../components/Search_results.vue'
import { mapState, useStore } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"
import { getMovies, parseMovies, getHomePage } from "../functions/get_movies"

export default {
	components: {
		SearchBar,
		SearchResults
	},
	data() {
		return {
			form              : '',
			text_content      : textContent.MOVIES,
			movies            : null,
			movies_slice      : null,
			limit			  : 50,
			number_of_results : 0,
			movie_count		  : 0,
			currentPage       : 1,
			rows              : 0,
			perPage           : 24,
			user_research     : 0,
		}
	},
	methods: {
		getMoviesSlice() {
			var start = (this.currentPage - 1) * this.perPage
			var end = start + this.perPage
			this.movies_slice = this.movies.slice(start, end)
		},
		async getFormResults() {
			try {
				this.movies = null
				this.movies_slice = null
				let res = null
				if (this.user_research == true) {
					console.log("getting homepage")
					res = await getHomePage(this.$cookies.get('token'));
				}
				else {
					console.log("getting getting form results")
					res = await getMovies(this.form, this.lang_nb, this.user_id, this.$cookies.get('token'));
				}
				if (res.status == 200) {
					this.movies = res.data
					this.number_of_results = this.movies.length;
					this.rows = this.number_of_results;
					this.getMoviesSlice()
				}
				else {
					throw("Unknow error code getting movies")
				}
			}
			catch (e) {
				throw(e)
			}
		},
		update_form(value) {
			console.log("updating form")
			let form = JSON.parse(JSON.stringify(value));
			this.form = form;
			this.user_research += 1
		},

	},
	computed: {
	...mapState({
      	lang_nb  : state =>  state.lang_nb,
      	user_id  : state =>  state.user_id,
    }),
	},
	watch: {
		currentPage: {
			handler:function() {
				this.getMoviesSlice()
			},
			deep:true
		},
		form: {
			handler:function() {
				this.getFormResults()
			},
			deep:true
		}
	}
}


</script>

<template>
	<div>
		<SearchBar @search_form="update_form"/>
		<div class="results_container">
			<div class="search_header">
				<div v-if="user_research > 1" class="title">Research:</div>
				<div v-else class="title">{{text_content.recommendations[lang_nb]}}:</div>
				<div v-if="number_of_results > 0" class="number_of_results">{{perPage * currentPage}}/{{number_of_results}} {{text_content.results[lang_nb]}}</div>
				<div v-else class="number_of_results">{{number_of_results}} {{text_content.results[lang_nb]}}</div>

			</div>
			<SearchResults :movie_list="movies_slice"/>
			<div class="pagination overflow-auto">
			<div v-if="number_of_results > 0">
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
	</div>
</template>


<style lang="scss" scoped>


.results_container {
	position: absolute;
	width: calc(100% - 300px);
	margin-left: 300px;
	min-height: 100%;
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
