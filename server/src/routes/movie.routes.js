
module.exports = (db_pool) => {
    const movie_controller = require("../controllers/movie.controller")(db_pool)
    const auth_controller  = require("../controllers/auth.controller" )(db_pool)

    var router = require("express").Router();

    router.get  ("/home"              , auth_controller.authenticateToken, movie_controller.get_homepage)
    router.get  ("/search"            , auth_controller.authenticateToken, movie_controller.search)
    // router.get  ("/details/:movie_id"  , auth_controller.authenticateToken, movie_controller.get_movie_details)
    router.post ("/set_watched/:movie_id"  , auth_controller.authenticateToken, movie_controller.set_movie_watched)

    return router
}


