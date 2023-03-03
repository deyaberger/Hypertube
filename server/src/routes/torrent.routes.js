
module.exports = (db_pool) => {
    const torrent_controller = require("../controllers/torrent.controller")(db_pool)
    const auth_controller    = require("../controllers/auth.controller"   )(db_pool)
    const srt_middle         = require("../middlewares/srt")
    const express            = require("express");
    var   router             = require("express").Router();

    router.post("/add_magnet"                 , torrent_controller.add_magnet                    )
    router.get ("/stream_magnet/:hash/:title" , torrent_controller.stream_magnet                 )
    router.get ("/streamlocal/:local_file_id" , torrent_controller.stream_local                  )
    router.get ("/get_local/:imdb_id"         , torrent_controller.get_local_files               )



    router.get ("/get_list"                   , torrent_controller.get_torrents_from_movie_id)
    router.get ("/subtitles/available"        , torrent_controller.get_available_subtitles   )
    router.get ("/subtitles/ready"            , torrent_controller.get_ready_subtitles   )

    router.use("/subtitles/get", srt_middle.only_srt_or_vtt)
          .use("/subtitles/get", srt_middle.convert_to_vtt)
          .use("/subtitles/get", express.static("./torrents"))

    return router
}
