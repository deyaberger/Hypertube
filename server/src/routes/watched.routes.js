
module.exports = (db_pool) => {
    const watched_controller = require("../controllers/watched.controller")(db_pool)
    const auth_middlewares = require("../middlewares/auth.middleware")

    var router = require("express").Router();

    router.get  ("/:user_id"               , auth_middlewares.authenticateToken, watched_controller.get_user_watched_movies);

    router.post ("/set_watched/:movie_id"  , auth_middlewares.authenticateToken, watched_controller.set_watched           );
    router.post ("/set_unwatched/:movie_id", auth_middlewares.authenticateToken, watched_controller.set_unwatched         );

    return router
}


