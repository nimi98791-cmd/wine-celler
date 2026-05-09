# 🍷 Wine Cellar Backend

A Node.js + Express backend that scans wine bottle images using **Google Gemini 1.5 Flash** and stores the extracted data in **Supabase**.

---

## Project Structure

```
src/
├── server.js                  # Entry point — starts server after DB check
├── app.js                     # Express app, routes, global error handler
├── config/
│   └── database.js            # Supabase client + connection verification
├── middleware/
│   └── upload.js              # Multer (memory storage, 10 MB limit)
├── routes/
│   └── wineRoutes.js          # Route definitions
├── controllers/
│   └── wineController.js      # Request handlers, error mapping
├── services/
│   ├── imageService.js        # Sharp image optimisation
│   └── visionService.js       # Gemini Vision API integration + schema validation
└── models/
    └── wineModel.js           # Supabase CRUD operations
supabase_schema.sql            # Run once in Supabase SQL Editor
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Fill in all values (see table below)
```

### 3. Create the database table
Open **Supabase Dashboard → SQL Editor** and run the contents of `supabase_schema.sql`.

### 4. Start the server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

---

## Environment Variables

| Variable | Where to get it | Required |
|---|---|---|
| `PORT` | Any free port, default `3000` | No |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) | **Yes** |
| `SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL | **Yes** |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → `service_role` key | **Yes** |

> ⚠️ Use the **service_role** key (not the `anon` key) so the backend can bypass Row Level Security.

---

## API Reference

### `POST /api/wines/scan`
Upload a wine bottle photo and get back extracted wine data saved to your cellar.

**Request** — `multipart/form-data`
| Field | Type | Notes |
|---|---|---|
| `image` | File | JPEG, PNG, WebP, or HEIC. Max 10 MB. |

**Response 201**
```json
{
  "success": true,
  "message": "Wine scanned and saved successfully.",
  "data": {
    "id": "uuid",
    "wine_name": "Condrieu La Doriane",
    "winery": "E. Guigal",
    "vintage": 2021,
    "type": "White",
    "characteristics": "Deep and fruity with notes of peach, apricot, and white flowers, finishing with a rich honeyed texture",
    "estimated_price": 85,
    "rating_out_of_100": 94,
    "aging_potential": "Best between 2024–2029; drink within 8 years for peak aromatics",
    "drink_now": false,
    "scanned_at": "2025-01-15T14:23:00Z"
  }
}
```

**Error responses**
| Status | Meaning |
|---|---|
| 400 | No image uploaded |
| 413 | Image > 10 MB |
| 415 | Unsupported file type |
| 422 | Label unreadable / API validation failure |
| 503 | Database unavailable |

---

### `GET /api/wines`
Returns all wines in the cellar, newest first.

### `GET /api/wines/:id`
Returns a single wine by UUID.

### `GET /health`
Health check — returns `{ "status": "ok" }`.

---

## Testing with curl

```bash
curl -X POST http://localhost:3000/api/wines/scan \
  -F "image=@/path/to/wine_bottle.jpg"
```
