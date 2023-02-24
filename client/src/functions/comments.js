import axios from "axios"

export const Parse_Comments = (data) => {
	data = data.comments
	if (data.length == 0) {
		return data
	}
	console.log("DATTTe: ", data[0].date, typeof(data[0].date))
	let comments = []
	for (let i = 0; i < data.length; i++) {
		comments.push( {
			"content" : data[i].content,
			"date" : data[i].date,
			"username" : data[i].username,
			"rating" : data[i].rating
		});
	  }
	console.log("COMMMMMENNNTS: ", comments)

	return comments
}


export const Get_Comments_By_Movie_ID = async(movie_id, token) => {
	console.lo
	let request = {
		url: `http://127.0.0.1:8071/api/comments/movie/${movie_id}`,
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
	console.log("Posting comment: ", movie_id, content, rating, token)
	let request = {
		url: `http://127.0.0.1:8071/api/comments/post/:${movie_id}`,
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
	console.log("RESPONSE: ", response)
	return response;
}
