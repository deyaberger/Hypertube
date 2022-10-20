<template>
	<div class="results_container">
		<div class="search_header">
			<div class="title">Suggestions:</div>
			<div class="number_of_results">115 results</div>
		</div>
		<div class="movie-card" v-for="movie in movie_list" :key="movie">
			<div class="movie-header">
				<img class="movie-image" :src="movie.path"/>
				<b-icon-info-circle-fill class="h2 header-icon"></b-icon-info-circle-fill>
			</div>
			<div class="movie-content">
				<div class="movie-content-header">
					<a href="#">
						<h3 class="movie-title">{{movie.name}}</h3>
					</a>
				</div>
				<div class="movie-info">
					<div class="info-section">
						<label>Year</label>
						<span>{{movie.year}}</span>
					</div><!--date,time-->
					<div class="info-section">
						<label>Rating</label>
						<span>{{movie.rating}}</span>
					</div><!--screen-->
					<div class="info-section">
						<label>Row</label>
						<span>F</span>
					</div><!--row-->
					<div class="info-section">
						<label>Seat</label>
						<span>21,22</span>
					</div><!--seat-->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			movie_list: [
				{
					path: "../src/assets/fake_library/la_vie_est_belle.jpg",
					name: "La vie est belle",
					rating: 2,
					year: 1998,
				},
				{
					path: "../src/assets/fake_library/tschik.jpg",
					name: "Tschik",
					rating: 3,
					year: 2017,
				},
				{
					path: "../src/assets/fake_library/victoria.jpg",
					name: "Victoria",
					rating: 4,
					year: 2020,
				},
				{
					path: "../src/assets/fake_library/bagdad_cafe.jpg",
					name: "Bagdad cafe",
					rating: 3,
					year: 2003,
				}
			],
		}
	},
}
</script>

<style lang="scss" scoped>

.results_container {
	position: absolute;
	width: 75%;
	height: 100%;
	left: 25%;
	background-color: rgba(34, 35, 40, 0.864);
	overflow: scroll
}


* {
	transition: 300ms;
	color: black;
}

.search_header {
	height: 30px;
	margin: 5%;
	letter-spacing: 3.5px;
	font-family: 'Roboto', sans-serif;
	text-transform: uppercase;
	text-align: center;
}

.title { 
	font-weight: bold;
	font-size: 25px;
	color: white;
}

.number_of_results {
	color: rgba(255, 255, 255, 0.644);
	margin-top: 3%;
	text-align: left;
}

@media screen and (max-width: 590px) {
	.title { 
		font-size: 18px;
	}

	.number_of_results {
		font-size: 12px;
	letter-spacing: 2.5px;
	margin-top: 7%;
	}
}

.movie-card {
	background: #ffffff;
	box-shadow: 0px 6px 18px rgba(0,0,0,.1);
	width: 100%;
	max-width: 315px;
	margin: 2em;
	border-radius: 10px;
	display:inline-block;
	cursor: pointer;
}



.movie-header, .movie-image{
	position: relative;
	padding:0;
	margin: 0;
	height: 300px;
	width: 100%;
	display: block;
	border-top-left-radius: 10px;
	border-top-right-radius:10px;
}

.movie-image {
	justify-content: left;
	object-fit: cover;
}

.header-icon {
	visibility: hidden;
	color: rgba(0, 0, 0, 0.878);
	// box-shadow: -2px -2px 10px 5px #202525;
	border-radius: 35px;
	background-color: white;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto auto auto auto;
	font-size: 54px;
	opacity: .85;


}

.movie-card:hover {
	transform:scale(1.03);
}

.movie-header:hover > .movie-image {
	opacity: 0.7
}

.movie-header:hover > .header-icon {
	visibility: visible;
}


.header-icon:hover {
	// font-size: 74px;
	transform:scale(1.1);
}



.movie-content {
	padding: 18px 18px 24px 18px;
	margin: 0;
}

.movie-content-header, .movie-info {
	display: table;
	width: 100%;
}

.movie-info {
	margin-top: 1em;
}

.info-section {
	display: table-cell;
	text-transform: uppercase;
	text-align:center;
}

.info-section:first-of-type {
	text-align:left;
}

.info-section:last-of-type {
	text-align:right;
}

.info-section label {
	display: block;
	color: rgba(0,0,0,.5);
	margin-bottom: .5em;
	font-size: 9px;
}

.info-section span {
	font-weight: 700;
	font-size: 11px;
}

.movie-image {
	background-size: cover;
	background-position: 100% 100%;
}

@media screen and (max-width: 590px) {
	.movie-card {
		width: 70%;
	}

	.movie-header, .movie-image{
	height: 200px;
	}

	.movie-title {
		font-size: 15px;
	}
	.movie-info {
	margin-top: 0em;
	}
	.movie-content {
		padding: 12px 12px 10px 12px;
		margin: 0;
	}

}

</style>