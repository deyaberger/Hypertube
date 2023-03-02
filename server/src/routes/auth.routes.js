module.exports = (db_pool) => {
    const auth_controller  = require("../controllers/auth.controller" )(db_pool)
    const oauth_controller = require("../controllers/oauth.controller")(db_pool)
    const oauth_controller_bis = require("../controllers/oauth.controller_bis")(db_pool)
    var router = require("express").Router();

    router.post("/signup"          , auth_controller.signup             );
    router.post("/signin"          , auth_controller.signin             );
    router.post("/resetpass"       , auth_controller.reset_pass         );

    router.get ("/getid"           , auth_controller.authenticateToken  , auth_controller.print_id)
    router.get ("/oauth"           , oauth_controller.oauthInUp);
    router.get ("/oauth/42"        , oauth_controller.oauthInUp);
    router.get ("/oauth/github"    , oauth_controller_bis.get_github_token, oauth_controller_bis.get_github_details);
    router.get ("/oauth/google"     , oauth_controller.oauth_google_InUp);
    router.get ("/oauth/gitlab"     , oauth_controller.oauth_gitlab_InUp);

    return router
}


