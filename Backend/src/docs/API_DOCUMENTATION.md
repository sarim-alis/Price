# Mobile Price Predictor API Documentation

## Base URL
```
http://localhost:5000
```

## Database
- **Type**: PostgreSQL
- **ORM**: Prisma
- **Connection**: Configured via `DATABASE_URL` in `.env` file

## Models

### Mobile
Stores actual mobile phone data with specifications and prices.

**Fields:**
- `id` (String): Unique identifier
- `brand` (String): Mobile brand name
- `model` (String): Mobile model name
- `ram` (Int): RAM in GB
- `storage` (Int): Storage in GB
- `screenSize` (Float): Screen size in inches
- `camera` (Int): Main camera in MP
- `battery` (Int): Battery capacity in mAh
- `processor` (String): Processor name
- `price` (Float): Actual price
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

### Prediction
Stores prediction history with predicted prices.

**Fields:**
- `id` (String): Unique identifier
- `brand` (String): Mobile brand name
- `model` (String): Mobile model name
- `ram` (Int): RAM in GB
- `storage` (Int): Storage in GB
- `screenSize` (Float): Screen size in inches
- `camera` (Int): Main camera in MP
- `battery` (Int): Battery capacity in mAh
- `processor` (String): Processor name
- `predictedPrice` (Float): Predicted price
- `createdAt` (DateTime): Creation timestamp

## API Endpoints

### Health Check

#### GET /health
Check server and database connection status.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-10-31T02:07:00.000Z"
}
```

---

### Mobile Endpoints

#### GET /api/mobiles
Get all mobiles (ordered by creation date, newest first).

**Response:**
```json
[
  {
    "id": "clxxx...",
    "brand": "Samsung",
    "model": "Galaxy S24",
    "ram": 8,
    "storage": 256,
    "screenSize": 6.2,
    "camera": 50,
    "battery": 4000,
    "processor": "Snapdragon 8 Gen 3",
    "price": 799.99,
    "createdAt": "2025-10-31T02:00:00.000Z",
    "updatedAt": "2025-10-31T02:00:00.000Z"
  }
]
```

#### GET /api/mobiles/:id
Get a specific mobile by ID.

**Parameters:**
- `id` (path): Mobile ID

**Response:**
```json
{
  "id": "clxxx...",
  "brand": "Samsung",
  "model": "Galaxy S24",
  "ram": 8,
  "storage": 256,
  "screenSize": 6.2,
  "camera": 50,
  "battery": 4000,
  "processor": "Snapdragon 8 Gen 3",
  "price": 799.99,
  "createdAt": "2025-10-31T02:00:00.000Z",
  "updatedAt": "2025-10-31T02:00:00.000Z"
}
```

#### POST /api/mobiles
Create a new mobile entry.

**Request Body:**
```json
{
  "brand": "Samsung",
  "model": "Galaxy S24",
  "ram": 8,
  "storage": 256,
  "screenSize": 6.2,
  "camera": 50,
  "battery": 4000,
  "processor": "Snapdragon 8 Gen 3",
  "price": 799.99
}
```

**Response:** (201 Created)
```json
{
  "id": "clxxx...",
  "brand": "Samsung",
  "model": "Galaxy S24",
  "ram": 8,
  "storage": 256,
  "screenSize": 6.2,
  "camera": 50,
  "battery": 4000,
  "processor": "Snapdragon 8 Gen 3",
  "price": 799.99,
  "createdAt": "2025-10-31T02:00:00.000Z",
  "updatedAt": "2025-10-31T02:00:00.000Z"
}
```

#### PUT /api/mobiles/:id
Update an existing mobile.

**Parameters:**
- `id` (path): Mobile ID

**Request Body:**
```json
{
  "brand": "Samsung",
  "model": "Galaxy S24 Ultra",
  "ram": 12,
  "storage": 512,
  "screenSize": 6.8,
  "camera": 200,
  "battery": 5000,
  "processor": "Snapdragon 8 Gen 3",
  "price": 1199.99
}
```

**Response:**
```json
{
  "id": "clxxx...",
  "brand": "Samsung",
  "model": "Galaxy S24 Ultra",
  "ram": 12,
  "storage": 512,
  "screenSize": 6.8,
  "camera": 200,
  "battery": 5000,
  "processor": "Snapdragon 8 Gen 3",
  "price": 1199.99,
  "createdAt": "2025-10-31T02:00:00.000Z",
  "updatedAt": "2025-10-31T02:05:00.000Z"
}
```

#### DELETE /api/mobiles/:id
Delete a mobile.

**Parameters:**
- `id` (path): Mobile ID

**Response:**
```json
{
  "message": "Mobile deleted successfully"
}
```

---

### Prediction Endpoints

#### GET /api/predictions
Get all predictions (ordered by creation date, newest first).

**Response:**
```json
[
  {
    "id": "clxxx...",
    "brand": "Apple",
    "model": "iPhone 15 Pro",
    "ram": 8,
    "storage": 256,
    "screenSize": 6.1,
    "camera": 48,
    "battery": 3274,
    "processor": "A17 Pro",
    "predictedPrice": 999.99,
    "createdAt": "2025-10-31T02:00:00.000Z"
  }
]
```

#### POST /api/predictions
Create a new prediction entry.

**Request Body:**
```json
{
  "brand": "Apple",
  "model": "iPhone 15 Pro",
  "ram": 8,
  "storage": 256,
  "screenSize": 6.1,
  "camera": 48,
  "battery": 3274,
  "processor": "A17 Pro",
  "predictedPrice": 999.99
}
```

**Response:** (201 Created)
```json
{
  "id": "clxxx...",
  "brand": "Apple",
  "model": "iPhone 15 Pro",
  "ram": 8,
  "storage": 256,
  "screenSize": 6.1,
  "camera": 48,
  "battery": 3274,
  "processor": "A17 Pro",
  "predictedPrice": 999.99,
  "createdAt": "2025-10-31T02:00:00.000Z"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable (database connection issue)

---

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file with:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/price?schema=public"
   PORT=5000
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

---

## Prisma Commands

- **Generate Client:** `npx prisma generate`
- **Run Migrations:** `npx prisma migrate dev`
- **Open Prisma Studio:** `npx prisma studio`
- **Reset Database:** `npx prisma migrate reset`
- **View Database:** `npx prisma studio`
