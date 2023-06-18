

# Deposit API

## Main Tech
* Node version: v16.14.0
* Passport + JWT for authentication
* Mongodb for connect data stored on Mongodb

Step to run:
* yarn
* yarn start
Then the API will run at: http://localhost:5001


## API Reference

#### Login

```http
  POST /login
```
User login

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. |
| `password` | `string` | **Required**. |

#### Register



```http
  POST /register
```
User register

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email` | `string` | **Required**. |
| `password` | `string` | **Required**.|


```http
  POST /token
```
Get new access token when access token is expired

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email` | `string` | **Required**. |

```http
  POST /bid/create
```
Create new Bid item

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `itemName` | `number` | **Required**. |
| `startPrice` | `number` | **Required**. |
| `timeWindow` | `number` | **Required**. |

```http
  GET /bid/get
```
Get list of Bid

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `filterType` | `one of "ongoing", "completed", "all"` | **Required**. |


```http
  PATCH /bid/place-order
```
Get list of Bid

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `amount` | `number` | **Required**. |
| `projectId` | `string` | **Required**. |



```http
  PATCH /user/deposit
```
Deposit

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `amount` | `number` | **Required**. |