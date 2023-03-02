const axios      = require('axios');
const back_hostname  = require('../utils/hostname.js').back_hostname
const front_hostname = require('../utils/hostname.js').front_hostname

const helper_functions = (db_pool) => {
    const auth_functions = require('./auth')(db_pool)
    return {
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
        }
    }
}

module.exports = (db_pool) => {
    const oauth_functions = require('./oauth')(db_pool)
    const utils = helper_functions(db_pool)

    return {
        get_github_details: async (req, res) => {
            try {
                let token_github = req.oauth_token
                console.log("3. GITHUB [oauth.controller]: get_github_details...")
                let user_details = await utils.get_github_user_details(token_github)
                if (user_details && user_details.status == 200 && user_details.data) {
                    user_info = {
                        mail       : user_details.data.email,
                        ext_id     : user_details.data.id,
                        login      : user_details.data.login,
                        first_name : user_details.data.first_name,
                        last_name  : user_details.data.last_name,
                        picture    : user_details.data.avatar_url
                    }
                    console.log("4. GITHUB [oauth.controller] Got user info from github:", user_info)
                }
            }
            catch(e) {
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
        }
    }
}