module.exports = (db_pool) => {
    const watched_functions = require('./watched')(db_pool)

    return {
        get_user_watched_movies : async (req, res) => {
            try {
                let my_user_id = req.user_id
                let other_user_id = req.params.user_id == 'undefined' ? null : Number(req.params.user_id)
                let watched = await watched_functions.get_watched_by_user_id(my_user_id, other_user_id)
                console.log("[favorite.controller]: get_user_watched SUCCESS", {count: watched.length})
                return res.status(200).send({watched: watched, code: "SUCCESS"})
            }
            catch (e) {
                console.log("ERRORin get_user_watched_movies")
                return res.status(400).send({msg: 'cant get_user_watched_movies', code: "FAILURE"})
            }
        },

        set_watched : async(req, res) => {
            try {
                let user_id = req.user_id
                let movie_id  = Number(req.params.movie_id)
                let update_res  = await watched_functions.post_watched(user_id, movie_id)
                if (update_res.affectedRows >= 1) {
                    console.log("[watched.controller]: set_watched SUCCESS")
                    return res.status(200).send({code: "SUCCESS"})
                }
                console.log("ERROR in set_watched", update_res)
                return res.status(400).send({msg: 'cant set_watched', code: "FAILURE"})
            }
            catch (e) {
                if (e.code == 'ER_DUP_ENTRY') {
                    return res.status(200).send({code: "SUCCESS"})
                }
                console.log("ERRORin set_watched", e)
                return res.status(400).send({msg: 'cant set_watched', code: "FAILURE"})
            }
        },

        set_unwatched : async(req, res) => {
            try {
                let user_id = req.user_id
                let movie_id  = Number(req.params.movie_id)
                let update_res  = await watched_functions.delete_watched(user_id, movie_id)
                if (update_res.affectedRows == 1) {
                    console.log("[watched.controller]: set_unwatched SUCCESS")
                    return res.status(200).send({update_res: update_res, code: "SUCCESS"})
                }
            }
            catch (e) {
                console.log("ERRORin set_unwatched")
                return res.status(400).send({msg: 'cant set_unwatched', code: "FAILURE"})
            }
        }
    }
}