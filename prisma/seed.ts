/**
 * Seed script to create an initial user.
 * Run with:
 *   npx ts-node --transpile-only prisma/seed.ts
 *
 * This script expects DATABASE_URL and JWT_SECRET in env (use .env)
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'alice@example.com';
  const password = 'Password123!'; // example only; do not hardcode in prod
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Seed user already exists');
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      passwordHash: hash,
    },
  });

  console.log('Created user', email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
