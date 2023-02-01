const { buildPatchQuery, buildPatchArgs } = require('../utils/update_args')
const transform_csv_lists_to_arrays       = require("../utils/group_concat_formatter")

module.exports = (db_pool) => {
    return {
        get_user_by_id: async (userid) => {
            [users, ] = await db_pool.query(`
            WITH aggregate_genres as (SELECT user_id, JSON_ARRAYAGG(movie_id) as watched_movies
                from watched_movies
                group by user_id)
            SELECT users.id, first_name, last_name, mail, language, picture, username, bio, JSON_ARRAYAGG(fm.movie_id) as favorite_movies, watched_movies
            FROM users
            LEFT JOIN aggregate_genres wm
                on users.id = wm.user_id
            LEFT JOIN favorite_movies fm
                on users.id = fm.user_id
            WHERE users.id=?;`,
            userid)
            if (users.length == 1) {
                // transform_csv_lists_to_arrays(users[0], ['watched_movies'])
                return users[0]
            }
            return null
        },

        update_user_info: async(user_id, update) => {
            let update_string = buildPatchQuery('users' , update)
            let update_args   = buildPatchArgs (user_id , update)

            let [update_result, ] = await db_pool.query(update_string, update_args)

            return update_result
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
    }
}