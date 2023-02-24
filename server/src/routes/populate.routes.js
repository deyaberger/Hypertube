
module.exports = (db_pool) => {
    const populate_controller = require("../controllers/populate.controller")(db_pool)

    var router = require("express").Router();

    router.get  ("/fetch"               , populate_controller.get_all_movies)
    router.get  ("/get_all_imdb_ids"    , populate_controller.get_all_imdb_ids)
    router.get  ("/add_to_db"           , populate_controller.from_json_to_db)
    router.get  ("/fetch_tmdb/:imdb_id" , populate_controller.fetch_tmdb)


    return router
}


