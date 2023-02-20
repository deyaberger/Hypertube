
module.exports = (db_pool) => {
    const fav_controller   = require("../controllers/favorites.controller")(db_pool)
    const auth_controller  = require("../controllers/auth.controller" )(db_pool)

    var router = require("express").Router();

    router.get  ("/all"                    , auth_controller.authenticateToken, fav_controller.get_all)
    router.get  ("/all_ids"                , auth_controller.authenticateToken, fav_controller.get_all_ids)
    router.get  ("/is_fav"                 , auth_controller.authenticateToken, fav_controller.is_favourite)
    router.post  ("/remove/:movie_id"      , auth_controller.authenticateToken, fav_controller.remove_from_favs)
    router.post  ("/add/:movie_id"         , auth_controller.authenticateToken, fav_controller.add_to_favs)
    return router
}


