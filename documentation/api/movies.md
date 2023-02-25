# `/movies`

All action regarding movies, not streaming.

****

## Movie data object

```js
{
    id,
    yts_id,
    imdb_code,
    title,
    imdb_rating,
    year,
    length_minutes,
    language,
    summary,
    genres,
    is_watched,
    is_favourite,
}
```

## `/home`

Method: `GET`  
Auth required: `True`

**Response data**:

```js
movies: [ MOVIE_DATA_OBJECT, ... ]
```

**Status codes**:

****

## `/search`

Method: `GET`  
Auth required: `True`

**Query keywords**

```js
query_term
minimum_rating
genre
quality
min_year
max_year
language
order_by
asc_or_desc
```

**Response data**:

```js
movies: [ MOVIE_DATA_OBJECT, ... ]
```

**Status codes**:

****

## `/details/:movie_id`

Method: `GET`  
Auth required: `True`

**Response data**:

```js
MOVIE_DATA_OBJECT
```

**Status codes**:

****

## `/torrents/:movie_id`

Method: `GET`  
Auth required: `True`

**Response data**:

```js
torrents: [
    {
        id
        movie_id
        url
        hash
        quality
        seeds
        peers
        size
        size_bytes
    }, 
]
```

**Status codes**:

****


## `/subtitles/:movie_id`

Method: `GET`  
Auth required: `True`

**Response data**:

```js
TO_BE_FIGURED_OUT
```

**Status codes**:

****

## `/set_watched/:movie_id`

Method: `POST`  
Auth required: `True`

**Response data**:

```js
{
    message: 'ok msg, or sql error msg',
    code: 'SUCCESS or sql error code'
}
```

**Status codes**:

- 200 : OK