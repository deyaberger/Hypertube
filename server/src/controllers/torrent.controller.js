const fs = require("fs");

const CHUNK_SIZE = 10 ** 6; // 1MB
const video_paf = '/home/joep/Downloads/torrents/Avengers.mp4'
module.exports = (db_pool) => {
    const user_functions = require('./user')(db_pool)

    return {
        get_page : async (req, res) => {
            console.log("get page")
            res.sendFile(__dirname + "/video.html");
        },

        stream: async (req, res) => {
            const range = req.headers.range;
            if (!range) {
                res.status(400).send("Requires Range header");
            }

            const videoSize = fs.statSync(video_paf).size;


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

            const videoStream = fs.createReadStream(video_paf, { start, end });
            videoStream.pipe(res);
        }
    }
}