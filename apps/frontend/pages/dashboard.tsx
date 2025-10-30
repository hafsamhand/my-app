import React, { useEffect, useState } from 'react';
import Router from 'next/router';

export default function Dashboard() {
  const [data, setData] = useState<unknown | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = window ? window.localStorage.getItem('accessToken') : null;
    let accessToken = null;
    if (token) {
      accessToken = token ? token.split('; ')[0] : null;
    }

    fetch(`${apiUrl}/api/example/protected`, {
      method: 'GET',
      credentials: 'include', // send cookie
      headers: {
        Authorization: `Bearer ${accessToken}`, // Prepend "Bearer " to the token
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          Router.push('/login');
          return;
        }
        const json = await res.json();
        setData(json);
        console.log('got in', res.status);
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
