const axios      = require('axios');
const jwt        = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const front_hostname = require('../utils/hostname.js').front_hostname
const back_hostname  = require('../utils/hostname.js').back_hostname
const return_codes   = require('../utils/return_codes.js')







const helper_functions = (db_pool) => {
    const auth_functions = require('./auth')(db_pool)
    
    return {
        create_user: async (user_info) => {
            let mail       = user_info.mail
            let id_42      = user_info.id_42
            let login      = user_info.login
            let first_name = user_info.first_name
            let last_name  = user_info.last_name
            let picture    = user_info.picture

            console.log("Creating account for:" , login)

            try {
                let randomstr      = nanoid(48)
                let signup_result  = await auth_functions.signup(login, first_name, last_name, mail, randomstr, picture, 'en')
                console.log("Adding user and 42_user_id to oauth table (for future reference)")
                let [oauth_insert_res, ] = await db_pool.query(
                    `
                    INSERT INTO oauth (42_id, user_id)
                        VALUES        (?    , ?      )
                    `,
                    [id_42, signup_result.insertId]
                )
                console.log("Oauth table insert result:", oauth_insert_res)
                return signup_result.insertId
            }
            catch (e) {
                if (e.code == 'ER_DUP_ENTRY') {
                    if (e.sqlMessage.includes('users.users_mail_uindex')) {
                        console.log(return_codes.MAIL_ALREADY_TAKEN)
                        throw(new Error(return_codes.MAIL_ALREADY_TAKEN))
                    }
        
                    else if (e.sqlMessage.includes('users.users_name_uindex')) {
                        console.log(return_codes.USERNAME_TAKEN)
                        throw(new Error(return_codes.USERNAME_TAKEN))
                    }
                }
                console.log("error create user for oauth", e)
                throw(new Error(return_codes.UNKNOWN_ERROR))
            }	
        },

        get_42_user_local_id: async (user_id_42) => {
            let [oauth_query, ] = await db_pool.query(
                `SELECT
                    user_id
                FROM oauth
                WHERE
                    42_id=?`,
                [user_id_42,]
            )
            if (oauth_query.length == 1) {
                return oauth_query[0].user_id
            }
            return null
        },

        get_42_user_token: async (code) => {
            let request = {
                url: `https://api.intra.42.fr/oauth/token`,
                method: "post",
                headers: {
                    "Content-type": "application/json",
                    'Accept-Encoding': 'application/json'
                },
                params : {
                    grant_type   : 'authorization_code',
                    client_id    : process.env.OAUTH_ID,
                    client_secret: process.env.OAUTH_SECRET,
                    redirect_uri : `${back_hostname}/api/auth/oauth`,
                    code         : code
                }
            };
            const response = await axios(request);
            return response;
        },

        get_42_user_details: async (bearer_token) => {
            console.log("TOKEEEEN: ", bearer_token)
            let request = {
                url: `https://api.intra.42.fr/v2/me`,
                method: "get",
                headers: {
                    "Content-type": "application/json",
                    'Accept-Encoding': 'identity',
                    Authorization : `Bearer ${bearer_token}`
                }
            };
            const response = await axios(request);
            return response;
        },

        create_access_token: auth_functions.create_access_token
    }
}


module.exports = (db_pool) => {
    const utils = helper_functions(db_pool)
    return {
        oauthInUp: async (req, res) => {
            console.log("Starting oauth process")
            try {
                console.log('Recieved code: ', req.query.code)
                console.log('Trading code for 42 token with 42 API')
                let token42 = await utils.get_42_user_token(req.query.code)
                if (token42.status == 200) {
                    console.log('Got 42 token, using it to get user info from 42 API')
                    let user_details = await utils.get_42_user_details(token42.data.access_token)
                    if (user_details.status == 200) {
                        user_info = {
                            mail      : user_details.data.email,
                            id_42     : user_details.data.id,
                            login     : user_details.data.login,
                            first_name: user_details.data.first_name,
                            last_name : user_details.data.last_name,
                            picture   : user_details.data.image.link
                        }
                        console.log("Got user info from 42:", user_info)
                        console.log("Checking if this oauth is to create user or login.")
                        let local_user_id = await utils.get_42_user_local_id(user_info.id_42)
                        let user_exists   = (local_user_id != null)
                        console.log("User already exists:", user_exists)
                        if (!user_exists) {
                            try {
                                local_user_id = await utils.create_user(user_info)
                            }
                            catch (e) {
                                if (e.message == return_codes.MAIL_ALREADY_TAKEN) {
                                    console.log("Redirecting user to password reset.")
                                    return res.redirect(`${front_hostname}/forgotpassword/taken`)
                                }
                                if (e.message == return_codes.USERNAME_TAKEN) {
                                    console.log("Redirecting user to signup.")
                                    return res.redirect(`${front_hostname}/signup`)
                                }
                                console.log("Unknown error in oauth", e)
                                return res.redirect(`${front_hostname}/signup`)
                            }
                        }
                        console.log("Creating access token for user:", local_user_id)
                        let access_token = utils.create_access_token(local_user_id)

                        console.log("Redirecting user to signin page and passing token in URL.")
                        return res.redirect(`${front_hostname}/sign_in?oauth_token=${encodeURIComponent(access_token)}`)
                    }
                }
            }
            catch (e) {
                console.log("Unknown ERR in oauth", e)
                return res.redirect(`${front_hostname}/signup`)
            }
        }
    }
}