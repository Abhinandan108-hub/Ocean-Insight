# Ocean Insight API Documentation

## Overview

The Ocean Insight backend provides a comprehensive RESTful API for the Ocean Education Resource Platform. The API is versioned and follows REST conventions with standardized response formats.

**Base URL**: `http://localhost:4000` (development) | `https://api.oceaninsight.com` (production)

**API Version**: v1

## Response Format

All API responses follow a standardized JSON structure:

```json
{
  "success": boolean,
  "message": string,
  "data": any,
  "error": string (optional)
}
```

## HTTP Status Codes

- `200` - OK: Successful GET request
- `201` - Created: Successful POST request creating a resource
- `400` - Bad Request: Invalid input or validation failed
- `401` - Unauthorized: Missing or invalid authentication token
- `403` - Forbidden: Authenticated user lacks permission
- `404` - Not Found: Resource doesn't exist
- `409` - Conflict: Resource already exists
- `500` - Server Error: Internal server error

## Authentication

### JWT Token Authentication

Most endpoints require authentication via JWT token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

**Token Types**:
- **Access Token**: Short-lived token (1 hour default), used for API requests
- **Refresh Token**: Long-lived token (7 days default), used to get new access tokens

### Token Refresh

When your access token expires, use the refresh token to get a new one:

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General Limit**: 100 requests per 15 minutes
- **Auth Limit**: 5 requests per 15 minutes (stricter for login/signup)
- **Search Limit**: 30 requests per minute
- **Email Limit**: 3 requests per hour (password reset, etc.)

When limit is exceeded, the API returns `429 Too Many Requests`.

## Validation

All input is validated using Joi schemas. Validation errors return:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "must be a valid email"
    }
  ]
}
```

---

## AUTH ENDPOINTS

Base: `/api/v1/auth`

### Register New User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one number
- At least one special character (!@#$%^&*)

**Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "65a1234567890abcdef12345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "User",
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Triggers**:
- Welcome email sent to user

---

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "65a1234567890abcdef12345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "User",
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Refresh Token

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Forgot Password

```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset link will be sent."
}
```

**Triggers**:
- Password reset email sent with unique token link

---

### Reset Password

```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

### Get Current User Profile

```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "_id": "65a1234567890abcdef12345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "User",
    "avatar": null,
    "bio": "Ocean enthusiast",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## RESOURCE ENDPOINTS

Base: `/api/v1/resources`

### Get All Resources

```http
GET /api/v1/resources?page=1&limit=10&grade=9-12&sort=newest
```

**Query Parameters**:
- `page` (number, default: 1) - Page number for pagination
- `limit` (number, default: 10, max: 100) - Items per page
- `grade` (string, optional) - Filter by grade: K-2, 3-5, 6-8, 9-12, Higher Ed, General
- `type` (string, optional) - Filter by type: Video, Image, Lesson, Link, PDF
- `subject` (string, optional) - Filter by subject
- `tag` (string, optional) - Filter by tag
- `sort` (string, default: newest) - Sort by: newest, oldest, popular, views

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Resources retrieved",
  "data": {
    "data": [
      {
        "_id": "65a1234567890abcdef12345",
        "title": "Ocean Currents Explained",
        "description": "A comprehensive guide...",
        "type": "Video",
        "gradeLevel": "9-12",
        "subject": "Marine Biology",
        "tags": ["currents", "ocean", "biology"],
        "mediaUrl": "https://example.com/video.mp4",
        "thumbnailUrl": "https://example.com/thumb.jpg",
        "author": {
          "_id": "65a1234567890abcdef12346",
          "name": "Dr. Smith",
          "email": "smith@example.com",
          "avatar": null
        },
        "views": 156,
        "isPublished": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 523,
      "pages": 53
    }
  }
}
```

---

### Get Resource by ID

