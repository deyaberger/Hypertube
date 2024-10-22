const axios          = require('axios');
const { nanoid }     = require("nanoid");
const back_hostname  = require('../utils/hostname.js').back_hostname;
const front_hostname = require('../utils/hostname.js').front_hostname;
const return_codes   = require('../utils/return_codes.js');
const { OAuth2Client } = require('google-auth-library');


const helper_functions = (db_pool) => {
    const auth_functions = require('./auth')(db_pool)
    const oauth_functions = require('./oauth')(db_pool)
    return {
        create_username: async (firstName, lastName, mail) => {
            console.log({firstName, lastName, mail})
            let tmp_username = null
            if (firstName && lastName) {
                tmp_username = `${firstName}${lastName}`
            }
            else if (firstName) {
                tmp_username = firstName
            }
            else if (lastName) {
                tmp_username = lastName
            }
            else if (mail) {
                tmp_username = mail.split("@")[0]
            }
            if (tmp_username == null || tmp_username == undefined) {
                throw(new Error(return_codes.CANT_CREATE_USERNAME))
            }
            let already_exists = await oauth_functions.check_if_username_exists(tmp_username)
            if (already_exists && already_exists.length == 0) {
                return tmp_username
            }
            if (already_exists && already_exists.length > 0) {
                let count_res = await oauth_functions.count_users()
                if (count_res != null ) {
                    let top = count_res.nb > 100 ? count_res.nb : 100
                    for (let index = 0; index < 10; index++) {
                        let randomNumber = Math.floor(Math.random() * top);
                        let new_username = `${tmp_username}_${randomNumber}`;
                        already_exists = await oauth_functions.check_if_username_exists(new_username)
                        if (already_exists && already_exists.length == 0) {
                            return new_username
                        }
                    }
                }
            }
            throw(new Error(return_codes.CANT_CREATE_USERNAME))
        },

        // *************************************************** GITHUB *************************************************
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
                    redirect_uri : `${back_hostname}/api/oauth/github`,
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

        // *************************************************** GITLAB *************************************************
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
                    redirect_uri : `${back_hostname}/api/oauth/gitlab`,
                    grant_type: 'authorization_code',
                    // state: 'test'
                }
            };
            console.log("REquest: ", request)
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

        // *************************************************** 42 *************************************************
        get_42_user_token: async (code) => {
            let request = {
                url: `https://api.intra.42.fr/oauth/token`,
                method: "post",
                headers: {
                    "Content-type": "application/json",
                    'Accept'      : 'application/json'
                },
                params : {
                    grant_type   : 'authorization_code',
                    client_id    : process.env.OAUTH_42_ID,
                    client_secret: process.env.OAUTH_42_SECRET,
                    redirect_uri : `${back_hostname}/api/oauth/42`,
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
                    "Content-type"   : "application/json",
                    'Accept-Encoding': 'identity',
                    Authorization    : `Bearer ${bearer_token}`
                }
            };
            const response = await axios(request);
            return response;
        },

        // *************************************************** GOOGLE *************************************************
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
                    redirect_uri: `${back_hostname}/api/oauth/google`,
                    grant_type: 'authorization_code'
                }
            };
            const response = await axios(request);
            return response;
        },

        get_google_user_details: async (bearer_token) => {
            const google_client = new OAuth2Client(process.env.OAUTH_GOOGLE_ID);
            const ticket = await google_client.verifyIdToken({
                idToken: bearer_token,
                audience: process.env.OAUTH_GOOGLE_ID,
            })
            return ticket.getPayload()
        },


        create_access_token: auth_functions.create_access_token
    }
}

