module.exports = (db_pool) => {
    const auth_functions = require('./auth')(db_pool)

    return {
        signup : async (req, res) => {
            let username        = req.body.username;
            let firstName       = req.body.firstName;
            let lastName        = req.body.lastName;
            let mail            = req.body.mail;
            let password        = req.body.password;
            let username_error  = false;
            let firstName_error = false;
            let lastName_error  = false;
            let mail_error      = false;
            let password_error  = false;

            let regex_whitespace = /^\S*$/;
            if (firstName.match(regex_whitespace) == null) {
                firstName_error = true;
            }
            if (lastName.match(regex_whitespace) == null) {
                lastName_error = true;
            }
            if (username.length == 0 || username.match(regex_whitespace) == null) {
                username_error = true
            }
            let regex_mail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (mail.length == 0 || mail.match(regex_mail) == null) {
                mail_error = true
            }
            let regex_pwd = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
            if (password.match(regex_pwd) == null) {
                password_error = true
            }
            if (username_error || firstName_error || lastName_error || mail_error || password_error) {
                let specific_errors = {username_error, firstName_error, lastName_error, mail_error, password_error}
                console.log("[auth.controller]: signup FAILURE", specific_errors)
                return res.status(201).send({specific_errors: specific_errors, message: "Cant create user", code: "FAILURE"})
            }
            try {
                let result = await auth_functions.signup(username, firstName, lastName, mail, password, '', 'en')
                let id     = result.insertId
                let token  = auth_functions.create_access_token(id)
                console.log("[auth.controller]: signup SUCCESS", {id})
                return res.status(200).send({specific_errors: null, message: "Successfully created user", code: "SUCCESS", token: token})
            }
            catch (e) {
                let specific_errors = {username_error, firstName_error, lastName_error, mail_error, password_error}
                if (e.code == 'ER_DUP_ENTRY') {
                    if (e.sqlMessage.includes(username)) {
                        console.log("ERROR [auth.controller]: signup ER_DUP_ENTRY for username:", username)
                        username_error = true
                    }
                    if (e.sqlMessage.includes(mail)) {
                        console.log("ERROR [auth.controller]: signup ER_DUP_ENTRY for mail:", mail)
                        mail_error = true
                    }
                    specific_errors = {username_error, firstName_error, lastName_error, mail_error, password_error}
                    console.log("[auth.controller]: signup", e.code, specific_errors)
                    return res.status(201).send({specific_errors: specific_errors, message: e.sqlMessage, code: e.code})
                }
                else if (e.code == 'ER_PARSE_ERROR') {
                    console.log("[auth.controller]: signup ER_PARSE_ERROR", e.sqlMessage)
                    return res.status(201).send({specific_errors: specific_errors, message: 'There was an error parsing your request', code: e.code})
                }
                else if (e.code == 'ER_DATA_TOO_LONG') {
                    console.log("[auth.controller]: signup ER_DATA_TOO_LONG", e.sqlMessage)
                    return res.status(201).send({specific_errors: specific_errors, message: 'Data too long', code: e.code})
                }
                else if (e.code == 'ER_BAD_NULL_ERROR') {
                    console.log("[auth.controller]: signup ER_BAD_NULL_ERROR", e.sqlMessage)
                    return res.status(201).send({specific_errors: specific_errors, message: 'data columns cant be null', code: e.code})
                }
                else {
                    console.log("[auth.controller]: signup ERROR", e.sqlMessage)
                    return res.status(201).send({specific_errors: specific_errors, message: 'cant create user', code: e.code})
                }
            }
        },


        signin: async (req, res) => {
            try {
                let user = await auth_functions.get_user_from_username(req.body.username)
				console.log("[auth.controller]: get_user_from_username ", {user})
				if (user == null) {
					return res.status(201).send("Signin failed")
				}
                let is_password_ok = await auth_functions.check_password(user, req.body.password)
                if (is_password_ok) {
                    let token = auth_functions.create_access_token(user.id)
                    return res.status(200).send({message: "Login Sucess", token: token})
                }

                return res.status(201).send({message: "Signin failed", token: token})
            }
            catch (e) {
                if (e.code == 'ER_DATA_TOO_LONG') {
                    console.log("[user.controller]: signin FAILURE : long")
                    return res.status(201).send({msg: "username too long", code : "TOO_LONG"})
                }
                console.log("\n\nError in signin.\n\n")
                throw (e)
            }
        },


        print_id: async (req, res) => {
            console.log("ID identified: %d.", req.user_id)
            res.status(200).send({userid: req.user_id})
        },


        request_reset_pass: async (req, res) => {
            try {
                let mail = req.params.mail
                let request_sucess = await auth_functions.request_new_pass(mail)

                if (request_sucess) {
                    return res.sendStatus(200)
                }
                console.log("the request for pass reset failed")
                return res.sendStatus(400)
            }
            catch (e) {
                console.log("REQUIERT RESET ERROR:")
                throw(e)
            }
        },


        reset_pass: async (req, res) => {
            try {
                let new_pass = req.body.new_pass
                let hash     = req.body.hash

                let reset_success = await auth_functions.reset_pass(hash, new_pass)

                if (reset_success) {
                    return res.sendStatus(200)
                }
                return res.sendStatus(400)

            }
            catch (e) {
                console.log("RESET PASS ERROR:")
                throw(e)
            }
        }

    }
}