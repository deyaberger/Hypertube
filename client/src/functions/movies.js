import axios from "axios"

function _parse_form_for_back(form, lang_nb) {
	const title       = form.title;
	const min_rating  = form.min_rating;
	const genre       = form.genre;
	const quality     = form.quality;
	const min_year    = form.min_year;
	const language    = lang_nb == 0 ? 'en' : 'fr';
	const asc_or_desc = form.asc_or_desc;
	const sort_by     = form.sort_by;
	const params               = {
		"query_term"     : title,
		"minimum_rating" : min_rating,
		"genre"          : genre,
		'quality'        : quality,
		'min_year'       : min_year,
		'language'       : language,
		"asc_or_desc"    : asc_or_desc,
		"sort_by"        : sort_by
	}
	return params

}

export const Parse_Single_Movie = (data) => {
	const res = data[0]
	let parsed_data = {
		"title"             : res.title,
		"genres"            : res.genres_list,
		"large_cover_image" : res.images_list[0],
		"list_comments"     : [],
		"year"              : res.year,
		"runtime"           : res.length_minutes,
		"rating"            : res.imdb_rating,
		"summary"           : res.summary,
		"cast"              : [],
	}
	return parsed_data
}

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


export const Get_Movies_Research = async(form , lang_nb, token) => {
	const params = _parse_form_for_back(form, lang_nb)
	let request = {
		url: `http://127.0.0.1:8071/api/movies/search`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		},
		params : params
	};
	const response = await axios(request);
	// console.log("response dans front: ", response)
	return response;
}



export const Get_Single_Movie_Details = async(movie_id , token) => {
	let request = {
		url: `http://127.0.0.1:8071/api/movies/details/:${movie_id}`,
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
	// console.log("response dans front: ", response)
	return response;
}