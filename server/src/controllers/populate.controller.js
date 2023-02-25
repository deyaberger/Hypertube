module.exports = (db_pool) => {
    const populate_functions = require('./populate')(db_pool)

    return {
		get_all_movies : async (req, res) => {
            try {
                let source = req.query.source
                let page   = req.query.page
                let infos  = await populate_functions.search_all_movies(source, page)
                return res.status(200).send(infos)
            }
            catch (e) {
                throw(e)
            }
        },

        from_json_to_db : async (req, res) => {
			console.log("in from json to db")
            try {
                let source = req.query.source
                let page   = req.query.page
                let infos  = await populate_functions.put_json_to_db(source, page);
                if (infos == null) {
                    return res.status(201).send("Error when adding movie to database")
                }
                return res.status(200).send(infos)
            }
            catch (e) {
                throw(e)
            }
        },
        get_all_imdb_ids: async (req, res) => {
			console.log("in from json to db")
            try {
                let ids  = await populate_functions.get_imdb_ids();
                if (ids == null) {
                    return res.status(201).send("Error when searching movie ids")
                }
                return res.status(200).send(ids)
            }
            catch (e) {
                throw(e)
            }
        },
        fetch_tmdb: async (req, res) => {
            console.log("In fetch_tmdb *************")
            try {
                let imdb_id = req.params.imdb_id;
                let id = req.query.id;
                console.log("IMDB_ID: ", imdb_id)
                let movie  = await populate_functions.fetch_tmdb_movie(imdb_id);
                if (movie == null) {
                    return res.status(201).send({msg: "no movie with this id"})
                }
                let tmdb_id = movie['id']
                let backdrop_path = movie["backdrop_path"]
                let image_path = `https://image.tmdb.org/t/p/w1280/${backdrop_path}`
                let cast = await populate_functions.get_tmdb_cast(tmdb_id);
                if (cast == null) {
                    await populate_functions.update_movie_infos(imdb_id, 0, '', '')
                    return res.status(201).send({msg: "no cast with this id"})
                }
                let actors = ''
                let director = ''
                if (cast.actors.length != 0) {
                    actors = cast.actors.join(', ')
                }
                if (cast.director.length != 0) {
                    director = cast.director[0]
                }
                let update_res = await populate_functions.update_movie_infos(imdb_id, tmdb_id, actors, director)
                if (update_res == null) {
                    console.log("Update res: ", update_res)
                    return res.status(201).send({msg: "Error when adding tmdb data movie"})
                }
                if (backdrop_path != null) {
                    update_res = await populate_functions.add_tmdb_image(id, image_path)
                    if (update_res == null) {
                        return res.status(201).send({msg: "Error when adding tmdb image movie"})
                    }
                }
                console.log("Succesfully added movie info to DB: ", id)
                return res.status(200).send({msg : `succesfully added tmdb info to movie ${id}`})

            }
            catch (e) {
                throw(e)
            }
        }


    }
}