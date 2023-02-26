const axios = require('axios')
const tor_client = require('torrent-client')
const client = new tor_client()

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
            return client.add(  torrentId = magnet,
                                {
                                    path      : "./torrents",                            
                                    strategy  : "sequential"
                                },
                                ready_callback);
        },


        get_torrent(magnet) {
            return client.get(magnet)
        },


        is_torrent_ready_to_watch(magnet) {
            torrent = client.get(magnet)
            return torrent.timeRemaining < 1000 * 60 * 30
        },


        get_torrent_stats(magnet) {
            torrent = client.get(magnet)
            return {
                time_remaining : torrent.timeRemaining / 1000,
                progress       : torrent.progress,
                numPeers       : torrent.numPeers,
                downloadSpeed  : torrent.downloadSpeed
            }
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
        },


        set_subtitles_high_priority(torrent) {
            console.log("Subs high prio")
            for(const file of torrent.files)
            {
                if(file.path.endsWith(".srt"))
                {
                    console.log(file.name)
                    file.select(100)
                }
            }
        },


        are_subtitles_downloaded(torrent) {
            let subs = []
            let file
            
            for(i = 0; i < torrent.files.length; i++)
            {
                file = torrent.files[i]
                if(file.path.endsWith(".srt") && !file.done)
                {
                    return false
                }
            }
            return true
        },


        get_downloaded_subtitles(torrent) {
            let subs = []
            let file
            
            for(i = 0; i < torrent.files.length; i++)
            {
                file = torrent.files[i]
                if(file.path.endsWith(".srt") && file.done)
                {
                    subs.push({
                        name: file.name,
                        path: file.path
                    })
                }
            }
            console.log("Ready subs:", subs.map(s => s.name))
            return subs
        },


        get_available_subtitles(torrent) {
            let subs = []
            let file
            
            for(i = 0; i < torrent.files.length; i++)
            {
                file = torrent.files[i]
                if(file.path.endsWith(".srt"))
                {
                    subs.push({
                        name: file.name,
                        path: file.path
                    })
                }
            }
            console.log("Available subs:", subs.map(s => s.name))
            return subs
        }
    }
}