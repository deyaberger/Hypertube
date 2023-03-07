const jwt          = require('jsonwebtoken')
const return_codes = require('../utils/return_codes')
const event_names  = require('../utils/events')

module.exports = {
    authenticateToken: (req, res, next) => {
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            if (token == null) return res.status(401).send({code: return_codes.MISSING_TOKEN})
            jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
                if (err != null) console.log(err)
                if (err && err instanceof jwt.TokenExpiredError){
                    return res.status(401).send({code: return_codes.EXPIRED_TOKEN})
                }
                if (err) {
                    return res.status(401).send({code: return_codes.CORRUPTED_TOKEN})
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
            const token = socket.handshake.auth.token
            if (token == null) {
                console.log("authenticateTokenSocket", event_names.MISSING_TOKEN)
                const err = new Error(event_names.MISSING_TOKEN)
                err.data  = event_names.MISSING_TOKEN
                return next(err)
            }
            jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
                if (err != null) console.log("authenticateTokenSocket err:\n", err, "\nhandled")

                if (err && err instanceof jwt.TokenExpiredError){
                    const err = new Error(event_names.EXPIRED_TOKEN)
                    err.data  = event_names.EXPIRED_TOKEN
                    return next(err)
                }
                if (err) {
                    const err = new Error(event_names.CORRUPTED_TOKEN)
                    err.data  = event_names.CORRUPTED_TOKEN
                    return next(err)
                }
                socket.user_id = decoded.user_id
                return next()
            })
        }
        catch (e) {
            console.log("ERROR in auth token: ", e)
            const err = new Error(event_names.UNKNOWN_ERROR)
            err.data  = event_names.UNKNOWN_ERROR
            throw(e)
            return next(err)
        }
    },
}