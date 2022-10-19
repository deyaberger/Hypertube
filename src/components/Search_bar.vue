<template>
	<nav class="navbar nav flex-column">
		<div class="sidebar_menu">
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
				<h2>Genres</h2>
				<div
					v-for="genre in genre_list" :key="genre"
					class="nav-link"
					:class="{ active: genre == form.genre }"
				>
					<span @click="update_genre(genre)" class="touchable"> {{ genre }} </span>
					<b-icon-x
						@click="update_genre()"
						class = "remove touchable"
						:class="{ active: genre == form.genre }"
					></b-icon-x>
			</div>
			</div>
			<div class = "nav-item">
				<h2>Sort by</h2>
				<div class="row justify-content-md-center">
					<a
					href="#"
					v-for="sort_category in sorting_list" :key="sort_category"
					class="col nav-link"
					:class="{ active: sort_category == form.sort_category }"
					@click="form.sort_category = sort_category"
					>{{sort_category}}</a>
				</div>
			</div>
			<div class = "nav-item">
				<hr class="solid">
				<p class="filter">Rating</p>
				<div>
					<Slider
					class="green_slider"
					v-model="form.rating_interval"
					:min="0"
					:max="5"
					/>
				</div>
				<p class="filter">Year</p>
				<div>
					<Slider
					class="green_slider"
					v-model="form.years"
					:min="1950"
					:max="2022"
					/>
				</div>
				<p class="filter">Name</p>
				<button v-if="form.a_to_z == true" class="btn a_to_z" @click="AtoZ" type="button">
					A <b-icon-arrow-right></b-icon-arrow-right> Z
				</button>
				<button v-else class="btn a_to_z" @click="AtoZ" type="button">
					Z <b-icon-arrow-right></b-icon-arrow-right> A
				</button>
			</div>
		</div>
	</nav>
</template>

<script>
import Slider from '@vueform/slider'

export default {
	components: {
		Slider,
	},
	data() {
		return {
			sorting_list : [
				'Rating',
				'Year',
				'Name',
			],
			form : {
				name           : '',
				genre          : '',
				sort_category  : 'Name',
				a_to_z         : true,
				rating_interval: [2, 5],
				years          : [1980, 2022],
			},
			genre_list: [
				"Action",
				"Animation",
				"Aventure",
				"Comédie",
				"Comédie dramatique",
				"Drame",
				"Epouvante-horreur",
				"Famille",
				"Fantastique",
				"Musical",
				"Policier",
				"Romance",
				"Science Fiction",
				"Thriller",
			],
		}
	},
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
		submit(e) {
			e.preventDefault()
			this.emit_form()
		}
	},
	mounted() {
		this.emit_form()
	}
	
}



</script>
<div class="nav_category__enable"></div>

<style src="@vueform/slider/themes/default.css">

</style>

<style lang="scss" scoped>
@import url("./../assets/shared_scss/navbars.scss");

:root {
	--slider-handle-width: 8px;
	--slider-handle-height: 8px;
}

.navbar {
	position        : absolute;
	width           : 25%;
	height          : 100%;
	background-color: rgba(34, 35, 40, 0.864);
}

.sidebar_menu {
	width: 90%
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


.btn {
	margin: unset;
	padding: unset;
}

.search_icon {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0px;
}

@media (max-width: 590px) {
	.search_icon {
		font-size:10px;
	}
}


.nav-link, .row, .nav-item {
	margin : 0px;
	padding: 0px;
}

.nav-item {
	margin-top    : 20%;
	position: relative;
}

.filter {
	letter-spacing: inherit;
	font-family   : inherit;
	text-transform: inherit;
	font-size     : inherit;
}

.input-group > * {
	background-color: rgba(0, 0, 0, 0.662);
	box-shadow      : 0px 0px 10px 0px rgba(252, 252, 252, 0.198);
	color           : white;
	transition      : box-shadow 1s;
	padding-top : 5px;
	padding-bottom : 5px;
}

.input_text {
	padding-left: 10%;
}

.input-group > input {
	width: 80%;
}

.input-group-btn {
	width: 20%;
	align-content: center;
	justify-content: center;
	position:relative;
}

.input-group:hover > *, .input-group:active > * {
	box-shadow: 0px 0px 10px 0px white;
	transition: 0.5s;
}

.input-group:hover:after > *{
	transition: 0.5s;
}

.nav-item > input {
	border       : none;
	border-radius: 5px;
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

.filter {
	margin         : 15% 0% 15% 0%;
}

.a_to_z {
	color          : white;
	margin-top     : -20%;
	padding        : 5px 10px 5px 10px;
	border         : 0.02rem solid;
	font-size      : 12px
}
@media (max-width: 590px) {
	.a_to_z{
		font-size: 8px;
		margin-top     : -10%;
		padding        : 2px 5px 2px 5px;
	}
	
}

hr {
	border         : 1.2px solid #bbb;
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

.touchable {
	cursor: pointer;
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