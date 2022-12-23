
module.exports = (db_pool) => {
    const torrent_controller = require("../controllers/torrent.controller")(db_pool)
    const auth_controller  = require("../controllers/auth.controller" )(db_pool)

    var router = require("express").Router();

    router.get  ("/home", torrent_controller.get_page)
    router.get  ("/stream", torrent_controller.stream)
    // router.get  ("/search", movie_controller.search)

    return router
}


