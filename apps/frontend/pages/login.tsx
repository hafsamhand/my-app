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
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          <label>Email</label>
          <br />
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit">Login</button>
        </div>
      </form>
      <p>{msg}</p>
    </div>
  );
}
