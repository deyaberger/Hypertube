const { buildPatchQuery, buildPatchArgs } = require('../utils/update_args')
const transform_csv_lists_to_arrays       = require("../utils/group_concat_formatter")

module.exports = (db_pool) => {
    return {
        get_user_by_id: async (userid) => {
            try {
                [users, ] = await db_pool.query(`
                WITH aggregate_genres as (SELECT user_id, JSON_ARRAYAGG(movie_id) as watched_movies
                    from watched_movies
                    group by user_id)
                SELECT users.id, first_name, last_name, mail, language, picture, username, bio, JSON_ARRAYAGG(fm.movie_id) as favorite_movies, watched_movies, 361 as followers, 420 as followed
                FROM users
                LEFT JOIN aggregate_genres wm
                    on users.id = wm.user_id
                LEFT JOIN favorite_movies fm
                    on users.id = fm.user_id
                WHERE users.id=?;`,
                userid)
                if (users.length == 1) {
                    return users[0]
                }

            }
            catch(e) {
                throw(e)
            }
        },

        update_user_info: async(user_id, update) => {
            let update_string = buildPatchQuery('users' , update)
            let update_args   = buildPatchArgs (user_id , update)

            let [update_result, ] = await db_pool.query(update_string, update_args)

            return update_result
        },

        update_firstname: async(user_id, firstname) => {
            console.log("in update first_name");
            try {
                let [update_result, ] = await db_pool.query(`
                update users
                set first_name = ?
                where id = ?
                `, [firstname, user_id])
                return update_result
            }
            catch(e) {
                throw (e)
            }
        },
        update_lastname: async(user_id, lastname) => {
            console.log("in update last_name");
            try {
                let [update_result, ] = await db_pool.query(`
                update users
                set last_name = ?
                where id = ?
                `, [lastname, user_id])
                return update_result
            }
            catch(e) {
                throw (e)
            }
        },
        update_user_bio: async(user_id, bio) => {
            console.log("in update bio");
            try {
                let [update_result, ] = await db_pool.query(`
                update users
                set bio = ?
                where id = ?
                `, [bio, user_id])
                console.log("update_result", update_result)
                return update_result
            }
            catch(e) {
                throw (e)
            }
        },
        update_user_email: async(user_id, email) => {
            console.log("in update email");
            try {
                let [update_result, ] = await db_pool.query(`
                update users
                set mail = ?
                where id = ?
                `, [email, user_id])
                console.log("update_result", update_result)
                return update_result
            }
            catch(e) {
                throw (e)
            }
        },



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