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
        get_user_by_id: async (userid) => {
            [users, ] = await db_pool.query("\
                SELECT                                        \
                    users.id,                                 \
                    first_name,                               \
                    last_name,                                \
                    mail,                                     \
                    language,                                 \
                    picture,                                  \
                    username,                                 \
                    GROUP_CONCAT(wm.movie_imdb_id) as watched \
                FROM users                                    \
                    LEFT JOIN watched_movies wm               \
                        on users.id = wm.user_id              \
                WHERE users.id=?;",
            userid)

            if (users.length == 1) {
                return users[0]
            }
            
            return null
        },

        update_user_info: async(user_id, update) => {
            let update_string = buildPatchQuery('users' , update)
            let update_args   = buildPatchArgs (user_id , update)

            let [update_result, ] = await db_pool.query(update_string, update_args)

            return update_result
        }
    }
}