const axios = require('axios')

function create_request(url, params) {
	let request = {
		url: url,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
		},
		params: params
	}
	return request;
}

const fs = require('fs/promises');

async function read_json(file_path) {
  try {
    const data = await fs.readFile(file_path, { encoding: 'utf8' });
    return data
  } catch (err) {
    console.log("Cant read file: ", file_path);
    console.log(err);
    return null;
  }
}


function parse_movie_data(movie) {
    let yts_id         = movie.hasOwnProperty('id')        ? movie.id        : null;
    let imdb_code      = movie.hasOwnProperty('imdb_code') ? movie.imdb_code : null;
    let title          = movie.hasOwnProperty('title')     ? movie.title     : null;
    let imdb_rating    = movie.hasOwnProperty('rating')    ? movie.rating    : null;
    let year           = movie.hasOwnProperty('year')      ? movie.year      : null;
    let length_minutes = movie.hasOwnProperty('runtime')   ? movie.runtime   : null;
    let language       = movie.hasOwnProperty('language')  ? movie.language  : null;
    let summary        = movie.hasOwnProperty('summary')   ? movie.summary   : null;
    if (summary.length > 4000) {
        console.log("Summary too long, using synopsis for movie: ", movie.title)
        summary = movie.hasOwnProperty('synopsis')   ? movie.synopsis   : null;
        if (summary.length > 4000) {
            console.log("Slicing synopsis for movie: ", movie.title)
            summary = summary.slice(0, 3999)
        }
    }
    if (summary.length == 0) {
        summary = 'No summary provided';
    }
    return ({
        "yts_id"         : yts_id,
        "imdb_code"      : imdb_code,
        "title"          : title,
        "imdb_rating"    : imdb_rating,
        "year"           : year,
        "length_minutes" : length_minutes,
        "language"       : language,
        "summary"        : summary
    })
}


async function post_movie(db_pool, yts_id, imdb_code, title, imdb_rating, year, length_minutes, language, summary) {

    try {
        [movie, ] = await db_pool.query("\
        INSERT INTO movies (yts_id,   imdb_code,   title,   imdb_rating,   year,   length_minutes,   language,   summary) \
        VALUES             (?,        ?,           ?,       ?,             ?,      ?,                ?,          ?      );",
                           [yts_id, imdb_code, title, imdb_rating, year, length_minutes, language, summary])
    }
    catch (e) {
        if (e.code == 'ER_DUP_ENTRY') {
            return ({"msg" : "duplicate"});
        }
        if (e.code == 'ER_DATA_TOO_LONG') {
            console.log("DATA TOO LONG for movie: ", m.title);
            console.log("Summary length: ", m.summary.length)
            console.log(e);
            return(null);
        }
        console.log(e);
        return (null);
    }
    return (movie.insertId)

}

async function post_image(db_pool, movie_id, size, url) {

    try {
        [image, ] = await db_pool.query("\
        INSERT INTO images (movie_id, size, url) \
        VALUES             (?,        ?,    ?  );",
                           [movie_id, size,  url])
    }
    catch (e) {
        throw(e)
    }
}


async function parse_and_post_images(db_pool, movie, movie_id) {
    if (movie.hasOwnProperty('large_cover_image')) {
        await post_image(db_pool, movie_id, 1, movie.large_cover_image)
    }
    if (movie.hasOwnProperty('medium_cover_image')) {
        await post_image(db_pool, movie_id, 2, movie.medium_cover_image)
    }
    if (movie.hasOwnProperty('small_cover_image')) {
        await post_image(db_pool, movie_id, 3, movie.small_cover_image)
    }
    if (movie.hasOwnProperty('background_image_original')) {
        await post_image(db_pool, movie_id, 4, movie.background_image_original)
    }
    if (movie.hasOwnProperty('background_image')) {
        await post_image(db_pool, movie_id, 5, movie.background_image)
    }
}



async function post_genre(db_pool, movie_id, name) {

    try {
        [genre, ] = await db_pool.query("\
        INSERT INTO genres (movie_id, name) \
        VALUES             (?,        ?);",
                           [movie_id, name])
    }
    catch (e) {
        throw(e)
    }
}



