const fs = require("fs");
const return_codes = require("../utils/return_codes");
const { hash_title_to_magnet_link } = require('../utils/hash_title_to_magnet')

const CHUNK_SIZE = 10 ** 6; // 1MB
const video_paf = '/home/joep/Downloads/torrents/Avengers.mp4'
module.exports = (db_pool) => {
    const torrent_functions = require('./torrent')(db_pool)

    return {
        stream_magnet: async (req, res) => {
            try {
                let magnet = hash_title_to_magnet_link(req.params.hash, req.params.title);

                let tor = torrent_functions.get_torrent(magnet);
                if (tor == undefined || tor == null || tor.ready == false) {
                    console.log("Tor not ready")
                    return res.sendStatus(200)
                }
    
                let file = torrent_functions.get_largest_file(tor);
                let paf = file.path
                paf = torrent_functions.to_relative_path(paf)
                // paf = './torrents/Your.Honor.US.S02E05.Parte.Quindici.ITA.ENG.1080p.AMZN.WEB-DL.DDP.H.264-MeM.GP.mkv'
                const range = req.headers.range;
                if (!range) {
                    console.log("no range")
                    return res.status(400).send("Requires Range header");
                }
    
                const videoSize = fs.statSync(paf).size;
                // console.log("size:", videoSize)
                // const videoSize = file.downloaded;
    
                let start = Number(range.replace(/\D/g, ""));
                const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
                start = Math.min(end, start)
                const contentLength = end - start + 1;
    
                console.log("start:", Math.round(start / (1000 * 1000 * 1)), "end:", Math.round(end / (1000 * 1000 * 1)), "file.down:", Math.round(file.downloaded / (1000 * 1000 * 1)))
    
                if (Math.max(start, end) >= file.downloaded) {
                    console.log("TOO FAR")
                    return res.sendStatus(206)
                }
    
                const headers = {
                    "Content-Range" : `bytes ${start}-${end}/${videoSize}`,
                    "Accept-Ranges" : "bytes",
                    "Content-Length": contentLength,
                    "Content-Type"  : "video/mp4",
                };
    
                // console.log(start) 
                // console.log("Write head")
                res.writeHead(206, headers);
                
                // console.log("Make stream")
                const videoStream = fs.createReadStream(paf, { start, end });
                // console.log("PIPE stream")
                videoStream.pipe(res);
            }
            catch (e) {
                console.log("Error in stream torrent", e)
                // throw(e)
                res.sendStatus(204)
            }
        },

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
                console.log("Got:", torrents.length)
                res.status(200).send({code: return_codes.SUCCESS, torrents: torrents})
            }
            catch (e) {
                console.log("Error in get torrents:", e)
                throw(e)
                res.status(400).send(e)
            }
        },
    }
}