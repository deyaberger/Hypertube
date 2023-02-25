module.exports = (db_pool) => {
    const favorites_functions = require('./favorites')(db_pool)

    return {
        get_all : async (req, res) => {
            console.log("get fav movies")
            try {
                let userid = req.user_id
                let favorites = await favorites_functions.get_all_favorites(userid)

                if (favorites == null) {
                    return res.sendStatus(500)
                }

                return res.status(200).send(favorites)
            }
            catch (e) {
                throw (e)
            }
        },
        get_all_ids : async (req, res) => {
            console.log("get fav movies")
            try {
                let userid = req.user_id
                let favorites_ids = await favorites_functions.get_all_favorites_ids(userid)

                if (favorites_ids == null) {
                    return res.sendStatus(500)
                }

                return res.status(200).send(favorites_ids)
            }
            catch (e) {
                throw (e)
            }
        },
        is_favourite : async(req, res) => {
            console.log("checking if movie is fav")
            try {
                let userid = req.user_id
                let movie_id = req.params.movie_id
                let is_fav = await favorites_functions.is_favorite_movie(userid, movie_id)
                if (is_fav == null) {
                    return res.sendStatus(500)
                }

                return res.status(200).send(is_fav)
            }
            catch (e) {
                throw (e)
            }
        },
        remove_from_favs : async(req, res) => {
            console.log("removing movie from favs")
            try {
                let userid = req.user_id
                let movie_id = Number(req.params.movie_id)
                let removed_res = await favorites_functions.remove_favorite(userid, movie_id)
                if (removed_res.affectedRows == 1) {
                    return res.status(200).send({message: "successfully deleted movie from favorites"})
                }
            }
            catch (e) {
                throw (e)
            }
        },
        add_to_favs : async(req, res) => {
            console.log("adding movie to favs")
            try {
                let userid = req.user_id
                let movie_id = Number(req.params.movie_id)
                console.log("Movie id;", movie_id)
                let added_res = await favorites_functions.add_favorite(userid, movie_id)
                if (added_res.affectedRows == 1) {
                    return res.status(200).send({message: "successfully added movie to favorites"})
                }
            }
            catch (e) {
                throw (e)
            }
        }
    }
}