module.exports = (db_pool) => {
    const populate_functions = require('./populate')(db_pool)

    return {
		get_all_movies : async (req, res) => {
            try {
                let source = req.query.source
                let page = req.query.page
                let infos = await populate_functions.search_all_movies(source, page)
                res.status(200).send(infos)
            }
            catch (e) {
                throw(e)
            }
        },

        from_json_to_db : (req, res) => {
            try {
                let source = req.query.source
                let page = req.query.page
                let infos = populate_functions.put_json_to_db(source, page)
                res.status(200).send(infos)
            }
            catch (e) {
                throw(e)
            }
        }

    }
}