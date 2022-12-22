const buildPatchQuery = (table, data) => {
    if (Object.keys(data).length === 0) return null; // Or return what you want
    let query = `UPDATE ${table} SET `;
    query += Object.keys(data).map((key) => {
        const valueToSet = typeof data[key] === 'string' ? `'${data[key]}'` : data[key];
        return `${key}=?`;
    }).join(', ');
    return query + ` WHERE id=?;`;
}

const buildPatchArgs = (id, data) => {
    if (Object.keys(data).length === 0) return null; // Or return what you want
    let args = []
    Object.keys(data).map((key) => {
        args.push(data[key])
    }).join(', ');
    args.push(id)
    return args
}

module.exports = (db_pool) => {
    return {
        get_comments : async(req, res) => {
            console.log("all comments")
            try {
                let [comments, ] = await db_pool.query(
                    "                                               \
                    SELECT comments.id, text, date, username        \
                        FROM comments                               \
                            LEFT JOIN users                         \
                                ON users.id = comments.author_id    \
                    "
                )
                res.status(200).send({data: comments})
            }
            catch (e) {
                res.status(500).send()
                throw(e)
            }
        },

        get_comment_by_id : async(req, res) => {
            console.log("comment by id")
            try {
                let [comment, ] = await db_pool.query("         \
                SELECT comments.id, text, date, username        \
                    FROM comments                               \
                        LEFT JOIN users                         \
                            ON users.id = comments.author_id    \
                        WHERE comments.id=?;",
                    req.params.id)

                res.status(200).send({data: comment})
            }
            catch (e) {
                throw(e)
            }
        },

        patch_comment : async(req, res) => {
            try {
                console.log('req.params: ', req.params)
                console.log('req.body: '  , req.body)

                let update_string = buildPatchQuery('comments'  , req.body)
                let update_args   = buildPatchArgs(req.params.id, req.body)

                console.log("UPDAAAAAAAA:\n" , update_string)
                console.log("\nargs:\n"      , update_args)

                let [update_result, ] = await db_pool.query(update_string, update_args)

                res.status(200).send({data: update_result})
            }
            catch (e) {
                throw(e)
            }
        },

        delete_comment_by_id : async(req, res) => {
            console.log("delete comment by id")
            try {
                let [comment, ] = await db_pool.query("\
                DELETE FROM comments                   \
                        WHERE comments.id=?;",
                    req.params.id)

                res.status(200).send({data: comment})
            }
            catch (e) {
                throw(e)
            }
        },
    }
}