import axios from "axios"

export const getAllMovies = async () => {
	console.log("Getting basic movies")
	let request = {
		url: "https://yts.torrentbay.to/api/v2/list_movies.json",
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
		},
        params: {
			"minimum_rating" : 8,
			"quality"        : "1080p",
			"sort_by"        : "download_count",
			"order_by"       : "desc"
        }
	};

	const response = await axios(request);
	return response;
}

export const getMovies = async (form, page) => {
	console.log("Getting specific research")
	let request = {
		url: "https://yts.torrentbay.to/api/v2/list_movies.json",
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
		},
        params: {
			"page" : page,
			"minimum_rating" : form.min_rating,
			"query_term" : form.title,
			"genre" : form.genre[0],
			"sort_by" : form.sort_category[0],
			'quality' : form.quality,
			'order_by' : form.order_by
        }
	};

	const response = await axios(request);
	console.log("got response")
	return response;
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
		console.log(old_list[index]);
		new_list[index][cat_name] = ''
	}

}


export function parseMovies(movies) {
	const no_duplicates = movies.filter((movies, index, self) =>
    						index === self.findIndex((t) => (t.id === movies.id)))
	var parsed_movies =  Object.assign({}, no_duplicates);
	var cat_names = ['title', 'year', 'slug', 'rating', 'runtime', 'genres', 'large_cover_image'];
	for (var index  in no_duplicates) {
		cat_names.forEach((cat_name, i) => parse_category(cat_name, no_duplicates, parsed_movies, index));
	}
	return no_duplicates
}