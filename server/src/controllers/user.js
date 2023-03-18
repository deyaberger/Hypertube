module.exports = (db_pool) => {
    return {
        get_all_users: async () => {
            console.log("[user]: get all users");
            const request =
            `
            SELECT
                id,
                username
            FROM users
            `
            try {
                [user, ] = await db_pool.query(request)
                return user
            }
            catch(e) {
                throw(e)
            }
        },

        get_my_user: async (userid) => {
            console.log("\n[user]: get_my_user: ", {userid});
            const request = `
            SELECT users.*,
                (SELECT COUNT(*) FROM follows WHERE follower_id = ${userid}) AS followings,
                (SELECT COUNT(*) FROM follows WHERE followed_id = ${userid}) AS followers
            FROM users
            WHERE users.id = ${userid}`
            try {
                [user, ] = await db_pool.query(request)
                return user
            }
            catch(e) {
                throw(e)
            }
        },

        get_user_by_id: async (userid) => {
            console.log("\n[user]: get_user_by_id: ", {userid});
            const request = `
            SELECT
                users.id,
                first_name,
                last_name,
                language,
                picture,
                username,
                bio,
                (SELECT COUNT(*) FROM follows WHERE follower_id = ${userid}) AS followings,
                (SELECT COUNT(*) FROM follows WHERE followed_id = ${userid}) AS followers
            FROM users
            WHERE users.id = ${userid}`
            try {
                [user, ] = await db_pool.query(request)
                return user
            }
            catch(e) {
                throw(e)
            }
        },

        get_user_by_id_back: async (userid) => {
            console.log("\n[user]: get_user_by_id: ", {userid});
            const request = 
            `
            SELECT
                users.id,
                first_name,
                last_name,
                language,
                picture,
                mail,
                username,
                bio
            FROM users
            WHERE users.id = ${userid}
            `
            try {
                [user, ] = await db_pool.query(request)
                return user
            }
            catch(e) {
                throw(e)
            }
        },

        update_username: async(user_id, username) => {
            console.log("\n[user]: update_username: ", {user_id, username});
            try {
                let [update_result, ] = await db_pool.query(`
                update users
                set username = ?
                where id = ?
                `, [username, user_id])
                return update_result
            }
            catch(e) {
                throw (e)
            }
        },

        update_firstname: async(user_id, firstname) => {
            console.log("\n[user]: update_firstname: ", {user_id, firstname});
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
            console.log("\n[user]: update_lastname ", {user_id, lastname});
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
            console.log("\n[user]: update_user_bio ", {user_id, bio});
            try {
                let [update_result, ] = await db_pool.query(`
                update users
                set bio = ?
                where id = ?
                `, [bio, user_id])
                return update_result
            }
            catch(e) {
                throw (e)
            }
        },

        update_user_email: async(user_id, email) => {
            console.log("\n[user]: update_user_bio ", {user_id, email});
            try {
                let [update_result, ] = await db_pool.query(`
                update users
                set mail = ?
                where id = ?
                `, [email, user_id])
                return update_result
            }
            catch(e) {
                throw (e)
            }
        }
    }
}