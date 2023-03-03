module.exports = (db_pool) => {
    return {

        count_users: async () => {
            let [count_users, ] = await db_pool.query(
                `SELECT count(*) as nb FROM users`
            )
            if (count_users.length > 0){
                return count_users[0]
            }
            return null
        },

        check_if_username_exists: async (username) => {
            let [check_username, ] = await db_pool.query(
                `SELECT * FROM users WHERE username = ?`, [username]
            )
            return check_username
        },

        // -------------------------------------- 42 --------------------------------------------------
        get_42_user_local_id: async (user_id_42) => {
            let [oauth_query, ] = await db_pool.query(
                `SELECT
                    user_id
                FROM oauth
                WHERE
                    42_id=?`,
                [user_id_42,]
            )
            if (oauth_query.length == 1) {
                return oauth_query[0].user_id
            }
            return null
        },

        insert_42_user: async (id_42, user_id) => {
            console.log("\n[auth]: insert_42_user ", {id_42, user_id})
            const request = `
            INSERT INTO oauth (42_id, user_id)
                VALUES        (${id_42}, ${user_id})
            `
            try {
                let [oauth_insert_res, ] = await db_pool.query(request)
                return oauth_insert_res
            }
            catch(e) {
                throw(e)
            }

        },

        // -------------------------------------- GITHUB --------------------------------------------------
        get_github_user_local_id: async (user_id_github) => {
            let [oauth_query, ] = await db_pool.query(
                `SELECT
                    user_id
                FROM oauth
                WHERE
                    github_id=?`,
                [user_id_github,]
            )
            if (oauth_query.length == 1) {
                return oauth_query[0].user_id
            }
            return null
        },

        insert_github_user: async (github_id, user_id) => {
            github_id = String(github_id)
            console.log("\n[auth]: insert_github_user ", {github_id, user_id})
            const request = `
            INSERT INTO oauth (github_id, user_id)
                VALUES        (${github_id},${user_id})
            `
            try {
                let [oauth_insert_res, ] = await db_pool.query(request)
                return oauth_insert_res
            }
            catch(e) {
                throw(e)
            }

        },


        // -------------------------------------- GOOGLE --------------------------------------------------
        get_google_user_local_id: async (user_id_google) => {
            let [oauth_query, ] = await db_pool.query(
                `SELECT
                    user_id
                FROM oauth
                WHERE
                    google_id=?`,
                [user_id_google,]
            )
            if (oauth_query.length == 1) {
                return oauth_query[0].user_id
            }
            return null
        },

        insert_google_user: async (google_id, user_id) => {
            google_id = String(google_id)
            console.log("\n[auth]: insert_google_user ", {google_id, user_id})
            const request = `
            INSERT INTO oauth (google_id, user_id)
                VALUES        (${google_id},${user_id})
            `
            try {
                let [oauth_insert_res, ] = await db_pool.query(request)
                return oauth_insert_res
            }
            catch(e) {
                throw(e)
            }

        },

        // -------------------------------------- GITLAB --------------------------------------------------
        get_gitlab_user_local_id: async (user_id_gitlab) => {
            let [oauth_query, ] = await db_pool.query(
                `SELECT
                    user_id
                FROM oauth
                WHERE
                    gitlab_id=?`,
                [user_id_gitlab,]
            )
            if (oauth_query.length == 1) {
                return oauth_query[0].user_id
            }
            return null
        },

        insert_gitlab_user: async (gitlab_id, user_id) => {
            gitlab_id = String(gitlab_id)
            console.log("\n[auth]: insert_gitlab_user ", {gitlab_id, user_id})
            const request = `
            INSERT INTO oauth (gitlab_id, user_id)
                VALUES        (${gitlab_id},${user_id})`
            try {
                let [oauth_insert_res, ] = await db_pool.query(request)
                return oauth_insert_res
            }
            catch(e) {
                throw(e)
            }

        },
    }
}