import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Link from 'next/link';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <header style={{ padding: '1rem', borderBottom: '1px solid #e6e6e6' }}>
        <nav>
          <Link href="/">Home</Link> | <Link href="/dashboard">Dashboard</Link> |{' '}
          <Link href="/me">Profile</Link> | <Link href="/login">Login</Link>
        </nav>
      </header>
      <main className="container">
        <Component {...pageProps} />
      </main>
    </>
  );
}
