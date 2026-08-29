# Backend Setup Guide

This guide will help you set up and run the Government ERP Backend API on your local machine.

## Installation Steps

1. Install Dependencies
   ```javascript
   npm install
   ```
   > in Backend folder

2. Environment Configuration
   > refer .env.example

3. Database Setup (Prisma)
   ```javascript
   npx prisma generate
   ```
   ```javascript
   npx prisma db push
   ```

## Running the Application

### Development Mode
   ```javascript
   npm run dev
   ```

### Production Mode
   ```javascript
   npm start
   ```

## API Documentation

Once the server is running, access Swagger UI at:
   http://localhost:3000/api-docs

## Common Commands

- Install dependencies
```javascript
npm install
``` 
- Regenerate Prisma Client
```javascript
npx prisma generate
```
- Sync schema with database
```javascript
npx prisma db push
```
- Start server in dev mode
```javascript
 npm run dev
```