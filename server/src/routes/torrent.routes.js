
module.exports = (db_pool) => {
    const torrent_controller = require("../controllers/torrent.controller")(db_pool)
    const auth_controller    = require("../controllers/auth.controller"   )(db_pool)

    var router = require("express").Router();

    router.get ("/home"                       , torrent_controller.get_page       );
    router.post("/add_magnet"                 , torrent_controller.add_magnet     );
    router.get ("/stream_magnet/:magnet"      , torrent_controller.stream_magnet  );
    router.get ("/streamlocal/:local_file_id" , torrent_controller.stream_local   );
    router.get ("/get_local/:imdb_id"         , torrent_controller.get_local_files);

    return router
}


