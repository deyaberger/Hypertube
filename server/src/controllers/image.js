const axios = require('axios')

module.exports = (db_pool) => {
    return {
        upload_profile_pic: async(user_id, url) => {
            console.log("\n[image]: upload_profile_pic ", {user_id, url})
            const request = `
            UPDATE users
            SET picture = '${url}'
            WHERE id = ${user_id}`
            try {
                let [update_result, ] = await db_pool.query(request)
                return update_result
            }
            catch(e) {
                throw (e)
            }
        },

    }
}