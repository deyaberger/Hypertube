const axios = require('axios')

module.exports = (db_pool) => {
    return {

        get_movies_recommendations: async (user_id) => {
            console.log("\n[movie]: getting reco")
            const request = `
            WITH aggregate_genres as (SELECT movie_id, JSON_ARRAYAGG(name) as genres_list
                FROM genres
                GROUP BY movie_id)
            SELECT
                movies.id,
                yts_id,
                imdb_code,
                title,
                imdb_rating,
                year,
                length_minutes,
                language,
                summary,
                genres_list,
                json_objectagg(IFNULL(images.size, ''), images.url) as images_list,
                NOT ISNULL(fm.movie_id) as is_fav,
                NOT ISNULL(wm.movie_id) as is_watched
            FROM movies
            LEFT JOIN aggregate_genres
                ON movies.id = aggregate_genres.movie_id
            LEFT JOIN images
                ON movies.id = images.movie_id
            LEFT JOIN favorite_movies fm
                ON movies.id = fm.movie_id
                AND fm.user_id = ${user_id}
            LEFT JOIN watched_movies wm
                ON movies.id = wm.movie_id
                AND wm.user_id = ${user_id}
            GROUP BY movies.id, yts_id, imdb_code, title, imdb_rating, year, length_minutes, language, summary, genres_list
            ORDER BY movies.imdb_rating DESC
            LIMIT 24 OFFSET 0
            `
            try {
                let [movies, ] = await db_pool.query(request)
                return movies;
            }
            catch (e) {
                throw (e)
            }
        },

        search_movies : async (user_id, query_term, minimum_rating, genre, quality, min_year, max_year, language, asc_or_desc, sort_by) => {
            // DONT FORGET TO REMOVE THE OFFSET !!!
            user_id        = user_id
            sort_by        = sort_by        ? sort_by        : 'max_seeds'
            asc_or_desc    = asc_or_desc    ? asc_or_desc    : 'ASC'
            genre          = genre          ? genre          : '%',
            quality        = quality        ? quality        : '%',
            minimum_rating = minimum_rating ? minimum_rating : 0,
            min_year       = min_year       ? min_year       : 0,
            max_year       = max_year       ? max_year       : 10000,
            language       = language       ? language       : '%',
            query_term     = query_term     ? query_term     : ''

            console.log("\n[movie]: getting search results: ", {user_id, query_term, minimum_rating, genre, min_year, max_year, quality, sort_by, asc_or_desc})
            const request = `
            WITH aggregate_genres as (SELECT movie_id, JSON_ARRAYAGG(name) as genres_list from genres group by movie_id),
                aggregate_quality as (SELECT movie_id, JSON_ARRAYAGG(quality) as quality_list from torrents group by movie_id)
            SELECT
                movies.id,
                yts_id,
                imdb_code,
                title,
                imdb_rating,
                year,
                length_minutes,
                language,
                summary,
                genres_list,
                quality_list,
                json_objectagg(IFNULL(images.size, ''), images.url) as images_list,
                NOT ISNULL(fm.movie_id) as is_fav,
                NOT ISNULL(wm.movie_id) as is_watched,
                MAX(t.seeds) as max_seeds
            FROM movies
            INNER JOIN genres
                ON movies.id = genres.movie_id
                AND genres.name LIKE '${genre}'
            INNER JOIN torrents
                ON movies.id = torrents.movie_id
                AND torrents.quality >= ${quality}
            LEFT JOIN torrents t
                ON movies.id = t.movie_id
            LEFT JOIN aggregate_genres
                ON movies.id = aggregate_genres.movie_id
            LEFT JOIN aggregate_quality
                ON movies.id = aggregate_quality.movie_id
            LEFT JOIN favorite_movies fm
                ON movies.id = fm.movie_id
                AND fm.user_id = ${user_id}
            LEFT JOIN watched_movies wm
                ON movies.id = wm.movie_id
                AND wm.user_id = ${user_id}
            LEFT JOIN images ON movies.id = images.movie_id
            WHERE imdb_rating >= ${minimum_rating}
                AND year >= ${min_year}
                AND LOWER(title) LIKE LOWER('%${query_term}%')
            GROUP BY movies.id
            ORDER BY ${sort_by} ${asc_or_desc}
            LIMIT 26 OFFSET 0`
            try {
                let [movies, ] = await db_pool.query(request)
                return movies;
            }
            catch (e) {
                throw (e)
            }
        },

        get_movie_details: async (movie_id, user_id) => {
            console.log("\n[movie]: getting movie details: ", movie_id)
            const request = `
            WITH aggregate_genres as (SELECT movie_id, JSON_ARRAYAGG(name) as genres_list
                from genres
                group by movie_id)
            SELECT movies.id,
                yts_id,
                imdb_code,
                title,
                imdb_rating,
                year,
                length_minutes,
                language,
                summary,
                genres_list,
                json_objectagg(IFNULL(images.size, ''), images.url) as images_list,
                director,
                actors,
                NOT ISNULL(fm.movie_id) as is_fav,
                NOT ISNULL(wm.movie_id) as is_watched
            FROM movies
                LEFT JOIN aggregate_genres
                    ON movies.id = aggregate_genres.movie_id
                LEFT JOIN images
                    ON movies.id = images.movie_id
                LEFT JOIN favorite_movies fm
                    ON movies.id = fm.movie_id
                    AND fm.user_id = ${user_id}
                LEFT JOIN watched_movies wm
                    ON movies.id = wm.movie_id
                    AND wm.user_id = ${user_id}
            WHERE movies.id = ${movie_id}
            GROUP BY movies.id`
            try {
<<<<<<< HEAD
                let [insert_res, ] = await db_pool.query(request)
=======
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
                WITH
                aggregate_genres as (
                    SELECT
                        movie_id,
                        JSON_ARRAYAGG(name) as genres_list
                    FROM
                        genres
                    GROUP BY movie_id
                )
                SELECT 
                    movies.id,
                    yts_id,
                    imdb_code,
                    title,
                    imdb_rating,
                    year,
                    length_minutes,
                    language,
                    summary,
                    genres_list,
                    json_objectagg(IFNULL(images.size, ''), images.url) as images_list
                FROM movies
                    LEFT JOIN aggregate_genres ON movies.id = aggregate_genres.movie_id
                    LEFT JOIN images ON movies.id = images.movie_id
                WHERE movies.id = ?
                GROUP BY movies.id
                `, [movie_id])
>>>>>>> main
                return insert_res;
            }
            catch (e) {
                throw (e)
            }
        }

    }
}