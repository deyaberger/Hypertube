const express    = require('express')
const bodyParser = require('body-parser')
const cors       = require("cors");
const app        = express();

app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

// GET .env file contents
require('dotenv').config()

// Create express app object and add json parsing middleware

const sanitizer = require("perfect-express-sanitizer");

app.use(sanitizer.clean({
    xss: false,
    noSql: false,
    sql: true,
    sqlLevel: 4,
}, whitelist = ["/api/image/upload"]));

const connection_pool = require('./src/db/create_connection_pool')

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


// // MOVIE
const movie_router = require("./src/routes/movie.routes")(connection_pool)
app.use("/api/movie", movie_router)


// TORRENT
const torrent_router = require("./src/routes/torrent.routes")(connection_pool)
app.use("/api/torrent", torrent_router)


// POPULATE
const populate_router = require("./src/routes/populate.routes")(connection_pool)
app.use("/api/populate", populate_router)


// FAVORITE
const favorites_router = require("./src/routes/favorite.routes")(connection_pool)
app.use("/api/favorites", favorites_router)


// WATCHED
const watched_router = require("./src/routes/watched.routes")(connection_pool)
app.use("/api/watched", watched_router)


// IMAGE
const image_router = require("./src/routes/image.routes")(connection_pool)
app.use("/api/image", image_router)


// Start the server
const PORT = process.env.PORT || 8071;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
