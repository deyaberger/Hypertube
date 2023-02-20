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
        is_favourite : async(req, res) => {
            console.log("checking if movie is fav")
            try {
                let userid = req.user_id
                let movie_id = req.query.movie_id
                let is_fav = await favorites_functions.is_favorite_movie(userid, movie_id)
                if (is_fav == null) {
                    return res.sendStatus(500)
                }

                return res.status(200).send(is_fav)
            }
            catch (e) {
                throw (e)
            }
        }
    }
}