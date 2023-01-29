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

        search_movies : async (searching_user_id, query_term, minimum_rating, genre, quality, min_year, max_year, language, order_by, asc_or_desc) => {
            order_by       = order_by       ? order_by       : 'max_seeds'
            asc_or_desc    = asc_or_desc    ? asc_or_desc    : 'ASC'
            genre          = genre          ? genre          : '%',
            quality        = quality        ? quality        : '%',
            minimum_rating = minimum_rating ? minimum_rating : 0,
            min_year       = min_year       ? min_year       : 0,
            max_year       = max_year       ? max_year       : 10000,
            language       = language       ? language       : '%',
            query_term     = query_term     ? query_term     : ''

            console.log("Searching movies: ", {
                query_term    : query_term,
                minimum_rating: minimum_rating ,
                genre         : genre ,
                min_year      : min_year,
                max_year      : max_year,
                quality       : quality ,
                order_by      : order_by,
                asc_or_desc   : asc_or_desc
            })
            try {
                let [movies, ] = await db_pool.query(`
                WITH 
                    genres_agg AS (SELECT movie_id, json_arrayagg(genres.name) as genres_list from genres GROUP BY movie_id)
                SELECT movies.id, yts_id, imdb_code, title, imdb_rating, year, length_minutes, language, summary, genres_list, MAX(torrents.seeds) as max_seeds, MAX(t.quality) as max_quality
                    FROM movies
                
                    INNER JOIN genres
                        ON movies.id = genres.movie_id
                        AND genres.name LIKE ?
                
                    INNER JOIN torrents
                        ON movies.id = torrents.movie_id
                        AND torrents.quality LIKE ?

                    LEFT JOIN torrents t
                        ON movies.id = t.movie_id
                        
                    LEFT JOIN favorite_movies
                        ON movies.id = favorite_movies.movie_id
                        AND favorite_movies.user_id = ?

                    LEFT JOIN genres_agg
                        ON movies.id = genres_agg.movie_id

                    WHERE imdb_rating >= ?
                        AND year >= ?
                        AND year <= ?
                        AND language LIKE ?
                        AND LOWER(title) LIKE LOWER('%${query_term}%')
                    GROUP BY movies.id, imdb_rating
                ORDER BY ${order_by} ${asc_or_desc};
                `, [genre          ? genre          : '%',
                    quality        ? quality        : '%',
                    searching_user_id,
                    minimum_rating ? minimum_rating : 0,
                    min_year       ? min_year       : 0,
                    max_year       ? max_year       : 10000,
                    language       ? language       : '%'])
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

        set_watched: async (user_id, movie_id) => {
            console.log("Setting movie %d watched by user %d.", movie_id, user_id)
            try {
                let [insert_res, ] = await db_pool.query(`
                    INSERT INTO watched_movies (movie_id, user_id)
                    VALUES (?, ?)
                `, [movie_id, user_id])
                console.log("Insert result: ", insert_res)
                return insert_res;
            }
            catch (e) {
                throw (e)
            }
        }
    }
}