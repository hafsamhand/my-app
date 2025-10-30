import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('Password123!');
  const [msg, setMsg] = useState('');
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('Logging in...');
    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // important so browser sends/receives cookies
      });
      const body = await res.json();
      document.cookie = body.cookie;
      localStorage.setItem('accessToken', body.cookie.split('=')[1]);
      if (res.ok) {
        setMsg('Logged in');
        router.push('/dashboard');
      } else {
        setMsg(body?.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setMsg('Network error');
    }
  }

  return (
    <div>
      <div className="text-3xl my-12 px-3 font-bold underline">Login</div>
      <form onSubmit={submit}>
        <div>
          <label className="text-xl py-4  font-medium">Email:</label>
          <br />
          <input
            className="border border-2 my-2 border-fuchsia-700 p-2 rounded-md bg-fuchsia-100 "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xl py-4  font-medium">Password:</label>
          <br />
          <input
            className="border border-2 my-2 border-fuchsia-700 p-2 rounded-md bg-fuchsia-100 "
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button
            type="submit"
            className="border p-4 text-blue-100 font-medium border-blue-900 bg-blue-900 rounded-lg"
          >
            Login
          </button>
        </div>
      </form>
      <p>{msg}</p>
    </div>
  );
}
