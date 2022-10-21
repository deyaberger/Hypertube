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
			lang_nb      : 0,
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
				rating : ['Rating', 'Note'],
				year   : ['Year', 'Année'],
				name   : ['Name', 'Nom'],
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
		language: {
			handler:function(newVal) {
				this.lang_nb = newVal == "eng" ? 0 : 1
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
					<input class = "input_text" type="text" v-model="form.name"/>
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
				<div class="row justify-text_content-md-center">
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
				<p class="filter">{{sorting_list.rating[lang_nb]}}</p>
				<div>
					<Slider
					class="green_slider"
					v-model="form.rating_interval"
					:min="0"
					:max="5"
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
				<p class="filter">{{sorting_list.name[lang_nb]}}</p>
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
@import url("./../assets/shared_scss/sidebar.scss");


</style>