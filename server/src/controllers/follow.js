module.exports = (db_pool) => {
    return {
        get_user_followings: async (userid) => {
            console.log("\n[follow]: get_user_followings ", userid)
            const request = `
            SELECT count(*) as following
            FROM follows
            WHERE follower_id = ${userid};`
            try {
                [users, ] = await db_pool.query(request)
                if (users.length == 1) {
                    return users[0]
                }
                return null
            }
            catch(e) {
                throw(e)
            }
        },
        get_user_followers: async (userid) => {
            console.log("\n[follow]: get_user_followers ", userid)
            const request = `
            SELECT count(*) as followers
            FROM follows
            WHERE followed_id = ${userid};`
            try {
                [users, ] = await db_pool.query(request)
                if (users.length == 1) {
                    return users[0]
                }
                return null
            }
            catch(e) {
                throw(e)
            }
        },
        is_following_user: async (follower_id, followed_id) => {
            console.log("\n[follow]: is_following_user ", {follower_id, followed_id})
            const request = `
            SELECT 1
            FROM follows
            WHERE follower_id = ${follower_id}
                AND followed_id = ${followed_id};`
            try {
                [following, ] = await db_pool.query(request)
                if (following.length == 1) {
                    return true
                }
                return false
            }
            catch(e) {
                throw(e)
            }

        },

        follow_user: async (follower_id, followed_id) => {
            console.log("\n[follow]: follow_user ", {follower_id, followed_id})
            const request = `
            INSERT into follows (follower_id, followed_id)
            VALUES (${follower_id}, ${followed_id});`
            try {
                [add, ] = await db_pool.query(request)
                if (add.length == 1) {
                    return add[0]
                }
                return null
            }
            catch(e) {
                throw(e)
            }
        },

        unfollow_user: async (follower_id, followed_id) => {
            console.log("\n[follow]: unfollow_user ", {follower_id, followed_id})
            const request = `
            DELETE
            FROM follows
            WHERE follower_id = ${follower_id} AND followed_id = ${followed_id};`
            try {
                [remove, ] = await db_pool.query(request)
                if (remove.length == 1) {
                    return remove[0]
                }
                return null
            }
            catch(e) {
                throw(e)
            }
        }
    }
}