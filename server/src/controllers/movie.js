const axios = require('axios')
const { remove_duplicates: remove_duplicates } = require('../utils/parse_movies')

const create_request = (url, params) => {
	let request = {
		url: url,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
		},
		params: params
	}
	return request;
}

module.exports = (db_pool) => {
    return {
        get_movie_by_yts_id: async (yts_movie_id) => {
            console.log("Getting specific movie")
            let request = {
                url: "https://yts.torrentbay.to/api/v2/movie_details.json",
                method: "get",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "Content-type" : "application/json",
                },
                params: {
                    "movie_id"    : yts_movie_id,
                    "with_images" : true,
                    "with_cast"   : true,
                }
            };
        
            const response = await axios(request);
            return response;
        },

        get_movie_by_imdb_id : async (imdb_id) => {
            console.log("Getting specific movie details")
            let request = {
                url: "https://yts.torrentbay.to/api/v2/movie_details.json",
                method: "get",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "Content-type"               : "application/json",
                    "Accept-Encoding"            : "gzip,deflate,compress"
                },
                params: {
                    "imdb_id"     : imdb_id,
                    "with_images" : true,
                    "with_cast"   : true,
                }
            };
            console.log("lol")
            const response = await axios(request);
            console.log("lil")
            console.log("got movie details: ", response)
            console.log("lil")

            return response;
        },
        
        search_movies : async (query_term, minimum_rating, genre, quality, sort_by, page, limit, order_by) => {
            let request = {
                url: "https://yts.torrentbay.to/api/v2/list_movies.json",
                method: "get",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "Content-type"               : "application/json",
                    "Accept-Encoding"            : "gzip,deflate,compress"
                },
                params: {
                    "query_term"    : query_term,
                    "minimum_rating": minimum_rating,
                    "genre"         : genre,
                    "quality"       : quality,
                    "sort_by"       : sort_by,
                    "page"          : page,
                    "limit"         : limit,
                    "order_by"      : order_by
                }
            };

            let response = await axios(request);
			console.log("THIS IS THE RESPNSE: ", response)
            response = response.data.data

            if (response.movies == undefined || response.movies.length == 0) {
                response.movies = []
            }

            response.movies = remove_duplicates(response.movies);

            return response;
        },


		search_all_movies : async (source) => {
			console.log("loooooool")
			let url = null;
			if (source == "yts") {
				url = "https://yts.torrentbay.to/api/v2/list_movies.json"            
            }
			let page_nb = 1;
			let count = 0;
			let total = 0;
			while (page_nb < 3) {
				let request = create_request(url, {"page" : page_nb});
				console.log("REQUEST = ", request)
				let response = await axios(request);
				count += response.data.data.movies.length;
				total = response.data.data.movie_count;
				page_nb += 1;
			}
			response = {"total" : total, "pages_done" : page_nb, "count" : count}
            return response;
        }
    }
}