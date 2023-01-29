# Api endpoints

All api endpoints are prefixed with `/api`.  
All calls that require auth can return error codes / messages present in `/auth/get_id`.  
**Required Headers for endpoints demanding auth :**

```js
'Authorization' : 'Bearer TOKEN'
```

## [`/auth`](./api/auth.md)

- `/signup`
- `/signin`
- `/forgot_pass/:mail`
- `/reset_pass`
- `/get_id`


## [`/movies`](./api/movies.md)

- `/home/:page`
- `/search`
- `/details/:movie_id`
- `/torrents/:movie_id`
- `/subtitles/:movie_id`
- `/set_watched/:movie_id`


## [`/comments`](./api/comments.md)

- `/post/:movie_id`
- `/update/:comment_id`
- `/delete/:comment_id`
- `/get_for_movie/:movie_id`
- `/get_for_user/:user_id`


## [`/user`](./api/user.md)

- `/get_profile`
- `/update_profile`
- `/profile/:user_id`
- `/watched_movies`


## [`/favourites`](./api/favourites.md)

- `/all`
- `/add/:movie_id`
- `/remove/:movie_id`


## [`/torrent`](./api/torrent.md)

- `/start/:torrent_id`
- `/is_started/:torrent_id`
- `/is_ready/:torrent_id`
- `/stream/:torrent_id`
