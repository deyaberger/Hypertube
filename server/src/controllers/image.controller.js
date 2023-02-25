module.exports = (db_pool) => {
    const image_functions = require('./image')(db_pool)

    return {
        upload_image : async(req, res) => {
            try {
                let user_id = req.user_id
                let filename = req.file.filename
                let upload_res = await image_functions.upload_profile_pic(user_id, filename)
                if (upload_res.affectedRows == 1) {
                    console.log("[image.controller]: upload_image SUCCESS")
                    return res.status(200).send({filename : filename, code: "SUCCESS"})
                }
                return res.status(400).send({msg : upload_res, code: "FAILURE"})
            }
            catch (e) {
                throw (e)
            }
        },
    }
}