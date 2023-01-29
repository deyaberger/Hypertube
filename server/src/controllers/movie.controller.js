module.exports = (db_pool) => {
    const movie_functions = require('./movie')(db_pool)

    return {
        get_homepage : async (req, res) => {
            try {
                let movies = await movie_functions.get_movies_homepage()
                console.log("got movies",movies)
                res.status(200).send(movies)
            }
            catch (e) {
                throw(e)
            }
        },

        get_movie_details: async (req, res) => {
            try {
                let imdb_id = Number(req.params.imdb_id)
                let movie = await movie_functions.get_movie_by_imdb_id(imdb_id)

                res.status(200).send(movie)
            }
            catch (e) {
                throw(e)
            }
        },


        search : async (req, res) => {
            try {
                console.log("searching movies")
                let query_term     = req.query.query_term
                let minimum_rating = req.query.minimum_rating
                let genre          = req.query.genre
                let quality        = req.query.quality
                let min_year       = req.query.min_year
                let max_year       = req.query.max_year
                let language       = req.query.language
                let order_by       = req.query.order_by
                let asc_or_desc    = req.query.asc_or_desc

                let movies = await movie_functions.search_movies(query_term, minimum_rating, genre, quality, min_year, max_year, language, order_by, asc_or_desc)
                res.status(200).send(movies)
            }
            catch (e) {
                throw(e)
            }
        }

    }
}