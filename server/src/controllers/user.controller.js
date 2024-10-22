const bcrypt              = require('bcrypt')

const hashPassword = (password) => {
    return bcrypt.hashSync(password, 8);
}

module.exports = (db_pool) => {
    const user_functions = require('./user')(db_pool)

    return {
        get_my_user : async (req, res) => {
            try {
                let userid = Number(req.user_id)
                let user = await user_functions.get_my_user(userid)
                if (user != null && user.length == 1) {
                    console.log("[user.controller]: get_my_user SUCCESS ", {user: user[0]})
                    return res.status(200).send({user : user[0], code : "SUCCESS"})
                }
                else if (user.length == 0) {
                    console.log("[user.controller]: get_my_user NO_USER_WITH_THIS_ID")
                    return res.status(201).send({user : null, code : "NO_USER_WITH_THIS_ID"})
                }
            }
            catch (e) {
                if (e.code == 'ER_BAD_FIELD_ERROR') {
                    console.log("[user.controller]: get_my_user FAILURE (A user id should be a number)")
                    return res.status(201).send({msg:  `User id not correct`, code: "FAILURE"})
                }
                throw (e)
            }
        },

        get_user : async (req, res) => {
            try {
                let my_user = Number(req.user_id)
                let other_user = req.params.user_id ? Number(req.params.user_id) : null
                let user = null
                if (other_user == null) {
                    user = await user_functions.get_my_user(my_user)
                }
                else {
                    user = await user_functions.get_user_by_id(other_user)
                }
                if (user != null && user.length == 1) {
                    console.log("[user.controller]: get_other_user SUCCESS ", {user: user[0]})
                    return res.status(200).send({user : user[0], connected_user_id: my_user, code : "SUCCESS"})
                }
                if (user && [...new Set(Object.values(user))][0] == null) {
                    console.log("[user.controller]: Nothing about this user. FAILURE")
                    return res.status(201).send({msg:  `Nothing in database about user ${user}`, code: "FAILURE"})
                }
                return res.status(201).send({msg:  `Unknown error while getting user: ${user}`, code: "FAILURE"})
            }
            catch (e) {
                if (e.code == 'ER_BAD_FIELD_ERROR') {
                    console.log("[user.controller]: get_other_user FAILURE (A user id should be a number)")
                    return res.status(201).send({msg:  `A user id should be a number`, code: "FAILURE"})
                }
                throw (e)
                return res.status(400).send({msg:  `Malformed Request`, code: "FAILURE"})
            }
        },

        get_user_back : async (req, res) => {
            try {
                let other_user = Number(req.params.user_id)
                let user = await user_functions.get_user_by_id_back(other_user)
                if (user != null && user.length == 1) {
                    console.log("[user.controller]: get_other_user SUCCESS ", {user: user[0]})
                    return res.status(200).send({user : user[0], code : "SUCCESS"})
                }
                return res.status(204).send({msg:  `user doesn't exist`, code: "FAILURE"})
            }
            catch (e) {
                if (e.code == 'ER_BAD_FIELD_ERROR') {
                    console.log("[user.controller]: get_other_user FAILURE (A user id should be a number)")
                    return res.status(400).send({msg:  `A user id should be a number`, code: "FAILURE"})
                }
                throw (e)
                return res.status(400).send({msg:  `Malformed Request`, code: "FAILURE"})
            }
        },

        update_user:  async (req, res) => {
            const tolerated_keys = ['username', 'mail', 'pass', 'picture']
            try {
                if (req.user_id != req.params.user_id) {
                    return res.status(403).send({msg: "Modify your own iser profile", code: "FORBIDDEN"})
                }
                if (req.body && Object.keys(req.body).length === 0) {
                    return res.status(200).send({code: 'SUCCESS'})
                }
                let update = req.body
                console.log("update ", update)
                Object.keys(update).forEach(key => {
                    if (!tolerated_keys.includes(key)) {
                        delete update[key]
                    }
                });

                console.log("filtered_update", update)

                if (update.username && (update.username.length == 0 || update.username.match(regex_whitespace) == null)) {
                    return res.status(400).send({msg: "Invalid username", code: "USERNAME_ERROR"})
                }
                console.log("username test passed")

                let regex_mail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                if (update.mail && (update.mail.length == 0 || update.mail.match(regex_mail) == null)) {
                    return res.status(400).send({msg: "Invalid mail", code: "MAIL_ERROR"})
                }
                console.log("mail test passed")

                let regex_pwd = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
                if (update.pass && (update.pass.match(regex_pwd) == null)) {
                    return res.status(400).send({msg: "Invalid password", code: "PASSWORD_ERROR"})
                }
                console.log("password test passed")

                if (update.pass) {
                    update.pass = hashPassword(update.pass)
                }

                await db_pool.query(`
                UPDATE users
                    SET   ?
                    WHERE id=?
		        `,
                [update, req.user_id])
                res.status(200).send({msg: "Succesfully updated user profile", code: "SUCCESS"})
            }
            catch (e) {
                console.log("error in update user")
                return res.status(400).send({msg: "Invalid data", code: "USER_UPDATE_ERROR"})
            }
        },

        get_all_users : async (req, res) => {
            try {
                let users = await user_functions.get_all_users()
                return res.status(200).send({users: users, code: "SUCCESS"})
            }
            catch (e) {
                console.log("error in get_all_users")
                return res.status(400).send({users: [], CODE: 'FAILURE', msg: 'Unknown error while getting users'})
            }
        },

        update_username : async(req, res) => {
            try {
                let user_id = req.user_id
                let new_username  = req.query.username
                let regex_whitespace = /^\S*$/;
                if (new_username && new_username.match(regex_whitespace) == null) {
                    console.log("\n[user.controller]: update_username FAILURE : whitespaces")
                    return res.status(201).send({msg: "Can't change username : whitespaces", code: "FAILURE"})
                }
                let update_res = await user_functions.update_username(user_id, new_username)
                if (update_res && update_res.affectedRows == 1) {
                    console.log("[user.controller]: update_username SUCCESS")
                    return res.status(200).send({msg: "successfully changed user username", code: "SUCCESS"})
                }
                return res.status(201).send({msg:  `Unknown error while updating_username: ${update_res}`, code: "FAILURE"})
            }
            catch (e) {
                if (e.code == 'ER_DUP_ENTRY') {
                    console.log("[user.controller]: update_username ER_DUP_ENTRY")
                    return res.status(201).send({msg: "Can't change username (already taken)", code : "USERNAME_TAKEN"})
                }
                if (e.code == 'ER_DATA_TOO_LONG') {
                    console.log("[user.controller]: update_username FAILURE : long")
                    return res.status(201).send({msg: "Can't change username (too long)", code : "TOO_LONG"})
                }
                if (e.code == 'ER_BAD_NULL_ERROR') {
                    console.log("[user.controller]: update_username FAILURE : ER_BAD_NULL_ERROR")
                    return res.status(201).send({msg: "Can't change username (empty)", code : "EMPTY"})
                }
                console.log("ERRROR in update_username")
                return res.status(400).send({msg: "Can't change username.", code : "UNKNOWN_ERROR"})
            }
        },

        update_first_name : async(req, res) => {
            try {
                let user_id = req.user_id
                let new_first_name  = req.query.firstname
                let regex_whitespace = /^\S*$/;
                if (new_first_name && new_first_name.match(regex_whitespace) == null) {
                    console.log("\n[user.controller]: update_first_name FAILURE : whitespaces")
                    return res.status(201).send({msg: "Can't change firstname : whitespaces", code: "FAILURE"})
                }
                let update_res = await user_functions.update_firstname(user_id, new_first_name)
                if (update_res && update_res.affectedRows == 1) {
                    console.log("[user.controller]: update_first_name SUCCESS")
                    return res.status(200).send({msg: "successfully changed user firstname", code: "SUCCESS"})
                }
                return res.status(201).send({msg:  `Unknown error while updating_first_name: ${update_res}`, code: "FAILURE"})
            }
            catch (e) {
                if (e.code == 'ER_DATA_TOO_LONG') {
                    console.log("[user.controller]: update_first_name FAILURE : long")
                    return res.status(201).send({msg: "Can't change first_name (too long)", code : "TOO_LONG"})
                }
                if (e.code == 'ER_BAD_NULL_ERROR') {
                    console.log("[user.controller]: update_first_name FAILURE : ER_BAD_NULL_ERROR")
                    return res.status(201).send({msg: "Can't change first_name (empty)", code : "EMPTY"})
                }
                console.log("[user.controller]: update_first_name ERROR")
                return res.status(400).send({msg: "Can't update_first_name.", code : "FAILURE"})
            }
        },

        update_last_name : async(req, res) => {
            try {
                let user_id = req.user_id
                let new_last_name  = req.query.lastname
                let regex_whitespace = /^\S*$/;
                if (new_last_name && new_last_name.match(regex_whitespace) == null) {
                    console.log("\n[user.controller]: update_last_name FAILURE : whitespaces")
                    return res.status(201).send({msg: "Can't change lastname : whitespaces", code: "FAILURE"})
                }
                let update_res = await user_functions.update_lastname(user_id, new_last_name)
                if (update_res && update_res.affectedRows == 1) {
                    console.log("[user.controller]: update_last_name SUCCESS")
                    return res.status(200).send({msg: "successfully changed user lastname", code: "SUCCESS"})
                }
                return res.status(201).send({msg:  `Unknown error while updating_last_name: ${update_res}`, code: "FAILURE"})
            }
            catch (e) {
                if (e.code == 'ER_DATA_TOO_LONG') {
                    console.log("[user.controller]: update_last_name FAILURE : long")
                    return res.status(201).send({msg: "Can't change last_name (too long)", code : "TOO_LONG"})
                }
                if (e.code == 'ER_BAD_NULL_ERROR') {
                    console.log("[user.controller]: update_last_name FAILURE : ER_BAD_NULL_ERROR")
                    return res.status(201).send({msg: "Can't change last_name (empty)", code : "EMPTY"})
                }
                console.log("[user.controller]: update_last_name ERROR")
                return res.status(400).send({msg: "Can't update_last_name.", code : "FAILURE"})
            }
        },

        update_bio : async(req, res) => {
            try {
                let user_id = req.user_id
                let new_bio  = req.query.bio
                let update_res = await user_functions.update_user_bio(user_id, new_bio)
                if (update_res.affectedRows == 1) {
                    console.log("[user.controller]: update_bio SUCCESS")
                    return res.status(200).send({msg: "successfully changed user bio", code: "SUCCESS"})
                }
                console.log("[user.controller]: update_bio SUCCESS")
                return res.status(201).send({msg:  `Unknown error in update_bio: ${update_res}`, code: "FAILURE"})
            }
            catch (e) {
                if (e.code == 'ER_DATA_TOO_LONG') {
                    console.log("[user.controller]: update_bio ER_DATA_TOO_LONG")
                    return res.status(201).send({msg: "Can't change bio (too long)", code : "TOO_LONG"})
                }
                return res.status(400).send({msg: "Can't update_bio.", code : "FAILURE"})
            }
        },

        update_email : async(req, res) => {
            try {
                let user_id = req.user_id
                let new_email  = req.query.email
                let regex_mail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                if (new_email != null && new_email != undefined && new_email.match(regex_mail) == null && new_email.length > 0) {
                    console.log("\n[user.controller]: update_email FAILURE (regex)")
                    return res.status(201).send({msg: "Can't change email (regex)", code : "FAILURE"})
                }
                let update_res = await user_functions.update_user_email(user_id, new_email)
                if (update_res.affectedRows == 1) {
                    console.log("[user.controller]: update_email SUCCESS")
                    return res.status(200).send({msg: "successfully changed user email", code: "SUCCESS"})
                }
                return res.status(201).send({msg:  `Unknown error in update_email: ${update_res}`, code: "FAILURE"})
            }
            catch (e) {
                if (e.code == 'ER_DUP_ENTRY') {
                    console.log("[user.controller]: update_email ER_DUP_ENTRY")
                    return res.status(201).send({msg: "Can't change email (already taken)", code : "EMAIL_TAKEN"})
                }
                if (e.code == 'ER_DATA_TOO_LONG') {
                    console.log("[user.controller]: update_email FAILURE : long")
                    return res.status(201).send({msg: "Can't change email (too long)", code : "TOO_LONG"})
                }
                if (e.code == 'ER_BAD_NULL_ERROR') {
                    console.log("[user.controller]: update_email FAILURE : ER_BAD_NULL_ERROR")
                    return res.status(201).send({msg: "Can't change email (empty)", code : "EMPTY"})
                }
                return res.status(400).send({msg: "Can't update_email.", code : "FAILURE"})
            }
        }
    }
}