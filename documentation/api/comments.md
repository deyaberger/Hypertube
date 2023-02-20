# `/comments`

**ALL ENDPOINTS REQUIRE AUTH AND CAN RETURN ERROR CODES COMING FROM THAT**

****

## `/post/:movie_id`

Method: `POST`  
Auth required: `True`

**Request Body**:

```js
{
    content: 'I like this movie!'
}
```

**Response data**:

```js
{
    id
    content
    user_id
    movie_id
    date
}
```

**Status codes**:

- 200 : OK

****

## `/update/:comment_id`

Method: `PATCH`  
Auth required: `True`

**Request Body**:

```js
{
    content: 'I dont like this movie anymore !'
}
```

**Response data**:

```js
{
    id
    content
    user_id
    movie_id
    date
}
MAY CHANGE
```

**Status codes**:

- 200 : OK

****

## `/delete/:comment_id`

Method: `DELETE`  
Auth required: `True`

**Response data**:

```js
{
    message: 'sql message if error.',
    code: 'SUCCESS or sql error code.'
}

```

**Status codes**:

- 200 : OK

****

## `/get_for_movie/:movie_id`

Method: `GET`  
Auth required: `True`

**Response data**:

```js
comments: [
    {
        id
        content
        user_id
        movie_id
        date
    }
]
```

**Status codes**:

- 200 : OK

****

## `/get_for_user/:user_id`

Method: `GET`  
Auth required: `True`

**Response data**:

```js
comments: [
    {
        id
        content
        user_id
        movie_id
        date
    }
]
```

**Status codes**:

- 200 : OK
