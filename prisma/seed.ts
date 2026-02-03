/**
 * Seed script to create initial data: user and currencies.
 * Run with:
 *   npx ts-node --transpile-only prisma/seed.ts
 *
 * This script expects DATABASE_URL and JWT_SECRET in env (use .env)
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Seed user
  const email = 'alice@example.com';
  const password = 'Password123!'; // example only; do not hardcode in prod
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) {
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        fullname: 'Alice Johnson',
        username: 'alicej',
        email,
        password: hash,
      },
    });
    console.log('Created user', email);
  } else {
    console.log('Seed user already exists');
  }

  // Seed currencies
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  ];

  for (const currency of currencies) {
    const existingCurrency = await prisma.currency.findUnique({ where: { code: currency.code } });
    if (!existingCurrency) {
      await prisma.currency.create({
        data: currency,
      });
      console.log('Created currency', currency.code);
    } else {
      console.log('Currency', currency.code, 'already exists');
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
