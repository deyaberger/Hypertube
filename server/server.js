const express    = require('express')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
require('dotenv').config()

const app = express();
const connection_pool = require('./src/db/create_connection_pool')
const auth_router = require("./src/routes/auth.routes")(connection_pool)

app.use(jsonParser)

app.use("/api/auth", auth_router)


const PORT = process.env.PORT || 8071;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
