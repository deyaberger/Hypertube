const axios = require('axios')
const { remove_duplicates: remove_duplicates } = require('../utils/parse_movies')

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
            console.log("Searching movies: ", {
                query_term    : query_term,
                minimum_rating: minimum_rating ,
                genre         : genre ,
                quality       : quality ,
                sort_by       : sort_by ,
                page          : page ,
                limit         : limit ,
                order_by      : order_by
            })
            try {
                let [movies, ] = await db_pool.query(`
                SELECT id, yts_id, imdb_code, title, imdb_rating, year, length_minutes, language, summary
                    FROM movies
                ORDER BY imdb_rating DESC
                `)
                return movies;
            }
            catch (e) {
                throw (e)
            }
        },

        get_movies_homepage: async () => {
            console.log("Getting movies homepage")
            try {
                let [movies, ] = await db_pool.query(`
                WITH aggregate_genres as (SELECT movie_id, JSON_ARRAYAGG(name) as genres_list
                    from genres
                    group by movie_id)
                SELECT movies.id, yts_id, imdb_code, title, imdb_rating, year, length_minutes, language, summary, genres_list, json_objectagg(IFNULL(images.size, ''), images.url) as images_list
                FROM movies
                    LEFT JOIN aggregate_genres ON movies.id = aggregate_genres.movie_id
                    LEFT JOIN images ON movies.id = images.movie_id
                GROUP BY movies.id
                ORDER BY movies.imdb_rating DESC
                `)
                return movies;
            }
            catch (e) {
                throw (e)
            }
        },
    }
}