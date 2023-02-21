module.exports = (db_pool) => {
    return {
        get_user_followings: async (userid) => {
            try {
                [users, ] = await db_pool.query(`
                SELECT count(*) as following
                from follows
                WHERE follower_id = ?;`,
                userid)
                if (users.length == 1) {
                    return users[0]
                }
            }
            catch(e) {
                throw(e)
            }
        },
        get_user_followers: async (userid) => {
            try {
                [users, ] = await db_pool.query(`
                SELECT count(*) as followers
                from follows
                WHERE followed_id = ?;`,
                userid)
                if (users.length == 1) {
                    return users[0]
                }
            }
            catch(e) {
                throw(e)
            }
        },
        is_following_user: async (follower_id, followed_id) => {
            [following, ] = await db_pool.query(`
            SELECT 1
            from follows
            WHERE follower_id = ? AND followed_id = ?`,
            [follower_id, followed_id])
            if (following.length == 1) {
                return true
            }
            return false
        },
        follow_user: async (follower_id, followed_id) => {
            [add, ] = await db_pool.query(`
            insert into follows (follower_id, followed_id)
            values (?, ?);`,
            [follower_id, followed_id])
            return add
        },
        unfollow_user: async (follower_id, followed_id) => {
            [remove, ] = await db_pool.query(`
            delete
            from follows
            where follower_id = ? AND followed_id = ?;`,
            [follower_id, followed_id])
            return remove
        }
    }
}