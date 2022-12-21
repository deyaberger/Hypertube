const bcrypt = require('bcrypt')

const buildPatchQuery = (table, data) => {
    if (Object.keys(data).length === 0) return null; // Or return what you want
    let query = `UPDATE ${table} SET `;
    query += Object.keys(data).map((key) => {
        const valueToSet = typeof data[key] === 'string' ? `'${data[key]}'` : data[key];
        return `${key}=?`;
    }).join(', ');
    return query + ` WHERE id=?;`;
}

const buildPatchArgs = (id, data) => {
    if (Object.keys(data).length === 0) return null; // Or return what you want
    let args = []
    Object.keys(data).map((key) => {
        args.push(data[key])
    }).join(', ');
    args.push(id)
    return args
}

const hashPassword = (password) => {
    return bcrypt.hashSync(password, 8);
}


module.exports = (db_pool) => {
    return {
        get_users : async(req, res) => {
            try {
                let [users, ] = await db_pool.query(
                    "SELECT username, mail FROM users"
                )
                res.status(200).send({data: users})
            }
            catch (e) {
                res.status(500).send()
                throw(e)
            }
        },

        get_user_by_id : async(req, res) => {
            try {
                let [users, ] = await db_pool.query("\
                    SELECT username, mail, picture   \
                        FROM users                   \
                        WHERE user.id=?",
                    req.params.id)

                res.status(200).send({data: users})
            }
            catch (e) {
                throw(e)
            }
        },

        patch_user : async(req, res) => {
            try {
                console.log('req.params: ', req.params)
                console.log('req.body: ', req.body)
                if (Object.keys(req.body).includes('pass')) {
                    req.body.pass = hashPassword(req.body.pass)
                }
                let update_string = buildPatchQuery('users', req.body)
                let update_args = buildPatchArgs(req.params.id, req.body)
                console.log("UPDAAAAAAAA:\n" , update_string)
                console.log("\nargs:\n" , update_args)
                let [users, ] = await db_pool.query(update_string, update_args)

                res.status(200).send({data: users})
            }
            catch (e) {
                throw(e)
            }
        }
    }
}