module.exports = (db_pool) => {
    const user_functions = require('./user')(db_pool)

    return {
        get_my_user : async (req, res) => {
            console.log("in get_my_user")
            try {
                let userid = req.userid
                let user = await user_functions.get_user_by_id(userid)

                if (user == null) {
                    return res.sendStatus(500)
                }

                return res.status(200).send(user)
            }
            catch (e) {
                throw (e)
            }
        }

    }
}