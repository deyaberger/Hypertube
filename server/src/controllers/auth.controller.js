module.exports = (db_pool) => {
    const auth_functions = require('./auth')(db_pool)

    return {
        signup : async (req, res) => {
            console.log("in signup: ", req.body)
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
            if (username.length == 0) {
                username_error = true
            }
            if (firstName.length == 0) {
                firstName_error = true
            }
            if (lastName.length == 0) {
                lastName_error = true
            }
            let regex_mail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (mail.match(regex_mail) == null) {
                mail_error = true
            }
            let regex_pwd = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
            if (password.match(regex_pwd) == null) {
                password_error = true
            }
            if (username_error || firstName_error || lastName_error || mail_error || password_error) {
                return res.status(201).send({message: "Cant create user", "username_error" : username_error,
                        "firstName_error" : firstName_error, "lastName_error" : lastName_error, "mail_error" : mail_error, "password_error" : password_error})
            }
            try {
                let result = await auth_functions.signup(username, firstName, lastName, mail, password, 'pic', 'en')
                let id     = result.insertId
                let token  = auth_functions.create_access_token(id)
                res.status(200).send({message: "Successfully created user.", token: token})
            }
            catch (e) {
                if (e.code == 'ER_DUP_ENTRY') {
                    if (e.sqlMessage.includes(username)) {
                        username_error = true
                    }
                    if (e.sqlMessage.includes(mail)) {
                        mail_error = true
                    }
                    res.status(201).send({message: e.sqlMessage, code: e.code, "username_error" : username_error,
                    "firstName_error" : firstName_error, "lastName_error" : lastName_error, "mail_error" : mail_error, "password_error" : password_error})
                }
                else if (e.code == 'ER_PARSE_ERROR') {
                    res.status(400).send({message: 'There was an error parsing your request', code: e.code, sqlMessage: e.sqlMessage})
                }
                else if (e.code == 'ER_DATA_TOO_LONG') {
                    res.status(201).send({message: "Data too long", code: e.code, sqlMessage: e.sqlMessage})
                }
                else if (e.code == 'ER_BAD_NULL_ERROR') {
                    res.status(201).send({message: "data columns cant be null", code: e.code, sqlMessage: e.sqlMessage})
                }
                else {
                    console.log("signup error:\n", e, "\nend signup error")
                    res.status(500).send({message: 'error in create test user', error: e, code: 'FAILURE'})
                    throw(e)
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