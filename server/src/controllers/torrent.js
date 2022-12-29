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
            client.add(
                torrentId = magnet,
                {path     : "./torrents",                            
                strategy  : "sequential" },
                ready_callback);
        },


        get_torrent(magnet) {
            return client.get(magnet)
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
            return file.path
        }
    }
}