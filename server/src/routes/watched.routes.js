
module.exports = (db_pool) => {
    const watched_controller = require("../controllers/watched.controller")(db_pool)
    const auth_controller = require("../controllers/auth.controller")(db_pool)

    var router = require("express").Router();

    router.get  ("/watched_movies", auth_controller.authenticateToken, watched_controller.get_watched_movies);
    router.get  ("/watched_movies_id", auth_controller.authenticateToken, watched_controller.get_watched_movies_ids);
    router.get  ("/is_watched/:movie_id", auth_controller.authenticateToken, watched_controller.is_watched);

    router.post  ("/set_watched/:movie_id", auth_controller.authenticateToken, watched_controller.set_watched);
    router.post  ("/set_unwatched/:movie_id", auth_controller.authenticateToken, watched_controller.set_unwatched);

    return router
}


