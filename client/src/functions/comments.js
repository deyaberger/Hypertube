import axios from "axios"

export const Parse_Comments = (data) => {
	data = data.comments
	console.log("DATTTe: ", data[0].date, typeof(data[0].date))
	let comments = []
	for (let i = 0; i < data.length; i++) {
		comments.push( {
			"content" : data[i].content,
			"date" : data[i].date,
			"username" : data[i].username,
			"rating" : 6.5, //TO BE CHANGED
		});
	  }
	console.log("COMMMMMENNNTS: ", comments)

	return comments
}


export const Get_Comments_By_Movie_ID = async(movie_id, token) => {
	console.lo
	let request = {
		url: `http://127.0.0.1:8071/api/comments/movie/:${movie_id}`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		},
		params : {
			"movie_id" : movie_id
		}
	};
	const response = await axios(request);
	return response;
}