```http
GET /api/v1/resources/:id
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Resource retrieved",
  "data": {
    "_id": "65a1234567890abcdef12345",
    "title": "Ocean Currents Explained",
    "description": "A comprehensive guide...",
    "content": "Detailed content here...",
    "type": "Video",
    "gradeLevel": "9-12",
    "subject": "Marine Biology",
    "tags": ["currents", "ocean", "biology"],
    "mediaUrl": "https://example.com/video.mp4",
    "thumbnailUrl": "https://example.com/thumb.jpg",
    "author": {
      "_id": "65a1234567890abcdef12346",
      "name": "Dr. Smith",
      "email": "smith@example.com"
    },
    "views": 157,
    "isPublished": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Note**: Views are automatically incremented when resource is accessed.

---

### Search Resources

```http
GET /api/v1/resources/search?query=ocean&grade=9-12&page=1&limit=10
```

**Query Parameters**:
- `query` (string, optional) - Search term for full-text search
- `grade`, `type`, `subject`, `tag` (string, optional) - Filters
- `page`, `limit` (number) - Pagination

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Search results retrieved",
  "data": {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 89,
      "pages": 9
    }
  }
}
```

---

### Create Resource

```http
POST /api/v1/resources
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Ocean Currents Explained",
  "description": "A comprehensive guide to understanding ocean currents",
  "content": "Detailed educational content about ocean currents...",
  "type": "Video",
  "gradeLevel": "9-12",
  "subject": "Marine Biology",
  "tags": ["currents", "ocean", "biology"],
  "mediaUrl": "https://example.com/video.mp4",
  "thumbnailUrl": "https://example.com/thumb.jpg"
}
```

**Required Fields**:
- title, description, content, type, gradeLevel, subject

**Optional Fields**:
- tags, mediaUrl, thumbnailUrl

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "_id": "65a1234567890abcdef12347",
    "title": "Ocean Currents Explained",
    ...
    "author": "65a1234567890abcdef12345",
    "isPublished": false,
    "views": 0
  }
}
```

---

### Update Resource

```http
PUT /api/v1/resources/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "isPublished": true
}
```

**Allowed Fields**: title, description, content, type, gradeLevel, subject, tags, mediaUrl, thumbnailUrl, isPublished

**Authorization**: User must be resource author or Admin

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Resource updated successfully",
  "data": {...}
}
```

---

### Delete Resource

```http
DELETE /api/v1/resources/:id
Authorization: Bearer <access_token>
```

**Authorization**: User must be resource author or Admin

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Resource deleted successfully"
}
```

---

## COLLECTIONS ENDPOINTS

Base: `/api/v1/collections`

### Get User Collections

```http
GET /api/v1/collections?page=1&limit=10
Authorization: Bearer <access_token>
```

**Query Parameters**:
- `page`, `limit` - Pagination

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Collections retrieved",
  "data": {
    "data": [
      {
        "_id": "65a1234567890abcdef99999",
        "userId": "65a1234567890abcdef12345",
        "title": "My Favorite Ocean Resources",
        "description": "Collection of resources I love",
        "resourceIds": [
          "65a1234567890abcdef12347",
          "65a1234567890abcdef12348"
        ],
        "isPublic": false,
        "shareToken": null,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

---

### Get Collection by ID

```http
GET /api/v1/collections/:id
Authorization: Bearer <access_token>
```

**Authorization**: Public collections accessible to anyone; private collections require ownership

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Collection retrieved",
  "data": {
    "_id": "65a1234567890abcdef99999",
    "title": "My Favorite Ocean Resources",
    "resourceIds": [...],
    ...
  }
}
```

---

### Create Collection

```http
POST /api/v1/collections
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "My Favorite Ocean Resources",
  "description": "Collection of resources I love",
  "isPublic": false
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Collection created successfully",
  "data": {
    "_id": "65a1234567890abcdef99999",
    "userId": "65a1234567890abcdef12345",
    "title": "My Favorite Ocean Resources",
    "resourceIds": [],
    "isPublic": false,
    "shareToken": null
  }
}
```

---

### Update Collection

```http
PUT /api/v1/collections/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "isPublic": true
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Collection updated successfully",
  "data": {...}
}
```

---

### Add Resource to Collection

```http
POST /api/v1/collections/:id/add
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "resourceId": "65a1234567890abcdef12347"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Resource added to collection",
  "data": {
    "_id": "65a1234567890abcdef99999",
    "resourceIds": [
      "65a1234567890abcdef12347",
      "65a1234567890abcdef12348"
    ]
  }
}
```

