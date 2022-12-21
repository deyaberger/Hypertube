
module.exports = (db_pool) => {
    return {
        get_users : async(req, res) => {
            try {
                let [users, ] = await db_pool.query(
                    "SELECT username, mail, picture FROM users"
                )
                res.status(200).send({data: users})
            }
            catch (e) {
                res.status(500).send()
                throw(e)
            }
        },

        get_users : async(req, res) => {
            try {
                let [users, ] = await db_pool.query(
                    "SELECT username, mail, picture FROM users"
                )
                res.status(200).send({data: users})
            }
            catch (e) {
                throw(e)
            }
        }
    }
} 