module.exports = (db_pool) => {
    const favorites_functions = require('./favorite')(db_pool)

    return {
        get_user_favorites : async (req, res) => {
            try {
                let userid = req.user_id
                let favorites = await favorites_functions.get_favorites_by_user_id(userid)
                console.log("[favorite.controller]: get_user_favorites SUCCESS")
                return res.status(200).send({favorites: favorites, code: "SUCCESS"})
            }
            catch (e) {
                throw (e)
            }
        },
        // get_all_ids : async (req, res) => {
        //     console.log("get fav movies")
        //     try {
        //         let userid = req.user_id
        //         let favorites_ids = await favorites_functions.get_all_favorites_ids(userid)

        //         if (favorites_ids == null) {
        //             return res.sendStatus(500)
        //         }

        //         return res.status(200).send(favorites_ids)
        //     }
        //     catch (e) {
        //         throw (e)
        //     }
        // },
        // is_favourite : async(req, res) => {
        //     console.log("checking if movie is fav")
        //     try {
        //         let userid = req.user_id
        //         let movie_id = req.params.movie_id
        //         let is_fav = await favorites_functions.is_favorite_movie(userid, movie_id)
        //         if (is_fav == null) {
        //             return res.sendStatus(500)
        //         }
        //         return res.status(200).send(is_fav)
        //     }
        //     catch (e) {
        //         throw (e)
        //     }
        // },
        remove_from_favs : async(req, res) => {
            try {
                let userid = req.user_id
                let movie_id = Number(req.params.movie_id)
                let removed_res = await favorites_functions.remove_favorite(userid, movie_id)
                if (removed_res.affectedRows == 1) {
                    console.log("[favorite.controller]: remove_from_favs SUCCESS")
                    return res.status(200).send({removed_res: removed_res, code: "SUCCESS"})
                }
            }
            catch (e) {
                throw (e)
            }
        },
        add_to_favs : async(req, res) => {
            try {
                let userid = req.user_id
                let movie_id = Number(req.params.movie_id)
                let added_res = await favorites_functions.add_favorite(userid, movie_id)
                if (added_res.affectedRows == 1) {
                    console.log("[favorite.controller]: add_to_favs SUCCESS")
                    return res.status(200).send({added_res: added_res, code: "SUCCESS"})
                }
            }
            catch (e) {
                throw (e)
            }
        }
    }
}