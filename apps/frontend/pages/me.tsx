/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
export default function Home() {
  const [userr, setUserr] = useState<{ id?: string; email?: string; username?: string } | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  useEffect(() => {
    const token = window ? window.localStorage.getItem('accessToken') : null;
    let accessToken = null;
    if (token) {
      accessToken = token ? token.split('; ')[0] : null;
    }
    fetch(`${apiUrl}/api/auth/me`, {
      method: 'GET',
      credentials: 'include', // send cookie
      headers: {
        Authorization: `Bearer ${accessToken}`, // Prepend "Bearer " to the token
      },
    })
      .then((r) => r.json())
      .then((data) => { setUserr(data.user); })
      .catch((e) => console.error(e));
  }, [apiUrl]);



  return (
    <div>
      <h1>{userr ? `Welcome, ${userr.email}` : 'monorepo-next-nest-mysql'} </h1>
      <p>Index page fetching a public backend endpoint:</p>
      <pre>{userr ? JSON.stringify(userr, null, 2) : 'Loading...'}</pre>
    </div>
  );
}
