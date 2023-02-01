const axios = require('axios')

module.exports = (db_pool) => {
    return {
        get_all_favorites: async (userid) => {
            [favorites, ] = await db_pool.query(`
            WITH aggregate_genres as (SELECT movie_id, JSON_ARRAYAGG(name) as genres_list from genres group by movie_id)
            SELECT movies.id, yts_id, imdb_code, title, imdb_rating, year, length_minutes, language, summary, genres_list, json_objectagg(IFNULL(images.size, ''), images.url) as images_list
            FROM movies
                LEFT JOIN aggregate_genres ON movies.id = aggregate_genres.movie_id
            RIGHT join favorite_movies
            ON movies.id = favorite_movies.movie_id
            LEFT JOIN images ON movies.id = images.movie_id
            WHERE favorite_movies.user_id = ?
            GROUP BY movies.id`,
            userid)
            return favorites
        },
        is_favorite_movie: async (userid, movie_id) => {
            [is_fav, ] = await db_pool.query(`
            SELECT COUNT(movies.id) as is_fav
            FROM movies
                RIGHT join favorite_movies
                ON movies.id = favorite_movies.movie_id
            WHERE favorite_movies.user_id = ?
            AND movie_id = ?`,
            [userid, movie_id])
            if (is_fav.length == 1) {
                return is_fav[0]
            }
            return is_fav
        }
    }
}