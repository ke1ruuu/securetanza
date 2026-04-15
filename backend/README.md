# Backend - Crime Data Management System

This directory contains all backend-related code for the Tanza Crime Management System.

## 📁 Directory Structure

```
backend/
├── api/                    # API route handlers
│   ├── crimes/            # Crime-related endpoints
│   │   ├── route.ts       # GET /api/crimes, POST /api/crimes
│   │   ├── [id]/route.ts  # GET/PUT/DELETE /api/crimes/[id]
│   │   └── stats/route.ts # GET /api/crimes/stats
│   └── barangays/         # Barangay-related endpoints
│       └── route.ts       # GET /api/barangays, POST /api/barangays
├── config/                # Configuration files
│   └── database.ts        # Database and Supabase config
├── lib/                   # Utility libraries
│   ├── prisma.ts          # Prisma client setup
│   └── crime-data.ts      # Crime data utilities
├── prisma/                # Database schema and migrations
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding script
└── types/                 # TypeScript type definitions
    └── index.ts           # Shared types
```

## 🗄️ Database Schema

### CrimeIncident
- `id`: Unique identifier (CUID)
- `barangay`: Name of the barangay
- `date`: Date of the incident
- `time`: Time of the incident (HH:MM format)
- `crimeType`: Type of crime
- `createdAt`: Record creation timestamp
- `updatedAt`: Record update timestamp

### Barangay
- `id`: Unique identifier (CUID)
- `name`: Barangay name (unique)
- `coordinates`: Optional GeoJSON coordinates
- `population`: Optional population count
- `area`: Optional area in square kilometers
- `createdAt`: Record creation timestamp
- `updatedAt`: Record update timestamp

## 🚀 API Endpoints

### Crime Management

#### GET /api/crimes
Fetch crime incidents with optional filters.

**Query Parameters:**
- `barangay`: Filter by barangay name
- `startDate`: Filter by start date (ISO string)
- `endDate`: Filter by end date (ISO string)
- `crimeType`: Filter by crime type
- `limit`: Limit number of results

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

#### POST /api/crimes
Create a new crime incident.

**Request Body:**
```json
{
  "barangay": "Bagtas",
  "date": "2024-01-15T10:30:00Z",
  "time": "10:30",
  "crimeType": "Theft"
}
```

#### GET /api/crimes/[id]
Get a specific crime incident by ID.

#### PUT /api/crimes/[id]
Update a crime incident.

#### DELETE /api/crimes/[id]
Delete a crime incident.

#### GET /api/crimes/stats
Get crime statistics and analytics.

**Query Parameters:**
- `barangay`: Filter stats by barangay
- `startDate`: Filter by start date
- `endDate`: Filter by end date

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCrimes": 150,
    "recentCrimes": 12,
    "crimesByType": [...],
    "crimesByBarangay": [...],
    "monthlyStats": [...]
  }
}
```

### Barangay Management

#### GET /api/barangays
Fetch all barangays.

**Query Parameters:**
- `search`: Search barangays by name

#### POST /api/barangays
Create a new barangay.

## 🛠️ Database Commands

```bash
# Generate Prisma client
bun run db:generate

# Push schema to database
bun run db:push

# Create and run migrations
bun run db:migrate

# Seed database with sample data
bun run db:seed

# Open Prisma Studio
bun run db:studio

# Reset database
bun run db:reset
```

## 🔧 Environment Variables

Required environment variables in `.env`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database URLs
DATABASE_URL=your_database_connection_string
DIRECT_URL=your_direct_database_connection_string
```

## 📊 Data Models

The system uses Prisma ORM with PostgreSQL (via Supabase) for data persistence. All models include automatic timestamps and use CUID for primary keys.

## 🔒 Security

- Input validation using Zod schemas
- Parameterized queries via Prisma (SQL injection protection)
- Environment variable validation
- Error handling and logging

## 🧪 Testing

The seed script creates sample data for all 24 barangays in Tanza, Cavite with realistic crime incidents for testing and development.