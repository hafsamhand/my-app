import React, { useEffect, useState } from 'react';
import SampleCard from '../components/SampleCard';

export default function Me() {
  const [userr, setUserr] = useState<{ id?: string; email?: string; username?: string } | null>(
    null,
  );
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
      .then((data) => {
        setUserr(data.user);
      })
      .catch((e) => console.error(e));
  }, [apiUrl]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {userr ? `Welcome back, ${userr.email?.split('@')[0]}!` : 'Loading Profile...'}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your personal dashboard where you can manage your account and view your information.
          </p>
        </div>
      </section>

      {/* Profile Information Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Profile Information</h2>
            <p className="text-lg text-gray-600">View and manage your account details</p>
          </div>

          {userr ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SampleCard title="User ID">
                <div className="text-center">
                  <p className="text-2xl font-mono font-bold text-blue-600">{userr.id}</p>
                </div>
              </SampleCard>
              <SampleCard title="Email Address">
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-800">{userr.email}</p>
                </div>
              </SampleCard>
              <SampleCard title="Username">
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-800">
                    {userr.username || 'Not set'}
                  </p>
                </div>
              </SampleCard>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-500 bg-blue-100">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading profile information...
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
