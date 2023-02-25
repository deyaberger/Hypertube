const fs = require("fs");
const return_codes = require("../utils/return_codes");
const { hash_title_to_magnet_link } = require('../utils/hash_title_to_magnet')

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
            console.log("Get magnet content", req.body)

            let on_ready_answer = (torrent) => {
                let files = [];
                console.log("torrent ready", Object.keys(torrent))
                torrent.files.forEach(function(data) {
                    files.push({
                        name: data.path.slice('torrents/'.length),
                        length: data.length
                    });
        
                });
                return res.status(200).send({files: files, code:return_codes.SUCCESS})
            }

            let magnet = hash_title_to_magnet_link(req.body.hash, req.body.title)
            
            let tor = torrent_functions.get_torrent(magnet);
            if (tor != undefined && tor != null && tor.ready == false) {
                tor.on('ready', () => on_ready_answer(torrent_functions.get_torrent(magnet)))
                return console.log("Tor present but not ready")
                // return res.status(400).send({code: return_codes.TORRENT_NOT_READY})
            }

            if (tor != undefined && tor != null && tor.ready == true) {
                console.log("Tor present and ready")
                let files = [];
                tor.files.forEach(function(data) {
                    files.push({
                        name: data.path.slice('torrents/'.length),
                        length: data.length
                    });
        
                });
                return res.status(200).send({files: files, code:return_codes.SUCCESS})
            }

            torrent_functions.add_torrent(magnet, on_ready_answer);
        },


        stream_magnet: async (req, res) => {
            console.log("Magnet stream")

            // if ()
            let magnet = hash_title_to_magnet_link(req.params.hash, req.params.title);
            // magnet =  "magnet:?xt=urn:btih:EA17E6BE92962A403AC1C638D2537DCF1E564D26&dn=Avengers%3A%20Infinity%20War&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969"
            // magnet = "magnet:?xt=urn:btih:39EADCF205DE494B341250D8E0ABC525F58C6151&dn=test&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969"
            console.log(req.params.hash, req.params.title);
            let tor = torrent_functions.get_torrent(magnet);
            if (tor == undefined || tor == null || tor.ready == false) {
                console.log("Tor not ready")
                return res.sendStatus(200)
            }

            console.log(torrent_functions.get_subtitles(tor))
            
            let file = torrent_functions.get_largest_file(tor);
            let paf = file.path
            paf = torrent_functions.to_relative_path(paf)
            // console.log(Object.keys(tor))

            const range = req.headers.range;
            if (!range) {
                return res.status(400).send("Requires Range header");
            }

            const videoSize = fs.statSync(paf).size;
            console.log("VIDSIXZE: ", "videoSize:",Math.round(videoSize / 1000000), "file.downloaded:",Math.round(file.downloaded / 1000000), "file.length:",Math.round(file.length / 1000000))

            console.log("rang: ", range)
            const start = Number(range.replace(/\D/g, ""));
            const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
            const contentLength = end - start + 1;
                if (start < 300 * 1000001) {
                    const headers = {
                    "Content-Range" : `bytes ${start}-${end}/${videoSize}`,
                    "Accept-Ranges" : "bytes",
                    "Content-Length": contentLength,
                    "Content-Type"  : "video/mp4",
                };

                console.log("start:", Math.round(start / 1000000), "end:", Math.round(end / 1000000), "file.down:", Math.round(file.downloaded / 1000000))
                if (end > file.downloaded) {
                    console.log("OUTTA HERE")
                    res.writeHead(400);
                    res.end();
                    return
                }
                console.log(start)
                console.log("Write head")
                res.writeHead(206, headers);
                
                console.log("Make stream")
                const videoStream = fs.createReadStream(paf, { start, end });
                console.log("PIPE stream")
                videoStream.pipe(res);
            }
        }
    }
}