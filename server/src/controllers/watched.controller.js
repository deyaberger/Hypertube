module.exports = (db_pool) => {
    const watched_functions = require('./watched')(db_pool)

    return {
<<<<<<< HEAD
        get_user_watched_movies : async (req, res) => {
            try {
                let userid = req.query.user_id == undefined ? req.user_id  : Number(req.query.user_id)
                let watched_movies = await watched_functions.get_watched_by_user_id(userid)
                console.log("[watched.controller]: get_user_watched_movies SUCCESS")
                return res.status(200).send({watched : watched_movies, code: "SUCCESS"})
=======
        get_watched_movies : async (req, res) => {
            console.log("get watch movies")
            try {
                let userid = req.query.user_id == undefined ? req.user_id  : Number(req.query.user_id)
                let watched = await watched_functions.get_watched(userid)

                if (watched == null) {
                    return res.sendStatus(500)
                }

                return res.status(200).send(watched)
>>>>>>> main
            }
            catch (e) {
                throw (e)
            }
        },
<<<<<<< HEAD
        // get_watched_movies_ids : async (req, res) => {
        //     console.log("get watch movies")
        //     try {
        //         let userid = req.user_id
        //         let watched = await watched_functions.get_watched_ids(userid)

        //         if (watched == null) {
        //             return res.sendStatus(500)
        //         }

        //         return res.status(200).send(watched)
        //     }
        //     catch (e) {
        //         throw (e)
        //     }
        // },
        set_watched : async(req, res) => {
            try {
                let user_id = req.user_id
                let movie_id  = Number(req.params.movie_id)
                let update_res  = await watched_functions.post_watched(user_id, movie_id)
                if (update_res.affectedRows == 1) {
                    console.log("[watched.controller]: set_watched SUCCESS")
                    return res.status(200).send({update_res: update_res, code: "SUCCESS"})
=======
        get_watched_movies_ids : async (req, res) => {
            console.log("get watch movies")
            try {
                let userid = req.user_id
                let watched = await watched_functions.get_watched_ids(userid)

                if (watched == null) {
                    return res.sendStatus(500)
                }

                return res.status(200).send(watched)
            }
            catch (e) {
                throw (e)
            }
        },
        set_watched : async(req, res) => {
            console.log("Set watched\n")
            try {
                let user_id = req.user_id
                let movie_id  = Number(req.params.movie_id)
                let watched_res  = await watched_functions.post_watched(user_id, movie_id)
                if (watched_res.affectedRows == 1) {
                    return res.status(200).send({message: "successfully added movie to watched"})
>>>>>>> main
                }
            }
            catch (e) {
                throw(e)
            }
        },
        set_unwatched : async(req, res) => {
<<<<<<< HEAD
            try {
                let user_id = req.user_id
                let movie_id  = Number(req.params.movie_id)
                let update_res  = await watched_functions.delete_watched(user_id, movie_id)
                if (update_res.affectedRows == 1) {
                    console.log("[watched.controller]: set_unwatched SUCCESS")
                    return res.status(200).send({update_res: update_res, code: "SUCCESS"})
=======
            console.log("Set unwatched\n")
            try {
                let user_id = req.user_id
                let movie_id  = Number(req.params.movie_id)
                let watched_res  = await watched_functions.delete_watched(user_id, movie_id)
                if (watched_res.affectedRows == 1) {
                    return res.status(200).send({message: "successfully deleted movie from watched"})
>>>>>>> main
                }
            }
            catch (e) {
                throw(e)
            }
        },
<<<<<<< HEAD
        // is_watched : async(req, res) => {
        //     try {
        //         let user_id = req.user_id
        //         let movie_id  = Number(req.params.movie_id)
        //         let watched_res  = await watched_functions.is_watched_movie(user_id, movie_id)
        //         return res.status(200).send({message: watched_res})
        //     }
        //     catch(e) {
        //         throw (e)
        //     }
        // }
=======
        is_watched : async(req, res) => {
            console.log("is watched")
            try {
                let user_id = req.user_id
                let movie_id  = Number(req.params.movie_id)
                let watched_res  = await watched_functions.is_watched_movie(user_id, movie_id)
                return res.status(200).send({message: watched_res})
            }
            catch(e) {
                throw (e)
            }
        }
>>>>>>> main
    }
}