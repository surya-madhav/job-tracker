# API Documentation

## Overview
RESTful API implementation using Next.js API routes.

## Authentication

### POST `/api/auth/register`
Register new user:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

### POST `/api/auth/login`
Login user:
```json
{
  "email": "string",
  "password": "string"
}
```

### POST `/api/auth/logout`
Logout user (no body required)

## Jobs

### GET `/api/jobs`
List user's jobs:
```json
{
  "jobs": [
    {
      "id": "string",
      "title": "string",
      "company": {
        "name": "string"
      },
      "status": "string",
      "applicationDate": "string"
    }
  ]
}
```

### POST `/api/jobs`
Create job:
```json
{
  "title": "string",
  "companyId": "string",
  "status": "string",
  "applicationDate": "string"
}
```

## Companies

### GET `/api/companies`
List companies:
```json
{
  "companies": [
    {
      "id": "string",
      "name": "string",
      "industry": "string",
      "location": "string"
    }
  ]
}
```

### POST `/api/companies`
Create company:
```json
{
  "name": "string",
  "website": "string",
  "industry": "string",
  "location": "string"
}
```

## Error Handling
```json
{
  "error": "Error message"
}
```

## Authentication
- JWT tokens in HTTP-only cookies
- Protected routes require valid token
- Token expiration: 24 hours