import axios from "axios"

export const Parse_Comments = (comments) => {
	if (comments.length == 0) {
		return comments
	}
	let parsed_comments = []
	for (let i = 0; i < comments.length; i++) {
		parsed_comments.push( {
			"content" : comments[i].content,
			"date" : comments[i].date,
			"username" : comments[i].username,
			"rating" : comments[i].rating
		});
	  }
	return parsed_comments
}


export const Get_Comments_By_Movie_ID = async(movie_id, token) => {
	let request = {
		url: `/api/comment/movie/${movie_id}`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		}
	};
	const response = await axios(request);
	return response;
}


export const Post_Comment = async(movie_id, content, rating, token) => {
	console.log("<comments> : posting ", {movie_id, content, rating, token})
	let request = {
		url: `/api/comment/post/:${movie_id}`,
		method: "post",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		},
		params : {
			"movie_id" : movie_id,
			"content" : content,
			"rating" : rating
		}
	};
	const response = await axios(request);
	return response;
}
