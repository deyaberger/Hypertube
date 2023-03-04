
module.exports = (db_pool) => {
    const torrent_controller = require("../controllers/torrent.controller")(db_pool)
    const auth_controller    = require("../controllers/auth.controller"   )(db_pool)
    const srt_middle         = require("../middlewares/srt")
    const express            = require("express");
    var   router             = require("express").Router();

    router.get ("/stream_magnet/:hash/:title" , torrent_controller.stream_magnet)

    router.get ("/get_list"                   , torrent_controller.get_torrents_from_movie_id)

    router.use("/subtitles/get", srt_middle.only_srt_or_vtt)
          .use("/subtitles/get", srt_middle.convert_to_vtt)
          .use("/subtitles/get", express.static("./torrents"))

    return router
}
