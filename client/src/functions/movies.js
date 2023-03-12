import axios from "axios"

// ------------------------------------------ MOVIES --------------------------------------------------------------
function _parse_form_for_back(form, lang_nb) {
	const title       = form.title;
	const min_rating  = form.min_rating;
	const genre       = form.genre;
	let quality = 720
	if (form.quality == '4k') {
		quality = 2160
	}
	else if (form.quality == '1080p') {
		quality = 1080
	}
	const min_year    = form.min_year;
	const language    = lang_nb == 0 ? 'en' : 'fr';
	const asc_or_desc = form.asc_or_desc;
	const sort_by     = form.sort_by == "seeds" ? "max_seeds" : form.sort_by;
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
	let parsed_data = {
		"title"             : data.title,
		"genres"            : data.genres_list,
		"images_list"		: data.images_list,
		"list_comments"     : [],
		"year"              : data.year,
		"runtime"           : data.length_minutes,
		"rating"            : data.imdb_rating,
		"summary"           : data.summary,
		"director"          : data.director,
		"actors"	        : data.actors,
		"is_watched"        : data.is_watched,
		"is_fav"	        : data.is_fav,
	}
	return parsed_data
}

export const Get_Recommendations = async(token) => {
	let request = {
		url: `/api/movie/reco`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				       : `Bearer ${token}`
		}
	};
	const response = await axios(request);
	return response;
}


export const Get_Movies_Research = async(form, lang_nb, token) => {
	const params = _parse_form_for_back(form, lang_nb)
	console.log("<movies> : params ", params)
	let request = {
		url: `/api/movie/search`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		},
		params : params
	};
	const response = await axios(request);
	return response;
}

export const Get_Movies_Research_Page = async(form, lang_nb, token, offset, limit) => {
	let params = _parse_form_for_back(form, lang_nb)
	params.offset = offset
	params.limit  = limit

	// console.log("<movies> : params ", params)
	let request = {
		url: `/api/movie/search_page`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		},
		params : params
	};
	const response = await axios(request);
	return response;
}


export const Get_Single_Movie_Details = async(movie_id, token) => {
	let request = {
		url: `/api/movie/get_details/${movie_id}`,
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

// ------------------------------------------ FAVORITES --------------------------------------------------------------
export const Get_User_Fav_Movies = async(token, user_id) => {
	let request = {
		url: `/api/favorites/${user_id}`,
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

export const Add_To_Favorites = async(movie_id, token) => {
	let request = {
		url: `/api/favorites/add/${movie_id}`,
		method: "post",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		}
	};
	const response = await axios(request);
	return response;
}

export const Remove_From_Favorites = async(movie_id, token) => {
	let request = {
		url: `/api/favorites/remove/${movie_id}`,
		method: "post",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		}
	};
	const response = await axios(request);
	return response;
}

export const Is_Fav_Movie = async(token, movie_id) => {
	let request = {
		url : `/api/favorites/is_fav/${movie_id}`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		}
	}
	const response = await axios(request);
	return response;
}


// ------------------------------------------ WATCHED --------------------------------------------------------------
export const Get_User_Watched_Movies = async(token, user_id) => {
	let request = {
		url: `/api/watched/${user_id}`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'              : `Bearer ${token}`
		}
	};
	const response = await axios(request);
	return response;
}

export const Set_Watched = async(movie_id, token) => {
	let request = {
		url: `/api/watched/set_watched/${movie_id}`,
		method: "post",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'              : `Bearer ${token}`
		}
	};
	const response = await axios(request);
	return response;
}

export const Set_UnWatched = async(movie_id, token) => {
	let request = {
		url: `/api/watched/set_unwatched/${movie_id}`,
		method: "post",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'              : `Bearer ${token}`
		}
	};
	const response = await axios(request);
	return response;
}

export const Is_Watched = async(movie_id, token) => {
	let request = {
		url: `/api/watched/is_watched/${movie_id}`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'              : `Bearer ${token}`
		}
	};
	const response = await axios(request);
	return response;
}

