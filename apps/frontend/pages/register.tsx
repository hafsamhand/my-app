import React from 'react';
export default function Register() {
  return (
    <div>
      <h1>Regiter</h1>
      <p>Index page fetching a public backend endpoint:</p>
      <form action="" method="post">
        <input type="email" name="email" placeholder="Email" required />
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
