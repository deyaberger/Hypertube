module.exports = (db_pool) => {
    const movie_functions = require('./movie')(db_pool)

    return {
        get_homepage : async (req, res) => {
            try {
                let movies = await movie_functions.get_movies_homepage()
                return res.status(200).send(movies)
            }
            catch (e) {
                throw(e)
            }
        },

        get_movie_details: async (req, res) => {
            try {
                let movie = await movie_functions.get_movie(Number(req.params.movie_id))
                if (movie == null || movie.length == 0) {
                    return res.status(201).send({msg: `Could not get movie data from DB with id: ${req.params.movie_id}`})
                }
                return res.status(200).send(movie)
            }
            catch (e) {
                throw(e)
            }
        },


        search : async (req, res) => {
            try {
                let query_term        = req.query.query_term
                let minimum_rating    = req.query.minimum_rating
                let genre             = req.query.genre
                let quality           = 1080
                let min_year          = req.query.min_year
                let max_year          = req.query.max_year
                let language          = req.query.language
                let asc_or_desc       = req.query.asc_or_desc
                let sort_by          = req.query.sort_by
                let movies = await movie_functions.search_movies(query_term, minimum_rating, genre, quality, min_year, max_year, language, asc_or_desc, sort_by)
                return res.status(200).send(movies)
            }
            catch (e) {
                throw(e)
            }
        },

        set_movie_watched: async (req, res) => {
            try {
                let movie_id = Number(req.query.movie_id)
                let movie = await movie_functions.set_watched(req.user_id, movie_id)
                res.status(200).send(movie)
            }
            catch (e) {
                if (e.code == 'ER_DUP_ENTRY') {
                    res.status(201).send({message: 'Already set as watched', code: "PLACEHOLDER"})
                }
                throw(e)
            }
        },

    }
}