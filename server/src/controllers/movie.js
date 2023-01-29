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

        search_movies : async (query_term, minimum_rating, genre, quality, min_year, max_year, language, order_by, asc_or_desc) => {
            console.log("Searching movies: ", {
                query_term    : query_term,
                minimum_rating: minimum_rating ,
                genre         : genre ,
                quality       : quality ,
                order_by      : order_by,
                asc_or_desc   : asc_or_desc
            })
            order_by ? order_by : 'max_seeds'
            asc_or_desc ? asc_or_desc : 'ASC'
            try {
                let [movies, ] = await db_pool.query(`
                SELECT movies.id, yts_id, imdb_code, title, imdb_rating, year, length_minutes, language, summary, MAX(torrents.seeds) as max_seeds
                    FROM movies
                
                    INNER JOIN genres
                        ON movies.id = genres.movie_id
                        AND genres.name LIKE ?
                
                    LEFT JOIN torrents
                        ON movies.id = torrents.movie_id
                        AND torrents.quality LIKE ?
                
                    WHERE imdb_rating >= ?
                        AND year >= ?
                        AND year <= ?
                        AND language = ?
                        AND LOWER(title) LIKE LOWER('%?%')
                    GROUP BY movies.id
                ORDER BY ${order_by} ${asc_or_desc}
                `, [genre          ? genre          : '%',
                    quality        ? quality        : '%',
                    minimum_rating ? minimum_rating : 0,
                    min_year       ? min_year       : 0,
                    max_year       ? max_year       : 10000,
                    language       ? language       : '%',
                    query_term     ? query_term     : ''])
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
                select movies.id, yts_id, imdb_code, title, imdb_rating, year, length_minutes, language, summary, json_objectagg(IFNULL(images.size, ''), images.url) as movie_images
                FROM movies LEFT JOIN images
                    ON movies.id = images.movie_id
                GROUP BY movies.id
                `)
                return movies;
            }
            catch (e) {
                throw (e)
            }
        },
    }
}