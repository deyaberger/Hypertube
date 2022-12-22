const bcrypt              = require('bcrypt')
const jwt                 = require('jsonwebtoken')

const throw_err_with_code = require('../utils/error_throw')


require('dotenv').config()


const hashPassword = (password) => {
    return bcrypt.hashSync(password, 8);
}

module.exports = (db_pool) => {
    return {
        signup: async (username, f_name, l_name, mail, pass, pic, lang) => {
            let pass_hash = hashPassword(pass)
            let [insert_res, ] = await db_pool.query(
                "\
                INSERT INTO users (first_name, last_name, mail , pass      , language , picture, username)\
                    VALUES        (?         , ?        , ?    , ?         , ?        , ?      , ?       );",
                                  [f_name    , l_name   , mail , pass_hash , lang     , pic    , username]
            )
            console.log("Signup user: %s,\nResult: %o\n", username, insert_res)
            return insert_res
        },


        create_access_token : (userid) => {
            console.log("Creating token for user %d.", userid);

            return jwt.sign({user_id: userid}, process.env.TOKEN_SECRET, {expiresIn: 86400 });
        },


        get_user_from_username: async (username) => {
            console.log("getting user from name: %s.", username)
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
            console.log("checking password: ", user)
            if (user == undefined) {
                return false
                throw_err_with_code("user doesnt exist", "MISSING_USER")
            }

            if (bcrypt.compareSync(password, user.pass)) {
                return true
            }
            return false
        },


        request_new_pass : async (mail) => {
            console.log("Reset pass: ", mail)
            let [user_res, ] = await db_pool.query("\
            SELECT * FROM users \
            WHERE mail=?;",
            [mail]) 
            let user
            if (user_res.length == 0) {
                user = null
            }
            else {
                user = user_res[0]

            }

            if (user == null) {
                console.log("MISSING YSEr")
                return false
            }

            let hash = hashPassword(user.id.toString(), 8) 
            await db_pool.query(
                "INSERT INTO reset_pass \
                (user_id, id_hash) \
                VALUES (?,?);",
                [user.id, hash]
            )

            // sendMail(req.body.mail, "Sekesi Password Reset",  "Click here to reset password: " + "https://matcha.yoopster.com/#/reset/" + encodeURIComponent(hash))
            console.log("reset pass hash:\n", hash)

            return true
        },


        reset_pass : async(hash, new_pass) => {
            console.log("resetting password")
            let [verify_reset_result, ] = await db_pool.query(
                "SELECT * FROM reset_pass \
                where id_hash=?",
                hash)

            if (verify_reset_result.length == 0) {
                console.log("no hash found for reset pass")
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
            console.log(upda)
            return true
        }
    }
}