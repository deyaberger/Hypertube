<script>
import { get_all_movies, add_json_to_db } from "../functions/get_movies"

export default {
	data() {
		return {
			yts_on                : false,
			yts_movie_count       : 0,
			yts_currently_fetched : 0,
			yts_done              : false,
			total_pages           : 0,
			seconds               : 0,
			minutes               : 0,
			hours                 : 0,
			db_on                 : false,
			db_done               : false
		}
	},
	methods: {
		get_time_spent(start) {
			let time = Math.round((Date.now() - start) / 1000);
			this.seconds = time % 60
			this.minutes = Math.round(time / 60) % (60 * 60)
			this.hours = Math.round(time / (60 * 60))
		},


		async fetch_data(source) {
			const start = Date.now();
			this.yts_movie_count = 0;
			this.yts_currently_fetched = 0;
			let current_page = 1;

			this.yts_on = true;
			let res = await get_all_movies(source, 1);
			this.yts_movie_count = res.data.movie_count;


			this.yts_currently_fetched = (20 * (current_page - 1))
			this.yts_movie_count = 50; // TO DELETE
			while (this.yts_currently_fetched < this.yts_movie_count) {
				let res = await get_all_movies(source, current_page);
				try {
					this.yts_currently_fetched += res.data.movies.length;
				}
				catch(e) {
					console.log(e);
					break;
				}
				this.get_time_spent(start);
				current_page += 1;
			}
			this.get_time_spent(start);
			this.yts_done = true;
			this.yts_on = false;
			console.log("Stoped at page: ", current_page - 1)
		},


		async add_to_db(source) {
			this.db_on = true;
			this.db_done = false;
			let current_page = 1;
			this.total_pages = 3;
			for (current_page; current_page < this.total_pages; current_page++) {
				let res = await add_json_to_db(source, current_page);
			}
			let res = await add_json_to_db(source, current_page);
			this.db_on = false;
			this.db_done = true;
		}
	}
}
</script>

<template>
  <div class="container homemade-container">
      <h2 class="mb-4 text-center">Populate DB:</h2>
      <div class="col-md-12 text-center mt-4">
        <button class="submit_button" @click="fetch_data('yts')">FETCH YTS data</button>
		<p v-if="yts_on || yts_done" class="mt-4">Fetching data: {{yts_currently_fetched}} / {{yts_movie_count}}
			<span v-if="yts_done"><b-icon-check class="h2 green" variant="success"/></span>
			<span v-else><b-spinner variant="success"></b-spinner></span>
		</p>
		<p v-if="yts_on || yts_done">Time Spent:{{hours}}:{{minutes}}:{{seconds}}</p>
      </div>
	  <div class="col-md-12 text-center mt-4">
        <button class="submit_button" @click="add_to_db('yts')">Add YTS to BDD</button>
		<p v-if="db_on || db_done" class="mt-4">Putting data to db: {{current_page}} / {{total_pages}}
			<span v-if="db_done"><b-icon-check class="h2 green" variant="success"/></span>
			<span v-else><b-spinner variant="success"></b-spinner></span>
		</p>
      </div>
  </div>
</template>

<style scoped>
@import "../assets/shared_scss/login.scss";
@import "../assets/shared_scss/shared.scss";

.green {
	color: rgb(12, 198, 12);
}

.container {
	margin-top : -200px;
}

</style>