import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SampleCard from '../components/SampleCard';

export default function Home() {
  const [data, setData] = useState<{ message?: string; time?: string } | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = window ? window.localStorage.getItem('accessToken') : null;
    let accessToken = null;
    if (token) {
      accessToken = token ? token.split('; ')[0] : null;
    }
    fetch(`${apiUrl}/api/public`, {
      method: 'GET',
      credentials: 'include', // send cookie
      headers: {
        Authorization: `Bearer ${accessToken}`, // Prepend "Bearer " to the token
      },
    })
      .then((r) => r.json())
      .then(setData)
      .catch((e) => console.error(e));
  }, [apiUrl]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to Monorepo App</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A modern full-stack application built with Next.js, NestJS, and MySQL. <br />
            Experience seamless integration between frontend and backend technologies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-lg text-gray-600">
              Discover what makes our platform powerful and user-friendly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SampleCard title="Modern Tech Stack">
              Built with Next.js, NestJS, and MySQL for a robust and scalable architecture.
            </SampleCard>
            <SampleCard title="Authentication">
              Secure user authentication with JWT tokens and protected routes.
            </SampleCard>
            <SampleCard title="Responsive Design">
              Mobile-first design that works seamlessly across all devices.
            </SampleCard>
            <SampleCard title="API Integration">
              Real-time data fetching from backend APIs with error handling.
            </SampleCard>
            <SampleCard title="Type Safety">
              Full TypeScript support for better development experience and fewer bugs.
            </SampleCard>
            <SampleCard title="Modern UI">
              Clean, professional interface with Tailwind CSS styling.
            </SampleCard>
          </div>
        </div>
      </section>

      {/* API Status Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">API Status</h2>
            <p className="text-lg text-gray-600">
              Check the current status of our backend services
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <SampleCard title="Backend Connection">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      data ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {data ? 'Connected' : 'Loading...'}
                  </span>
                </div>
                {data && (
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Message:</strong> {data.message}
                    </p>
                    <p>
                      <strong>Time:</strong> {data.time}
                    </p>
                  </div>
                )}
              </div>
            </SampleCard>
          </div>
        </div>
      </section>
    </div>
  );
}
