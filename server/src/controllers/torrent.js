const axios = require('axios')
const client = require('webtorrent')

module.exports = (db_pool) => {
    
    return {
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
        }
    }
}