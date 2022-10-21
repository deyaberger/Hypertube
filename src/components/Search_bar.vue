<script>
import Slider from '@vueform/slider'
import { mapState, useStore } from 'vuex';

export default {
	components: {
		Slider,
	},
	data() {
		const store = useStore()
		return {
			show         : true,
			text_content : {
				genre : ["Genre", "Genres"], // 0
				sort  : ["Sort by", "Trier par"] // 1
			},
			form : {
				name           : '',
				genre          : '',
				sort_category  : ['Name', 'Nom'],
				a_to_z         : true,
				rating_interval: [2, 5],
				years          : [1980, 2022],
			},
			sorting_list : {
				"RATING" : ['Rating', 'Note'],
				"YEAR" : ['Year', 'Année'],
				"NAME" : ['Name', 'Nom'],
			},
			genre_list: [
				["Action", "Action"],
				["Animation", "Animation"],
				["Adventure","Aventure"],
				["Comedy", "Comédie"],
				["Drama", "Drame"],
				["Horror", "Epouvante-horreur"],
				["Familly", "Famille"],
				["Musical", "Musical"],
				["Romance", "Romance"],
				["Science Fiction", "Science Fiction"],
				["Thriller", "Thriller"],
			], 
		}
	},
	computed: mapState({
		language: state => state.language,
	}),
	methods: {
		emit_form() {
			this.$emit('search_form', this.form);
		},
		AtoZ() {
			this.form.a_to_z = !this.form.a_to_z
		},
		update_genre(genre) {
			this.form.genre = genre
			this.emit_form()
		},
		update_sort_cat(cat) {
			this.form.sort_category = cat
			this.emit_form()
		},
		submit(e) {
			e.preventDefault()
			this.emit_form()
		},
		language_nb() {
			if (this.language == 'eng') {
				return (0)
			}
			else return (1)
		}
	},
	mounted() {
		this.emit_form()
	},
	watch: {
		form: {
		handler:function(newVal) {
			this.emit_form()
		},
		deep:true
		},

	}


	
}



</script>


<template>
	<nav class="navbar nav flex-column" :class="{small_sidebar : !show}">
		<div class="sidebar_menu">
			<button @click="show = !show" class="btn navbar-nav ms-auto"><b-icon-filter-left class = "h1 show_bar"></b-icon-filter-left></button>
			<div v-if="show">
			<form @submit="submit">
				<div class = "nav-item input-group">
					<input class = "input_text" type="text" v-model="form.name"/>
					<span class="input-group-btn">
						<button class="btn search_icon" type="submit">
							<b-icon-search color="white"></b-icon-search>
						</button>
					</span>
				</div>
			</form>
			
			<div class = "nav-item">
				<h2>{{text_content.genre[language_nb()]}}</h2>
				<div
					v-for="genre in genre_list" :key="genre"
					class="nav-link"
					:class="{ active: genre == form.genre }"
				>
					<span @click="update_genre(genre)" class="touchable"> {{ genre[language_nb()] }} </span>
					<b-icon-x
						@click="update_genre()"
						class = "remove touchable"
						:class="{ active: genre == form.genre }"
					></b-icon-x>
			</div>
			</div>
			<div class = "nav-item">
				<h2>{{text_content.sort[language_nb()]}}</h2>
				<div class="row justify-text_content-md-center">
					<a
					href="#"
					v-for="sort_category in sorting_list" :key="sort_category"
					class="col nav-link"
					:class="{ active: sort_category[0] == form.sort_category[0] }"
					@click="update_sort_cat(sort_category)"
					>{{sort_category[language_nb()]}}</a>
				</div>
			</div>
			<div class = "nav-item">
				<hr class="solid">
				<p class="filter">{{sorting_list["RATING"][language_nb()]}}</p>
				<div>
					<Slider
					class="green_slider"
					v-model="form.rating_interval"
					:min="0"
					:max="5"
					/>
				</div>
				<p class="filter">{{sorting_list["YEAR"][language_nb()]}}</p>
				<div>
					<Slider
					class="green_slider"
					v-model="form.years"
					:min="1950"
					:max="2022"
					/>
				</div>
				<p class="filter">{{sorting_list["NAME"][language_nb()]}}</p>
				<button v-if="form.a_to_z == true" class="btn a_to_z" @click="AtoZ" type="button">
					A <b-icon-arrow-right></b-icon-arrow-right> Z
				</button>
				<button v-else class="btn a_to_z" @click="AtoZ" type="button">
					Z <b-icon-arrow-right></b-icon-arrow-right> A
				</button>
			</div>
		</div>
		</div>
	</nav>
