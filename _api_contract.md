# Backend API Contract

This file was generated automatically by AI Factory after the backend phase completed.
**Frontend agents MUST use these exact paths, methods, and payload shapes.**
Do not invent or guess endpoint paths — use only what is listed here.

## Endpoint Summary

| Method | Path | Description |
| ------ | ---- | ----------- |
| `POST` | `/api/auth/register` | Create new user account |
| `POST` | `/api/auth/login` | Authenticate user and return JWT |
| `GET` | `/api/recipes` | List all recipes with optional search and pagination |
| `GET` | `/api/recipes/:id` | Get single recipe details |
| `POST` | `/api/recipes` | Create new recipe (auth required) |
| `PUT` | `/api/recipes/:id` | Update own recipe (auth required) |
| `DELETE` | `/api/recipes/:id` | Delete own recipe (auth required) |
| `POST` | `/api/upload` | Upload recipe image (auth required), multipart/form-data with field 'image' |
| `POST` | `/api/auth/register` | Create a new user account with bcrypt-hashed password, return JWT and user profile (no password) |
| `POST` | `/api/auth/login` | Authenticate existing user with bcrypt comparison, return JWT and user profile (no password) |
| `GET` | `/api/recipes` | List all recipes with optional search and pagination |
| `GET` | `/api/recipes/:id` | Get a single recipe by ID |
| `POST` | `/api/recipes` | Create a new recipe (auth required) |
| `PUT` | `/api/recipes/:id` | Update own recipe (auth required); returns 403 if not owner |
| `DELETE` | `/api/recipes/:id` | Delete own recipe (auth required); returns 403 if not owner |
| `POST` | `/api/upload` | Upload a recipe image (auth required). Accepts multipart/form-data with an 'image' field. Validates file type (JPEG, PNG, GIF, WebP) and size (max 5 MB). Returns the public URL of the stored image. |

## Endpoint Details

### `POST /api/auth/register`
Create new user account

**Request body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "createdAt": "date"
  }
}
```

### `POST /api/auth/login`
Authenticate user and return JWT

**Request body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "createdAt": "date"
  }
}
```

### `GET /api/recipes`
List all recipes with optional search and pagination

**Response:**
```json
{
  "recipes": [],
  "total": "number",
  "page": "number"
}
```

### `GET /api/recipes/:id`
Get single recipe details

**Response:**
```json
{
  "recipe": {}
}
```

### `POST /api/recipes`
Create new recipe (auth required)

**Request body:**
```json
{
  "title": "string",
  "description": "string",
  "ingredients": [
    "string"
  ],
  "instructions": [
    "string"
  ],
  "difficulty": "string",
  "prepTime": "number",
  "cookTime": "number",
  "servings": "number",
  "imageUrl": "string"
}
```

**Response:**
```json
{
  "recipe": {}
}
```

### `PUT /api/recipes/:id`
Update own recipe (auth required)

**Request body:**
```json
{
  "title": "string",
  "description": "string",
  "ingredients": [
    "string"
  ],
  "instructions": [
    "string"
  ],
  "difficulty": "string",
  "prepTime": "number",
  "cookTime": "number",
  "servings": "number",
  "imageUrl": "string"
}
```

**Response:**
```json
{
  "recipe": {}
}
```

### `DELETE /api/recipes/:id`
Delete own recipe (auth required)

**Response:**
```json
{
  "success": true
}
```

### `POST /api/upload`
Upload recipe image (auth required), multipart/form-data with field 'image'

**Request body:**
```json
{
  "image": "file"
}
```

**Response:**
```json
{
  "url": "string"
}
```

### `POST /api/auth/register`
Create a new user account with bcrypt-hashed password, return JWT and user profile (no password)

**Request body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email format)",
  "password": "string (required, min 8 chars, at least one uppercase letter and one number)"
}
```

**Response:**
```json
{
  "token": "string (JWT, 7d expiry)",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "createdAt": "date"
  }
}
```

### `POST /api/auth/login`
Authenticate existing user with bcrypt comparison, return JWT and user profile (no password)

**Request body:**
```json
{
  "email": "string (required, valid email format)",
  "password": "string (required)"
}
```

**Response:**
```json
{
  "token": "string (JWT, 7d expiry)",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "createdAt": "date"
  }
}
```

### `GET /api/recipes`
List all recipes with optional search and pagination

**Response:**
```json
{
  "recipes": [],
  "total": "number",
  "page": "number"
}
```

### `GET /api/recipes/:id`
Get a single recipe by ID

**Response:**
```json
{
  "recipe": {}
}
```

### `POST /api/recipes`
Create a new recipe (auth required)

**Request body:**
```json
{
  "title": "string",
  "description": "string",
  "ingredients": "string[]",
  "instructions": "string[]",
  "difficulty": "string",
  "prepTime": "number",
  "cookTime": "number",
  "servings": "number",
  "imageUrl": "string"
}
```

**Response:**
```json
{
  "recipe": {}
}
```

### `PUT /api/recipes/:id`
Update own recipe (auth required); returns 403 if not owner

**Request body:**
```json
{
  "title": "string",
  "description": "string",
  "ingredients": "string[]",
  "instructions": "string[]",
  "difficulty": "string",
  "prepTime": "number",
  "cookTime": "number",
  "servings": "number",
  "imageUrl": "string"
}
```

**Response:**
```json
{
  "recipe": {}
}
```

### `DELETE /api/recipes/:id`
Delete own recipe (auth required); returns 403 if not owner

**Response:**
```json
{
  "success": true
}
```

### `POST /api/upload`
Upload a recipe image (auth required). Accepts multipart/form-data with an 'image' field. Validates file type (JPEG, PNG, GIF, WebP) and size (max 5 MB). Returns the public URL of the stored image.

**Request body:**
```json
{
  "image": "file (multipart/form-data)"
}
```

**Response:**
```json
{
  "url": "string \u2014 publicly accessible URL to the uploaded image"
}
```
