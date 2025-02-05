const bcrypt              = require('bcrypt')
const jwt                 = require('jsonwebtoken')
const { nanoid }          = require("nanoid");
const querystring         = require('querystring');
const front_hostname      = require('../utils/hostname.js').front_hostname;
const sendMail             = require('../utils/email');
const throw_err_with_code = require('../utils/error_throw')


require('dotenv').config()


const hashPassword = (password) => {
    return bcrypt.hashSync(password, 8);
}

module.exports = (db_pool) => {
    return {
        signup: async (username, f_name, l_name, mail, pass, pic, lang) => {
            console.log("\n[auth]: in signup ", {username, f_name, l_name, mail, pass, pic, lang})
            let pass_hash = hashPassword(pass)
            try {
                let [insert_res, ] = await db_pool.query(
                    `
                    INSERT INTO users (first_name, last_name, mail , pass      , language , picture, username)
                        VALUES        (?         , ?        , ?    , ?         , ?        , ?      , ?       );`,
                                      [f_name    , l_name   , mail , pass_hash , lang     , pic    , username]
                )
                return insert_res
            }
            catch(e) {
                throw e
            }
        },

        create_access_token : (userid) => {
            console.log("\n[auth]: Creating token for ", {userid});
            return jwt.sign({user_id: userid}, process.env.TOKEN_SECRET, { expiresIn: 86400 });
        },

        get_user_from_username: async (username) => {
            console.log("\n[auth]: getting user from ", {username})
            let [user_res, ] = await db_pool.query("\
                SELECT * FROM users \
                WHERE username=?;",
                [username])

            if (user_res.length == 0) {
                return null
            }
            return user_res[0]
        },

        get_user_from_mail: async (mail) => {
            console.log("getting user from mail: %s.", mail)
            let [user_res, ] = await db_pool.query("\
                SELECT * FROM users \
                WHERE mail=?;",
                [mail])

            if (user_res.length == 0) {
                return null
            }

            return user_res[0]
        },

        check_password : async (user, password) => {
            // console.log("checking password: ", user)
            if (user == undefined) {
                return false
                // throw_err_with_code("user doesnt exist", "MISSING_USER")
            }

            if (bcrypt.compareSync(password, user.pass)) {
                return true
            }
            return false
        },


        request_new_pass : async (mail) => {
            console.log("\n[auth] request_new_pass: ", mail)
            let [user_res, ] = await db_pool.query("\
            SELECT * FROM users \
            WHERE mail=?;",
            [mail])
            if (user_res == null || user_res.length == 0) {
                return false
            }
            let user = user_res[0]
            let hash = nanoid(48)
            await db_pool.query(
                "INSERT INTO reset_pass \
                (user_id, id_hash) \
                VALUES (?,?);",
                [user.id, hash]
            )
			const query = querystring.stringify({hash : hash});
			const url_reset = `${front_hostname}/reset_pwd?${query}`
            sendMail(mail, "Reset your password", "To reset your password, click on the following link: " + `${url_reset}`)
            // console.log("reset pass hash:\n", url_reset)
            return true
        },

        reset_pass : async(hash, new_pass) => {
            console.log("\n[auth] reset pass")
            let [verify_reset_result, ] = await db_pool.query(
                "SELECT * FROM reset_pass \
                where id_hash=?",
                hash)

            if (!verify_reset_result || verify_reset_result.length == 0) {
                return false
            }
            let user_id = verify_reset_result[0].user_id

            await db_pool.query(
                "DELETE FROM reset_pass \
                where id_hash=?",
                hash)

            if ((Date.now() - verify_reset_result[0].last_updated) > 600000) {
                return false
            }

            let password_hash  = hashPassword(new_pass);
            let [upda, ] = await db_pool.query(
                "UPDATE users SET pass=? WHERE users.id=?",
                [password_hash, user_id]
            )
            console.log("[auth] reset_pass update: ", upda)
            return true
        },


        delete_user: async (id) => {
            const request = `
            DELETE
            FROM users
            WHERE id = ${id};`
            try {
                let [del_res, ] = await db_pool.query(request)
                return del_res
            }
            catch(e) {
                throw e
            }

        }
    }
}