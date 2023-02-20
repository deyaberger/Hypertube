# `/user`

****

## `/get_profile`

Gets the logged in user's own profile.

Method: `GET`
Auth required: `True`

**Response data**:

```js
{
    id,
    first_name,
    last_name,
    mail,
    language,
    picture,
    username,
    bio,
    city
}
```

**Status codes**:

- 200 : OK

****

## `/update_profile`

Update the logged in user's profile

Method: `GET`
Auth required: `True`

**Request Body**:

```js
{
    first_name (optional),
    last_name (optional),
    mail (optional),
    pass (optional),
    language (optional),
    username (optional),
    bio (optional),
    city (optional)
}
```

**Response data**:

Updated profile information:

```js
{
    id,
    first_name,
    last_name,
    mail,
    language,
    picture,
    username,
    bio,
    city
}
```

**Status codes**:

- 200 : OK

****

## `/profile/:user_id`

Method: `GET`
Auth required: `True`


**Response data**:

```js
{
    id,
    first_name,
    last_name,
    mail,
    language,
    picture,
    username,
    bio,
    city
}
```

**Status codes**:

- 200 : OK

****

## `/watched_movies`

Get the logged in user's watched_movies (max 20, if more oldest will be ommitted).

Method: `GET`
Auth required: `True`

**Response data**:

```js
[MOVIE_DATA_OBJECT, ... ]
```

**Status codes**:

- 200 : OK

## `/update_first_name`

Update the logged in user's profile

Method: `GET`
Auth required: `True`

**Request Body**:

```js
{
    first_name (required),
}
```

**Response data**:

Updated profile information:

```js
{
    id,
    first_name,
    last_name,
    mail,
    language,
    picture,
    username,
    bio,
    city
}
```
