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
                else if ([...new Set(Object.values(user))][0] == null) {
                    console.log("Nothing about this user")
                    return res.status(201).send({message:  "Nothing in database about user: " + userid})
                }
                return res.status(200).send(user)
            }
            catch (e) {
                throw (e)
            }
        },

        get_other_user : async (req, res) => {
            console.log("in get_other_user")
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
        get_watched_movies : async (req, res) => {
            console.log("get watch movies")
            try {
                let userid = req.user_id
                let watched = await user_functions.get_watched(userid)

                if (watched == null) {
                    return res.sendStatus(500)
                }

                return res.status(200).send(watched)
            }
            catch (e) {
                throw (e)
            }
        },
        update_first_name : async(req, res) => {
            try {
                let user_id = req.user_id
                let new_first_name  = req.query.firstname
                let regex_whitespace = /^\S*$/;
                if (new_first_name.match(regex_whitespace) == null) {
                    return res.status(201).send({message: "Can't change firstname", details: "whitespaces"})
                }
                if (new_first_name.length == 0) {
                    return res.status(201).send({message: "Can't change firstname", details: "empty"})
                }
                let update_res = await user_functions.update_firstname(user_id, new_first_name)
                if (update_res.affectedRows == 1) {
                    return res.status(200).send({message: "successfully changed user firstname"})
                }
                return update_res
            }
            catch (e) {
                throw(e)
            }
        },
        update_last_name : async(req, res) => {
            try {
                let user_id = req.user_id
                let new_last_name  = req.query.lastname
                let regex_whitespace = /^\S*$/;
                if (new_last_name.match(regex_whitespace) == null) {
                    return res.status(201).send({message: "Can't change lastname", details: "whitespaces"})
                }
                if (new_last_name.length == 0) {
                    return res.status(201).send({message: "Can't change lastname", details: "empty"})
                }
                let update_res = await user_functions.update_lastname(user_id, new_last_name)
                if (update_res.affectedRows == 1) {
                    return res.status(200).send({message: "successfully changed user lastname"})
                }
                return update_res
            }
            catch (e) {
                throw(e)
            }
        },
        update_bio : async(req, res) => {
            try {
                let user_id = req.user_id
                let new_bio  = req.query.bio
                let update_res = await user_functions.update_user_bio(user_id, new_bio)
                if (update_res.affectedRows == 1) {
                    return res.status(200).send({message: "successfully changed user bio"})
                }
                return update_res
            }
            catch (e) {
                throw(e)
            }
        },
        update_email : async(req, res) => {
            try {
                let user_id = req.user_id
                let new_email  = req.query.email
                let regex_mail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                if (new_email.match(regex_mail) == null) {
                    return res.status(201).send({message: "Can't change email", details: "regex"})
                }
                if (new_email.length == 0) {
                    return res.status(201).send({message: "Can't change email", details: "empty"})
                }
                let update_res = await user_functions.update_user_email(user_id, new_email)
                if (update_res.affectedRows == 1) {
                    return res.status(200).send({message: "successfully changed user email"})
                }
                return update_res
            }
            catch (e) {
                throw(e)
            }
        }

    }
}