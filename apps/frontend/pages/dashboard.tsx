import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Redirect /dashboard to homepage
export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return null;
}
