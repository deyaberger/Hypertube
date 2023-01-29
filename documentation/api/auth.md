# /auth

****
## `/signup`

Method: `POST`  
Auth required: `False`

**Request Body**:

- username
- firstName
- lastName
- mail
- password

**Response data**:

- message : ok message or the sql error message
- id : The id of the created user
- code (only in case of error)

**Status codes**:

- 200 : OK
- 201 : Error
    - ER_DUP_ENTRY : mail or username taken
    - ER_DATA_TOO_LONG : A field exceeds max length
    - ER_BAD_NULL_ERROR : a required field is empty
- 400 : ER_PARSE_ERROR

****
## `/signin`

Method: `POST`
Auth required: `False`

**Request Body**:

- username
- password

**Response data**:

- message
- token: token to use for authentication (null if failed)

**Status codes**:

- 200 : success
- 201 : failure


****
## `/forgotpass/:mail`

Request a password reset, get a link by mail.

Method: `GET`

**Response data**:

Empty,
Information (**hash code** required for reset)is sent to the mail address.  
**THE MAIL IS NOT SENT YET, HASH IS PRINTED IN SERVER CONSOLE**

**Status codes**:

- 200 : OK
- 400 : FAIL


****
## `/resetpass`

Reset password.

Method: `POST`

**Request Body**:

- new_pass
- hash (hash from `forgotpass`)

****
## `/getid`

Method: `GET`  
Auth required: `True`  

**Request Headers**:

```js
'Authorization' : 'Bearer TOKEN'
```

**Response data**:

```js
{
    userid: user_id
}
```

