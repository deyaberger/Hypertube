module.exports = (db_pool) => {
    return {
        get_watched_by_user_id: async (userid) => {
            console.log("\n[watched]: getting watched movies by user id: ", userid)
            try {
                [watched, ] = await db_pool.query(`
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
                WHERE wm.user_id = ${userid}
                GROUP BY movies.id`,
                userid)
                return watched
            }
            catch(e) {
                throw(e)
            }

        },
        // get_watched_ids: async (userid) => {
        //     console.log("in get wathced ids");
        //     [watched, ] = await db_pool.query(`
        //     SELECT movie_id
        //     from watched_movies
        //     WHERE user_id = ?`,
        //     userid)
        //     return watched
        // },
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
        // is_watched_movie: async (userid, movie_id) => {
        //     [watched, ] = await db_pool.query(`
        //     SELECT 1
        //     from watched_movies
        //     WHERE user_id = ? AND movie_id = ?`,
        //     [userid, movie_id])
        //     if (watched.length == 1) {
        //         return true
        //     }
        //     return false
        // }
    }
}