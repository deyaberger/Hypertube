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
			tmp_title		   : '',
			quality_list       : ['720p', '1080p', '4k'],
			form               : {
									title         : '',
									min_rating    : 0,
									genre         : '',
									quality       : '',
									min_year      : 1900,
									sort_by       : 'title',
									asc_or_desc   : 'asc',
								}
		}
	},
	computed: mapState({
		lang_nb: state => state.lang_nb,
		user_token : state =>  state.user_token,
	}),
	methods: {
		emit_form() {
			this.$emit('search_form', this.form);
		},
		order() {
			if (this.form.asc_or_desc == 'desc') {
				this.form.asc_or_desc = 'asc'
			}
			else {
				this.form.asc_or_desc = 'desc'
			}
		},
		is_current_sort_category(category) {
			if (category == this.form.sort_by)
				return true
			return false
		},
		is_current_genre(genre) {
			if (genre == this.form.genre)
				return true
			return false
		},
		update_genre(genre) {
			this.form.genre = genre
		},
		update_quality(quality) {
			this.form.quality = quality
		},
		update_sort_cat(category) {
			this.form.sort_by = category
		},
		submit(e) {
			e.preventDefault()
		},
	},
	mounted() {
		this.emit_form()
	},
	watch: {
		form: {
			handler:function() {
				this.emit_form();
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
			<form @submit="submit" class="search-form">
				<div class = "nav-item input-group">
					<input class="input_text" type="text" v-model="tmp_title" v-on:keyup.enter="form.title = tmp_title"
					:placeholder="text_content.title_research[lang_nb]"/>
					<span class="input-group-btn">
						<button class="btn search_icon" type="submit">
							<b-icon-search color="white" @click="form.title = tmp_title"></b-icon-search>
						</button>
					</span>
				</div>
			</form>
			<div class = "nav-item">
				<h2>{{text_content.genre[lang_nb]}}</h2>
				<div
					v-for="(value, key) in genre_list"
					class="nav-link"
					:class="{ active: is_current_genre(key)}"
				>
					<span @click="update_genre(key)" class="touchable"> {{ value[lang_nb] }} </span>
					<b-icon-x
						@click="update_genre('')"
						class = "remove touchable"
						:class="{ active: is_current_genre(key)}"
					></b-icon-x>
			</div>
			<div class = "nav-item">
				<hr class="solid">
				<div class="col filter_item">
					<p class="filter">Min Year:</p>
					<Slider
						class="green_slider"
						v-model="form.min_year"
						:min="1900"
						:max="2023"
						:step="10"
						tooltipPosition="bottom"
						/>
				</div>
			</div>
			</div>
			<div class = "nav-item">
				<hr class="solid">
				<p class="filter">Min {{sorting_list.imdb_rating[lang_nb]}}</p>
				<div>
					<star-rating
						v-model:rating="form.min_rating"
						:numberOfStars=10
						:increment="1"
						:star-size="20"
						:max-rating="9"
						:clearable="true"
					/>
				</div>
			</div>
			<div class = "nav-item">
				<hr class="solid">
				<p class="filter">{{text_content.quality[lang_nb]}}</p>
				<div class="row">
				<div
					v-for="quality in quality_list" :key="quality"
					class="nav-link col"
					:class="{ active: quality == form.quality }"
				>
					<span @click="update_quality(quality)" class="quality touchable">{{quality}} </span>
					<b-icon-x
						@click="update_quality()"
						class = "touchable cross"
						:class="{ active: quality == form.quality }"
					></b-icon-x>
			</div>
		</div>
			</div>
			<div class = "nav-item">
				<h2>{{text_content.sort[lang_nb]}}</h2>
				<div class="row justify-temp-md-center">
					<a
					href="#"
					v-for="(value, key) in sorting_list"
					class="nav-link"
					:class="{ active: is_current_sort_category(key)}"
					@click="update_sort_cat(key)"
					>{{value[lang_nb]}}</a>
				</div>
			</div>
			<button v-if="form.asc_or_desc == 'desc'" class="btn a_to_z" @click="order" type="button">
					DESC <b-icon-arrow-down></b-icon-arrow-down>
				</button>
				<button v-else class="btn a_to_z" @click="order" type="button">
					ASC <b-icon-arrow-up></b-icon-arrow-up>
				</button>

		</div>
		</div>
	</nav>
</template>



<style src="@vueform/slider/themes/default.css">

</style>

<style lang="scss" scoped>
@import url("./../assets/shared_scss/navbars.scss");
@import url("./../assets/shared_scss/sidebar.scss");

.cross {
	display        :none
}

.cross.active {
	display: unset;
	font-size: 1.4rem;
}


.quality {
	text-transform: lowercase
}


</style>