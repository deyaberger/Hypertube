<script>
import SearchBar from '../components/Search_bar.vue'
import SearchResults from '../components/Search_results.vue'
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json"
import { Get_Movies_Research, Get_Recommendations } from "../functions/movies"
import { Get_Current_User_Fav_Movies_ID, Get_Current_User_Watched_Movies_ID } from "../functions/user"

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
			only_show_fav	  : false,
			error			  : false,
			user_favs		  : null,
			user_watched	  : null,
			saved_movies	  : null,
		}
	},
	methods: {
		set_movie_props() {
			return {
				'data'    : this.movies_slice,
				'profile' : false,
				'error'   : this.error,
				'favs'    : this.user_favs,
				'watched' : this.user_watched,
			}
		},
		async get_user_fav_and_co() {
			console.log("getting favvsss")
			let res = await Get_Current_User_Fav_Movies_ID(this.user_token);
			this.user_favs = res.data.map(item => item.movie_id);
			res = await Get_Current_User_Watched_Movies_ID(this.user_token);
			this.user_watched = res.data.map(item => item.movie_id);
		},
		get_movies_page_slice() {
			var start = (this.currentPage - 1) * this.perPage
			var end = start + this.perPage
			this.movies_slice = this.movies.slice(start, end)
		},
		async get_form_results() {
			try {
				this.movies = null
				this.movies_slice = null
				let res = null
				if (this.user_research <= 1) {
					console.log("getting homepage")
					res = await Get_Recommendations(this.user_token);
				}
				else {
					console.log("getting form results")
					res = await Get_Movies_Research(this.form, this.lang_nb, this.user_token);
				}
				if (res.status == 200) {
					this.movies = res.data
					this.number_of_results = this.movies.length;
					this.get_movies_page_slice();
				}
				else {
					throw("Unknow error code getting movies")
				}
			}
			catch (e) {
				this.error = true
				throw(e)
			}
		},
		update_form(value) {
			console.log("updating form")
			let form = JSON.parse(JSON.stringify(value));
			this.form = form;
			this.user_research += 1
		},
		reset_form() {
			this.form = {
				title         : '',
				min_rating    : 0,
				genre         : '',
				quality       : '',
				min_year      : 1900,
				sort_by       : 'title',
				asc_or_desc   : 'asc',
			}
		},
		from_research_to_reco() {
			this.user_research = 0,
			this.reset_form()
		},
		from_reco_to_research() {
			this.user_research = 2,
			this.reset_form()
		},
		show_favorites() {
			if (this.only_show_fav == true) {
				console.log("only show favs")
				this.saved_movies  = this.movies
				this.movies = this.movies.filter(item => this.user_favs.includes(item.id));
				this.number_of_results = this.movies.length;
				this.currentPage = 1
				this.get_movies_page_slice();
			}
			else {
				this.movies = this.saved_movies;
				this.number_of_results = this.movies.length;
				this.get_movies_page_slice();
				console.log("show all")
			}
		},
		async updating_movies(value) {
			let update_info = JSON.parse(JSON.stringify(value));
			let movie_type = update_info['type']
			let id = update_info['id']
			if (movie_type == "favorites") {
				if (this.user_favs.includes(id)) {
					delete this.user_favs[this.user_favs.indexOf(id)]
				}
				else {
					this.user_favs.push(id)
				}
			}
			if (movie_type == "watched") {
				if (this.user_watched.includes(id)) {
					delete this.user_watched[this.user_favs.indexOf(id)]
				}
				else {
					this.user_watched.push(id)
				}
			}
		},
	},
	computed: {
	...mapState({
      	lang_nb    : state =>  state.lang_nb,
      	user_token : state =>  state.user_token,
    })
	},
	created() {
		this.get_user_fav_and_co();
	},
	watch: {
		currentPage: {
			handler:function() {
				this.get_movies_page_slice()
			},
			deep:true
		},
		form: {
			handler:function() {
				this.get_form_results()
			},
			deep:true
		},
		only_show_fav: {
			handler:function() {
				this.show_favorites()
			},
			deep:true
		}
	}
}


</script>

<template>
	<div>
		<SearchBar ref="search_bar" @search_form="update_form"/>
		<div ref="results_container" class="results_container">
			<div class="search_header">
				<div v-if="user_research > 1" class="title">
					<p class="actual">{{ text_content.research[lang_nb] }}:</p>
					<p class="nav-link">or</p>
					<a class="nav-link active" href="#" @click="from_research_to_reco()">{{text_content.see_reco[lang_nb]}}</a>
				</div>
				<div v-else class="title">
					<p class="actual">{{text_content.recommendations[lang_nb]}}:</p>
					<p class="nav-link">or</p>
					<a class="nav-link active" href="#" @click="from_reco_to_research()">{{text_content.see_all[lang_nb]}}</a>
				</div>
				<div class = "row">
					<div v-if="number_of_results > 0" class="number_of_results col-11">{{movies_slice ? movies_slice.length : 0}}/{{number_of_results}} {{text_content.results[lang_nb]}}</div>
					<div v-else class="number_of_results col-11">{{number_of_results}} {{text_content.results[lang_nb]}}</div>
					<div class="show_favorites col"><b-form-checkbox v-model="only_show_fav" switch data-toggle="tooltip" data-placement="top" :title="only_show_fav ? 'show all movies' : 'only show favorites'"></b-form-checkbox></div>
				</div>
			</div>
			<SearchResults :movie_list="set_movie_props()" class="search_res" @updating="updating_movies"/>
			<div class="pagination overflow-auto">
			<div v-if="number_of_results > 0">
				<b-pagination
					v-model="currentPage"
					:total-rows="number_of_results"
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
