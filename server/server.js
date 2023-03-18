const express    = require('express')
const bodyParser = require('body-parser')
const cors       = require("cors");
const app        = express();
const torrentGod = require('./src/sock/torrent.god')
// GET .env file contents
require('dotenv').config()


// ##### MIDDLEWARES #######

app.use(cors({
  origin: "*"
}))
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));


const sanitizer = require("perfect-express-sanitizer");

app.use(sanitizer.clean({
    xss: false,
    noSql: false,
    sql: true,
    sqlLevel: 4,
}, whitelist = ["/api/image/upload"]));


// ##### GLOBAL CLIENT #######

const tor_client = require('torrent-client')
client = new tor_client()
wsClientList = {}

// ##### DB POOL #######


const connection_pool = require('./src/db/create_connection_pool')


// ##### SOCKETO #######

const http  = require('http').Server(app);
const {Server}    = require('socket.io');
io = new Server(http, {
  path: "/socketo/"
});
TorGod = new torrentGod(io, connection_pool, client)

require('./src/sock/socket.server')(io, TorGod)


// AUTH
const auth_router = require("./src/routes/auth.routes")(connection_pool)
app.use("/api/auth", auth_router)


// USER
const user_router = require("./src/routes/user.routes")(connection_pool)
app.use("/api/user", user_router)


// FOLLOW
const follow_router = require("./src/routes/follow.routes")(connection_pool)
app.use("/api/follow", follow_router)


// COMMENT
const comment_router = require("./src/routes/comment.routes")(connection_pool)
app.use("/api/comment", comment_router)


// MOVIE
const movie_router = require("./src/routes/movie.routes")(connection_pool)
app.use("/api/movie", movie_router)


// TORRENT
const torrent_router = require("./src/routes/torrent.routes")(connection_pool)
app.use("/api/torrents", torrent_router)



// FAVORITE
const favorites_router = require("./src/routes/favorite.routes")(connection_pool)
app.use("/api/favorites", favorites_router)


// WATCHED
const watched_router = require("./src/routes/watched.routes")(connection_pool)
app.use("/api/watched", watched_router)


// IMAGE
const image_router = require("./src/routes/image.routes")(connection_pool)
app.use("/api/image", image_router)

// OAUTH
const oauth_router = require("./src/routes/oauth.routes")(connection_pool)
app.use("/api/oauth", oauth_router)


// POPULATE

if (process.env.ENABLE_POPULATE == 'TRUE') {
  console.log("Populate Enabled")
  const populate_router = require("./src/routes/populate.routes")(connection_pool)
  app.use("/api/populate", populate_router)
}
else {
  console.log("Populate Disabled")
}


// BACK API
const back_api_router = require("./src/routes/back.routes")(connection_pool)
app.use("/api/back", back_api_router)


const history = require('connect-history-api-fallback');

const historyMiddleware = history({
  verbose: true,
});

app.use((req, res, next) => {
  console.log(req.path)
  let route_base = req.path.split('/')[1]
  console.log("LIOL", route_base)
  if (route_base == 'populate' && process.env.ENABLE_POPULATE != 'TRUE') {
    return res.redirect('/')
  }
  if (route_base != 'api') {
    historyMiddleware(req, res, next);
  } else {
    next();
  }
});


// app.use(function (req, res, next) {
//   if (req.path.substr(-1) == '/' && req.path.length > 1) {
//     let query = req.url.slice(req.path.length)
//     res.redirect(301, req.path.slice(0, -1) + query)
//   } else {
//     next()
//   }
// })

app.use("/", express.static(__dirname + '/client_dist'));


app.use((req, res, next) => {
  res.redirect('/404_by_joep')
})
// Start the server

const PORT = process.env.PORT || 8071;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