module.exports = (db_pool) => {
    const auth_functions = require('./auth')(db_pool)
    const oauth_functions = require('./oauth')(db_pool)
    const utils = helper_functions(db_pool)
    const querystring = require('querystring');

    return {

        get_urls: async (req, res) => {
            // GITHUB
            const params_github = {
				client_id    : process.env.OAUTH_GITHUB_ID,
				redirect_uri : 'http://localhost:8071/api/oauth/github'
			};
			const query_github = querystring.stringify(params_github);
			const url_github = `https://github.com/login/oauth/authorize?${query_github}`

            // GITLAB
            const params_gitlab = {
				client_id     : process.env.OAUTH_GITLAB_ID,
				redirect_uri  : 'http://localhost:8071/api/oauth/gitlab',
                response_type : 'code',
                scope         : 'read_user email'
			};
			const query_gitlab = querystring.stringify(params_gitlab);
			const url_gitlab = `https://gitlab.com/oauth/authorize?${query_gitlab}`

            // 42
            const params_42 = {
				client_id     : process.env.OAUTH_42_ID,
				redirect_uri  : 'http://localhost:8071/api/oauth/42',
                response_type : 'code'
			};
			const query_42 = querystring.stringify(params_42);
			const url_42 = `https://api.intra.42.fr/oauth/authorize?${query_42}`

            // GOOGLE
            const params_google = {
				client_id     : process.env.OAUTH_GOOGLE_ID,
				redirect_uri  : 'http://localhost:8071/api/oauth/google',
                scope         : 'openid profile email',
                response_type : 'code',
                access_type   : 'offline',
                prompt        : 'consent'
			};
			const query_google = querystring.stringify(params_google);
			const url_google = `https://accounts.google.com/o/oauth2/v2/auth?${query_google}`

            return res.status(200).send({urls : {url_github, url_gitlab, url_42, url_google}})

        },

        create_ext_user: async (req, res, next) => {
            try {
                let type = req.type
                let username        = req.user_details.username;
                let firstName       = req.user_details.first_name;
                let lastName        = req.user_details.last_name;
                let mail            = req.user_details.mail;
                let picture         = req.user_details.picture;
                let randomstr       = nanoid(48)
                console.log("\n8. [oauth.controller] Signin up user from oauth details...", type)

                let regex_whitespace = /^\S*$/;
                if (firstName != null && firstName.match(regex_whitespace) == null) {
                    firstName = firstName.split(" ")[0];
                }
                if (lastName != null && lastName.match(regex_whitespace) == null) {
                    lastName = lastName.split(" ")[0];
                }
                if (username != null && username.length != 0 && username.match(regex_whitespace) == null) {
                    username = username.split(" ")[0];
                }
                else if (username == null || username.length == 0)  {
                    console.log("8bis. [oauth.controller] Creating fake username...")
                    username = await utils.create_username(firstName, lastName, mail)
                    console.log("8bis. [oauth.controller]: ", {"fake username" : username})
                }
                if (username != null) {
                    signup_result  = await auth_functions.signup(
                        username,
                        firstName,
                        lastName,
                        mail,
                        randomstr,
                        picture,
                        'en')
                    if (signup_result != null && signup_result != undefined && signup_result.affectedRows == 1) {
                        req.user_id = signup_result.insertId
                        console.log("\n9. [oauth.controller] Successfully signed up user in USERS table! , ")
                        next()
                    }
                }
                else {
                    console.log("ERROR [oauth.controller]: could not create user", req.user_details)
                    return res.redirect(`${front_hostname}/sign_up`)
                }
            }
            catch(e) {
                if (e.message == return_codes.CANT_CREATE_USERNAME) {
                    console.log("ERROR: [oauth.controller] CANT_CREATE_USERNAME, Redirecting signup page")
                }
                else if (e.code == "ER_DUP_ENTRY") {
                    if (e.sqlMessage.includes('mail_uindex')) {
                        console.log("ERROR: [oauth.controller] MAIL_ALREADY_TAKEN, Redirecting signup page")
                    }
                    else if (e.sqlMessage.includes('name_uindex')) {
                        console.log("ERROR: [oauth.controller] USERNAME_ALREADY_TAKEN, Redirecting signup page")
                    }
                    return res.redirect(`${front_hostname}/sign_up`)
                }
                console.log("UNKOWN ERROR GITHUB [oauth.controller]: could not create user", e)
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },

        // ------------------------------------------GITHUB-------------------------------------------------------------
        insert_github_user: async (req, res) => {
            console.log("\n10. GITHUB [oauth.controller] FINAL STEP, inserting github user")
            let hypertube_id = req.user_id
            let github_id = req.user_details.ext_id
            try {
                let insert_oauth = await oauth_functions.insert_github_user(github_id, hypertube_id)
                if (insert_oauth != null  && insert_oauth.affectedRows == 1) {
                    console.log("11. GITHUB [oauth.controller] Successfully inserted user into oauth table")
                    let access_token = utils.create_access_token(hypertube_id)
                    console.log("12. GITHUB [oauth.controller] Got token, redirecting to user account ;) ")
                    return res.redirect(`${front_hostname}/sign_in?oauth_token=${encodeURIComponent(access_token)}`)
                }
                console.log("[oauth.controller]: ERROR when inserting github user in oauth table: ")
                return res.redirect(`${front_hostname}/sign_up`)
            }
            catch (e) {
                console.log("[oauth.controller]: ERROR when inserting github user in oauth table: ", e)
                let del = await auth_functions.delete_user(hypertube_id)
                console.log("[oauth.controller], ERROR: deleted user, now redirecting to sign up")
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },

        check_if_github_user_exists: async (req, res, next) => {
            try {
                let user_details = req.user_details
                let id = user_details.ext_id
                console.log("\n6. GITHUB [oauth.controller]: check_if_github_user_exists... ", id)
                let local_user_id = await oauth_functions.get_github_user_local_id(id)
                let user_exists  = (local_user_id != null)
                if (!user_exists) {
                    req.type = "github"
                    console.log("7. GITHUB [oauth.controller]: User does not exists, we must create it")
                    next()
                }
                else {
                    console.log("7. GITHUB [oauth.controller]: User does exists, creating a hypertube token..")
                    let access_token = utils.create_access_token(local_user_id)
                    console.log("8. GITHUB [oauth.controller]: Got token, redirecting to existing account..", {access_token})
                    return res.redirect(`${front_hostname}/sign_in?oauth_token=${encodeURIComponent(access_token)}`)
                }
            }
            catch(e) {
                console.log("UNKOWN ERROR GITHUB [oauth.controller]: could not check_if_github_user_exists", e)
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },

        get_github_details: async (req, res, next) => {
            try {
                let token_github = req.oauth_token
                console.log("\n4. GITHUB [oauth.controller]: get_github_details...")
                let user_details = await utils.get_github_user_details(token_github)
                if (user_details && user_details.status == 200 && user_details.data) {
                    req.user_details = {
                        mail       : user_details.data.email,
                        ext_id     : user_details.data.id,
                        username   : user_details.data.login,
                        first_name : user_details.data.first_name,
                        last_name  : user_details.data.last_name,
                        picture    : user_details.data.avatar_url
                    }
                    console.log("5. GITHUB [oauth.controller] Got user info from github:", req.user_details)
                    next()
                }
                else {
                    console.log("UNKOWN ERROR GITHUB [oauth.controller]: could not get github user details", {user_details})
                    return res.redirect(`${front_hostname}/sign_up`)
                }
            }
            catch(e) {
                if (e.code == "ERR_BAD_REQUEST") {
                    console.log("ERR_BAD_REQUEST GITHUB [oauth.controller]: could not get github user details")
                    return res.redirect(`${front_hostname}/sign_up`)
                }
                console.log("UNKOWN ERROR GITHUB [oauth.controller]: could not get github user details", e)
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },

        get_github_token: async (req, res, next) => {
            console.log("1. GITHUB [oauth.controller]: Starting oauth process...")
            try {
                let code = req.query.code
                console.log('2. GITHUB [oauth.controller] Recieved code: ', code)
                let token_github = await utils.get_github_user_token(code)
                if (token_github != null && token_github.status == 200 && token_github.data) {
                    if (token_github.data.access_token != null && token_github.data.access_token != undefined) {
                        req.oauth_token = token_github.data.access_token
                        console.log("3. GITHUB [oauth.controller]: Successfully received oauth token: ", req.oauth_token)
                        next()
                    }
                }
                else {
                    console.log("UNKOWN ERROR GITHUB [oauth.controller]: could not get oauth token, ", {token_github: token_github, code : e.code, msg: e.response})
                    return res.redirect(`${front_hostname}/sign_up`)
                }
            }
            catch(e) {
                console.log("UNKOWN ERROR GITHUB [oauth.controller]: could not get oauth token, ", {code : e.code, msg: e.response})
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },

        // ------------------------------------------GITLAB-------------------------------------------------------------
        insert_gitlab_user: async (req, res) => {
            console.log("\n10. GITLAB [oauth.controller] FINAL STEP, inserting gitlab user")
            let hypertube_id = req.user_id
            let gitlab_id = req.user_details.ext_id
            try {
                let insert_oauth = await oauth_functions.insert_gitlab_user(gitlab_id, hypertube_id)
                if (insert_oauth != null  && insert_oauth.affectedRows == 1) {
                    console.log("11. GITLAB [oauth.controller] Successfully inserted user into oauth table")
                    let access_token = utils.create_access_token(hypertube_id)
                    console.log("12. GITLAB [oauth.controller] Got token, redirecting to user account ;) ")
                    return res.redirect(`${front_hostname}/sign_in?oauth_token=${encodeURIComponent(access_token)}`)
                }
                console.log("[oauth.controller]: ERROR when inserting gitlab user in oauth table: ")
                return res.redirect(`${front_hostname}/sign_up`)
            }
            catch (e) {
                console.log("[oauth.controller]: ERROR when inserting gitlab user in oauth table: ", e)
                let del = await auth_functions.delete_user(hypertube_id)
                console.log("[oauth.controller], ERROR: deleted user, now redirecting to sign up")
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },


        check_if_gitlab_user_exists: async (req, res, next) => {
            try {
                let user_details = req.user_details
                let id = user_details.ext_id
                console.log("\n6. GITLAB [oauth.controller]: check_if_gitlab_user_exists... ", id)
                let local_user_id = await oauth_functions.get_gitlab_user_local_id(id)
                let user_exists  = (local_user_id != null)
                if (!user_exists) {
                    req.type = "gitlab"
                    console.log("7. GITLAB [oauth.controller]: User does not exists, we must create it")
                    next()
                }
                else {
                    console.log("7. GITLAB [oauth.controller]: User does exists, creating a hypertube token..")
                    let access_token = utils.create_access_token(local_user_id)
                    console.log("8. GITLAB [oauth.controller]: Got token, redirecting to existing account..", {access_token})
                    return res.redirect(`${front_hostname}/sign_in?oauth_token=${encodeURIComponent(access_token)}`)
                }
            }
            catch(e) {
                console.log("UNKOWN ERROR GITLAB [oauth.controller]: could not check_if_gitlab_user_exists", e)
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },

        get_gitlab_details: async (req, res, next) => {
            try {
                let token_gitlab = req.oauth_token
                console.log("\n4. GITLAB [oauth.controller]: get_gitlab_details...")
                let user_details = await utils.get_gitlab_user_details(token_gitlab)
                if (user_details && user_details.status == 200 && user_details.data) {
                    req.user_details = {
                        mail       : user_details.data.email,
                        ext_id     : user_details.data.id,
                        username   : user_details.data.username,
                        first_name : user_details.data.name ? user_details.data.name.split(" ")[0] : '',
                        last_name  : user_details.data.name && user_details.data.name.split(' ').length == 2 ? user_details.data.name.split(" ")[1] : '',
                        picture    : user_details.data.avatar_url
                    }
                    console.log("5. GITLAB [oauth.controller] Got user info from gitlab:", req.user_details)
                    next()
                }
                else {
                    console.log("UNKOWN ERROR GITLAB [oauth.controller]: could not get gitlab user details", {user_details})
                    return res.redirect(`${front_hostname}/sign_up`)
                }
            }
            catch(e) {
                if (e.code == "ERR_BAD_REQUEST") {
                    console.log("ERR_BAD_REQUEST GITLAB [oauth.controller]: could not get gitlab user details")
                    return res.redirect(`${front_hostname}/sign_up`)
                }
                console.log("UNKOWN ERROR GITLAB [oauth.controller]: could not get gitlab user details", e)
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },


        get_gitlab_token: async (req, res, next) => {
            console.log("1. GITLAB [oauth.controller]: Starting oauth process...")
            try {
                let code = req.query.code
                console.log('2. GITLAB [oauth.controller] Recieved code: ', code)
                let token_gitlab = await utils.get_gitlab_user_token(code)
                if (token_gitlab != null && token_gitlab.status == 200 && token_gitlab.data) {
                    if (token_gitlab.data.access_token != null && token_gitlab.data.access_token != undefined) {
                        req.oauth_token = token_gitlab.data.access_token
                        console.log("3. GITLAB [oauth.controller]: Successfully received oauth token: ", req.oauth_token)
                        next()
                    }
                }
                else {
                    console.log("UNKOWN ERROR GITLAB [oauth.controller]: could not get oauth token, ", {token_gitlab: token_gitlab, code : e.code, msg: e.response})
                    return res.redirect(`${front_hostname}/sign_up`)
                }
            }
            catch(e) {
                console.log("UNKOWN ERROR GITLAB [oauth.controller]: could not get oauth token, ", {code : e.code, msg: e.response})
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },

        // ------------------------------------------42-------------------------------------------------------------
        insert_42_user: async (req, res) => {
            console.log("\n10. 42 [oauth.controller] FINAL STEP, inserting 42 user")
            let id_hypertube = req.user_id
            let id_42 = req.user_details.ext_id
            try {
                let insert_oauth = await oauth_functions.insert_42_user(id_42, id_hypertube)
                if (insert_oauth != null  && insert_oauth.affectedRows == 1) {
                    console.log("11. 42 [oauth.controller] Successfully inserted user into oauth table")
                    let access_token = utils.create_access_token(id_hypertube)
                    console.log("12. 42 [oauth.controller] Got token, redirecting to user account ;) ")
                    return res.redirect(`${front_hostname}/sign_in?oauth_token=${encodeURIComponent(access_token)}`)
                }
                console.log("[oauth.controller]: ERROR when inserting 42 user in oauth table: ")
                return res.redirect(`${front_hostname}/sign_up`)
            }
            catch (e) {
                console.log("[oauth.controller]: ERROR when inserting 42 user in oauth table: ", e)
                let del = await auth_functions.delete_user(id_hypertube)
                console.log("[oauth.controller], ERROR: deleted user, now redirecting to sign up")
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },

        check_if_42_user_exists: async (req, res, next) => {
            try {
                let user_details = req.user_details
                let id = user_details.ext_id
                console.log("\n6. 42 [oauth.controller]: check_if_42_user_exists... ", id)
                let local_user_id = await oauth_functions.get_42_user_local_id(id)
                let user_exists  = (local_user_id != null)
                if (!user_exists) {
                    req.type = "42"
                    console.log("7. 42 [oauth.controller]: User does not exists, we must create it")
                    next()
                }
                else {
                    console.log("7. 42 [oauth.controller]: User does exists, creating a hypertube token..")
                    let access_token = utils.create_access_token(local_user_id)
                    console.log("8. 42 [oauth.controller]: Got token, redirecting to existing account..", {access_token})
                    return res.redirect(`${front_hostname}/sign_in?oauth_token=${encodeURIComponent(access_token)}`)
                }
            }
            catch(e) {
                console.log("UNKOWN ERROR 42 [oauth.controller]: could not check_if_42_user_exists", e)
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },

        get_42_details: async (req, res, next) => {
            try {
                let token_42 = req.oauth_token
                console.log("\n4. 42 [oauth.controller]: get_42_details...")
                let user_details = await utils.get_42_user_details(token_42)
                if (user_details && user_details.status == 200 && user_details.data) {
                    req.user_details = {
                        mail       : user_details.data.email,
                        ext_id     : user_details.data.id,
                        username   : user_details.data.login,
                        first_name : user_details.data.first_name,
                        last_name  : user_details.data.last_name,
                        picture    : user_details.data.image.link
                    }
                    console.log("5. 42 [oauth.controller] Got user info from 42:", req.user_details)
                    next()
                }
                else {
                    console.log("UNKOWN ERROR 42 [oauth.controller]: could not get 42 user details", {user_details})
                    return res.redirect(`${front_hostname}/sign_up`)
                }
            }
            catch(e) {
                if (e.code == "ERR_BAD_REQUEST") {
                    console.log("ERR_BAD_REQUEST 42 [oauth.controller]: could not get 42 user details")
                    return res.redirect(`${front_hostname}/sign_up`)
                }
                console.log("UNKOWN ERROR 42 [oauth.controller]: could not get 42 user details", e)
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },

        get_42_token: async (req, res, next) => {
            console.log("1. 42 [oauth.controller]: Starting oauth process...")
            try {
                let code = req.query.code
                console.log('2. 42 [oauth.controller] Recieved code: ', code)
                let token_42 = await utils.get_42_user_token(code)
                if (token_42 != null && token_42.status == 200 && token_42.data) {
                    if (token_42.data.access_token != null && token_42.data.access_token != undefined) {
                        req.oauth_token = token_42.data.access_token
                        console.log("3. 42 [oauth.controller]: Successfully received oauth token: ", req.oauth_token)
                        next()
                    }
                }
                else {
                    console.log("UNKOWN ERROR 42 [oauth.controller]: could not get oauth token, ", {token_42: token_42, code : e.code, msg: e.response})
                    return res.redirect(`${front_hostname}/sign_up`)
                }
            }
            catch(e) {
                console.log("UNKOWN ERROR 42 [oauth.controller]: could not get oauth token, ", {code : e.code, msg: e.response})
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },

        // ------------------------------------------ GOOGLE -------------------------------------------------------------

        insert_google_user: async (req, res) => {
            console.log("\n10. GOOGLE [oauth.controller] FINAL STEP, inserting google user")
            let hypertube_id = req.user_id
            let google_id = req.user_details.ext_id
            try {
                let insert_oauth = await oauth_functions.insert_google_user(google_id, hypertube_id)
                if (insert_oauth != null  && insert_oauth.affectedRows == 1) {
                    console.log("11. GOOGLE [oauth.controller] Successfully inserted user into oauth table")
                    let access_token = utils.create_access_token(hypertube_id)
                    console.log("12. GOOGLE [oauth.controller] Got token, redirecting to user account ;) ")
                    return res.redirect(`${front_hostname}/sign_in?oauth_token=${encodeURIComponent(access_token)}`)
                }
                console.log("[oauth.controller]: ERROR when inserting google user in oauth table: ")
                return res.redirect(`${front_hostname}/sign_up`)
            }
            catch (e) {
                console.log("[oauth.controller]: ERROR when inserting google user in oauth table: ", e)
                let del = await auth_functions.delete_user(hypertube_id)
                console.log("[oauth.controller], ERROR: deleted user, now redirecting to sign up")
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },

        check_if_google_user_exists: async (req, res, next) => {
            try {
                let user_details = req.user_details
                let id = user_details.ext_id
                console.log("\n6. GOOGLE [oauth.controller]: check_if_google_user_exists... ", id)
                let local_user_id = await oauth_functions.get_google_user_local_id(id)
                let user_exists  = (local_user_id != null)
                if (!user_exists) {
                    req.type = "google"
                    console.log("7. GOOGLE [oauth.controller]: User does not exists, we must create it")
                    next()
                }
                else {
                    console.log("7. GOOGLE [oauth.controller]: User does exists, creating a hypertube token..")
                    let access_token = utils.create_access_token(local_user_id)
                    console.log("8. GOOGLE [oauth.controller]: Got token, redirecting to existing account..", {access_token})
                    return res.redirect(`${front_hostname}/sign_in?oauth_token=${encodeURIComponent(access_token)}`)
                }
            }
            catch(e) {
                console.log("UNKOWN ERROR GOOGLE [oauth.controller]: could not check_if_google_user_exists", e)
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },

        get_google_details: async (req, res, next) => {
            try {
                let token_google = req.oauth_token
                console.log("\n4. GOOGLE [oauth.controller]: get_google_details...")
                let user_details = await utils.get_google_user_details(token_google)
                if (user_details && user_details.email_verified == true) {
                    req.user_details = {
                        mail       : user_details.email,
                        ext_id     : user_details.sub,
                        username   : user_details.login,
                        first_name : user_details.given_name,
                        last_name  : user_details.family_name,
                        picture    : user_details.picture
                    }
                    console.log("5. GOOGLE [oauth.controller] Got user info from google:", req.user_details)
                    next()
                }
                else if (user_details == null || user_details.length == 0) {
                    console.log("INVALID_TOKEN GOOGLE [oauth.controller]: could not get google user details")
                    return res.redirect(`${front_hostname}/sign_up`)
                }
                else if (user_details.email_verified === false) {
                    console.log("MAIL_NOT_VERIFIED GOOGLE [oauth.controller]: could not get google user details")
                    return res.redirect(`${front_hostname}/sign_up`)
                }
                else {
                    console.log("UNKOWN ERROR GOOGLE [oauth.controller]: could not get google user details", {user_details})
                    return res.redirect(`${front_hostname}/sign_up`)
                }
            }
            catch(e) {
                if (e.code == "ERR_BAD_REQUEST") {
                    console.log("ERR_BAD_REQUEST GOOGLE [oauth.controller]: could not get google user details")
                    return res.redirect(`${front_hostname}/sign_up`)
                }
                console.log("UNKOWN ERROR GOOGLE [oauth.controller]: could not get google user details", e)
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },

        get_google_token: async (req, res, next) => {
            console.log("1. GOOGLE [oauth.controller]: Starting oauth process...")
            try {
                let code = req.query.code
                console.log('2. GOOGLE [oauth.controller] Recieved code: ', code)
                let token_google = await utils.get_google_user_token(code)
                if (token_google != null && token_google.status == 200 && token_google.data) {
                    if (token_google.data.id_token != null && token_google.data.id_token != undefined) {
                        req.oauth_token = token_google.data.id_token
                        console.log("3. GOOGLE [oauth.controller]: Successfully received oauth token: ", req.oauth_token);
                        next()
                    }
                }
                else {
                    console.log("UNKOWN ERROR GOOGLE [oauth.controller]: could not get oauth token, ", {token_google: token_google, code : e.code, msg: e.response})
                    return res.redirect(`${front_hostname}/sign_up`)
                }
            }
            catch(e) {
                console.log("UNKOWN ERROR GOOGLE [oauth.controller]: could not get oauth token, ", {code : e.code, msg: e.response})
                return res.redirect(`${front_hostname}/sign_up`)
            }
        },

    }
}