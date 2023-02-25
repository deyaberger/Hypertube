module.exports = (db_pool) => {
    const follows_functions = require('./follows')(db_pool)

    return {
        get_followings : async (req, res) => {
            console.log("************in get following")
            try {
                let userid = req.query.user_id == undefined ? req.user_id  : Number(req.query.user_id)
                let followings_res = await follows_functions.get_user_followings(userid)
                if (followings_res != null && followings_res.following) {
                    return res.status(200).send({count: followings_res.following})
                }
                return res.status(400).send({message: followings_res})
            }
            catch (e) {
                throw (e)
            }
        },
        get_followers : async (req, res) => {
            console.log("************in get followers")
            try {
                let userid = req.query.user_id == undefined ? req.user_id  : Number(req.query.user_id)
                let followers_res = await follows_functions.get_user_followers(userid)
                if (followers_res != null && followers_res.followers) {
                    return res.status(200).send({count: followers_res.followers})
                }
                return res.status(400).send({message: followers_res})
            }
            catch (e) {
                throw (e)
            }
        },
        is_following : async(req, res) => {
            try {
                let follower_id = req.user_id
                let followed_id = Number(req.params.user_id)
                let following_res  = await follows_functions.is_following_user(follower_id, followed_id)
                return res.status(200).send({message: following_res})
            }
            catch(e) {
                throw (e)
            }
        },
        follow : async(req, res) => {
            try {
                let follower_id = req.user_id
                let followed_id = Number(req.params.user_id)
                let following_res  = await follows_functions.follow_user(follower_id, followed_id)
                return res.status(200).send({message: following_res})
            }
            catch(e) {
                throw (e)
            }
        },
        unfollow : async(req, res) => {
            try {
                let follower_id = req.user_id
                let followed_id = Number(req.params.user_id)
                let following_res  = await follows_functions.unfollow_user(follower_id, followed_id)
                return res.status(200).send({message: following_res})
            }
            catch(e) {
                throw (e)
            }
        }
    }
}