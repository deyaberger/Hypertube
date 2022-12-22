
const placeholder = async (req, res) => {
    console.log("go home baby")
}

module.exports = (db_pool) => {
    const user_controller    = require("../controllers/user.controller"   )(db_pool)
    const movie_controller   = require("../controllers/movie.controller"  )(db_pool)
    const comment_controller = require("../controllers/comment.controller")(db_pool)

    console.log(user_controller)
    console.log(movie_controller)
    console.log(comment_controller)

    var router = require("express").Router();

    router.post  ("oauth/token"                , placeholder)
    router.get   ("/users"                     , user_controller.get_users)
    router.get   ("/users/:id"                 , user_controller.get_user_by_id)
    router.patch ("/users/:id"                 , user_controller.patch_user)
    router.get   ("/movies"                    , movie_controller.get_movies)
    router.get   ("/movies/:id"                , movie_controller.get_movie_by_id)
    router.get   ("/comments"                  , comment_controller.get_comments)
    router.get   ("/comments/:id"              , comment_controller.get_comment_by_id)
    router.patch ("/comments/:id"              , comment_controller.patch_comment)
    router.delete("/comments/:id"              , comment_controller.delete_comment_by_id)
    router.post  ("/comments"                  , placeholder)
    router.post  ("/movies/:movie_id/comments" , placeholder)

    return router
}