---

### Remove Resource from Collection

```http
POST /api/v1/collections/:id/remove
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "resourceId": "65a1234567890abcdef12347"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Resource removed from collection",
  "data": {...}
}
```

---

### Share Collection

```http
POST /api/v1/collections/:id/share
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "email": "friend@example.com"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Collection shared successfully",
  "data": {
    "shareLink": "http://localhost:5173/collections/abc123xyz789"
  }
}
```

**Triggers**:
- Email sent to recipient with link to shared collection

---

### View Shared Collection (Public)

```http
GET /api/v1/collections/public/:token
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Collection retrieved",
  "data": {
    "title": "My Favorite Ocean Resources",
    "resourceIds": [...]
  }
}
```

---

### Delete Collection

```http
DELETE /api/v1/collections/:id
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Collection deleted successfully"
}
```

---

## EVENTS ENDPOINTS

Base: `/api/v1/events`

### Get All Events

```http
GET /api/v1/events?page=1&limit=10&location=Hawaii&sort=upcoming
```

**Query Parameters**:
- `page`, `limit` - Pagination
- `location` (string, optional) - Filter by location
- `sort` (string) - newest, oldest, upcoming

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Events retrieved",
  "data": {
    "data": [{
      "_id": "65a1234567890abcdef88888",
      "title": "Ocean Expedition 2024",
      "description": "Join us for an amazing ocean expedition",
      "startDate": "2024-06-15T09:00:00Z",
      "endDate": "2024-06-15T17:00:00Z",
      "location": "Hawaii",
      "externalLink": "https://expedition.oceaninsight.com",
      "liveStreamLink": "https://stream.example.com",
      "eventImage": "https://example.com/event.jpg",
      "createdBy": {
        "_id": "65a1234567890abcdef12345",
        "name": "Admin",
        "email": "admin@example.com"
      },
      "registeredUsers": [
        "65a1234567890abcdef12346",
        "65a1234567890abcdef12347"
      ],
      "maxParticipants": 50
    }],
    "pagination": {...}
  }
}
```

---

### Get Event by ID

```http
GET /api/v1/events/:id
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Event retrieved",
  "data": {...}
}
```

---

### Create Event

```http
POST /api/v1/events
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Ocean Expedition 2024",
  "description": "Join us for an amazing ocean expedition exploring marine ecosystems",
  "startDate": "2024-06-15T09:00:00Z",
  "endDate": "2024-06-15T17:00:00Z",
  "location": "Hawaii",
  "externalLink": "https://expedition.oceaninsight.com",
  "liveStreamLink": "https://stream.example.com",
  "eventImage": "https://example.com/event.jpg",
  "maxParticipants": 50
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {...}
}
```

---

### Update Event

```http
PUT /api/v1/events/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated Event Title",
  "maxParticipants": 75
}
```

**Authorization**: User must be event creator or Admin

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {...}
}
```

---

### Register for Event

```http
POST /api/v1/events/:id/register
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Registered for event successfully"
}
```

---

### Unregister from Event

```http
POST /api/v1/events/:id/unregister
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Unregistered from event successfully"
}
```

---

### Delete Event

```http
DELETE /api/v1/events/:id
Authorization: Bearer <access_token>
```

**Authorization**: User must be event creator or Admin

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

## ADMIN ENDPOINTS

Base: `/api/v1/admin`

**Authorization**: All admin endpoints require Admin role and authentication

### Get Dashboard Statistics

```http
GET /api/v1/admin/dashboard/stats
Authorization: Bearer <admin_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Dashboard statistics",
  "data": {
    "stats": {
      "totalUsers": 150,
      "totalResources": 523,
      "publishedResources": 487,
      "totalEvents": 25,
      "activeUsers": 120
    },
    "recentActivity": {
      "logs": [...],
      "users": [...],
      "resources": [...]
    }
  }
}
```

---

### Get All Users

```http
GET /api/v1/admin/users?page=1&limit=20&role=Educator&isActive=true
Authorization: Bearer <admin_token>
```

