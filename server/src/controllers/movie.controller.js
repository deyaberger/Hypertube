module.exports = (db_pool) => {
    const movie_functions = require('./movie')(db_pool)

    return {
        get_homepage : async (req, res) => {
            try {
                let page = Number(req.params.page)
                let limit = 20
                let movies = await movie_functions.get_movies_homepage(page, limit)

                // console.log("Found movies:\n%o.", movies)
                res.status(200).send(movies)
            }
            catch (e) {
                throw(e)
            }
        }
    }
}