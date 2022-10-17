<template>
	<div>
		<nav class="navbar nav flex-column">
			<div class="sidebar_menu">
				<div class = "nav-item">
					<input type="text"/>
				</div>
				<div class = "nav-item">
					<h2>Genres</h2>
					<a class="nav-link" href="#" v-for="genre in genre_list" :key="genre">
						{{ genre }}
					</a>
				</div>
				<div class = "nav-item">
					<h2>Sort by</h2>
					<div class="row">
						<div class = "col">
							<a class="nav-link" href="#">Rating</a>
						</div>
						<div class = "col">
							<a class="nav-link" href="#">Year</a>
						</div>
						<div class = "col">
							<a class="nav-link" href="#">Name</a>
						</div>
					</div>
				</div>
				<div class = "nav-item">
					<h2>Filters:</h2>
					<p class="filter">Rating</p>
					<div>
						<Slider
						v-model="rating_vale"
						:min="0"
						:max="5"
						/>
					</div>
					<p class="filter">Year</p>
					<div>
						<Slider
						v-model="years"
						:min="1950"
						:max="2022"
						/>
					</div>
					<p class="filter">Name</p>
				</div>
			</div>
		</nav>
	</div>
</template>

<script>
import Slider from '@vueform/slider'

export default {
	components: {
		Slider,
	},
	data() {
		return {
			rating_vale: [2, 5],
			years: [1980, 2022],
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
			]
		}
	}
}



</script>
<div class="nav_category__enable"></div>

<style src="@vueform/slider/themes/default.css"></style>

<style lang="scss" scoped>
@import url("./../assets/shared_scss/navbars.scss");


.navbar {
	position: absolute;
	width: 25%;
	height: 100%;
}

.nav-link, .row, .nav-item {
	margin: 0px;
	padding: 0px;
}



</style>