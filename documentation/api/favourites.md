# `/favourites`

Maximum 20 favourites allowed per user.

****

## `/all`

Get the logged in user's favourite movies (max 20)

Method: `GET`  
Auth required: `True`

**Response data**:

```js
[ MOVIE_DATA_OBJECT, ... ]
```

**Status codes**:

- 200 : OK

****

## `/add/:movie_id`

Method: `GET`  
Auth required: `True`

**Response data**:

```js
{
    message: 'sql error message',
    code: 'sql error code'
}
```

**Status codes**:

- 200 : OK

## `/remove/:movie_id`

Method: `GET`  
Auth required: `True`

**Response data**:

```js
{
    message: 'sql error message',
    code: 'sql error code'
}
```

**Status codes**:

- 200 : OK
