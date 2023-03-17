module.exports = (db_pool) => {
    const comment_functions = require('./comment')(db_pool)

    return {
        post_comment : async (req, res) => {
            try {
                let user_id       = req.user_id
                let movie_id      = Number(req.params.movie_id)
                if (!movie_id || isNaN(movie_id)) {
                    movie_id = req.body.movie_id
                }
                let content       = req.body.content
                let rating        = req.body.rating
                console.log(`user_id: ${user_id} movie_id: ${movie_id} content: ${ content} rating: ${ rating}`)
                let comment_res   = await comment_functions.post_comment(user_id, movie_id, content, rating)
                if (comment_res != null && comment_res.affectedRows == 1) {
                    console.log("[comment.controller]: post_comment SUCCESS")
                    return res.status(200).send({comment_res: comment_res, code: "SUCCESS"})
                }
                return res.status(201).send({comment_res: comment_res, code: "FAILURE"})
            }
            catch (e) {
                if (e.code == 'ER_BAD_FIELD_ERROR') {
                    console.log("[comment.controller]: post_comment bad field error")
                    return res.status(400).send({code: "FAILURE", msg: 'invalid id'})
                }
                if (e.code == 'ER_DATA_TOO_LONG') {
                    console.log("[comment.controller]: post_comment ER_DATA_TOO_LONG")
                    return res.status(400).send({comment_res: e.sqlMessage, code: "TOO_LONG"})
                }
                if (e.sqlMessage=="Check constraint 'number_range_check' is violated.") {
                    console.log("[comment.controller]: post_comment bad rating")
                    return res.status(400).send({comment_res: e.sqlMessage, code: "BAD_RATING"})
                }
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
        },

        get_latest_comments : async (req, res) => {
            try {
                let comments = await comment_functions.get_latest()
                console.log("[comment.controller]: get latest SUCCESS")
                return res.status(200).send({comments: comments, code: "SUCCESS"})
            }
            catch (e) {
                throw(e)
            }
        },
        
        get_comment_by_id : async (req, res) => {
            try {
                let comment_id = Number(req.params.id)
                let comments = await comment_functions.get_comment_by_id(comment_id)
                console.log("[comment.controller]: get by id SUCCESS")
                if (comments.length == 0) {
                    return res.status(204).send({msg: 'No comments with this id', code: "SUCCESS"})
                }
                return res.status(200).send({comments: comments, code: "SUCCESS"})
            }
            catch (e) {
                if (e.code == 'ER_BAD_FIELD_ERROR') {
                    return res.status(400).send({code: "FAILURE", msg: 'invalid id'})
                }
                throw(e)
                return res.status(400).send({code: "FAILURE"})
            }
        },

        delete_comment : async (req, res) => {
            try {
                let comment_id = Number(req.params.id)
                let del = await db_pool.query(
                    `
                    DELETE FROM comments WHERE id=? AND user_id=?
                    `,
                    [comment_id, req.user_id]
                )
                console.log("[comment.controller]: delete SUCCESS", del)
                return res.status(200).send({code: "SUCCESS"})
            }
            catch (e) {
                if (e.code == 'ER_BAD_FIELD_ERROR') {
                    return res.status(400).send({code: "FAILURE", msg: 'invalid id'})
                }
                throw(e)
                return res.status(400).send({code: "FAILURE"})
            }
        },

        update_comment:  async (req, res) => {
            const tolerated_keys = ['content']
            try {
                if (!req.body || !req.body.content) {
                    return res.status(400).send({code: 'FAILURE'})
                }
                let comment_id = Number(req.params.id)

                let update = req.body
                console.log("update comments ", update, comment_id, req.user_id)
                Object.keys(update).forEach(key => {
                    if (!tolerated_keys.includes(key)) {
                        delete update[key]
                    }
                });

                console.log("filtered_update comment", update)
                let [comment, ] = await db_pool.query(`
                SELECT * FROM comments
                    WHERE id=?
		        `,
                comment_id)

                console.log("trying to modify:", comment)
                if (comment.length == 0) {
                    return res.status(204).send({code: 'FAILURE'})
                }

                if (comment[0].user_id != req.user_id) {
                    return res.status(403).send({msg: 'You can only modify your own comments', code: 'FAILURE'})
                }

                await db_pool.query(`
                UPDATE comments
                    SET content=?
                    WHERE id=? AND user_id=?
		        `,
                [update.content, comment_id, req.user_id])
                res.status(200).send({msg: "Succesfully updated comment", code: "SUCCESS"})
            }
            catch (e) {
                console.log("error in update comment")
                if (e.code == 'ER_BAD_FIELD_ERROR') {
                    return res.status(400).send({code: "FAILURE", msg: 'invalid id'})
                }
                throw(e)
                return res.status(400).send({msg: "Invalid data", code: "COMMENT_UPDATE_ERROR"})
            }
        },
    }
}