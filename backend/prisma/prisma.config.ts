import { defineConfig } from '@prisma/client';

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL!,
      directUrl: process.env.DIRECT_URL,
    },
  },
});
