module.exports = (db_pool) => {
    const comment_functions = require('./comment')(db_pool)

    return {
        post_comment : async (req, res) => {
            try {
                let user_id       = Number(req.user_id)
                let movie_id      = Number(req.query.movie_id)
                let content       = req.query.content
                let rating        = Number(req.query.rating)
                let comment_res   = await comment_functions.post_comment(user_id, movie_id, content, rating)
                if (comment_res != null && comment_res.affectedRows == 1) {
                    console.log("[comment.controller]: post_comment SUCCESS")
                    return res.status(200).send({comment_res: comment_res, code: "SUCCESS"})
                }
                return res.status(201).send({comment_res: comment_res, code: "FAILURE"})
            }
            catch (e) {
                throw (e)
            }
        },


        get_comments_from_user : async (req, res) => {
            try {
                let author_id = Number(req.query.author_id)
                let comments = await comment_functions.get_comment_by_author_id(author_id)
                console.log("[comment.controller]: get_comments_from_user SUCCESS")
                return res.status(200).send({comments: comments, author_id: author_id, code: "SUCCESS"})
            }
            catch (e) {
                throw(e)
            }
        },


        get_comments_from_movie : async (req, res) => {
            try {
                let movie_id = Number(req.params.movie_id)
                let comments = await comment_functions.get_comment_by_movie_id(movie_id)
                console.log("[comment.controller]: get_comments_from_movie SUCCESS")
                return res.status(200).send({comments: comments, code: "SUCCESS"})
            }
            catch (e) {
                throw(e)
            }
        }

    }
}