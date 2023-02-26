module.exports = (db_pool) => {
    const follows_functions = require('./follow')(db_pool)

    return {
        get_followings : async (req, res) => {
            try {
                let userid = req.query.user_id == undefined ? req.user_id  : Number(req.query.user_id)
                let followings_res = await follows_functions.get_user_followings(userid)
                if (followings_res != null && followings_res.following) {
                    console.log("[follows.controller]: get_followings SUCCESS")
                    return res.status(200).send({followings: followings_res.following, code: "SUCCESS"})
                }
                console.log("[follows.controller]: get_followings FAILURE")
                return res.status(400).send({msg: followings_res, code: "FAILURE"})
            }
            catch (e) {
                throw (e)
            }
        },
        get_followers : async (req, res) => {
            try {
                let userid = req.query.user_id == undefined ? req.user_id  : Number(req.query.user_id)
                let followers_res = await follows_functions.get_user_followers(userid)
                if (followers_res != null && followers_res.followers) {
                    console.log("[follows.controller]: get_followers SUCCESS")
                    return res.status(200).send({followers: followers_res.followers, code: "SUCCESS"})
                }
                console.log("[follows.controller]: get_followers FAILURE")
                return res.status(400).send({msg: followers_res, code: "FAILURE"})
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