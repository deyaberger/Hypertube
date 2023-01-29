# `/comments`

**ALL ENDPOINTS REQUIRE AUTH AND CAN RETURN ERROR CODES COMING FROM THAT**

****

## `/post/:movie_id`

Method: `POST`  
Auth required: `True`

**Request Body**:

```js

```

**Response data**:

```js

```

**Status codes**:

- 200 : OK

****

## `/update/:comment_id`

Method: `PATCH`  
Auth required: `True`

**Request Body**:

```js

```

**Response data**:

```js

```

**Status codes**:

- 200 : OK

****

## `/delete/:comment_id`

Method: `DELETE`  
Auth required: `True`

**Request Body**:

```js

```

**Response data**:

```js

```

**Status codes**:

- 200 : OK

****

## `/get_for_movie/:movie_id`

Method: `GET`  
Auth required: `True`

**Request Body**:

```js

```

**Response data**:

```js

```

**Status codes**:

- 200 : OK

****

## `/get_for_user/:user_id`

Method: `GET`  
Auth required: `True`

**Request Body**:

```js

```

**Response data**:

```js

```

**Status codes**:

- 200 : OK
