const axios = require('axios')
const Client = require('node-torrent')
var base32 = require('base32');

const client = new Client({logLevel: 'INFO', downloadPath: "./torrents", })

module.exports = (db_pool) => {
    
    return {
        to_relative_path(paf) {
            return "./torrents/" + paf
        },


        async check_video_is_downloaded(imdb_id) {
            let [downloaded_movies, ] = await db_pool.query("SELECT * FROM downloaded_movies WHERE movie_imdb_id=?;", imdb_id)

            console.log("wathced: ", downloaded_movies)
            return downloaded_movies
        },


        async get_local_files(imdb_id) {
            let [downloaded_movies, ] = await db_pool.query("SELECT * FROM downloaded_movies WHERE movie_imdb_id=?;", imdb_id)

            return downloaded_movies
        },


        async get_local_file_path(local_file_id) {
            let [downloaded_movie, ] = await db_pool.query("SELECT * FROM downloaded_movies WHERE id=?;", local_file_id)

            return downloaded_movie[0].file_path
        },


        add_torrent(magnet, ready_callback) {
            let torrent = client.addTorrent(magnet);
            torrent.once('torrent:ready', ready_callback)
        },


        get_torrent(magnet) {
            var parsedUrl = require('url').parse(magnet, true),
            hash;
            
            var urns = parsedUrl.query.xt;
            if (!Array.isArray(urns)) {
                urns = [urns];
            }
            console.log(urns.length)
            urns.some(function(urn) {
                if (urn.match(/^urn:btih:/)) {
                    hash = urn.substring(9);
                    return true;
                }
            });
            var infoHash;
            if (hash.length === 40) {
                infoHash = new Buffer(hash, 'hex');
            } else {
                infoHash = new Buffer(base32.decode(hash), 'binary');
            }
            let found_torrent = client.torrents[infoHash]

            if (found_torrent == undefined) {
                found_torrent = null
            }
            return found_torrent
        },


        get_largest_file(torrent) {
            let largest = 0
            let file
            for(i = 0; i < torrent.files.length; i++)
            {
                if(torrent.files[i].length > largest)
                {
                    largest = torrent.files[i].length
                    file = torrent.files[i];
                    console.log("paf: ", torrent.files[i].path)
                }
            }
            return file
        }
    }
}