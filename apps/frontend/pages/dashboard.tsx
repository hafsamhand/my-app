import React, { useEffect, useState } from 'react';
import Router from 'next/router';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${apiUrl}/api/protected`, {
      method: 'GET',
      credentials: 'include', // send cookie
    })
      .then(async (res) => {
        if (res.status === 401) {
          Router.push('/login');
          return;
        }
        const json = await res.json();
        setData(json);
      })
      .catch((e) => {
        console.error(e);
        setData({ error: 'Network error' });
      });
  }, [apiUrl]);

  return (
    <div>
      <h2>Dashboard (protected)</h2>
      <pre>{data ? JSON.stringify(data, null, 2) : 'Loading...'}</pre>
    </div>
  );
}
