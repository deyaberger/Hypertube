module.exports = (db_pool) => {
    const follows_controller = require("../controllers/follow.controller")(db_pool)
    const auth_middlewares   = require("../middlewares/auth.middleware")

    var router = require("express").Router();

    router.get  ("/who_do_you_follow"    , auth_middlewares.authenticateToken, follows_controller.get_followings);
    router.get  ("/who_follows_you"      , auth_middlewares.authenticateToken, follows_controller.get_followers );
    router.get  ("/is_following/:user_id", auth_middlewares.authenticateToken, follows_controller.is_following  );
    router.post ("/follow/:user_id"      , auth_middlewares.authenticateToken, follows_controller.follow        );
    router.post ("/unfollow/:user_id"    , auth_middlewares.authenticateToken, follows_controller.unfollow      );

    return router
}


