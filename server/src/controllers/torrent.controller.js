const fs = require("fs");

const CHUNK_SIZE = 10 ** 6; // 1MB
const video_paf = '/home/joep/Downloads/torrents/Avengers.mp4'
module.exports = (db_pool) => {
    const torrent_functions = require('./torrent')(db_pool)

    return {
        get_page : async (req, res) => {
            console.log("get page")
            res.sendFile(__dirname + "/video.html");
        },

        async get_local_files(req, res) {
            try {
                let local_files = await torrent_functions.get_local_files(req.params.imdb_id)

                // TODO: purge fs info
                res.status(200).send({local_files: local_files})
            }
            catch (e) {
                throw(e)
            }
        },

        stream_local: async (req, res) => {
            // TODO: Refresh the file inactivity timer

            console.log("Local stream")
            let local_file_paf = await torrent_functions.get_local_file_path(req.params.local_file_id)
            local_file_paf = "./torrents/" + local_file_paf

            const range = req.headers.range;
            if (!range) {
                return res.status(400).send("Requires Range header");
            }

            const videoSize = fs.statSync(local_file_paf).size;


            console.log("rang: ", range)
            const start = Number(range.replace(/\D/g, ""));
            const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
            const contentLength = end - start + 1;
            const headers = {
                "Content-Range" : `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges" : "bytes",
                "Content-Length": contentLength,
                "Content-Type"  : "video/mp4",
            };

            res.writeHead(206, headers);

            const videoStream = fs.createReadStream(local_file_paf, { start, end });
            videoStream.pipe(res);
        }
    }
}