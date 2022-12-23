const express    = require('express')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

// GET .env file contents
require('dotenv').config()

// Create express app object and add json parsing middleware
const app = express();
app.use(jsonParser)

// Create database connection pool, this will be injected into the controllers to avoid recreating new connections all the time
const connection_pool = require('./src/db/create_connection_pool')


// Create the AUTH router, (injecting the connection pool) and add it to the server
const auth_router = require("./src/routes/auth.routes")(connection_pool)
app.use("/api/auth", auth_router)


// Create the user router, (injecting the connection pool) and add it to the server
const user_router = require("./src/routes/user.routes")(connection_pool)
app.use("/api/users", user_router)



// Create the comment router, (injecting the connection pool) and add it to the server
const comment_router = require("./src/routes/comment.routes")(connection_pool)
app.use("/api/comments", comment_router)



// Create the comment router, (injecting the connection pool) and add it to the server
const movie_router = require("./src/routes/movie.routes")(connection_pool)
app.use("/api/movies", movie_router)




// Start the server
const PORT = process.env.PORT || 8071;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
