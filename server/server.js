const express    = require('express')
const bodyParser = require('body-parser')
const cors       = require("cors");

const jsonParser = bodyParser.json({ limit: '50mb' })

// GET .env file contents
require('dotenv').config()

// Create express app object and add json parsing middleware
const app = express();
app.use(jsonParser)
app.use(cors({
  origin: "*"
}))

// Create database connection pool, this will be injected into the controllers to avoid recreating new connections all the time
const connection_pool = require('./src/db/create_connection_pool')


// Create the AUTH router, (injecting the connection pool) and add it to the server
const auth_router = require("./src/routes/auth.routes")(connection_pool)
app.use("/api/auth", auth_router)


// Create the user router, (injecting the connection pool) and add it to the server
const user_router = require("./src/routes/user.routes")(connection_pool)
app.use("/api/user", user_router)

// Create the following router, (injecting the connection pool) and add it to the server
const follows_router = require("./src/routes/follows.routes")(connection_pool)
app.use("/api/follows", follows_router)


// Create the comment router, (injecting the connection pool) and add it to the server
const comment_router = require("./src/routes/comment.routes")(connection_pool)
app.use("/api/comments", comment_router)



// Create the comment router, (injecting the connection pool) and add it to the server
const movie_router = require("./src/routes/movie.routes")(connection_pool)
app.use("/api/movies", movie_router)



// Create the comment router, (injecting the connection pool) and add it to the server
const torrent_router = require("./src/routes/torrent.routes")(connection_pool)
app.use("/api/torrents", torrent_router)


const populate_router = require("./src/routes/populate.routes")(connection_pool)
app.use("/api/populate", populate_router)


const favorites_router = require("./src/routes/favorites.routes")(connection_pool)
app.use("/api/favorites", favorites_router)

const watched_router = require("./src/routes/watched.routes")(connection_pool)
app.use("/api/watched", watched_router)


// Start the server
const PORT = process.env.PORT || 8071;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
