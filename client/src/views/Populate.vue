<script>
import { get_all_movies, add_json_to_db } from "../functions/populate_db.js"

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
			db_done               : false,
			db_error			  : false,
			current_page		  : 1,
			db_stop				  : false,
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
			this.current_page = 1;

			this.yts_on = true;
			let res = await get_all_movies(source, 1);
			this.yts_movie_count = res.data.movie_count;


			this.yts_currently_fetched = (20 * (this.current_page - 1))
			this.yts_movie_count = 50; // TO DELETE
			while (this.yts_currently_fetched < this.yts_movie_count) {
				let res = await get_all_movies(source, this.current_page);
				try {
					this.yts_currently_fetched += res.data.movies.length;
				}
				catch(e) {
					console.log(e);
					break;
				}
				this.get_time_spent(start);
				this.current_page += 1;
			}
			this.get_time_spent(start);
			this.yts_done = true;
			this.yts_on = false;
			console.log("Stoped at page: ", this.current_page - 1)
		},

		Stop(source) {
			this.stop = true;
		},


		async add_to_db(source) {
			this.stop = false;
			this.db_error = false;
			this.db_on = true;
			this.db_done = false;
			let duplicates = 0;
			let missing_file = 0;
			this.current_page = 1;
			// this.current_page = 2221;
			// this.total_pages = 3;
			this.total_pages = 2368;
			const start = Date.now();
			for (this.current_page; this.current_page < this.total_pages + 1; this.current_page++) {
				console.log("SENDING SOMEHTING:")
				let res = await add_json_to_db(source, this.current_page);
				if (res == null || res.status != 200) {
					this.db_error = true;
					break;
				}
				if (this.stop == true) {
					break;
				}
				if (res.data.msg == "duplicate") {
					duplicates += 1;
				}
				else if (res.data.msg == "missing_file") {
					missing_file += 1;
				}
				this.get_time_spent(start);
			}
			this.get_time_spent(start);
			console.log("Duplicates: ", duplicates);
			console.log("missing_file: ", missing_file);
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
        <button class="submit_button" @click="add_to_db('yts')" v-if="!db_on">
			Add YTS to BDD
		</button>
		<button class="submit_button" @click="Stop('yts')" v-else>
			Stop
		</button>
		<p v-if="db_on || db_done" class="mt-4">Putting data to db: {{current_page - 1}} / {{total_pages}}
			<span v-if="db_done && !db_error"><b-icon-check class="h2 green" variant="success"/></span>
			<span v-if="!db_done && !db_error"><b-spinner variant="success"></b-spinner></span>
			<span v-if="db_error"><b-icon-exclamation-circle-fill class="red" variant="danger"></b-icon-exclamation-circle-fill></span>
		</p>
		<p v-if="db_on || db_done || db_error">Time Spent:{{hours}}:{{minutes}}:{{seconds}}</p>
      </div>
  </div>
</template>

<style scoped>
@import "../assets/shared_scss/login.scss";
@import "../assets/shared_scss/shared.scss";

.green {
	color: rgb(12, 198, 12);
}

.red {
	color: red
}

.container {
	margin-top : -200px;
}

</style>