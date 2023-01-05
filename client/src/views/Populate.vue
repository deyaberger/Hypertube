<script>
import { get_all_movies } from "../functions/get_movies"

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
			hours: 0
		}
	},
	methods: {
		get_time_spent(start) {
			this.time = Math.round((Date.now() - start) / 1000);
			this.seconds = this.time % 60
			this.minutes = Math.round(this.time / 60) % (60 * 60)
			this.hours = Math.round(this.time / (60 * 60))
		},
		async Populate(source) {
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
			let i = 230;
			if (i > 1) {
				this.yts_count = (20 * i)
			}
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
			console.log("Stoped at page: ", i)
		}
	}
}
</script>

<template>
  <div class="container homemade-container">
      <h2 class="mb-4 text-center">Populate DB:</h2>
      <div class="col-md-12 text-center mt-4">
        <button class="submit_button" @click="Populate('yts')">YTS</button>
		<p v-if="yts_on || yts_done" class="mt-4">Fetching data: {{yts_count}} / {{yts_total}}
			<span v-if="yts_done"><b-icon-check class="h2 green" variant="success"/></span>
			<span v-else><b-spinner variant="success"></b-spinner></span>
		</p>
		<p v-if="yts_on || yts_done">Time Spent:{{hours}}:{{minutes}}:{{seconds}}</p>
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