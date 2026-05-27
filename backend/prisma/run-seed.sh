#!/bin/bash
# Load environment variables from .env.local
set -a
source .env.local
set +a

# Run the seed script
npx tsx backend/prisma/seed-auth.ts
