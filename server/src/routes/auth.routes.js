module.exports = (db_pool) => {
    const auth_controller  = require("../controllers/auth.controller" )(db_pool)
    const auth_middlewares = require("../middlewares/auth.middleware")
    var router = require("express").Router();

    router.post("/signup"             , auth_controller.signup             );
    router.post("/signin"             , auth_controller.signin             );
    router.post("/request_pass_reset" , auth_controller.request_reset_pass );
    router.post("/resetpass"          , auth_controller.reset_pass         );

    router.get ("/getid"              , auth_middlewares.authenticateToken , auth_controller.print_id)

    return router
}


