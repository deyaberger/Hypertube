module.exports = (db_pool) => {
    const movie_functions = require('./movie')(db_pool)
    return {
        get_recommendations : async (req, res) => {
            try {
                let user_id = req.user_id
                let movies_res = await movie_functions.get_movies_recommendations(user_id)
                console.log("[movie.controller]: get_recommendations SUCCESS")
                return res.status(200).send({movies: movies_res, code: "SUCCESS"})
            }
            catch (e) {
                throw(e)
                // return res.status(400).send({movies: [], code: "FAILURE"})
            }
        },

        search : async (req, res) => {
            try {
                let user_id           = req.user_id
                let query_term        = req.query.query_term
                let minimum_rating    = req.query.minimum_rating
                let genre             = req.query.genre
                let quality           = 1080
                let min_year          = req.query.min_year
                let max_year          = req.query.max_year
                let language          = req.query.language
                let asc_or_desc       = req.query.asc_or_desc
                let sort_by          = req.query.sort_by
                let movies_res = await movie_functions.search_movies(user_id, query_term, minimum_rating, genre, quality, min_year, max_year, language, asc_or_desc, sort_by)
                console.log("[movie.controller]: search SUCCESS")
                return res.status(200).send({movies: movies_res, code: "SUCCESS"})
            }
            catch (e) {
                throw(e)
            }
        },

        get_details: async (req, res) => {
            try {
                let user_id = req.user_id
                let movie_id = Number(req.params.movie_id)
                let movie_res = await movie_functions.get_movie_details(movie_id, user_id)
                if (movie_res == null || movie_res.length == 0) {
                    console.log("[movie.controller]: get_details MISSING_MOVIE")
                    return res.status(200).send({movie: movie_res, code: "MISSING_MOVIE"})
                }
                console.log("[movie.controller]: get_details SUCCESS")
                return res.status(200).send({movie: movie_res, code: "SUCCESS"})
            }
            catch (e) {
                if (e.code == "ER_BAD_FIELD_ERROR") {
                    console.log("ERROR [movie.controller]: ER_BAD_FIELD_ERROR")
                    return res.status(201).send({msg: "the path /movie/:movie_id should contain a number as movie id", code: "FAILURE"})
                }
                throw(e)
            }
        },
    }
}