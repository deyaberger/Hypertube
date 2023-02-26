const axios = require('axios')

module.exports = (db_pool) => {
    return {
        get_favorites_by_user_id: async (userid) => {
            console.log("\n[favorite]: get_favorites_by_user_id ", userid)
            const request = `
            WITH aggregate_genres as (SELECT movie_id, JSON_ARRAYAGG(name) as genres_list from genres group by movie_id)
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
                LEFT JOIN favorite_movies fm
                    ON movies.id = fm.movie_id
                    AND fm.user_id = ${userid}
                LEFT JOIN watched_movies wm
                    ON movies.id = wm.movie_id
                    AND wm.user_id = ${userid}
                LEFT JOIN images
                    ON movies.id = images.movie_id
            WHERE fm.user_id = ${userid}
            GROUP BY movies.id`
            try {
                [favorites, ] = await db_pool.query(request)
                return favorites
            }
            catch(e) {
                throw(e)
            }

        },

        remove_favorite: async (userid, movie_id) => {
            console.log("\n[favorite]: remove_favorite ", {userid, movie_id})
            const request = `
            DELETE
            FROM favorite_movies
            WHERE user_id = ${userid} AND movie_id = ${movie_id}`
            try {
                [removed, ] = await db_pool.query(request)
                return removed
            }
            catch(e) {
                throw(e)
            }

        },

        add_favorite: async (userid, movie_id) => {
            console.log("\n[favorite]: add_favorite ", {userid, movie_id})
            const request = `
            INSERT into favorite_movies (user_id, movie_id)
            VALUES                    (${userid}, ${movie_id})`
            try {
                [added, ] = await db_pool.query(request)
                return added
            }
            catch(e) {
                throw (e)
            }

        }
    }
}