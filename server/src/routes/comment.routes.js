
module.exports = (db_pool) => {
    const comment_controller = require ("../controllers/comment.controller")(db_pool)
    const auth_controller    = require ("../controllers/auth.controller"   )(db_pool)

    var router               = require ("express").Router();

    router.post("/post/:movie_id"      , auth_controller.authenticateToken, comment_controller.post_comment           )
    router.get ("/user/:author_id"     , auth_controller.authenticateToken, comment_controller.get_comments_from_user )
    router.get ("/movie/:movie_id"     , auth_controller.authenticateToken, comment_controller.get_comments_from_movie)

    return router
}


