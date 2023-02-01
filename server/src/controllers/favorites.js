const axios = require('axios')

module.exports = (db_pool) => {
    return {
        get_all_favorites: async (userid) => {
            [favorites, ] = await db_pool.query(`
            SELECT movies.id, movies.title
            FROM movies
            RIGHT join favorite_movies
            ON movies.id = favorite_movies.movie_id
            WHERE favorite_movies.user_id = ?`,
            userid)
            return favorites
        },
    }
}