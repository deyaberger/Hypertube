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

export const getMovies = async (form) => {
	console.log("Getting specific research")
	console.log(form)
	let request = {
		url: "https://yts.torrentbay.to/api/v2/list_movies.json",
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
		},
        params: {
			"page" : 1,
			"minimum_rating" : form.rating_interval[0],
			"query_term" : form.title,
			"genre" : form.genre,
        }
	};

	const response = await axios(request);
	return response;
}

export function parseMovies(movies) {
	const no_duplicates = movies.filter((movies, index, self) =>
    						index === self.findIndex((t) => (t.id === movies.id)))
	return no_duplicates
}