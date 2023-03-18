const mysql = require('mysql2/promise');
const fs = require('fs')
const { hash_title_to_magnet_link } = require('./src/utils/hash_title_to_magnet')

require('dotenv').config()

async function make_connection() {
  return await mysql.createConnection({
    host              : process.env.HYPERDB_HOST,
    port              : process.env.HYPERDB_PORT,
    user              : process.env.HYPERDB_USER,
    password          : process.env.HYPERDB_PASS,
    database          : 'hyperdb',
  });
}

async function get_movies_to_delete(db_conn) {
  let [res, ] = await db_conn.query(`
  SELECT
    folder,
    TIMESTAMPDIFF(DAY, last_added, CURRENT_TIMESTAMP) as diffy
  FROM torrents
  HAVING diffy >= 30
  `)
  return res
}

async function clean_up() {
  start = new Date()
  console.log("creating connection")
  let db = await make_connection()
  let  movies_to_delete = await get_movies_to_delete(db)
  
  let tordir = process.argv[2]
  console.log("tordir", tordir)
  for (const movie of movies_to_delete) {
    console.log("mov:", movie)
    try {
      fs.unlinkSync(tordir + movie.folder)
    }
    catch (ue) {
      try {
        fs.rmdirSync(tordir + movie.folder, {recursive: true}) 
      }
      catch (e) {
        if (e.code != 'ENOENT') {
          console.log("unlink err", ue)
          console.log("rm dir err", e)
        }
      }
    }
  }
  process.exit()
}

clean_up()