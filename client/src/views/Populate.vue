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
		}
	},
	methods: {
	async Populate(source, token) {
		const start = Date.now();
		this.yts_on = true;
		// await new Promise(resolve => setTimeout(resolve, 3000));
		let res = await get_all_movies(source, token);
		console.log("res cote front: ", res)
		this.yts_total = res.data.total;
		this.yts_count = res.data.count;
		this.time = Math.round((Date.now() - start) / 100);
		this.yts_done = true;
		this.yts_on = false;
	}
	}
}
</script>

<template>
  <div class="container homemade-container ">
      <h2 class="mb-4 text-center">Populate DB:</h2>
      <div class="col-md-12 text-center mt-4">
        <button class="submit_button" @click="Populate('yts', this.$cookies.get('token'))">YTS</button>
		<p v-if="yts_on || yts_done" class="mt-4">Fetching data: {{yts_count}} / {{yts_total}}
			<span v-if="yts_done"><b-icon-check class="h2 green" variant="success"/></span>
			<span v-else><b-spinner variant="success"></b-spinner></span>
		</p>
		<p v-if="yts_on || yts_done">Time Spent:{{time}}sec</p>
      </div>
  </div>

</template>

<style scoped>
@import "../assets/shared_scss/login.scss";
@import "../assets/shared_scss/shared.scss";

.green {
	color: rgb(12, 198, 12);
}

</style>