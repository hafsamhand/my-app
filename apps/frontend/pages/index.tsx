import React, { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState<{ message?: string; time?: string } | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${apiUrl}/api/public`)
      .then((r) => r.json())
      .then(setData)
      .catch((e) => console.error(e));
  }, [apiUrl]);

  return (
    <div>
      <h1>monorepo-next-nest-mysql</h1>
      <p>Index page fetching a public backend endpoint:</p>
      <pre>{data ? JSON.stringify(data, null, 2) : 'Loading...'}</pre>
    </div>
  );
}
