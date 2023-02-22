module.exports = (db_pool) => {
    return {
        get_watched: async (userid) => {
            console.log("in get wathced");
            [watched, ] = await db_pool.query(`
            WITH aggregate_genres as (SELECT movie_id, JSON_ARRAYAGG(name) as genres_list from genres group by movie_id)
            SELECT movies.id, yts_id, imdb_code, title, imdb_rating, year, length_minutes, language, summary, genres_list, json_objectagg(IFNULL(images.size, ''), images.url) as images_list
            FROM movies
                LEFT JOIN aggregate_genres ON movies.id = aggregate_genres.movie_id
            RIGHT join watched_movies
            ON movies.id = watched_movies.movie_id
            LEFT JOIN images ON movies.id = images.movie_id
            WHERE watched_movies.user_id = ?
            GROUP BY movies.id`,
            userid)
            return watched
        },
        get_watched_ids: async (userid) => {
            console.log("in get wathced ids");
            [watched, ] = await db_pool.query(`
            SELECT movie_id
            from watched_movies
            WHERE user_id = ?`,
            userid)
            return watched
        },
        post_watched: async (userid, movie_id) => {
            [added, ] = await db_pool.query(`
            INSERT into watched_movies (user_id, movie_id)
            values (?, ?)`,
            [userid, movie_id])
            if (added.length == 1) {
                return added[0]
            }
            return added
        },
        delete_watched: async (userid, movie_id) => {
            [removed, ] = await db_pool.query(`
            DELETE from watched_movies
            WHERE user_id = ? AND movie_id = ?`,
            [userid, movie_id])
            if (removed.length == 1) {
                return removed[0]
            }
            return removed
        },
        is_watched_movie: async (userid, movie_id) => {
            [watched, ] = await db_pool.query(`
            SELECT 1
            from watched_movies
            WHERE user_id = ? AND movie_id = ?`,
            [userid, movie_id])
            if (watched.length == 1) {
                return true
            }
            return false
        }
    }
}