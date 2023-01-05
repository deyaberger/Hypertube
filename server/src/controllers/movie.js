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


const post_movie = async (db_pool, movie_imdb_id, title, imbd_rate, release_year, genre, cover_image) => {
	[movie, ] = await db_pool.query("\
	INSERT INTO movies_info (movie_imdb_id, title, imbd_rate, release_year, genre, cover_image) \
	VALUES               (?       ,?              ,?  ,?, ?, ?           );",
	[movie_imdb_id, title, imbd_rate, release_year, genre, cover_image])

	return movie
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




		search_all_movies : async (source, page_nb) => {
			let url = null;
            let response = null;
			if (source == "yts") {
                console.log("Fetching movies from YTS, page:", page_nb)
				url = "https://yts.torrentbay.to/api/v2/list_movies.json"
            }
            var fs = require('fs');
            let request = create_request(url, {"page" : page_nb});
            try {
                response = await axios(request);
                response = response.data.data;
                var file_path = "./src/yts_response/yts_page" + page_nb + ".json"
                fs.writeFile(file_path, JSON.stringify(response), function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            catch(e) {
                let data_to_append = JSON.stringify({"page_nb" : page_nb, "type" : "req error", "msg" : e, "res" : response})
                fs.appendFile('./src/yts_response/log.txt', data_to_append, function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                  });
            }

            return (response)
        },

        parse_movie_data : (data) => {
            var yts_id = data.hasOwnProperty("id") ? data.id : null;
            var imbd_code = data.hasOwnProperty("imdb_code") ? data.imdb_code : null;
            var title = data.hasOwnProperty("title") ? data.title : null;
            var imbd_rate = data.hasOwnProperty("imbd_rate") ? data.imbd_rate : 0;
            var year = data.hasOwnProperty("year") ? data.year : null;
            var runtime = data.hasOwnProperty("runtime") ? data.runtime : 0;
            var language = data.hasOwnProperty("language") ? data.language : "eng";
            var summary = data.hasOwnProperty("summary") ? data.summary : "Summary unavailable";
            var image_1 = data.hasOwnProperty("image_1") ? data.image_1 : null;
            var image_2 = data.hasOwnProperty("image_2") ? data.image_2 : null;
            var image_3 = data.hasOwnProperty("image_3") ? data.image_3 : null;

        },

        post_movie : async (yts_id, imbd_code, title, imbd_rate, year, time_minute, language, summary, image_1, image_2, image_3) => {
            [movie, ] = await db_pool.query("\
            INSERT INTO movies_info ((id, yts_id, imbd_code, title, imbd_rate, year, time_minute, language, summary, image_1, image_2, image_3)) \
            VALUES               (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [(yts_id, imbd_code, title, imbd_rate, year, time_minute, language, summary, image_1, image_2, image_3)])

            return movie
        },

        put_json_to_db : (source, page_nb) => {
            let prefix = null;
            let data = null;
            var fs = require('fs');
			if (source == "yts") {
                console.log("Adding data to DB, page:", page_nb)
				prefix = "./src/yts_response/yts_page"
                file_path = prefix + page_nb + ".json"
                fs.readFile(file_path, 'utf8', function(err, data){
                        data = JSON.parse(data)
                        for (let movie in data.movies) {
                            movie_res =  post_movie(movie)
                        }
                        // data = JSON.stringify(data, null, 4)
                        console.log("DATA read from file: ", data)
                });
            }
            return (data)
        }

    }
}