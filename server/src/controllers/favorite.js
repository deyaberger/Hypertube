const axios = require('axios')

module.exports = (db_pool) => {
    return {
        get_favorites_by_user_id: async (my_user_id, other_user_id) => {
            if (other_user_id == null) {
                other_user_id = my_user_id
            }
            console.log("\n[favorite]: get_favorites_by_user_id ", {my_user_id, other_user_id})
            const request = `
            SELECT
                movies.id,
                title,
                imdb_rating,
                year,
                length_minutes,
                language,
                summary,
                max_seeds,
                json_objectagg(IFNULL(images.size, ''), images.url) as images_list,
                NOT ISNULL(fm2.movie_id) as is_fav,
                NOT ISNULL(wm2.movie_id) as is_watched
            FROM movies
            LEFT JOIN favorite_movies fm1
                ON movies.id = fm1.movie_id
                AND fm1.user_id = ${other_user_id}
            LEFT JOIN watched_movies wm1
                ON movies.id = wm1.movie_id
                AND wm1.user_id = ${other_user_id}
            LEFT JOIN favorite_movies fm2
                ON movies.id = fm2.movie_id
                AND fm2.user_id = ${my_user_id}
            LEFT JOIN watched_movies wm2
                ON movies.id = wm2.movie_id
                AND wm2.user_id = ${my_user_id}
            LEFT JOIN images
                ON movies.id = images.movie_id
            WHERE NOT ISNULL(fm1.user_id)
            GROUP BY movies.id, title, imdb_rating, year, length_minutes, language, summary, max_seeds;`
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