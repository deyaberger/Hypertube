
module.exports = (db_pool) => {
    const auth_controller  = require("../controllers/auth.controller" )(db_pool)
    const oauth_controller = require("../controllers/oauth.controller")(db_pool)
    var router = require("express").Router();

    router.post("/signup"          , auth_controller.signup             )
    router.post("/signin"          , auth_controller.signin             )
    router.get ("/forgotpass/:mail", auth_controller.request_reset_pass )
    router.post("/resetpass"       , auth_controller.reset_pass         )

    router.get ("/getid"           , auth_controller.authenticateToken  , auth_controller.print_id)
    router.get ("/oauth"           , oauth_controller.oauthInUp);

    return router
}


