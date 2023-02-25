const fs = require("fs");

const return_codes = require("../utils/return_codes")

module.exports = (db_pool) => {
    const torrent_functions = require('./torrent')(db_pool)

    return {
        get_torrents_from_movie_id : async (req, res) => {
            console.log("get torrents for movie", req.query.movie_id)
            try {
                let movie_id=req.query.movie_id
                if (movie_id == null) {
                    res.status(200).send({code: return_codes.MISSING_QUERY})
                }
                let [torrents, ] = await db_pool.query(
                    `
                    SELECT
                        id,
                        movie_id,
                        url,
                        hash,
                        quality,
                        seeds,
                        peers,
                        size,
                        size_bytes
                    FROM
                        torrents
                    WHERE
                        movie_id=?;
                    `,
                    movie_id
                )
                console.log("Got:", torrents)
                res.status(200).send({code: return_codes.SUCCESS, torrents: torrents})
            }
            catch (e) {
                console.log("Error in get torrents:", e)
                throw(e)
                res.status(400).send(e)
            }
        }
    }
}