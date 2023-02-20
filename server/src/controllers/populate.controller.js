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
        }

    }
}