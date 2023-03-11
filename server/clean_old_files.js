const mysql = require('mysql2/promise');
const { EXPIRED_TOKEN } = require('./src/utils/return_codes');
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
  WITH UNWATCHED_MOVIES AS (
    SELECT
        movie_id,
        MAX(last_updated) as most_recent_watch,
        TIMESTAMPDIFF(DAY, MAX(last_updated), CURRENT_TIMESTAMP) as diffy
    FROM watched_movies
    GROUP BY movie_id
    HAVING
        diffy >= 0
  )

  SELECT
      *
  FROM torrents
  INNER JOIN UNWATCHED_MOVIES
  ON UNWATCHED_MOVIES.movie_id=torrents.movie_id
  `)
  return res
}

async function clean_up() {
  console.log("creating connection")
  let db = await make_connection()
  let  movies_to_delete = await get_movies_to_delete(db)
  console.log(movies_to_delete)
  process.exit()
}

clean_up()