
module.exports = (db_pool) => {
  const user_controller  = require("../controllers/user.controller" )(db_pool)
  const auth_controller  = require("../controllers/auth.controller" )(db_pool)
  const movie_controller = require("../controllers/movie.controller")(db_pool)
  const comment_controller = require("../controllers/comment.controller")(db_pool)
  const auth_middlewares = require("../middlewares/auth.middleware" )

  var router = require("express").Router();

  // TODO: is username / password OK for oauth/token ?
  router.post ("/oauth/token"                                          , auth_controller.signin_oauth );

  router.get  ("/users"            , auth_middlewares.authenticateToken, user_controller.get_all_users);
  router.get  ("/users/:user_id"   , auth_middlewares.authenticateToken, user_controller.get_user_back);
  router.patch("/users/:user_id"   , auth_middlewares.authenticateToken, user_controller.update_user);

  router.get  ("/movies"           , auth_middlewares.authenticateToken, movie_controller.get_recommendations);
  router.get  ("/movies/:movie_id" , auth_middlewares.authenticateToken, movie_controller.get_details_back        );


  router.get  ("/comments"         , auth_middlewares.authenticateToken, comment_controller.get_latest_comments);
  router.get  ("/comments/:id"     , auth_middlewares.authenticateToken, comment_controller.get_comment_by_id);
  router.patch("/comments/:id"     , auth_middlewares.authenticateToken, comment_controller.update_comment);
  router.delete("/comments/:id"    , auth_middlewares.authenticateToken, comment_controller.delete_comment);
  router.post ("/movies/:movie_id/comments"         , auth_middlewares.authenticateToken, comment_controller.post_comment);
  router.post ("/comments"         , auth_middlewares.authenticateToken, comment_controller.post_comment);
  
  return router
}

