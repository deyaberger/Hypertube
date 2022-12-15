import axios from "axios"

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
			return "../src/assets/missing_cover.jpeg"
		}
		console.log("Returnning mdeium: ", movie.title)
		return movie.medium_cover_image
	}
	return movie.large_cover_image;
}


const parse_category = async (cat_name, old_list, new_list, index) => {
	try {
		new_list[index][cat_name] = old_list[index][cat_name]
		if (cat_name == 'genres'){
			new_list[index][cat_name] = old_list[index][cat_name][0]
			return new_list[index][cat_name]
		}
		else if (cat_name == "large_cover_image") {
			new_list[index][cat_name] = await parseImage(old_list[index])
			return new_list[index][cat_name]
		}
	}
	catch(e) {
		console.log("Error in category: ", cat_name, " for movie:");
		console.log(old_list[index]);
		new_list[index][cat_name] = ''
		return new_list[index][cat_name]
	}

}


export const parseMovies = async (movies) => {
	const no_duplicates = movies.filter((movies, index, self) =>
    						index === self.findIndex((t) => (t.id === movies.id)))
	var parsed_movies =  Object.assign({}, no_duplicates);
	var cat_names = ['title', 'year', 'slug', 'rating', 'runtime', 'genres', 'large_cover_image'];
	for (var index  in no_duplicates) {
		for (var i in cat_names) {
			parsed_movies[index][cat_names[i]] = await parse_category(cat_names[i], no_duplicates, parsed_movies, index)
		}
	}
	return no_duplicates
}