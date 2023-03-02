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
            console.log("Get magnet content", req.body.title)
            
            let on_ready_answer = (torrent) => {
                // TorGod.addTorrent(torrent, 1)
                let files = [];
                console.log("torrent ready", torrent.name)
                torrent.files.forEach(function(data) {
                    files.push({
                        name: data.path.slice('torrents/'.length),
                        length: data.length
                    });
        
                });
                torrent_functions.set_subtitles_high_priority(torrent)
                // torrent.on('download', (dl) => {
                //     console.log("dowsnl", torrent.progress)
                // })
                console.log("sending torrent contents")
                return res.status(200).send({files: files, code:return_codes.SUCCESS})
            }

            let magnet = hash_title_to_magnet_link(req.body.hash, req.body.title)
            
            let tor = torrent_functions.get_torrent(magnet);
            if (tor != undefined && tor != null && tor.ready == false) {
                tor.on('ready', () => on_ready_answer(tor))
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
                torrent_functions.set_subtitles_high_priority(tor)
                console.log("sending torrent contents")
                return res.status(200).send({files: files, code:return_codes.SUCCESS})
            }

            console.log("Adding torrent first time")
            tor = torrent_functions.add_torrent(magnet, (torrent) => {
                on_ready_answer(torrent)
                // torrent_functions.set_subtitles_high_priority(torrent)
            });
        },

        stream_magnet: async (req, res) => {
            // console.log("Magnet stream")

            // if ()
            let magnet = hash_title_to_magnet_link(req.params.hash, req.params.title);
            // magnet =  "magnet:?xt=urn:btih:EA17E6BE92962A403AC1C638D2537DCF1E564D26&dn=Avengers%3A%20Infinity%20War&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969"
            // magnet = "magnet:?xt=urn:btih:39EADCF205DE494B341250D8E0ABC525F58C6151&dn=test&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969"
            // console.log(req.params.hash, req.params.title);
            let tor = torrent_functions.get_torrent(magnet);
            if (tor == undefined || tor == null || tor.ready == false) {
                console.log("Tor not ready")
                return res.sendStatus(200)
            }

            torrent_functions.get_downloaded_subtitles(tor)
            torrent_functions.get_available_subtitles(tor)
            
            let file = torrent_functions.get_largest_file(tor);
            let paf = file.path
            paf = torrent_functions.to_relative_path(paf)
            // console.log(Object.keys(tor))

            const range = req.headers.range;
            if (!range) {
                return res.status(400).send("Requires Range header");
            }

            // const videoSize = fs.statSync(paf).size;
            const videoSize = file.downloaded;
            // console.log("VIDSIXZE: ", "videoSize:",Math.round(videoSize / 1000000), "file.downloaded:",Math.round(file.downloaded / 1000000), "file.length:",Math.round(file.length / 1000000))

            // console.log("rang: ", range)
            const start = Number(range.replace(/\D/g, ""));
            const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
            const contentLength = end - start + 1;

            if (end > file.downloaded || start > file.downloaded || end < 0) {
                // console.log("HSDFOISDFOLKhj")
                // const headers = {
                //     // "Content-Range" : `bytes ${start}-${start}/${file.length}`,
                //     "Accept-Ranges" : "bytes",
                //     // "Content-Length": 0,
                //     "Content-Type"  : "video/mp4",
                // };
                // return res.writeHead(206, headers);
                return res.sendStatus(206)
            }

            const headers = {
                "Content-Range" : `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges" : "bytes",
                "Content-Length": contentLength,
                "Content-Type"  : "video/mp4",
            };

            console.log("start:", Math.round(start / 1000000), "end:", Math.round(end / 1000000), "file.down:", Math.round(file.downloaded / 1000000))

            // console.log(start)
            // console.log("Write head")
            res.writeHead(206, headers);
            
            // console.log("Make stream")
            const videoStream = fs.createReadStream(paf, { start, end });
            // console.log("PIPE stream")
            videoStream.pipe(res);
            
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

        async get_ready_subtitles(req, res) {
            try {
                console.log("Getting ready subs", req.query.title)
                if (req.query == null || req.query.hash == null || req.query.title == null) {
                    return res.status(400).send({code: return_codes.MISSING_QUERY})
                }

                let magnet = hash_title_to_magnet_link(req.query.hash, req.query.title);
                let tor    = torrent_functions.get_torrent(magnet);
                
                if (tor == null) {
                    return res.status(204).send({code: return_codes.TORRENT_NOT_EXIST})
                }
                else if (tor.ready == false) {
                    return res.status(204).send({code: return_codes.TORRENT_NOT_READY})
                }

                let subs   = torrent_functions.get_downloaded_subtitles(tor)

                return res.status(200).send({subs: subs, code: return_codes.SUCCESS})
            }
            catch (e) {
                throw(e)
                return res.status(400).send({code: return_codes.UNKNOWN_ERROR, subs: []})
            }
        },

        async get_available_subtitles(req, res) {
            try {
                if (req.query == null || req.query.hash == null || req.query.title == null) {
                    return res.status(400).send({code: return_codes.MISSING_QUERY})
                }

                let magnet = hash_title_to_magnet_link(req.query.hash, req.query.title);
                let tor    = torrent_functions.get_torrent(magnet);
                
                if (tor == null) {
                    return res.status(204).send({code: return_codes.TORRENT_NOT_EXIST})
                }
                else if (tor.ready == false) {
                    return res.status(204).send({code: return_codes.TORRENT_NOT_READY})
                }

                let subs   = torrent_functions.get_available_subtitles(tor)

                return res.status(200).send({subs: subs, code: return_codes.SUCCESS})
            }
            catch (e) {
                throw(e)
                return res.status(400).send({code: return_codes.UNKNOWN_ERROR, subs: []})
            }
        },
    }
}