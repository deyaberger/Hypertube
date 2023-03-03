module.exports = (db_pool) => {
    const oauth_controller = require("../controllers/oauth.controller")(db_pool)
    var router = require("express").Router();

    router.get ("/urls",        oauth_controller.get_urls);

    router.get ("/github",      oauth_controller.get_github_token,
                                oauth_controller.get_github_details,
                                oauth_controller.check_if_github_user_exists,
                                oauth_controller.create_ext_user,
                                oauth_controller.insert_github_user);

    router.get ("/gitlab",      oauth_controller.get_gitlab_token,
                                oauth_controller.get_gitlab_details,
                                oauth_controller.check_if_gitlab_user_exists,
                                oauth_controller.create_ext_user,
                                oauth_controller.insert_gitlab_user);

    router.get ("/42",          oauth_controller.get_42_token,
                                oauth_controller.get_42_details,
                                oauth_controller.check_if_42_user_exists,
                                oauth_controller.create_ext_user,
                                oauth_controller.insert_42_user);

    router.get ("/google",      oauth_controller.get_google_token,
                                oauth_controller.get_google_details,
                                oauth_controller.check_if_google_user_exists,
                                oauth_controller.create_ext_user,
                                oauth_controller.insert_google_user);

    return router
}


