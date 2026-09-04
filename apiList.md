# DevTinder APIs

## authRouter (router and below are routes)1 
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password = forgot password API

## connectionRequestRouter
<!-- - POST /request/send/:status/:userId -->

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter
- GET /user/requests/received
- GET /user/connections
- GET /user/feed - Gets you the profiles of other users on platform


Status: ignore, interested, accepted, rejected

// Pagination
// /user/feed?page=1&limit=10  => gives first 10 users 1 to 10 => .skip(0) & .limit(10)
// /user/feed?page=2&limit=10  => gives 10 users from 11 to 20

skip formula = (page - 1) * limit