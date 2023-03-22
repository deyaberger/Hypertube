module.exports = (db_pool) => {
    const movie_controller = require("../controllers/movie.controller")(db_pool)
    const auth_middlewares = require("../middlewares/auth.middleware")

    var router = require("express").Router();

    router.get ("/reco"                  , auth_middlewares.authenticateToken, movie_controller.get_recommendations);
    router.get ("/search_page"           , auth_middlewares.authenticateToken, movie_controller.search_page             );
    router.get ("/get_details/:movie_id" , auth_middlewares.authenticateToken, movie_controller.get_details        );

    return router
}


