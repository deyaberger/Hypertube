module.exports = (db_pool) => {
    const comment_functions = require('./comment')(db_pool)

    return {
        post_comment : async (req, res) => {
            console.log("Post comment")
            try {
                let author_id     = req.user_id
                let movie_imdb_id = req.body.movie_imdb_id
                let content       = req.body.content

                let comment_id    = await comment_functions.post_comment(author_id, movie_imdb_id, content)
                res.status(200).send({comment_id: comment_id})
            }
            catch (e) {
                throw (e)
            }
        },


        get_comments_from_user : async (req, res) => {
            try {
                let author_id = req.params.author_id

                let comments = await comment_functions.get_comment_by_author_id(author_id)

                res.status(200).send({comments: comments, author_id: author_id})
            }
            catch (e) {
                throw(e)
            }
        },


        get_comments_from_movie : async (req, res) => {
            try {
                let movie_imdb_id = req.params.movie_imdb_id

                let comments = await comment_functions.get_comment_by_movie_imdb_id(movie_imdb_id)

                res.status(200).send({comments: comments, movie_imdb_id: movie_imdb_id})
            }
            catch (e) {
                throw(e)
            }
        }

    }
}