async function parse_and_post_genres(db_pool, movie, movie_id) {
    if (!movie.hasOwnProperty('genres')) {
        return ({"msg" : "missing_genres"});
    }
    let genres = movie.genres;
    if (typeof(genres) != "object" || genres.length == 0) {
        return ({"msg" : "missing_genres"});
    }
    for (let i in genres) {
        await post_genre(db_pool, movie_id, genres[i])
    }
    return ({"msg" : "genres_all_good"})
}


async function post_torrent(db_pool, movie_id, url, hash, quality, seeds, peers, size, size_bytes) {

    try {
        [torrent, ] = await db_pool.query("\
        INSERT INTO torrents (movie_id, url, hash, quality, seeds, peers, size, size_bytes) \
        VALUES               (?,        ?,   ?,    ?,       ?,     ?,     ?,    ?         );",
                             [movie_id, url, hash, quality, seeds, peers, size, size_bytes])
    }
    catch (e) {
        throw(e)
    }
}




async function parse_and_post_torrents(db_pool, movie, movie_id) {
    if (!movie.hasOwnProperty('torrents')) {
        return ({"msg" : "missing_torrents"});
    }
    let torrents = movie.torrents;
    if (typeof(torrents) != "object" || torrents.length == 0) {
        return ({"msg" : "missing_torrents"});
    }
    let torrents_res = []
    for (let i in torrents) {
        let torrent = torrents[i];
        let url = torrent.hasOwnProperty('url')               ? torrent.url               : null;
        let hash = torrent.hasOwnProperty('hash')             ? torrent.hash              : null;
        let quality = torrent.hasOwnProperty('quality')       ? parseInt(torrent.quality) : null;
        let seeds = torrent.hasOwnProperty('seeds')           ? torrent.seeds             : null;
        let peers = torrent.hasOwnProperty('peers')           ? torrent.peers             : null;
        let size = torrent.hasOwnProperty('size')             ? torrent.size              : null;
        let size_bytes = torrent.hasOwnProperty('size_bytes') ? String(torrent.size_bytes): null;
        torrents_res.push(await post_torrent(db_pool, movie_id, url, hash, quality, seeds, peers, size, size_bytes))
    }
    return ({"msg" : "torrents_all_good"})
}


module.exports = (db_pool) => {
    return {

		search_all_movies : async (source, page_nb) => {
			let url = null;
            let response = null;
			if (source == "yts") {
                console.log("Fetching movies from YTS, page:", page_nb)
				url = "https://yts.torrentbay.to/api/v2/list_movies.json"
            }
            var fs = require('fs');
            let request = create_request(url, {"page" : page_nb});
            try {
                response = await axios(request);
                response = response.data.data;
                var file_path = "./src/yts_response/yts_page" + page_nb + ".json"
                fs.writeFile(file_path, JSON.stringify(response), function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            catch(e) {
                let data_to_append = JSON.stringify({"page_nb" : page_nb, "type" : "req error", "msg" : e, "res" : response})
                fs.appendFile('./src/yts_response/log.txt', data_to_append, function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                  });
            }

            return (response)
        },

        put_json_to_db : async (source, page_nb) => {
            let prefix = null;
            let page_result = null;
            let data = null;
            let movie_res = null;
            var fs = require('fs');
			if (source == "yts") {
                // console.log("Adding data to DB, page:", page_nb)
				prefix = "./src/yts_response/yts_page"
                file_path = prefix + page_nb + ".json";
                data = await read_json(file_path);
                if (data == null) {
                    return ({"msg" : "missing_file"});
                }
                page_result = JSON.parse(data);
                if (!page_result.hasOwnProperty("movies")) {
                    console.log("No movies in this page")
                    return (null);
                }
                for (let i in page_result.movies) {
                    let movie_id = null;
                    let movie = page_result.movies[i];
                    let m = parse_movie_data(movie);
                    movie_res = await post_movie(db_pool, m.yts_id, m.imdb_code, m.title, m.imdb_rating, m.year, m.length_minutes, m.language, m.summary);
                    // WE should receive the movie's id, if otherwise: we have encountered an error or a duplicate
                    if (typeof movie_res != "number") {
                        return movie_res
                    }
                    movie_id = movie_res;
                    await parse_and_post_images(db_pool,   movie, movie_id);
                    await parse_and_post_genres(db_pool,   movie, movie_id);
                    await parse_and_post_torrents(db_pool, movie, movie_id);
                }
            }
            return ({"msg" : "success", "id" : movie_res})
        }

    }
}