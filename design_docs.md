# ProctorX REST API Documentation

## Table of Contents
1. [Introduction](#introduction)
    - [Base URL](#base-url)
2. [Authentication](#authentication)
    - [Signup Flow](#signup-flow)
    - [Login Flow](#login-flow)
    - [Generate Token Flow](#generate-token-flow)
    - [Refresh Token Flow](#refresh-token-flow)
    - [Logout Flow](#logout-flow)
3. [Test](#test)


## Introduction
>Welcome to the ProctorX REST API documentation. This documentation is intended for developers who want to write front end clients using out REST API.


### Base URL
The base URL for all API endpoints is: `localhost:8000/`



## Authentication


### Signup Flow
The signup flow starts by navigating to the `/signup` endpoint.

Signup Request:
```http
POST /signup
Content-Type: application/json

{
    "username": "testuser",
    "password": "testpassword",
    "email": "testuser@example.com",
    "type": "student",          // or "institute"
}
```

Signup Response:
1. If the signup is successful, the server will respond with a 201 Created status code and a JSON object containing the user's information.
```http
HTTP/1.1 201 Created
Content-Type: application/json
{
    "ok": true,
    "type": "student",          // or "institute"
    "name": "Test User",
    "username": "testuser",
    "email": "testuser@example.com",
    "bio": "",
    "profile_url": "https://cdn.example.com/default.jpg"
}
```

2. If the signup is unsuccessful, the server will respond with a 400 Bad Request status code and a JSON object containing an error message. Below are the possible error messages.

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "ok": false,
    "error": "Username already exists"
}
```

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "ok": false,
    "error": "Email already exists"
}
```

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "ok": false,
    "error": "Invalid user type"
}
```

### Login Flow
The login flow starts by navigating to the `/login` endpoint.

Login Request:
```http
POST /login
Content-Type: application/json

{
    "username": "testuser",
    "password": "testpassword"
}
```

Login Response: 
1. If the login is successful, the server will respond with a 200 OK status code and a JSON object containing the user's information and a JWT token.
```http
HTTP/1.1 200 OK
Content-Type: application/json
{
    "ok": true,
    "type": "student",          // or "institute"
    "name": "Test User",
    "username": "testuser",
    "email": "testuser@example.com",
    "bio": "IIT Ropar 2025",
    "profile_url": "https://cdn.example.com/testuser.jpg",
    "refresh": "refresh_token",
    "access": "access_token",
    "expires_in": 3600          // in seconds
}
```

2. If the login is unsuccessful, the server will respond with a 401 Unauthorized status code and a JSON object containing an error message.
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
{
    "ok": false,
    "error": "Invalid username or password"
}
```


### Generate Token Flow
The generate token flow is used to obtain a new access token after the current access token has expired.

Generate Token Request:
```http
POST /token
Content-Type: application/json
{
    "username": "testuser",
    "password": "testpassword"
}
```

Generate Token Response:
1. If the login is successful, the server will respond with a 200 OK status code and a JSON object containing the new access token.
```http
HTTP/1.1 200 OK
Content-Type: application/json
{
    "access": "new_access_token",
    "refresh": "refresh_token"
}
```



### Refresh Token Flow
The refresh token flow is used to obtain a new access token after the current access token has expired.

Refresh Token Request:
```http
POST /token/refresh
Content-Type: application/json
{
    "refresh": "refresh_token"
}
```

Refresh Token Response:
1. If the refresh token is valid, the server will respond with a 200 OK status code and a JSON object containing the new access token.
```http
HTTP/1.1 200 OK
Content-Type: application/json
{
    "ok": true,
    "access": "new_access_token",
    "expires_in": 3600          // in seconds
}
```

2. If the refresh token is invalid, the server will respond with a 401 Unauthorized status code and a JSON object containing an error message.
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
{
    "ok": false,
    "error": "Invalid refresh token"
}
```



### Logout Flow
The logout flow starts by navigating to the `/logout` endpoint.

Logout Request:
```http
POST /logout
Content-Type: application/json
{
    "refresh": "refresh_token"
}
```

Logout Response:
1. If the logout is successful, the server will respond with a 200 OK status code and a JSON object containing a success message.
```http
HTTP/1.1 205 Reset Content
Content-Type: application/json
{
    "ok": true,
    "message": "Successfully logged out"
}
```

2. If the logout is unsuccessful, the server will respond with a 400 Bad Request status code and a JSON object containing an error message.
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "ok": false,
    "error": "Invalid refresh token"
}
```



## Test
Under development
