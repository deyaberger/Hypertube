const jwt    = require('jsonwebtoken')
const return_codes = require('../utils/return_codes')

module.exports = {
    authenticateToken: (req, res, next) => {
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            if (token == null) return res.status(401).send({code: return_codes.MISSING_TOKEN})
            jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
                if (err != null) console.log(err)

                if (err) {
                    return res.statue(403).send({code: return_codes.CORRUPTED_TOKEN})
                }
                req.user_id = decoded.user_id
                next()
            })
        }
        catch (e) {
            console.log("ERROR in auth token: ", e)
            throw(e)
        }
    },

    authenticateTokenSocket: (socket, next) => {
        try {
            socket.user_id = 1
            return next()

            const token = socket.handshake.auth.token
            if (token == null) {
                const err = new Error(return_codes.MISSING_TOKEN)
                err.data  = return_codes.MISSING_TOKEN
                return next(err)
            }
            jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
                if (err != null) console.log("tok sok", err)

                if (err) {
                    const err = new Error(return_codes.CORRUPTED_TOKEN)
                    err.data  = return_codes.CORRUPTED_TOKEN
                    return next(err)
                }
                socket.user_id = decoded.user_id
                return next()
            })
        }
        catch (e) {
            console.log("ERROR in auth token: ", e)
            throw(e)
        }
    },
}