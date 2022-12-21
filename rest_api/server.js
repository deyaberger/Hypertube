const express    = require('express')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
require('dotenv').config()

const connection_pool = require('./src/db/create_connection_pool')
const router = require("./src/routes/basic.routes")
const app = express();

const basic_router = require("./src/routes/basic.routes")(connection_pool)
app.use("/api", jsonParser, basic_router, function(req, res, next){
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  })

const PORT = process.env.PORT || 8070;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
