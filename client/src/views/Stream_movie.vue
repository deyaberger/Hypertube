<script>
import { mapState } from 'vuex';
import vue3StarRatings from "vue3-star-ratings";
import { Get_Single_Movie_Details,
		 Parse_Single_Movie,
		 Set_Watched,
		 Set_UnWatched,
		 Is_Watched } from "../functions/movies";
import { Get_Comments_By_Movie_ID, Parse_Comments, Post_Comment } from "../functions/comments";
import { Get_Formatted_Time } from "../functions/utils.js";
import StarRating from 'vue-star-rating';


export default {
	props: {
		movie_id: String,
	},
	data() {
		return {
			movie : []
	}
	},
	components: {
	},
	computed: mapState({
		lang_nb    : state => state.lang_nb,
		user_token : state =>  state.user_token,
	}),
	methods: {
		async get_movie_details() {
			try {
				let res = await Get_Single_Movie_Details(this.movie_id, this.user_token);
				console.log("MOVIE RES = ", res)
				if (res.status == 200) {
					this.movie = Parse_Single_Movie(res.data);
				}
				else {
					console.log(res.code, res.data)
					throw("Unknow error code getting movies")
				}
			}
			catch (e) {
				console.log("Error in get_movie_details")
				throw(e)
			}
		},
	},
	mounted() {
	},
}
</script>

<template>
	<div class="homemade-container">
    </div>
</template>



<style lang="scss" scoped>
@import "../assets/shared_scss/single_movie.scss";

.time {
	text-align: end;
}

.icon.score.bof {
	color: rgba(255, 196, 0, 0.671)
}

.icon.score.bad {
	color: rgba(255, 0, 0, 0.671)
}

</style>