
module.exports = (db_pool) => {
    const user_controller = require("../controllers/user.controller")(db_pool)
    const auth_controller = require("../controllers/auth.controller")(db_pool)
    var router = require("express").Router();

    router.get("/myuser", auth_controller.authenticateToken, user_controller.get_my_user)

    return router
}


