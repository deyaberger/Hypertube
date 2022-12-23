module.exports = (db_pool) => {
    const movie_functions = require('./movie')(db_pool)

    return {
        get_homepage : async (req, res) => {
            try {
                let page = Number(req.params.page)
                let limit = 20
                let movies = await movie_functions.search_movies(undefined, undefined, undefined, undefined, 'download_count', page, limit, 'desc')

                res.status(200).send(movies)
            }
            catch (e) {
                throw(e)
            }
        },


        search : async (req, res) => {
            try {
                console.log("searching movies")
                let page           = req.query.page
                let limit          = req.query.limit
                let minimum_rating = req.query.minimum_rating
                let query_term     = req.query.query_term
                let genre          = req.query.genre
                let sort_by        = req.query.sort_by
                let quality        = req.query.quality
                let order_by       = req.query.order_by

                let movies = await movie_functions.search_movies(query_term, minimum_rating, genre, quality, sort_by, page, limit, order_by)
                res.status(200).send(movies)
            }
            catch (e) {
                throw(e)
            }
        }
    }
}