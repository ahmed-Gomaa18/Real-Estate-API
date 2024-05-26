# Real-Estate-APIs Project

This is a NestJS project built with TypeScript, using MongoDb as the database and Mongoose as the ODM.This Real Estate Project that allow client to create property requests and agent create ads and find the ads that be matched with requests and allow admin to control this flow 
 The project is organized into three main modules:

1. **Property Request Module**
2. **ad Module**
3. **Auth Module**

## Project Setup



1. **Clone the repository**:
   ```bash
   git clone <repository_url>
   cd <repository_directory>
2. **Make sure you have docker installed on your computer then run**:
   ```bash
   docker-compose up
3. **You will find in repo realestate folder use it to restore the backup**:
   ```bash
   mongorestore --uri="mongodb://root:root@mongodb:27017/realestate?authSource=admin" --out /yourPath/realestate

## Modules
---

### Property Request Module
---
>This module allow only Client to Create Property Requests.

### Create

**Endpoint**: **POST /propertyRequest/create**

***Description***: `Create Property Requests this endpoint allowed for Client Only`

### Update
**Endpoint**: **PATCH /propertyRequest/update{propertyRequestId}**

***Description***: `update Property Requests this endpoint allowed for Client Only`

### Get All propertyRequests
**Endpoint**: **GET /propertyRequest**

***Description***: `Retrieve propertyRequests with options for search, filte, and pagination`

### Get matches ads
**Endpoint**: **GET /propertyRequest/{propertyRequestId}/matches**

***Description***: `Retrieve matches ads By {propertyRequestId}`




### Ad Module
---
>This module allow only Agent to Create Ads.

### Create

**Endpoint**: **POST /ad/create**

***Description***: `Create Ads this endpoint allowed for Agent Only`

### Get All Ads
**Endpoint**: **GET /ad**

***Description***: `Retrieve Ads with options for search, filte, and pagination`

### Get matches propertyRequests
**Endpoint**: **GET /ad/{adId}/matches**

***Description***: `Retrieve propertyRequests ads By {adId}`


### Auth Module
---
>This module handles user registration and authentication.

### Get User Stats:
**Endpoint**: 
**GET /auth/userStats**

***Description:*** `Allow Only Admins to get report about user Stats at all app`

### Register:
**Endpoint**: **POST /auth/register**
***Description:*** `Register a new user.`

### Login:
**Endpoint**: 
**POST /auth/login**

***Description:*** `Authenticate a user and provide an access token.`

### Guarded Endpoints:
>protect some endpoint by guards to ensure only authenticated users can access them.

### validation Pipes:
>adding pipes for most endpoint to validate data before enter to controller or interact with DB

### API Documentation
>Swagger: http://hos:3000/api


Ensure your install docker in your computer
Kindly, Find attached `realestate` Folder, `users.txt` File to login or  register with new account