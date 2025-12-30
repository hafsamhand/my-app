import Link from 'next/link';
import React from 'react';

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link> | <Link href="/dashboard">Dashboard</Link> |{' '}
      <Link href="/loans">Loans</Link> | <Link href="/spendings">Spendings</Link> |{' '}
      <Link href="/login">Login</Link>
    </nav>
  );
}
