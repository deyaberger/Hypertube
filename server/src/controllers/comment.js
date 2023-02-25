module.exports = (db_pool) => {
    return {
        get_comment_by_comment_id: async (comment_id) => {
            [comments, ] = await db_pool.query("\
            SELECT * FROM comments \
            WHERE id=?;",
            comment_id)

            if (comments.length == 1) {
                return comments[0]
            }

            return null
        },


        get_comment_by_author_id: async (author_id) => {
            console.log("getting comments for user id: ", author_id);
            [comments, ] = await db_pool.query("\
            SELECT * FROM comments \
            WHERE author_id=?;",
            author_id)

            // console.log("Found comments for user: ", comments)
            return comments
        },


        get_comment_by_movie_id: async (movie_id) => {
            console.log("getting comments for movie id: ", movie_id);
            try {
                [comments, ] = await db_pool.query(`
                SELECT content, DATE_FORMAT(date, '%Y-%m-%d %T') as date, u.username, rating
                FROM comments
                    LEFT JOIN users u on comments.user_id = u.id
                WHERE comments.movie_id = ?
                GROUP BY comments.id
                ORDER BY date DESC;`,
                movie_id)
                return comments
            }
            catch(e) {
                throw(e)

            }
        },


        post_comment: async (user_id, movie_id, content, rating) => {
            [comments, ] = await db_pool.query("\
            INSERT INTO comments (content, user_id, movie_id, rating) \
            VALUES               (      ?,         ?,        ?,      ?);",
                                 [content, user_id, movie_id, rating])

            return comments.insertId
        }
    }
}