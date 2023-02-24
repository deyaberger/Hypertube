const axios = require('axios')
const { remove_duplicates: remove_duplicates } = require('../utils/parse_movies')

module.exports = (db_pool) => {
    return {
        search_movies : async (query_term, minimum_rating, genre, quality, min_year, max_year, language, asc_or_desc, sort_by) => {
            sort_by        = sort_by        ? sort_by        : 'max_seeds'
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
                sort_by       : sort_by,
                asc_or_desc   : asc_or_desc
            })
            try {
                let [movies, ] = await db_pool.query(`
                WITH aggregate_genres as (SELECT movie_id, JSON_ARRAYAGG(name) as genres_list from genres group by movie_id),
                    aggregate_quality as (SELECT movie_id, JSON_ARRAYAGG(quality) as quality_list from torrents group by movie_id)
                SELECT movies.id, yts_id, imdb_code, title, imdb_rating, year, length_minutes, language, summary, genres_list, json_objectagg(IFNULL(images.size, ''), images.url) as images_list, MAX(t.seeds) as max_seeds, quality_list
                    FROM movies
                    INNER JOIN genres
                        ON movies.id = genres.movie_id
                        AND genres.name LIKE ?
                    INNER JOIN torrents
                        ON movies.id = torrents.movie_id
                        AND torrents.quality >= ?
                    LEFT JOIN torrents t
                        ON movies.id = t.movie_id
                    LEFT JOIN aggregate_genres ON movies.id = aggregate_genres.movie_id
                    LEFT JOIN aggregate_quality ON movies.id = aggregate_quality.movie_id
                    LEFT JOIN images ON movies.id = images.movie_id
                    WHERE imdb_rating >= ?
                        AND year >= ?
                        AND LOWER(title) LIKE LOWER('%${query_term}%')
                GROUP BY movies.id
                ORDER BY ${sort_by} ${asc_or_desc}
                LIMIT 26 OFFSET 0
                `, [genre          ? genre          : '%',
                    quality        ? quality        : '%',
                    minimum_rating ? minimum_rating : '%',
                    min_year       ? min_year       : '%'])
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
                LIMIT 24 OFFSET 0
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
        },

        get_movie: async (movie_id) => {
            console.log("Getting movie %d", movie_id)
            try {
                let [insert_res, ] = await db_pool.query(`
                WITH aggregate_genres as (SELECT movie_id, JSON_ARRAYAGG(name) as genres_list
                    from genres
                    group by movie_id)
                SELECT movies.id, yts_id, imdb_code, title, imdb_rating, year, length_minutes, language, summary, genres_list, json_objectagg(IFNULL(images.size, ''), images.url) as images_list, director, actors
                FROM movies
                    LEFT JOIN aggregate_genres ON movies.id = aggregate_genres.movie_id
                    LEFT JOIN images ON movies.id = images.movie_id
                WHERE movies.id = ?
                GROUP BY movies.id
                `, [movie_id])
                return insert_res;
            }
            catch (e) {
                throw (e)
            }
        }

    }
}