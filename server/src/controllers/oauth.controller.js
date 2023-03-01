const axios      = require('axios');
const jwt        = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const { OAuth2Client } = require('google-auth-library')


const front_hostname = require('../utils/hostname.js').front_hostname
const back_hostname  = require('../utils/hostname.js').back_hostname
const return_codes   = require('../utils/return_codes.js')

const google_client = new OAuth2Client(process.env.OAUTH_GOOGLE_ID)

const verify = async (token) => {
  const ticket = await google_client.verifyIdToken({
    idToken: token,
    audience: process.env.OAUTH_GOOGLE_ID,
  })
  return ticket.getPayload()
}

const helper_functions = (db_pool) => {
    const auth_functions = require('./auth')(db_pool)

    return {
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

        create_user: async (user_info, type) => {
            let mail       = user_info.mail
            let ext_id     = user_info.ext_id
            let login      = user_info.login
            let first_name = user_info.first_name
            let last_name  = user_info.last_name
            let picture    = user_info.picture

            console.log("[oauth.controller]: Creating account for:" , login)
            let signup_result = null
            let randomstr      = nanoid(48)
            try {
                signup_result  = await auth_functions.signup(login, first_name, last_name, mail, randomstr, picture, 'en')
                if (signup_result != null && signup_result != undefined && signup_result.affectedRows == 1) {
                    if (type == "42") {
                        console.log("[oauth.controller]: Signup Successful, now inserting user into oauth table...")
                        let insert_oauth = await auth_functions.insert_42_user(ext_id, signup_result.insertId)
                        console.log("INSERT OAUTH:" , insert_oauth)
                    }
                    else if (type == "git") {
                        console.log("[oauth.controller]: Signup Successful, now inserting user into oauth table...")
                        let insert_oauth = await auth_functions.insert_github_user(ext_id, signup_result.insertId)
                        console.log("INSERT OAUTH:" , insert_oauth)
                    }
                    else if (type == "google") {
                        console.log("[oauth.controller]: Signup Successful, now inserting user into oauth table...")
                        let insert_oauth = await auth_functions.insert_google_user(ext_id, signup_result.insertId)
                        console.log("INSERT OAUTH:" , insert_oauth)
                    }
                    return signup_result.insertId
                }
            }
            catch(e) {
                if (e.code == 'ER_DUP_ENTRY') {
                    if (e.sqlMessage.includes('users.users_mail_uindex')) {
                        throw(new Error(return_codes.MAIL_ALREADY_TAKEN))
                    }
                    else if (e.sqlMessage.includes('users.users_name_uindex')) {
                        throw(new Error(return_codes.USERNAME_TAKEN))
                    }
                }
                else if (e.code == 'ER_WARN_DATA_OUT_OF_RANGE') {
                    if (signup_result != null) {
                        await auth_functions.delete_user(signup_result.insertId)
                        console.log("[oauth.controller]: deleted previously created user")
                    }
                    throw(new Error(return_codes.DATA_OUT_OF_RANGE))
                }
                if (signup_result != null) {
                    await auth_functions.delete_user(signup_result.insertId)
                    console.log("[oauth.controller]: deleted previously created user")
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
                    client_id    : process.env.OAUTH_42_ID,
                    client_secret: process.env.OAUTH_42_SECRET,
                    redirect_uri : `${back_hostname}/api/auth/oauth`,
                    code         : code
                }
            };
            const response = await axios(request);
            return response;
        },

        get_42_user_details: async (bearer_token) => {
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

        get_github_user_token: async (code) => {
            let request = {
                url: `https://github.com/login/oauth/access_token`,
                method: "post",
                headers: {
                    "Content-type": "application/json",
                    'Accept': 'application/json'
                },
                params : {
                    client_id    : process.env.OAUTH_GITHUB_ID,
                    client_secret: process.env.OAUTH_GITHUB_SECRET,
                    redirect_uri : `${back_hostname}/api/auth/oauth/github`,
                    scope        : 'user user:email',
                    code         : code
                }
            };
            const response = await axios(request);
            return response;
        },


        get_github_user_details: async (bearer_token) => {
            let request = {
                url: `https://api.github.com/user`,
                method: "get",
                headers: {
                    "Content-type": "application/json",
                    Authorization : `Bearer ${bearer_token}`
                }
            };
            const response = await axios(request);
            return response;
        },


        get_github_user_local_id: async (user_id_github) => {
            let [oauth_query, ] = await db_pool.query(
                `SELECT
                    user_id
                FROM oauth
                WHERE
                    github_id=?`,
                [user_id_github,]
            )
            if (oauth_query.length == 1) {
                return oauth_query[0].user_id
            }
            return null
        },

        get_gitlab_user_token: async (code) => {
            let request = {
                url: `https://gitlab.com/oauth/token`,
                method: "post",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded",
                    'Accept': 'application/json',
                    'cache-control': 'no-cache',
                },
                params : {
                    code,
                    client_id    : process.env.OAUTH_GITLAB_ID,
                    client_secret: process.env.OAUTH_GITLAB_SECRET,
                    redirect_uri : `${back_hostname}/api/auth/oauth/gitlab`,
                    grant_type: 'authorization_code',
                    state: 'test'
                }
            };
            const response = await axios(request);
            return response;
        },


        get_gitlab_user_details: async (bearer_token) => {
            let request = {
                url: `https://gitlab.com/api/v4/user`,
                method: "get",
                headers: {
                    "Content-type": "application/json",
                    Authorization : `Bearer ${bearer_token}`
                }
            };
            const response = await axios(request);
            return response;
        },


        get_gitlab_user_local_id: async (user_id_gitlab) => {
            let [oauth_query, ] = await db_pool.query(
                `SELECT
                    user_id
                FROM oauth
                WHERE
                    gitlab_id=?`,
                [user_id_gitlab,]
            )
            if (oauth_query.length == 1) {
                return oauth_query[0].user_id
            }
            return null
        },


        get_google_user_token: async (code) => {
            let request = {
                url: `https://oauth2.googleapis.com/token`,
                method: "post",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded",
                    'Accept': 'application/json'
                },
                data : {
                    code,
                    client_id: process.env.OAUTH_GOOGLE_ID,
                    client_secret: process.env.OAUTH_GOOGLE_SECRET,
                    redirect_uri: `${back_hostname}/api/auth/oauth/google`,
                    grant_type: 'authorization_code'
                }
            };
            const response = await axios(request);
            return response;
        },

        get_google_user_details: async (access_token) => {
            let request = {
                url: 'https://people.googleapis.com/v1/people/me',
                method: 'get',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Accept': 'application/json'
                },
                params: {
                    'personFields': 'names,emailAddresses'
                }
            }
            const response = await axios(request);
            return response;
        },


        get_google_user_local_id: async (user_id_google) => {
            let [oauth_query, ] = await db_pool.query(
                `SELECT
                    user_id
                FROM oauth
                WHERE
                    google_id=?`,
                [user_id_google,]
            )
            if (oauth_query.length == 1) {
                return oauth_query[0].user_id
            }
            return null
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
                            ext_id     : user_details.data.id,
                            login     : user_details.data.login,
                            first_name: user_details.data.first_name,
                            last_name : user_details.data.last_name,
                            picture   : user_details.data.image.link
                        }
                        console.log("Got user info from 42:", user_info)
                        console.log("Checking if this oauth is to create user or login.")
                        let local_user_id = await utils.get_42_user_local_id(user_info.ext_id)
                        let user_exists   = (local_user_id != null)
                        console.log("User already exists:", user_exists)
                        if (!user_exists) {
                            try {
                                local_user_id = await utils.create_user(user_info, type=42)
                            }
                            catch (e) {
                                if (e.message == return_codes.MAIL_ALREADY_TAKEN) {
                                    console.log("Redirecting user to password reset.")
                                    return res.redirect(`${front_hostname}/forgotpassword/taken`)
                                }
                                if (e.message == return_codes.USERNAME_TAKEN) {
                                    console.log("Redirecting user to signup.")
                                    return res.redirect(`${front_hostname}/sign_up`)
                                }
                                console.log("Unknown error in oauth", e)
                                return res.redirect(`${front_hostname}/sign_up`)
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
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },

        oauth_github_InUp: async (req, res) => {
            console.log("1. [oauth.controller]: Starting oauth process...")
            try {
                console.log('2. [oauth.controller] Recieved code: ', req.query.code)
                console.log('3. [oauth.controller] Trading code for github token with github API...')
                let token_github = await utils.get_github_user_token(req.query.code)
                if (token_github.status == 200) {
                    console.log('4. [oauth.controller] Got github token, using it to get user info from github API: ', token_github.data)
                    let user_details = await utils.get_github_user_details(token_github.data.access_token)
                    if (user_details.status == 200) {
                        console.log("USER DETAILS: ", user_details.data)
                        user_info = {
                            mail      : user_details.data.email ? user_details.data.email : '',
                            ext_id    : user_details.data.id,
                            login     : user_details.data.login,
                            first_name: user_details.data.first_name ? user_details.data.first_name : '',
                            last_name : user_details.data.last_name ? user_details.data.last_name : '',
                            picture   : user_details.data.avatar_url
                        }
                        console.log("5. [oauth.controller] Got user info from github:", user_info)
                        console.log("6. [oauth.controller] Checking if this oauth is to create user or login...")
                        let local_user_id = await utils.get_github_user_local_id(user_info.ext_id)
                        let user_exists  = (local_user_id != null)
                        if (!user_exists) {
                            console.log("7. [oauth.controller] User does not exists")
                            try {
                                console.log("8. [oauth.controller] Creating user ...")
                                local_user_id = await utils.create_user(user_info, "git")
                            }
                            catch (e) {
                                if (e.message == return_codes.MAIL_ALREADY_TAKEN) {
                                    console.log("ERROR: [oauth.controller] MAIL_ALREADY_TAKEN, Redirecting user to password reset.")
                                    return res.redirect(`${front_hostname}/forgotpassword/taken`)
                                }
                                if (e.message == return_codes.USERNAME_TAKEN) {
                                    console.log("ERROR: [oauth.controller] USERNAME_TAKEN, Redirecting user to password reset.")
                                    return res.redirect(`${front_hostname}/sign_up`)
                                }
                                console.log("Unknown error in oauth", e)
                                return res.redirect(`${front_hostname}/sign_up`)
                            }
                        }
                        console.log(`9. [oauth.controller] Got id ${local_user_id}, now creating user token  ...`)
                        let access_token = utils.create_access_token(local_user_id)

                        console.log("10. [oauth.controller] Redirecting user to signin page and passing token in URL.")
                        return res.redirect(`${front_hostname}/sign_in?oauth_token=${encodeURIComponent(access_token)}`)
                    }
                }
            }
            catch (e) {
                if (e.code == "ER_WARN_DATA_OUT_OF_RANGE") {
                    console.log("[oauth.controller]: ER_WARN_DATA_OUT_OF_RANGE")
                }
                console.log("Unknown ERR in oauth github", e)
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },


        oauth_gitlab_InUp: async (req, res) => {
            console.log("1. [oauth.controller]: Starting oauth process...")
            try {
                console.log('2. [oauth.controller] Recieved code: ', req.query.code)
                console.log('3. [oauth.controller] Trading code for gitlab token with gitlab API...')
                let token_gitlab = await utils.get_gitlab_user_token(req.query.code)
                if (token_gitlab.status == 200) {
                    console.log('4. [oauth.controller] Got gitlab token, using it to get user info from gitlab API: ', token_gitlab.data)
                    let user_details = await utils.get_gitlab_user_details(token_gitlab.data.access_token)
                    if (user_details.status == 200) {
                        console.log("USER DETAILS: ", user_details.data)
                        user_info = {
                            mail      : user_details.data.email ? user_details.data.email : '',
                            ext_id    : user_details.data.id,
                            login     : user_details.data.username,
                            first_name: user_details.data.name ? user_details.data.name.split(" ")[0] : '',
                            last_name : user_details.data.name && user_details.data.name.split(' ').length == 2 ? user_details.data.name.split(" ")[1] : '',
                            picture   : user_details.data.avatar_url
                        }
                        console.log("5. [oauth.controller] Got user info from gitlab:", user_info)
                        console.log("6. [oauth.controller] Checking if this oauth is to create user or login...")
                        let local_user_id = await utils.get_gitlab_user_local_id(user_info.ext_id)
                        let user_exists  = (local_user_id != null)
                        if (!user_exists) {
                            console.log("7. [oauth.controller] User does not exists")
                            try {
                                console.log("8. [oauth.controller] Creating user ...")
                                local_user_id = await utils.create_user(user_info, "git")
                            }
                            catch (e) {
                                if (e.message == return_codes.MAIL_ALREADY_TAKEN) {
                                    console.log("ERROR: [oauth.controller] MAIL_ALREADY_TAKEN, Redirecting user to password reset.")
                                    return res.redirect(`${front_hostname}/forgotpassword/taken`)
                                }
                                if (e.message == return_codes.USERNAME_TAKEN) {
                                    console.log("ERROR: [oauth.controller] USERNAME_TAKEN, Redirecting user to password reset.")
                                    return res.redirect(`${front_hostname}/sign_up`)
                                }
                                console.log("Unknown error in oauth", e)
                                return res.redirect(`${front_hostname}/sign_up`)
                            }
                        }
                        console.log(`9. [oauth.controller] Got id ${local_user_id}, now creating user token  ...`)
                        let access_token = utils.create_access_token(local_user_id)

                        console.log("10. [oauth.controller] Redirecting user to signin page and passing token in URL.")
                        return res.redirect(`${front_hostname}/sign_in?oauth_token=${encodeURIComponent(access_token)}`)
                    }
                }
            }
            catch (e) {
                if (e.code == "ER_WARN_DATA_OUT_OF_RANGE") {
                    console.log("[oauth.controller]: ER_WARN_DATA_OUT_OF_RANGE")
                }
                console.log("Unknown ERR in oauth gitlab", e)
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },



        oauth_google_InUp: async (req, res) => {
            console.log("1. [oauth.controller]: Starting oauth process...")
            try {
                const code = req.query.code
                console.log('2. [oauth.controller] Recieved code: ', code)
                console.log('3. [oauth.controller] Trading code for google token with google API...')
                const google_res = await utils.get_google_user_token(code)
                if (google_res.status == 200) {
                    console.log('4. [oauth.controller] Got token, getting user details: ', google_res.data.id_token)
                    const user_details = await verify(google_res.data.id_token)
                    console.log("user_details : ", user_details)
                    if (user_details == null || user_details.length == 0) {
                        console.log("ERROR: [oauth.controller] INVALID_TOKEN, Redirecting user to signup.")
                        return res.redirect(`${front_hostname}/sign_up`)
                    }
                    else if (user_details.email_verified === false) {
                        console.log("ERROR: [oauth.controller] MAIL_NOT_VERIFIED, Redirecting user to signup.")
                        return res.redirect(`${front_hostname}/sign_up`)
                    }
                    else {
                        user_info = {
                            mail      : user_details.email,
                            ext_id    : user_details.sub,
                            login     : user_details.login ? user_details.login : null,
                            first_name: user_details.given_name ? user_details.given_name : null,
                            last_name : user_details.family_name ? user_details.family_name : null,
                            picture   : user_details.picture ? user_details.picture : null
                        }
                        console.log("5. [oauth.controller] Got user info from google:", user_info)
                        console.log("6. [oauth.controller] Checking if this oauth is to create user or login...")
                        let local_user_id = await utils.get_google_user_local_id(user_info.ext_id)
                        let user_exists  = (local_user_id != null)
                        if (!user_exists) {
                            console.log("7. [oauth.controller] User does not exists")
                            try {
                                console.log("8. [oauth.controller] Creating user ...")
                                local_user_id = await utils.create_user(user_info, "google")
                            }
                            catch (e) {
                                if (e.message == return_codes.INVALID_TOKEN) {
                                    console.log("ERROR: [oauth.controller] INVALID_TOKEN, Redirecting user to signup.")
                                    return res.redirect(`${front_hostname}/sign_up`)
                                }
                                if (e.message == return_codes.MAIL_NOT_VERIFIED) {
                                    console.log("ERROR: [oauth.controller] MAIL_NOT_VERIFIED, Redirecting user to signup.")
                                    return res.redirect(`${front_hostname}/sign_up`)
                                }
                                if (e.message == return_codes.MAIL_ALREADY_TAKEN) {
                                    console.log("ERROR: [oauth.controller] MAIL_ALREADY_TAKEN, Redirecting user to password reset.")
                                    return res.redirect(`${front_hostname}/forgotpassword/taken`)
                                }
                                if (e.message == return_codes.USERNAME_TAKEN) {
                                    console.log("ERROR: [oauth.controller] USERNAME_TAKEN, Redirecting user to sign up.")
                                    return res.redirect(`${front_hostname}/sign_up`)
                                }
                                console.log("Unknown error in oauth", e)
                                return res.redirect(`${front_hostname}/sign_up`)
                            }
                        }
                        console.log(`9. [oauth.controller] Got id ${local_user_id}, now creating user token for our website...`)
                        let access_token = utils.create_access_token(local_user_id)

                        console.log("10. [oauth.controller] Redirecting user to signin page and passing token in URL.")
                        return res.redirect(`${front_hostname}/sign_in?oauth_token=${encodeURIComponent(access_token)}`)
                    }
                }
            }
            catch (e) {
                if (e.code == "ER_WARN_DATA_OUT_OF_RANGE") {
                    console.log("[oauth.controller]: ER_WARN_DATA_OUT_OF_RANGE")
                }
                console.log("Unknown ERR in oauth github", e)
                return res.redirect(`${front_hostname}/sign_up`)
            }
        }
    }
}
