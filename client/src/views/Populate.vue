<script>
import { Get_All_Movies, Dump_Json_To_DB, Get_All_Movies_IMDB_Ids, Fetch_And_Add_TMDB, Opti_DB } from "../functions/populate_db.js"

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
			tmdb_on			      : false,
			tmdb_done			  : false,
			tmdb_currently_fetched : 0,
			tmdb_movie_count      : 0,
			tmdb_error			  : false,

			opti_on				  : false,
			opti_done			  : false,
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
			let res = await Get_All_Movies(source, 1);
			this.yts_movie_count = res.data.movie_count;


			this.yts_currently_fetched = (20 * (this.current_page - 1))
			this.yts_movie_count = 50; // TO DELETE
			while (this.yts_currently_fetched < this.yts_movie_count) {
				let res = await Get_All_Movies(source, this.current_page);
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

		stop_process(source) {
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
			for (let page_number = this.current_page; page_number < this.total_pages + 1; page_number++) {
				console.log("SENDING SOMEHTING:")
				Dump_Json_To_DB(source, page_number).then( (res) => {
					console.log("finished", page_number)
					this.current_page += 1
					if (res == null || res.status != 200) {
					this.db_error = true;
					}
					if (this.stop == true) {
					}
					if (res.data.msg == "duplicate") {
						duplicates += 1;
					}
					else if (res.data.msg == "missing_file") {
						missing_file += 1;
					}
					this.get_time_spent(start);
				})
			}
			this.get_time_spent(start);
			console.log("Duplicates: ", duplicates);
			console.log("missing_file: ", missing_file);
			this.db_on = false;
			this.db_done = true;

		},

		async get_all_movies_ids() {
			try {
				let res = await Get_All_Movies_IMDB_Ids();
				if (res.status == 200) {
					return (res.data)
				}
				return null
			}
			catch(e) {
				console.log("ERROR in get all movies ids")
				throw(e)
			}
		},

		async fetch_tmdb_loop(i, total, imdb_ids) {
			const start = Date.now();

			for (let index = i; index < imdb_ids.length; index = index + total) {
					const imdb_code = imdb_ids[index].imdb_code;
					const id = imdb_ids[index].id;
					if (this.stop == true) {
						break;
					}
					
					let res = await Fetch_And_Add_TMDB(imdb_code, id);
					if (res != null && res.data.code == "SUCCESS") {
						console.log("[populate]: Succesffully got info on movie: ", id)
					}
					else if (res != null && res.data.code == "SKIPPING") {
						let msg = res.data.msg
						console.log("[populate]: Skipping movie: ", {id, msg})
					}
					else if (res != null && res.data.code == "FAILURE") {
						let msg = res.data.msg
						console.log("ERROR [populate]: ", {id, msg})
					}
					else if (res == null || res.data.code !=  "SUCCESS") {
						console.log("UNKOWN ERROR [populate]: optimize ", res)
						this.stop = true
						break
					}
					this.tmdb_currently_fetched += 1
					this.get_time_spent(start);
			}
		},

		async pimp_db(source) {
			this.tmdb_error = false
			this.tmdb_on = true
			this.tmdb_done = false
			this.stop = false
			console.log("[populate]: getting all movies ids...")
			try {
				let imdb_ids = await this.get_all_movies_ids()
				if (imdb_ids != null) {
					this.tmdb_movie_count = imdb_ids.length
					console.log("[populate]: Succesffully got all movies ids! ", this.tmdb_movie_count)
					this.tmdb_currently_fetched = 0

					let promises = []
					let n_parralel = 5
					for (let i = 0; i < n_parralel; i++) {
						promises.push(this.fetch_tmdb_loop(i, n_parralel, imdb_ids))
					}
					await Promise.all(promises)
				}
			}
			catch(e) {
				this.tmdb_error = true
			}
			this.tmdb_done = true
			this.tmdb_on = false
		},

		async opti_db() {
			try {
				this.opti_on = true
				this.opti_done = false
				let res = await Opti_DB();
				if (res != null && res.data.code == "SUCCESS") {
					let seed_res = res.data.seeds_res
					let clean = res.data.clean
					console.log("[populate]: Successfully optimized database! ", {seed_res, clean})
					this.opti_on = false
					this.opti_done = true
				}
			}
			catch(e) {
				console.log("UNKOWN ERROR [populate]: opti_db")
				throw(e)
			}
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
		<button class="submit_button" @click="stop_process('yts')" v-else>
			Stop
		</button>
		<p v-if="db_on || db_done" class="mt-4">Putting data to db: {{current_page - 1}} / {{total_pages}}
			<span v-if="db_done && !db_error"><b-icon-check class="h2 green" variant="success"/></span>
			<span v-if="!db_done && !db_error"><b-spinner variant="success"></b-spinner></span>
			<span v-if="db_error"><b-icon-exclamation-circle-fill class="red" variant="danger"></b-icon-exclamation-circle-fill></span>
		</p>
		<p v-if="db_on || db_done || db_error">Time Spent:{{hours}}:{{minutes}}:{{seconds}}</p>
      </div>
	  <div class="col-md-12 text-center mt-4">
        <button class="submit_button" @click="pimp_db('tmdb')" v-if="!tmdb_on">
			Pimp DB with TMDB data
		</button>
		<button class="submit_button" @click="stop_process('tmdb')" v-else>
			Stop
		</button>
		<p v-if="tmdb_on || tmdb_done" class="mt-4">Fetching data: {{tmdb_currently_fetched}} / {{tmdb_movie_count}}
			<span v-if="tmdb_done && !tmdb_error"><b-icon-check class="h2 green" variant="success"/></span>
			<span v-if="!tmdb_done"><b-spinner variant="success"></b-spinner></span>
			<span v-if="tmdb_error"><b-icon-exclamation-circle-fill class="red" variant="danger"></b-icon-exclamation-circle-fill></span>
		</p>
		<p v-if="tmdb_on || tmdb_done">Time Spent:{{hours}}:{{minutes}}:{{seconds}}</p>
		</div>
		<div class="col-md-12 text-center mt-4">
        <button class="submit_button" @click="opti_db()" v-if="!opti_on">
			Optimize DB
		</button>
		<p>
			<span v-if="opti_on && !opti_done">Optimizing DB...<b-spinner variant="success"></b-spinner></span>
			<span v-if="opti_done">Done Optimizing!<b-icon-check class="h2 green" variant="success"/></span>
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

.red {
	color: red
}

.container {
	margin-top : -200px;
}

</style>