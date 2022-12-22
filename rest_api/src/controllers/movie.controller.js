const bcrypt = require('bcrypt')

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
        get_movies : async(req, res) => {
            console.log("all movies")
            try {
                let [movies, ] = await db_pool.query(
                    "SELECT id, name FROM movies"
                )
                res.status(200).send({data: movies})
            }
            catch (e) {
                res.status(500).send()
                throw(e)
            }
        },

        get_movie_by_id : async(req, res) => {
            console.log("movie by id")
            try {
                let [movie, ] = await db_pool.query("                  \
                        SELECT                                         \
                        movies.id,                                     \
                        movies.name,                                   \
                        year,                                          \
                        COUNT(c.id) as number_of_comments,             \
                        GROUP_CONCAT(s.language) as availabe_subtitles \
                        FROM movies                                    \
                            LEFT JOIN subtitles s                      \
                                ON movies.id = s.movie_id              \
                            LEFT JOIN comments c                       \
                                ON movies.id = c.movie_id              \
                        WHERE movies.id=?;",
                    req.params.id)

                res.status(200).send({data: movie})
            }
            catch (e) {
                throw(e)
            }
        }
    }
}