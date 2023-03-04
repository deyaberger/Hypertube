module.exports = (db_pool) => {
    const comment_controller = require ("../controllers/comment.controller")(db_pool)
    const auth_middlewares   = require("../middlewares/auth.middleware")

    var router = require ("express").Router();

    router.post("/post/:movie_id" , auth_middlewares.authenticateToken, comment_controller.post_comment           );
    router.get ("/user/:author_id", auth_middlewares.authenticateToken, comment_controller.get_comments_from_user );
    router.get ("/movie/:movie_id", auth_middlewares.authenticateToken, comment_controller.get_comments_from_movie);

    return router
}


