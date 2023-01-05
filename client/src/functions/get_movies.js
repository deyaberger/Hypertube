import axios from "axios"

export const get_movie_by_imdb_id = async (imdb_id, token) => {
	console.log("Getting specific movie details")
	let request = {
		url: `http://127.0.0.1:8071/api/movies/details/${imdb_id}`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		}
	};

	const response = await axios(request);
	console.log("got movie details: ", response.data)
	return response;
}

export const getMoviesNew = async (form, page, limit, token) => {
	console.log("Getting list of movies");
	console.log("token = ", token)
	var genre = ""
	var category = ""
	if (form.genre) {
		genre = form.genre[0];
	}
	if (form.sort_category) {
		category = form.sort_category[0];
	}
	let request = {
		url: `http://127.0.0.1:8071/api/movies/search`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		},
        params: {
			"page" : page,
			"minimum_rating" : form.min_rating,
			"query_term" : form.title,
			"genre" : genre,
			"sort_by" : category,
			'quality' : form.quality,
			'order_by' : form.order_by,
			"limit"   : limit,
		}
	};

	const response = await axios(request);
	console.log("response dans front: ", response)
	return response;
}

// JUST A TEST
export const get_all_movies = async (source, page) => {
	console.log("Getting all movies from : ", source);
	let request = {
		url: `http://127.0.0.1:8071/api/movies/populate`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json"
		},
        params: {
			"source" : source,
			"page"   : page,
		}
	};

	const response = await axios(request);
	return response;
}


const get_resquest = async(url, params) => {
	let request = {
		url: url,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
		},
        params: params
	}
	const response = await axios(request);
	return response;
}

export const parseImage = async (movie) => {
	console.log("checking image disponibility")
	const response = await get_resquest(movie.large_cover_image, {})
	if (response.data.includes("<html>\n<head><title>404 Not Found")) {
		const res = await get_resquest(movie.medium_cover_image, {})
		if (res.data.includes("<html>\n<head><title>404 Not Found")) {
			console.log("Returnning replacement: ", movie.title)
			movie.large_cover_image = "../src/assets/missing_cover.jpeg"
			return
		}
		console.log("Returnning mdeium: ", movie.title)
		movie.large_cover_image = movie.medium_cover_image
		return
	}
	return;
}


function parse_category(cat_name, old_list, new_list, index) {
	try {
		new_list[index][cat_name] = old_list[index][cat_name]
		if (cat_name == 'genres'){
			new_list[index][cat_name] = old_list[index][cat_name][0]
		}
	}
	catch(e) {
		console.log("Error in category: ", cat_name, " for movie:");
		new_list[index][cat_name] = ''
	}

}


export function parseMovies(movies) {
	if (!movies) {
		return []
	}
	const no_duplicates = movies.filter((movies, index, self) =>
    						index === self.findIndex((t) => (t.id === movies.id)))
	var parsed_movies =  Object.assign([], no_duplicates);
	var cat_names = ['title', 'year', 'slug', 'rating', 'runtime', 'genres', 'large_cover_image'];
	for (var index  in no_duplicates) {
		cat_names.forEach((cat_name, i) => parse_category(cat_name, no_duplicates, parsed_movies, index));
	}
	return parsed_movies
}