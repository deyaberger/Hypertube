
const placeholder = async (req, res) => {
    console.log("go home baby")
}

module.exports = (db_pool) => {
    const user_controller = require("../controllers/user.controller")(db_pool)
    console.log(user_controller)
    var router = require("express").Router();

    router.post  ("oauth/token"                , placeholder)
    router.get   ("/users"                     , user_controller.get_users)
    router.get   ("/users/:id"                 , user_controller.get_user_by_id)
    router.patch ("/users/:id"                 , user_controller.patch_user)
    router.get   ("/movies"                    , placeholder)
    router.get   ("/movies/:id"                , placeholder)
    router.get   ("/comments"                  , placeholder)
    router.get   ("/comments/:id"              , placeholder)
    router.patch ("/comments/:id"              , placeholder)
    router.delete("/comments/:id"              , placeholder)
    router.post  ("/comments"                  , placeholder)
    router.post  ("/movies/:movie_id/comments" , placeholder)

    return router
}


