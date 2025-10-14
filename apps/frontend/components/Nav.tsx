import Link from 'next/link';

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link> | <Link href="/dashboard">Dashboard</Link> |{' '}
      <Link href="/login">Login</Link>
    </nav>
  );
}
