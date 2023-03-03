module.exports = (db_pool) => {
    const oauth_controller_bis = require("../controllers/oauth.controller_bis")(db_pool)
    var router = require("express").Router();

    router.get ("/urls",        oauth_controller_bis.get_urls);

    router.get ("/github",      oauth_controller_bis.get_github_token,
                                oauth_controller_bis.get_github_details,
                                oauth_controller_bis.check_if_github_user_exists,
                                oauth_controller_bis.create_ext_user,
                                oauth_controller_bis.insert_github_user);

    router.get ("/42",          oauth_controller_bis.get_42_token,
                                oauth_controller_bis.get_42_details,
                                oauth_controller_bis.check_if_42_user_exists,
                                oauth_controller_bis.create_ext_user,
                                oauth_controller_bis.insert_42_user);
    return router
}


