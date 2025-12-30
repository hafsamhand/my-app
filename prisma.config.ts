// prisma.config.ts
import { defineConfig } from '@prisma/config';

export default defineConfig({
  migrate: {
    // URL used ONLY for migrations
    // MUST come from env file
    url: process.env.DATABASE_URL!,
  },
});
