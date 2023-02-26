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
            try {
                let imdb_id = req.params.imdb_id;
                let id = req.query.id;
                let movie  = await populate_functions.fetch_tmdb_movie(imdb_id);
                if (movie == null || movie.code == 'ERR_BAD_REQUEST') {
                    await populate_functions.update_movie_infos(imdb_id, 0, '', '')
                    console.log(`SKIPPING [populate.controller]: no movie with imdb_code ${imdb_id} in tmdb db`)
                    return res.status(201).send({msg: `no movie with imdb_code ${imdb_id} in tmdb db`, code: "SKIPPING"})
                }
                let tmdb_id = movie['id']
                let backdrop_path = movie["backdrop_path"]
                let image_path = `https://image.tmdb.org/t/p/w1280/${backdrop_path}`
                let cast = await populate_functions.get_tmdb_cast(tmdb_id);
                if (cast == null) {
                    await populate_functions.update_movie_infos(imdb_id, 0, '', '')
                    console.log(`SKIPPING [populate.controller]: no movie with tmdb id ${tmdb_id}`)
                    return res.status(201).send({msg: `no movie with tmdb id ${tmdb_id}`, code : "SKIPPING"})
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
                    console.log(`FAILURE [populate.controller]: Error when adding tmdb data to our db`)
                    return res.status(400).send({msg: `Error when adding tmdb data to our db`, code : "FAILURE"})
                }
                if (backdrop_path != null) {
                    update_res = await populate_functions.add_tmdb_image(id, image_path)
                    if (update_res == null) {
                        console.log(`FAILURE [populate.controller]: Error when adding tmdb image movie`)
                        return res.status(201).send({msg: "Error when adding tmdb image movie", code: "FAILURE"})
                    }
                }
                console.log(`[populate.controller]: fetch_tmdb SUCCESS`)
                return res.status(200).send({msg : `succesfully added tmdb info to movie ${id}`, code: "SUCCESS"})

            }
            catch (e) {
                throw(e)
            }
        },

        optimize: async (req, res) => {
            try {
                let adding_max_seeds = await populate_functions.max_seeds();
                if (adding_max_seeds != null && adding_max_seeds.affectedRows > 0) {
                    let seeds_res = {affectedRows : adding_max_seeds.affectedRows, changedRows : adding_max_seeds.changedRows}
                    console.log("[populate.controller]: max_seeds SUCCESS: ", seeds_res)
                    let clean_res = await populate_functions.prune_db();
                    if (clean_res != null) {
                        let clean = {affectedRows : clean_res.affectedRows}
                        console.log("[populate.controller]: clean SUCCESS: ", clean)
                        return res.status(200).send({seeds_res: seeds_res, clean : clean, code: "SUCCESS"})
                    }
                }
                console.log("[populate.controller]: optimize FAILURE: ", {adding_max_seeds, clean})
                return res.status(400).send({result: adding_max_seeds, code: "FAILURE"})
            }
            catch(e) {
                throw(e)
            }

        }


    }
}