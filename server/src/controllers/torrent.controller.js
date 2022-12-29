const fs = require("fs");

const CHUNK_SIZE = 10 ** 6; // 1MB
const video_paf = '/home/joep/Downloads/torrents/Avengers.mp4'
module.exports = (db_pool) => {
    const torrent_functions = require('./torrent.node')(db_pool)

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
            local_file_paf = torrent_functions.to_relative_path(local_file_paf)

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
        },


        add_magnet(req, res) {
            console.log("Adding magnet")
            let magnet = req.body.magnet;
            
            torrent_functions.add_torrent(magnet, (torrent) => {
                let files = [];
                torrent.files.forEach(function(data) {
        
                    files.push({
                        name: data.path.slice('torrents/'.length),
                        length: data.length
                    });
        
                });
                res.status(200).send(files)
            });
        },


        stream_magnet: async (req, res) => {
            console.log("Magnet stream")

            let magnet = req.params.magnet;
            magnet =  "magnet:?xt=urn:btih:EA17E6BE92962A403AC1C638D2537DCF1E564D26&dn=Avengers%3A%20Infinity%20War&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969"

            let tor = torrent_functions.get_torrent(magnet);
            if (tor == undefined || tor == null || tor.status != 'torrent:ready') {
                console.log("Tor not ready")
                console.log(tor.status)
                return res.sendStatus(400)
            }
            
            let paf = "./" + torrent_functions.get_largest_file(tor);

            const range = req.headers.range;
            if (!range) {
                return res.status(400).send("Requires Range header");
            }

            const videoSize = fs.statSync(paf).size;
            console.log("VIDSIXZE: ", videoSize)

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

            const videoStream = fs.createReadStream(paf, { start, end });
            videoStream.pipe(res);
        }
    }
}