const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt    = require('jsonwebtoken')


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
    const auth_functions = require('./auth')(db_pool)

    return {

        signup : async (req, res) => {
            console.log("in signup")
            try {
                let username  = req.body.username;
                let firstName = req.body.firstName;
                let lastName  = req.body.lastName;
                let mail      = req.body.mail;
                let password  = req.body.password;

                let result = await auth_functions.signup(username, firstName, lastName, mail, password, 'pic', 'en')
                res.status(200).send({message: "Successfully created user.", id: result.insertId})
            }
            catch (e) {
                if (e.code == 'ER_DUP_ENTRY') {
                    res.status(200).send({message: e.sqlMessage, code: e.code, sqlMessage: e.sqlMessage})
                }
                else if (e.code == 'ER_PARSE_ERROR') {
                    res.status(400).send({message: 'There was an error parsing your request', code: e.code, sqlMessage: e.sqlMessage})
                    // throw(e)
                }
                else if (e.code == 'ER_DATA_TOO_LONG') {
                    res.status(200).send({message: "Data too long", code: e.code, sqlMessage: e.sqlMessage})
                }
                else if (e.code == 'ER_BAD_NULL_ERROR') {
                    res.status(200).send({message: "data columns cant be null", code: e.code, sqlMessage: e.sqlMessage})
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
                let is_password_ok = await auth_functions.check_password(user, req.body.password)
                if (is_password_ok) {
                    let token = auth_functions.create_access_token(user.id)
                    return res.status(200).send({token: token})
                }

                return res.status(201).send("Signin failed")
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


        authenticateToken: (req, res, next) => {
            try {
                const authHeader = req.headers['authorization']
                const token = authHeader && authHeader.split(' ')[1]
                // console.log("token: ", token)
              
                if (token == null) return res.sendStatus(401)
                jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
                    if (err != null) console.log(err)
              
                    if (err) {
                        return res.sendStatus(403)
                    }
                    // console.log(decoded)              
                    req.user_id = decoded.user_id
                    console.log("Authenthicated user %o.", decoded.user_id)
                    next()
                })
            }
            catch (e) {
                console.log("ERROR in auth token: ", e)
                throw(e)
            }
            
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