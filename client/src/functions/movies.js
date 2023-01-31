import axios from "axios"

// export const get_movie_by_imdb_id = async (imdb_id, token) => {
// 	console.log("Getting specific movie details")
// 	let request = {
// 		url: `http://127.0.0.1:8071/api/movies/details/${imdb_id}`,
// 		method: "get",
// 		headers: {
// 			'Access-Control-Allow-Origin': '*',
// 			"Content-type"               : "application/json",
// 			'Authorization'				 : `Bearer ${token}`
// 		}
// 	};

// 	const response = await axios(request);
// 	// console.log("got movie details: ", response.data)
// 	return response;
// }

export const Get_Recommendations = async(token) => {
	let request = {
		url: `http://127.0.0.1:8071/api/movies/home`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		}
	};
	const response = await axios(request);
	// console.log("response dans front: ", response)
	return response;
}


export const Get_Movies_Research = async(form , language, id, token) => {
	if (form.sort_category[0] == 'rating') {
		form.sort_category[0] = 'imdb_rating'
	}
	let request = {
		url: `http://127.0.0.1:8071/api/movies/search`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		},
		params               : {
			"id"             : id,
			"query_term"     : form.title,
			"minimum_rating" : form.min_rating,
			"genre"          : form.genre[0],
			'quality'        : form.quality,
			'min_year'       : form.min_year,
			'language'       : language,
			"asc_or_desc"    : form.asc_or_desc,
			"sort_by"        : form.sort_category[0]
		}
	};
	const response = await axios(request);
	// console.log("response dans front: ", response)
	return response;
}
