module.exports = (db_pool) => {
    return {
        get_watched_by_user_id: async (my_user_id, other_user_id) => {
            if (other_user_id == null) {
                other_user_id = my_user_id
            }
            console.log("\n[watched]: get_watched_by_user_id ", {my_user_id, other_user_id})
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
            WHERE NOT ISNULL(wm1.user_id)
            GROUP BY movies.id, title, imdb_rating, year, length_minutes, language, summary, max_seeds;`
            try {
                [watched, ] = await db_pool.query(request)
                return watched
            }
            catch(e) {
                throw(e)
            }
        },

        post_watched: async (userid, movie_id) => {
            console.log("\n[watched]: posting watched: ", {userid, movie_id})
            try {
                [added, ] = await db_pool.query(`
                INSERT into watched_movies (user_id, movie_id)
                values (?, ?)`,
                [userid, movie_id])
                return added
            }
            catch(e) {
                throw(e)
            }

        },

        delete_watched: async (userid, movie_id) => {
            console.log("\n[watched]: deleting watched: ", {userid, movie_id})
            try {
                [removed, ] = await db_pool.query(`
                DELETE from watched_movies
                WHERE user_id = ? AND movie_id = ?`,
                [userid, movie_id])
                return removed
            }
            catch(e) {
                throw(e)
            }

        }
    }
}