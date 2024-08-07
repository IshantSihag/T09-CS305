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
    - [Get Test](#get-test)
    - [Start Test](#start-test)
    - [Delete Test](#delete-test)
    - [Update Test](#update-test)
    - [Register Student for Test](#register-student-for-test)
    - [Get Result for Student](#get-result-for-student)
    - [Test Result](#test-result)
    - [Submit Test](#submit-test)
    - [Test Rating](#test-rating)
    - [Fetch Test](#fetch-test)
4. [Student](#student)
    - [Fetch Student Details](#fetch-student-details)
    

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
    "name": "Test User",
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
    "username": "testuser@example.com",
    "password": "testpassword",
    "type": "student"          // or "institute"
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
    "email": "testuser@example.com",
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

### Get Test

This endpoint retrieves tests associated with the authenticated user.

Get Test Request:
```http
GET /getTest
```

Get Test Response:

1. If the request is successful, the server will respond with a 200 OK status code and a JSON object containing the user's tests.
```http
HTTP/1.1 200 OK
{
    "ok": true,
    "tests": [
        {
            "test_id": "Test ID",
            "title": "Test Title",
            "author": "Author's Email",
            "start": "YYYY-MM-DDTHH:MM:SSZ",
            "duration": "3600"  // in seconds
        },
        ...
    ]
}
```

2. If the request is unsuccessful, the server will respond with a 400 Bad Request status code and a JSON object containing an error message.
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "ok": false,
    "error": "Invalid request"
}
```


### Start Test

This endpoint starts a test for the authenticated user.

Start Test Request:
```http
POST /startTest
Content-Type: application/json
{
    "test_id": "Test ID"
}
```

Start Test Response:

1. If the request is successful, the server will respond with a 200 OK status code and a JSON object containing a success message.
```http
HTTP/1.1 200 OK
Content-Type: application/json
{
    "ok": true,
    "start": "YYYY-MM-DDTHH:MM:SSZ",
    "duration": "3600",      // in seconds
    "author": "Author's Email",
    "title": "Test Title",
    "questions": [
        {
            "statement": "Question Statement",
            "type": "Question Type",
            "marks": "Question Marks",
            "options": ["Option 1", "Option 2", ...]
        },
        ...
    ]
}
```

2. If the request is unsuccessful, the server will respond with a 400 Bad Request status code and a JSON object containing an error message.
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "ok": false,
    "error": "Invalid request"
}
```

### Delete Test

This endpoint deletes a test for the authenticated institute.

Delete Test Request:
```http
DELETE /deleteTest
Content-Type: application/json
{
    "test_id": "Test ID"
}
```

Delete Test Response:

1. If the request is successful, the server will respond with a 200 OK status code and a JSON object containing a success message.
```http
HTTP/1.1 200 OK
Content-Type: application/json
{
    "ok": true,
    "message": "Test deleted successfully"
}
```

2. If the request is unsuccessful, the server will respond with a 400 Bad Request status code and a JSON object containing an error message.
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "ok": false,
    "error": "Invalid request"
}
```
### Update Test

This endpoint updates a test for the authenticated institute.

Update Test Request:

```http
POST /api/update-test
Content-Type: application/json

{
    "title": "New Test Title",
    "start": "2024-04-10 10:00:00",
    "duration": 60,
    "questions": [
        {
            "id": "Question ID",
            "statement": "What is the capital of France?",
            "type": "single_choice",
            "marks": 5,
            "choices": [
                {
                    "value": "Paris",
                    "isCorrect": true
                },
                {
                    "value": "London",
                    "isCorrect": false
                }
            ]
        }
    ],
    "test_id": "Test ID"
}
```

Update Test Response:

1. If the request is successful, the server will respond with a 200 OK status code and a JSON object containing a success message.

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "ok": true,
    "message": "Test updated successfully",
    "test_id": "Test ID"
}
```
2. **Invalid Request Body:** If the request body is not as intended or missing required fields, the server will respond with a 400 Bad Request status code and a JSON object containing an error message.

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
    "ok": false,
    "error": "body of the request not as intended"
}

```

3. **Test Not Found:** If the specified test ID does not correspond to any existing test in the database, the server will respond with a 400 Bad Request status code and a JSON object containing an error message.

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
    "ok": false,
    "error": "Test not found"
}
```



4. **User Not Valid:** If the user making the request is not considered a valid user, the server will respond with a 400 Bad Request status code and a JSON object containing an error message.

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
    "ok": false,
    "error": "Only insitute profile allowed access this resource"
}

```

5. **Other:** Any other error apart from the one mentioned above, the server response with a 400 Bad Request status code and a JSON object containing an error message.
```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
    "ok": false,
    "error": "Error message specific to the error"
}
```

### Register Student for Test

This endpoint registers a student for a test.

Register Student for Test Request:
```http
POST /student/registerForTest/
Content-Type: application/json
{
    "test_id": "ID of the test to register for",
    "test_code": "Test code for registration"
}
```

Register Student for Test Response:
1. If the request is successful, the server will respond with a 200 OK status code and a JSON object containing a success message.
```http
HTTP/1.1 200 OK
Content-Type: application/json
{
    "ok": true,
    "message": "successfully registered"
}
```

2. If the request is unsuccessful, the server will respond with a 400 Bad Request status code and a JSON object containing an error message.
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "ok": false,
    "error": "Error message describing the issue"
}
```

3. If the user or test doesn't exist, the server will respond with a 404 Not Found status code and a JSON object containing an error message.
```http
HTTP/1.1 404 Not Found
Content-Type: application/json
{
    "ok": false,
    "error": "User/Test not found"
}
```

4. If the test code is incorrect, the server will respond with a 406 Not Acceptable status code and a JSON object containing an error message.
```http
HTTP/1.1 406 Not Acceptable
Content-Type: application/json
{
    "ok": false,
    "error": "Incorrect Test code"
}
```

5. If the student is already registered for the test, the server will respond with a 409 Conflict status code and a JSON object containing an error message.
```http
HTTP/1.1 409 Conflict
Content-Type: application/json
{
    "ok": false,
    "error": "You are already registered for the Test"
}
```

### Get Result for Student

This endpoint retrieves the test result for a student.

Get Result for Student Request:
```http
GET /student/getResultForTest?test_id=ID of the test to get the result for
```

Get Result for Student Response:
1. If the request is successful, the server will respond with a 200 OK status code and a JSON object containing the test result.
```http
HTTP/1.1 200 OK
Content-Type: application/json
{
    "ok": true,
    "total": "Total marks of the test",
    "score": "Score obtained by the student",
    "questionwise_score": [
        {
            "id": "ID of the question",
            "statement": "Question statement",
            "total_marks": "Total marks of the question",
            "type": "Question type",
            "marks_scored": "Marks scored by the student for the question",
            "options": ["Option 1", "Option 2", ...],
            "answer_options_indices": [0, 2, ...],
            "attempted_options_indices": [1, 3, ...]
        },
        ...
    ]
}
```

2. If the request is unsuccessful, the server will respond with a 400 Bad Request status code and a JSON object containing an error message.
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "ok": false,
    "error": "Error message describing the issue"
}
```

3. If the user or test doesn't exist, the server will respond with a 404 Not Found status code and a JSON object containing an error message.
```http
HTTP/1.1 404 Not Found
Content-Type: application/json
{
    "ok": false,
    "error": "User/Test not found"
}
```



### Test Result

This endpoint retrieves the test result for an Institute.

Test Result Request:
```http
GET /testresult?test_id=ID of the test to get the result for
```

Test Result Response:

1. If the request is successful, the server will respond with a 200 OK status code and a JSON object containing the test result.
```http
HTTP/1.1 200 OK
Content-Type: application/json
{
    "ok": true,
    "result": [
        {
            "name": "Name of Student",
            "cgpa": "Student's CGPA",
            "phoneNo": "Student's Phone number",
            "batch": "Student's Batch eg. 2021",
            "course": "Student's Course eg. BTech",
            "score": "total score achieved by the student"
        },
        ...
    ]
}
```

2. If the request is unsuccessful, the server will respond with a 400 Bad Request status code and a JSON object containing an error message.
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "ok": false,
    "error": "Error message describing the issue"
}
```


### Submit Test

This endpoint submits a test for the authenticated student.

Submit Test Request:
```http
POST /submitTest
Content-Type: application/json
{
    "test_id": "ID of the test to submit",
    "user_response": [
        {
            "id": "ID of the question",
            "answerList": ["Index of the selected option", ...]
        },
        ...
    ]
}
```

Submit Test Response:

1. If the request is successful, the server will respond with a 200 OK status code and a JSON object containing a success message and the score obtained by the student.
```http
HTTP/1.1 200 OK
Content-Type: application/json
{
    "ok": true,
    "message": "Test submitted successfully",
    "score": "Score obtained by the student"
}
```

2. If the request is unsuccessful, the server will respond with a 400 Bad Request status code and a JSON object containing an error message.
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "ok": false,
    "error": "Error message describing the issue"
}
```

### Test Rating

This endpoint rates a test for the authenticated student.

Test Rating Request:
```http
POST /submitTestRating
Content-Type: application/json
{
    "test_id": "ID of the test to rate",
    "rating": "Rating for the test",
    "suggestion": "Suggestion for the test"
}
```

Test Rating Response:

1. If the request is successful, the server will respond with a 200 OK status code and a JSON object containing a success message.
```http
HTTP/1.1 200 OK
Content-Type: application/json
{
    "ok": true,
    "message": "Rating saved successfully"
}
```

2. If the request is unsuccessful, the server will respond with a 400 Bad Request status code and a JSON object containing an error message.
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "ok": false,
    "error": "Invalid request"
}
```

### Fetch Test

This endpoint retrieves the test details with answer key for the authenticated institute.

Fetch Test Request:
```http
GET /fetchTest?test_id=ID of the test to fetch
```

Fetch Test Response:

1. If the request is successful, the server will respond with a 200 OK status code and a JSON object containing the test details.
```http
HTTP/1.1 200 OK
Content-Type: application/json
{
    "ok": true,
    "start": "YYYY-MM-DDTHH:MM:SSZ",
    "duration": "3600",      // in seconds
    "author": "Author's Email",
    "title": "Test Title",
    "questions": [
        {
            "statement": "Question Statement",
            "type": "Question Type",
            "marks": "Question Marks",
            "options": ["Option 1", "Option 2", ...],
            "answer": "Answer to the question"
        },
        ...
    ]
}
```

2. If the request is unsuccessful, the server will respond with a 400 Bad Request status code and a JSON object containing an error message.
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "ok": false,
    "error": "Error message describing the issue"
}
```



## Student


### Fetch Student Details

This API endpoint retrieves details of the authenticated student.

The Fetch Student Detail request:
```http

GET /student/fetchStudentDetails
```

Fetch Student Response

1. If the request is successful, the server will respond with a 200 OK status code and a JSON object containing a success message.

```http
HTTP/1.1 200 OK
Content-Type: application/json
{
    "ok": true,
    "phone_number": "123-456-7890",
    "cgpa": 8.7,
    "batch": "2021",
    "course": "Computer Science"
    "bio": "An aspiring Computer Scientist in the field of Cybersecurity and zero knowledge proofs"
    "profile_url":"https://drive/sdasa.png"
}
```

2. If the login credentials are not that of a student, the server responds with a 400 Bad Request and a JSON object containing an error message.

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "ok": false,
    "error": "Need to login through a student credentials"
}
```
3. Any other error apart from the one mentioned above, the server response with 500 Internal Server Error

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{
    "ok": false,
    "error": "Error message specific to the error"
}
```

### Update Student Details

This endpoint allows authenticated students to update their details, including both their student information and user profile.

The Update Student Detail request:

```http
POST student/updateStudentDetails
Content-Type: application/json

{
    "phone_number": "Phone number of the student",
    "cgpa": "Cumulative grade point average (CGPA) of the student",
    "batch": "Batch/joining year of the student",
    "course": "Course of study of the student",
    "bio": "Bio information of the user",
    "profile_url": "URL to the user's profile picture"
}
```


Update Student Details Response:

1. If the request is successful, the server will respond with a 200 OK status code and a JSON object containing a success message.

```http
HTTP/1.1 200 OK
Content-Type: application/json
{
    "ok": true,
    "message": "Successfully updated the details"
}
```

2. If incorrect body is passed to the request, then server returns the required fields that it is expecting

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "ok": false,
    "error": "Body fields not correct. Expecting phone_number, cgpa, batch, course, bio, profile_url"
}
```
3. If the authenticated user is not of type student then, the server cannot provide the resource and hence error

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
    "ok": false,
    "error": "Need to login through student credentials"
}
```

4. General error, the ones that are not mentioned above, the server response with 500 Internal Server Error

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{
    "ok": false,
    "error": "Error message specific to the error"
}
```