</template>



<style src="@vueform/slider/themes/default.css">

</style>

<style lang="scss" scoped>
@import url("./../assets/shared_scss/navbars.scss");

.navbar {
	position        : absolute;
	width           : 25%;
	height          : 100%;
	background-color: rgba(34, 35, 40, 0.864);
}

.small_sidebar {
	width: 5%;
}

.sidebar_menu {
	width: 90%
}

.nav-link, .row, .nav-item {
	margin : 0px;
	padding: 0px;
}

.nav-item {
	margin-top    : 10%;
	margin-bottom  : 20%;
	position: relative;
}


.input-group > *{
	background-color: rgba(0, 0, 0, 0.662);
	box-shadow      : 0px 0px 10px 0px rgba(252, 252, 252, 0.198);
	color           : white;
	transition      : box-shadow 1s;
	border       : none;
	border-radius: 5px;
	width: 80%;
}

.input_text {
	padding-left: 10%;
}

.input-group-btn {
	width: 15%;
	position:relative;
}


.input-group:hover > *, .input-group:active > * {
	box-shadow: 0px 0px 10px 0px white;
	transition: 0.5s;
}

.input-group:hover:after > *{
	transition: 0.5s;
}
.btn.search_icon {
	width: 100%;
}


@media (max-width: 590px) {
	.search_icon {
		font-size:10px;
		right: 100%;
	}
}


.touchable {
	cursor: pointer;
}

.nav-link {
	font-size: 12px;
	opacity  : 0.7;
}

.nav-link:hover, .nav-link:active, .nav-link.active {
	opacity  : unset;
	font-size: 14px;
}

.nav-link.active {
	font-weight    : bold;
	text-decoration: underline;
}


.remove {
	display        :none
}

.remove.active {
	display: unset;
	font-size: 1.4rem;
	position: absolute;
	right: 0px;
}



.filter {
	letter-spacing: inherit;
	font-family   : inherit;
	text-transform: inherit;
	font-size     : inherit;
	margin         : 15% 0% 15% 0%;
}

.green_slider {
	--slider-tooltip-font-size: 0.775rem;
	--slider-tooltip-line-height: 0.9rem;
}
@media (max-width: 590px) {
	.green_slider {
		margin-top: 30%;
	--slider-tooltip-font-size: 0.5rem;
	--slider-tooltip-line-height: 0.4rem;
	--slider-tooltip-py: 2px;
	--slider-tooltip-px: 2px;
	--slider-handle-width: 8px;
	--slider-handle-height: 8px;
}
}


.show_bar, .a_to_z {
	border       : 0.02rem solid;
	border-color : rgba(255, 255, 255, 0.654);
	border-radius: 5px;
	color        : white;
}
.show_bar:hover, .a_to_z:hover {
	background-color: rgba(255, 255, 255, 0.163);
}

.a_to_z {
	margin-top     : -20%;
	padding        : 5px 10px 5px 10px;
	font-size      : 12px
}
@media (max-width  : 590px) {
	.a_to_z{
		font-size  : 8px;
		margin-top : -10%;
		padding    : 2px 5px 2px 5px;
	}
	
}



@media (max-width: 690px) {
	h2{
		font-size: 20px;
	}
	.nav-link, .filter {
		font-size: 10px;
	}
}

@media (max-width: 590px) {
	h2{
		font-size: 12px;
	}
	.nav-link, .nav-link.active {
		font-size: 9px;
	}
}



</style>