module.exports = (db_pool) => {
    const fav_controller  = require("../controllers/favorite.controller")(db_pool)
    const auth_middlewares = require("../middlewares/auth.middleware")

    var router = require("express").Router();

    router.get  ("/:user_id"         , auth_middlewares.authenticateToken, fav_controller.get_user_favorites );
    router.post ("/remove/:movie_id" , auth_middlewares.authenticateToken, fav_controller.remove_from_favs);
    router.post ("/add/:movie_id"    , auth_middlewares.authenticateToken, fav_controller.add_to_favs     );

    return router
}


