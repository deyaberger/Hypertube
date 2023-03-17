module.exports = (db_pool) => {
    return {
        get_comment_by_author_id: async (author_id) => {
            console.log("\n[comment]:getting comment by author id: ", author_id)
            try {
                [comments, ] = await db_pool.query("\
                SELECT * FROM comments \
                WHERE author_id=?;",
                author_id)
                return comments
            }
            catch(e) {
                throw(e)
            }
        },

        get_comment_by_id: async (id) => {
            console.log("\n[comment]:getting comment by id: ", id)
            try {
                [comments, ] = await db_pool.query(`
                SELECT
                    comments.id,
                    comments.date,
                    comments.content,
                    comments.rating,
                    users.username
                FROM comments
                INNER JOIN users
                    ON users.id = comments.user_id
                WHERE comments.id = ?`,
                id)
                return comments
            }
            catch(e) {
                throw(e)
            }
        },

        get_latest: async (id) => {
            console.log("\n[comment]: getting latest: ")
            try {
                [comments, ] = await db_pool.query(`
                SELECT
                    comments.id,
                    comments.date,
                    comments.content,
                    comments.rating,
                    users.username
                FROM comments
                INNER JOIN users
                    ON users.id = comments.user_id
                ORDER BY date DESC
                LIMIT 20 OFFSET 0
                `)
                return comments
            }
            catch(e) {
                throw(e)
            }
        },

        get_comment_by_movie_id: async (movie_id) => {
            console.log("\n[comment]:getting comment by movie id: ", movie_id)
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
            console.log("\n[comment]:posting comment: ", {user_id, movie_id, content, rating})
            try {
                [comments, ] = await db_pool.query("\
                INSERT INTO comments (content, user_id, movie_id, rating) \
                VALUES               (      ?,         ?,        ?,      ?);",
                                     [content, user_id, movie_id, rating])
                return comments
            }
            catch(e) {
                throw(e)
            }
        }
    }
}