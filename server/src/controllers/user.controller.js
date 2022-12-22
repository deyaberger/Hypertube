module.exports = (db_pool) => {
    const user_functions = require('./user')(db_pool)

    return {
        get_my_user : async (req, res) => {
            console.log("in get_my_user")
            try {
                let userid = req.user_id
                let user = await user_functions.get_user_by_id(userid)

                if (user == null) {
                    return res.sendStatus(500)
                }

                return res.status(200).send(user)
            }
            catch (e) {
                throw (e)
            }
        },

        get_other_user : async (req, res) => {
            console.log("in get_my_user")
            try {
                let user_id = req.params.user_id
                let user = await user_functions.get_user_by_id(user_id)

                if (user == null) {
                    return res.sendStatus(500)
                }
                
                delete user.mail
                return res.status(200).send(user)
            }
            catch (e) {
                throw (e)
            }
        },

        update_user_info : async(req, res) => {
            try {
                let user_id = req.user_id
                let update  = req.body

                let update_res = await user_functions.update_user_info(user_id, update)
                res.sendStatus(200)
            }
            catch (e) {
                throw(e)
            }
        },

    }
}