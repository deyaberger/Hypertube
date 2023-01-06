
module.exports = (db_pool) => {
    const populate_controller = require("../controllers/populate.controller")(db_pool)

    var router = require("express").Router();

    router.get  ("/fetch"         , populate_controller.get_all_movies)
    router.get  ("/add_to_db"         , populate_controller.from_json_to_db)

    return router
}


