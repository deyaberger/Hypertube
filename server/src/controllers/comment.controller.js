module.exports = (db_pool) => {
    const comment_functions = require('./comment')(db_pool)

    return {
        post_comment : async (req, res) => {
            console.log("Post comment req: ", req)
            try {
                let user_id       = Number(req.user_id)
                let movie_id      = Number(req.query.movie_id)
                let content       = req.query.content
                let rating        = Number(req.query.rating)
                let comment_id   = await comment_functions.post_comment(user_id, movie_id, content, rating)
                res.status(200).send({comment_id: comment_id})
            }
            catch (e) {
                throw (e)
            }
        },


        get_comments_from_user : async (req, res) => {
            try {
                let author_id = Number(req.query.author_id)

                let comments = await comment_functions.get_comment_by_author_id(author_id)

                res.status(200).send({comments: comments, author_id: author_id})
            }
            catch (e) {
                throw(e)
            }
        },


        get_comments_from_movie : async (req, res) => {
            try {
                let movie_id = Number(req.query.movie_id)

                let comments = await comment_functions.get_comment_by_movie_id(movie_id)

                res.status(200).send({comments: comments, movie_id: movie_id})
            }
            catch (e) {
                throw(e)
            }
        }

    }
}