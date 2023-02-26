const { buildPatchQuery, buildPatchArgs } = require('../utils/update_args')

module.exports = (db_pool) => {
    return {
        get_my_user: async (userid) => {
            console.log("\n[user]: get_my_user ", userid)
            try {
                [users, ] = await db_pool.query(`
                SELECT
                    users.id,
                    first_name,
                    last_name,
                    mail,
                    language,
                    picture,
                    username,
                    bio

                FROM users
                WHERE users.id=?;`,
                userid)
                return users
            }
            catch(e) {
                throw(e)
            }
        },
        get_user_by_id: async (userid) => {
            try {
                [users, ] = await db_pool.query(`
                SELECT users.id, first_name, last_name, language, picture, username, bio, JSON_ARRAYAGG(fm.movie_id) as favorite_movies_ids, JSON_ARRAYAGG(wm.movie_id) as watched_movies_ids
                FROM users
                LEFT JOIN watched_movies wm
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
        }
    }
}