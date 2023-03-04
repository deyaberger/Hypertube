
module.exports = (db_pool) => {
    const user_controller = require("../controllers/user.controller")(db_pool)
    const auth_middlewares = require("../middlewares/auth.middleware")

    var router = require("express").Router();

    router.get  ("/me"               , auth_middlewares.authenticateToken, user_controller.get_user   );
    router.get  ("/profile/:user_id" , auth_middlewares.authenticateToken, user_controller.get_user   );

    router.post ("/update_first_name", auth_middlewares.authenticateToken, user_controller.update_first_name);
    router.post ("/update_last_name" , auth_middlewares.authenticateToken, user_controller.update_last_name );
    router.post ("/update_bio"       , auth_middlewares.authenticateToken, user_controller.update_bio       );
    router.post ("/update_email"     , auth_middlewares.authenticateToken, user_controller.update_email     );

    return router
}


