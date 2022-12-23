
module.exports = (db_pool) => {
    const movie_controller = require("../controllers/movie.controller")(db_pool)
    const auth_controller  = require("../controllers/auth.controller" )(db_pool)

    var router = require("express").Router();

    router.get  ("/home/:page" , auth_controller.authenticateToken, movie_controller.get_homepage)

    return router
}