**Query Parameters**:
- `page`, `limit` - Pagination
- `role` (string, optional) - Admin, Educator, User
- `isActive` (boolean, optional) - true, false

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Users retrieved",
  "data": {
    "data": [...]
    "pagination": {...}
  }
}
```

---

### Update User Role

```http
PUT /api/v1/admin/users/:userId/role
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "Educator"
}
```

**Allowed Roles**: Admin, Educator, User

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User role updated",
  "data": {...}
}
```

---

### Deactivate User

```http
PUT /api/v1/admin/users/:userId/deactivate
Authorization: Bearer <admin_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User deactivated",
  "data": {...}
}
```

---

### Get All Resources

```http
GET /api/v1/admin/resources?page=1&limit=20&isPublished=false
Authorization: Bearer <admin_token>
```

**Query Parameters**:
- `page`, `limit` - Pagination
- `isPublished` (boolean, optional) - Filter by publication status

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Resources retrieved",
  "data": {...}
}
```

---

### Publish Resource

```http
PUT /api/v1/admin/resources/:resourceId/publish
Authorization: Bearer <admin_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Resource published",
  "data": {...}
}
```

---

### Unpublish Resource

```http
PUT /api/v1/admin/resources/:resourceId/unpublish
Authorization: Bearer <admin_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Resource unpublished",
  "data": {...}
}
```

---

### Get System Logs

```http
GET /api/v1/admin/logs?page=1&limit=50&level=error&userId=65a1234567890abcdef12345
Authorization: Bearer <admin_token>
```

**Query Parameters**:
- `page`, `limit` - Pagination
- `level` (string, optional) - error, warn, info, debug
- `userId` (string, optional) - Filter by user

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Logs retrieved",
  "data": {
    "data": [
      {
        "_id": "65a1234567890abcdef70000",
        "level": "error",
        "message": "Failed to save resource",
        "timestamp": "2024-01-15T10:30:00Z",
        "userId": "65a1234567890abcdef12345",
        "endpoint": "/api/v1/resources",
        "statusCode": 500,
        "error": "Database connection failed"
      }
    ],
    "pagination": {...}
  }
}
```

---

## HEALTH CHECK ENDPOINT

Base: `/health`

### Check API Health

```http
GET /health
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "status": "OK",
    "timestamp": "2024-01-15T10:30:00Z",
    "uptime": 3600,
    "memory": {
      "rss": 104857600,
      "heapTotal": 52428800,
      "heapUsed": 26214400,
      "external": 1048576
    }
  }
}
```

---

## Error Handling

### Common Error Responses

**Validation Error** (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "must be a valid email"
    }
  ]
}
```

**Unauthorized** (401):
```json
{
  "success": false,
  "message": "Unauthorized. Please login."
}
```

**Forbidden** (403):
```json
{
  "success": false,
  "message": "Access denied. Required role: Admin"
}
```

**Not Found** (404):
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**Conflict** (409):
```json
{
  "success": false,
  "message": "User already exists"
}
```

**Rate Limited** (429):
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

**Server Error** (500):
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!"
  }'

# Login
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Get Resources
curl -X GET "http://localhost:4000/api/v1/resources?page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

### Using Postman

1. Import the API into Postman
2. Set up environment variables for `baseUrl`, `accessToken`, and `refreshToken`
3. Use the provided collection to test all endpoints

---

## Pagination

All list endpoints support pagination with standard parameters:

```
GET /api/v1/resources?page=2&limit=20
```

**Pagination Response Object**:
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 523,
    "pages": 27
  }
}
```

---

## Sorting

Sorting is available on list endpoints using the `sort` parameter:

```
GET /api/v1/resources?sort=popular
```

**Available Sorts**:
- `newest` - Most recently created
- `oldest` - Oldest created first
- `popular` - Most viewed
- `views` - By view count

---

## Filtering

Most endpoints support multiple filters:

```
GET /api/v1/resources?grade=9-12&type=Video&subject=Biology&tag=ocean
```

---

## Rate Limiting Headers

Responses include rate limit information in headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705318200
```

---

## Changelog

**Version 1.0.0** (February 2024)
- Initial API release
- Core modules: Auth, Resources, Collections, Events, Admin
- Email notifications
- Full-text search
- Role-based access control
- Rate limiting and security features