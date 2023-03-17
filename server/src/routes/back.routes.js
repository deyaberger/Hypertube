
module.exports = (db_pool) => {
  const user_controller = require("../controllers/user.controller")(db_pool)
  const auth_controller  = require("../controllers/auth.controller" )(db_pool)
  const auth_middlewares = require("../middlewares/auth.middleware")

  var router = require("express").Router();

  router.post("/oauth/token"                                        , auth_controller.signin_oauth );
  router.get ("/users"          , auth_middlewares.authenticateToken, user_controller.get_all_users);
  router.get ("/users/:user_id" , auth_middlewares.authenticateToken, user_controller.get_user_back);

  return router
}

