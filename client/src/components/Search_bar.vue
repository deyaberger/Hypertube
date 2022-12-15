<script>
import Slider from '@vueform/slider'
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json";
import StarRating from 'vue-star-rating';



export default {
	components: {
		Slider,
		StarRating
	},
	data() {
		return {
			show               : true,
			text_content       : textContent.MOVIES,
			genre_list         : textContent.MOVIES.genre_list,
			sorting_list       : textContent.MOVIES.sorting_list,
			form               : {
									title         : '',
									genre         : '',
									quality       : '1080p',
									sort_category : textContent.MOVIES.sorting_list.year,
									order_by      : 'desc',
									min_rating    : 0,
									years         : [1980, 2022],
								}
		}
	},
	computed: mapState({
		lang_nb: state => state.lang_nb,
	}),
	methods: {
		emit_form() {
			this.$emit('search_form', this.form);
		},
		order() {
			if (this.form.order_by == 'desc') {
				this.form.order_by = 'asc'
			}
			else {
				this.form.order_by = 'desc'
			}
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
	},
	mounted() {
		this.emit_form()
	},
	watch: {
		form: {
			handler:function() {
				this.emit_form()
			},
			deep:true
		},
	}
}
</script>


<template>
	<nav class="navbar nav flex-column search_bar" :class="{small_sidebar : !show}">
		<div class="sidebar_menu">
			<button @click="show = !show" class="btn navbar-nav ms-auto"><b-icon-filter-left class = "h1 show_bar"></b-icon-filter-left></button>
			<div v-if="show">
			<form @submit="submit">
				<div class = "nav-item input-group">
					<input class = "input_text" type="text" v-model="form.title"/>
					<span class="input-group-btn">
						<button class="btn search_icon" type="submit">
							<b-icon-search color="white"></b-icon-search>
						</button>
					</span>
				</div>
			</form>

			<div class = "nav-item">
				<h2>{{text_content.genre[lang_nb]}}</h2>
				<div
					v-for="genre in genre_list" :key="genre"
					class="nav-link"
					:class="{ active: genre == form.genre }"
				>
					<span @click="update_genre(genre)" class="touchable"> {{ genre[lang_nb] }} </span>
					<b-icon-x
						@click="update_genre()"
						class = "remove touchable"
						:class="{ active: genre == form.genre }"
					></b-icon-x>
			</div>
			</div>
			<div class = "nav-item">
				<h2>{{text_content.sort[lang_nb]}}</h2>
				<div class="row justify-temp-md-center">
					<a
					href="#"
					v-for="sort_category in sorting_list" :key="sort_category"
					class="col nav-link"
					:class="{ active: sort_category[0] == form.sort_category[0] }"
					@click="update_sort_cat(sort_category)"
					>{{sort_category[lang_nb]}}</a>
				</div>
			</div>

			<div class = "nav-item">
				<hr class="solid">
				<p class="filter">{{form.sort_category[lang_nb]}}</p>
				<button v-if="form.order_by == 'desc'" class="btn a_to_z" @click="order" type="button">
					ASC <b-icon-arrow-up></b-icon-arrow-up>
				</button>
				<button v-else class="btn a_to_z" @click="order" type="button">
					DESC <b-icon-arrow-down></b-icon-arrow-down>
				</button>
				<p class="filter">Min {{sorting_list.rating[lang_nb]}}</p>
				<div>
					<star-rating
						v-model="form.min_rating"
						:numberOfStars=10
						:increment="1"
						:star-size="20"
						:max-rating="10"
					/>
				</div>
				<p class="filter">{{sorting_list.year[lang_nb]}}</p>
				<div>
					<Slider
					class="green_slider"
					v-model="form.years"
					:min="1950"
					:max="2022"
					/>
				</div>

			</div>
		</div>
		</div>
	</nav>
</template>



<style src="@vueform/slider/themes/default.css">

</style>

<style lang="scss" scoped>
@import url("./../assets/shared_scss/navbars.scss");
@import url("./../assets/shared_scss/sidebar.scss");



</style>