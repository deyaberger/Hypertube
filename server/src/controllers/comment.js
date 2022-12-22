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

            console.log("Found comments for user: ", comments)
            return comments
        },


        get_comment_by_movie_imdb_id: async (movie_imdb_id) => {
            console.log("getting comments for movie id: ", movie_imdb_id);
            [comments, ] = await db_pool.query("\
            SELECT * FROM comments \
            WHERE movie_imdb_id=?;",
            movie_imdb_id)

            console.log("Found comments for movie: ", comments)
            return comments
        },


        post_comment: async (user_id, movie_imdb_id, content) => {
            [comments, ] = await db_pool.query("\
            INSERT INTO comments (content , author_id     , movie_imdb_id) \
            VALUES               (?       ,?              ,?             );",
            [content, user_id, movie_imdb_id])

            return comments.insertId
        }
    }
}