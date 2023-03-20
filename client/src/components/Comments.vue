<script>
import { mapState } from 'vuex';
import textContent from "../assets/language_dict/language_dict.json";
import StarRating from 'vue-star-rating';
import { Get_Comments_By_Movie_ID, Parse_Comments, Post_Comment } from "../functions/comments";
import { Get_Rating_Level } from "../functions/utils.js";

export default {
	props: {
		movie_id: String,
	},

	components: {
		StarRating
	},

	data() {
		return {
			text_content       : textContent.MOVIES,
			Get_Rating_Level	: Get_Rating_Level,
			comments           : [],
			user_rating        : 0,
			user_comment 	   : ''
		}
	},


	computed: mapState({
		lang_nb: state => state.lang_nb,
		user_token : state =>  state.user_token,
	}),

	methods: {
		async get_comments() {
			try {
				console.log("[single_movie]: getting movie comments...")
				let res = await Get_Comments_By_Movie_ID(this.movie_id, this.user_token);
				if (res.data.code == "SUCCESS") {
					this.comments = Parse_Comments(res.data.comments);
					console.log("[single_movie]: Successfully got movie comments! ", this.comments)
				}
				else {
					console.log("ERROR [single_movie]: in get comments: ", res)
				}
			}
			catch (e) {
				console.log("UNKNOWN ERROR [single_movie]: in get_comments")
				// throw(e)
				console.log("HANDLED error in get comments", e)
			}
		},

		async post_comment(content, rating) {
			try {
				let res = await Post_Comment(this.movie_id, content, rating, this.user_token)
				if (res.data.code == "SUCCESS") {
					this.get_comments();
					this.reset_comment_input();
					console.log("[single_movie]: Succesfully added comment to db!")
				}
			}
			catch (e) {
				// throw(e)
				console.log("HANDLED error in post comment", e)
			}
		},

		reset_comment_input() {
			this.user_comment = ''
			this.user_rating = 0
		},

		reviewComplete() {
			if (this.user_rating != 0 && this.user_comment.length > 0) {
				console.log("[single_movie]: review complete!")
				return true
			}
			return false
		},
	},

	mounted() {
		this.get_comments()
	}

}
</script>


<template>
	<div class="row my_review">
		<hr class="solid">
		<div class="infos_title">{{ text_content["add_review"][lang_nb] }}:</div>
		<star-rating
			v-model:rating="user_rating"
			class="stars_container"
			inactive-color="#474848"
			:numberOfStars=10
			:increment="1"
			:star-size="20"
			:max-rating="10"
		/>
		<b-form-textarea
			id="textarea"
			v-model="user_comment"
			placeholder="Enter something..."
			rows="3"
			max-rows="2"
			:maxlength="499"
			></b-form-textarea>
		<p :class="user_comment.length >= 499 ? 'max_length warning' : 'max_length'">max length: 500</p>
		<button @click="post_comment(user_comment, user_rating)"
			:disabled="!reviewComplete()"
			class="submit_button"
			type = "submit">
			{{ text_content['send_review'][lang_nb] }}
		</button>
	</div>
	<div v-for="comment in comments" :key="comment" class="row people_reviews">
		<hr class="solid">
		<div class="col-3 rating">
			<b-icon-star-fill class="icon score" :class="Get_Rating_Level(comment.rating)"></b-icon-star-fill>
			<span><span class="big">{{comment.rating}}</span>/10</span>
		</div>
		<div class="col username">
			<router-link :to="'/profile/' + comment.user_id" class="link_to_user">@{{comment.username}}</router-link>
		</div>
		<div class="col-3 time">
			<span>{{comment.date}}</span>
		</div>
		<div class="comment"><p class="comment_text">'{{comment.content}}'</p></div>
	</div>
</template>



<style lang="scss" scoped>
@import "../assets/shared_scss/single_movie.scss";
@import "../assets/shared_scss/movie_infos.scss";

.link_to_user {
	color: rgb(197, 126, 255);
}

</style>