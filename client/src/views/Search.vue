<script>
import SearchBar from '../components/Search_bar.vue'
import SearchResults from '../components/Search_results.vue'
import { mapState } from 'vuex';
import store from '../stores/store';
import textContent from "../assets/language_dict/language_dict.json"
import Paginator from '../functions/pagination.service'

export default {

	name: "Search",

	beforeRouteEnter(to, from, next) {
		// TODO: This fails if the token is invalid or expired.
		const isAuthenticated = store.state.user_token != null // check if the user is authenticated
		if (!isAuthenticated) {
			console.log("[search]: not logged in yeat, redirecting to sign in")
			next("/sign_in") // redirect to sign-in page if the user is not authenticated
		} else {
			next() // continue with navigation
		}
	},


	components: {
		SearchBar,
		SearchResults
	},


	data() {
		return {
			form              : {},
			text_content      : textContent.MOVIES,
			currentPage       : 0,
			perPage           : 24,
			user_research     : "RECO", // or "SEARCH"
			error             : false,
			reset             : false,
			paginator         : null,
			current_movies    : [],
			recommendations   : []
		}
	},


	computed: {
		reco_slice() {
			return this.paginator.recommendations
		},

		search_slice() {
			return this.paginator.current_page_movies
		},

		reco_ready() {
			return !this.paginator.loading_reco
		},

		totalo() {
			return this.paginator.total_movies
		},

		...mapState({
			lang_nb    : state =>  state.lang_nb,
			user_token : state =>  state.user_token,
		})
	},

	
	watch: {
		currentPage: {
			handler: async function() {
				console.log('current_page handler')
				if (this.paginator) {
					await this.paginator.set_page(this.currentPage)
					// this.current_movies = this.paginator.currentPage
				}
			}
		},
	},

	methods: {
		update_form(value) {
			console.log("update form")
			this.reset = false;
			this.form = JSON.parse(JSON.stringify(value));
			this.user_research = "SEARCH"
			if (this.paginator) {
					this.paginator.set_search_form(this.form)
			}
		},

		from_research_to_reco() {
			console.log("to reco")
			this.user_research = 'RECO'
		},

		from_reco_to_research() {
			console.log("to search")
			this.user_research = "SEARCH"
			console.log("user", this.user_research)
			this.reset= true;
		},
	},


	created() {
		this.paginator = new Paginator(this.user_token, this.lang_nb, this.perPage)
		this.paginator.on("GET_MOVIE_ERROR", () => {
			throw(new Error("SEARCH MOVIE ERROR"))
		})

		this.paginator.once('reco_done', (recos) => {
			console.log("reco done")
			this.recommendations = recos
		})

		this.paginator.on('search_done', (movies) => {
			console.log("reco done")
			this.current_movies = movies
		})
		console.log('MOUNTED', this.paginator)
	}
}


</script>

<template>
	<div>
		<SearchBar ref="search_bar" @search_form="update_form" :reset="reset"/>
		<div ref="results_container" class="results_container">
		
			<div class="search_header">
				<div v-if="user_research == 'SEARCH'" class="title">
					<p class="actual">{{ text_content.research[lang_nb] }}:</p>
					<p class="nav-link">or</p>
					<a class="nav-link active" href="#" @click="from_research_to_reco()">{{text_content.see_reco[lang_nb]}}</a>
				</div>

				<div v-else class="title">
					<p class="actual">{{text_content.recommendations[lang_nb]}}:</p>
					<p class="nav-link">or</p>
					<a class="nav-link active" href="#" @click="from_reco_to_research()">{{text_content.see_all[lang_nb]}}</a>
				</div>
			</div>

			<!-- <SearchResults v-if="!paginator.loading_reco" :movie_list="reco_slice" :error="false" :profile="false" class="search_res"/> -->
			<!-- <SearchResults v-if="!paginator.loading_reco" :movie_list="reco_slice" :error="false" :profile="false" class="search_res"/> -->
			<SearchResults v-if="user_research == 'SEARCH'" :movie_list="current_movies" :error="false" :profile="false" class="search_res"/>
			<SearchResults v-if="user_research == 'RECO'" :movie_list="recommendations" :error="false" :profile="false" class="search_res"/>
			
			<div class="pagination overflow-auto">
				<div v-if="user_research == 'SEARCH'">
					<b-pagination
						v-model="currentPage"
						limit=7
						:total-rows="totalo"
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

.form-check > *, .form-switch > * {
	cursor: pointer;
}

.nav-link {
	color: rgb(143, 142, 142);
	font-size: small;
}
.nav-link.active {
	font-weight    : bold;
	text-decoration: underline;
}

.nav-link.active:focus, .nav-link.active:hover {
	color: white;
}

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
	margin-left: 5%;
	margin-right: 5%;
	margin-top: 2%;
	margin-bottom: 8%;
	letter-spacing: 3.5px;
	font-family: 'Roboto', sans-serif;
	text-transform: uppercase;
	text-align: center;
}

@media screen and (max-width: 1550px) {
	.search_header {
	margin-bottom: 10%;
	}
}

@media screen and (max-width: 1350px) {
	.search_header {
	margin-bottom: 15%;
	}
}

@media screen and (max-width: 980px) {
	.number_of_results {
		font-size: 12px;
		letter-spacing: 2.5px;
	}
	.actual {
		font-size: 14px;
		margin-bottom: 5px;
		margin-top: 6%;

	}
	.nav-link {
		font-size: 12px;
	}
}

@media screen and (max-width: 890px) {
	.search_header {
		margin-bottom: 20%;
	}
	.nav-link.active {
		margin-bottom: 5%;
	}
}


@media screen and (max-width: 770px) {
	.small_sidebar + .results_container > .search_res {
		margin-left: 25%;
		margin-right:  25%;
	}
}


@media screen and (max-width: 690px) {
	.results_container {
		margin-left: 250px;
		width: calc(100% - 250px);
	}
	.search_header {
	margin-bottom: 25%;
	}
	.nav-link.active {
		margin-bottom: 7%;
	}
	.actual {
		font-size: 12px;
		margin-bottom: 5%;

	}
	.nav-link {
		font-size: 10px;
	}
	.small_sidebar + .results_container > .search_res {
		margin-left: 20%;
		margin-right:  20%;
	}
}


@media screen and (max-width: 590px) {
	.results_container {
		margin-left: 150px;
		width: calc(100% - 150px);
	}
	.small_sidebar + .results_container > .search_res {
		margin-left: 10%;
		margin-right:  10%;
	}
}



@media screen and (max-width: 510px) {
	.search_header {
	margin-bottom: 30%;
	}

	.nav-link.active {
		margin-bottom: 10%;
	}

	.actual {
		font-size: 10px;
		margin-bottom: 3%;

	}
	.nav-link {
		font-size: 8px;
	}
}

@media screen and (max-width: 440px) {
	.search_header {
	margin-bottom: 40%;
	}
	.nav-link.active {
		margin-bottom: 15%;
	}
}


.number_of_results {
	color: rgba(255, 255, 255, 0.644);
	margin-top: 3%;
	text-align: left;
}

.show_favorites {
	margin-top: 3%;
	align-items: right;
}


.pagination {
	justify-content: center;
}

</style>
