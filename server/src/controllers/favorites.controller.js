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
    }
}