module.exports = (db_pool) => {
    return {
        get_user_by_id: async (userid) => {
            [users, ] = await db_pool.query("\
            SELECT id, first_name, last_name, mail, language, picture, username FROM users \
            WHERE id=?;",
            userid)

            if (users.length == 1) {
                return users[0]
            }
            
            return null
        }
    }
}