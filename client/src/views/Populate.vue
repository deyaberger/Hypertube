<script>
import { get_all_movies, add_json_to_db } from "../functions/get_movies"

export default {
	data() {
		return {
			yts_on : false,
			yts_total : 0,
			yts_count : 0,
			yts_done : false,
			time : 0,
			seconds : 0,
			minutes: 0,
			hours: 0,
			page : 0,
			db_on : false,
			db_done : false,
			page_start : 1,
			pages_total : 0,
		}
	},
	methods: {
		get_time_spent(start) {
			this.time = Math.round((Date.now() - start) / 1000);
			this.seconds = this.time % 60
			this.minutes = Math.round(this.time / 60) % (60 * 60)
			this.hours = Math.round(this.time / (60 * 60))
		},
		async fetch_data(source) {
			this.yts_total = 0;
			this.yts_count = 0;
			const start = Date.now();
			this.yts_on = true;
			let res = await get_all_movies(source, 1);
			try {
					this.yts_total = res.data.movie_count;
			}
			catch(e) {
				console.log(i)
			}
			let i = 1;
			this.yts_count = (20 * (i - 1))
			this.yts_total = 50
			while (this.yts_count < this.yts_total) {
				let res = await get_all_movies(source, i);
				try {
					this.yts_count += res.data.movies.length;
				}
				catch(e) {
					console.log(i)
				}
				// console.log("res cote front: ", res)
				this.get_time_spent(start)
				i += 1;
			}
			this.get_time_spent(start);
			this.time = 0;
			this.yts_done = true;
			this.yts_on = false;
			console.log("Stoped at page: ", i - 1)
		},
		async add_to_db(source) {
			this.db_on = true;
			this.db_done = false;
			this.page_start = 1;
			this.pages_total = 3;
			for (this.page_start; this.page_start < this.pages_total; this.page_start++) {
				let res = await add_json_to_db(source, this.page_start);
			}
			let res = await add_json_to_db(source, this.page_start);
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
		<p v-if="yts_on || yts_done" class="mt-4">Fetching data: {{yts_count}} / {{yts_total}}
			<span v-if="yts_done"><b-icon-check class="h2 green" variant="success"/></span>
			<span v-else><b-spinner variant="success"></b-spinner></span>
		</p>
		<p v-if="yts_on || yts_done">Time Spent:{{hours}}:{{minutes}}:{{seconds}}</p>
      </div>
	  <div class="col-md-12 text-center mt-4">
        <button class="submit_button" @click="add_to_db('yts')">Add YTS to BDD</button>
		<p v-if="db_on || db_done" class="mt-4">Putting data to db: {{page_start}} / {{pages_total}}
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