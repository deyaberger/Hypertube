
module.exports = (db_pool) => {
    const user_controller = require("../controllers/user.controller")(db_pool)
    const auth_controller = require("../controllers/auth.controller")(db_pool)

    var router = require("express").Router();

    router.get  ("/me"            , auth_controller.authenticateToken, user_controller.get_my_user     )
    router.post  ("/update_first_name", auth_controller.authenticateToken, user_controller.update_first_name)
    router.post  ("/update_last_name", auth_controller.authenticateToken, user_controller.update_last_name)
    router.post  ("/update_bio", auth_controller.authenticateToken, user_controller.update_bio)
    router.post  ("/update_email", auth_controller.authenticateToken, user_controller.update_email)

    // router.patch("/update"        , auth_controller.authenticateToken, user_controller.update_user_info)
    // router.get  ("/:user_id"      , auth_controller.authenticateToken, user_controller.get_other_user  )
    router.get  ("/watched_movies", auth_controller.authenticateToken, user_controller.get_watched_movies);

    return router
}


