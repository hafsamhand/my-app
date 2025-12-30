import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { AuthProvider, useAuth } from '../lib/auth';

function Nav() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Monorepo App
            </Link>
          </div>
          <nav className="hidden md:flex space-x-4 lg:space-x-8 items-center">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/loans"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Loans
            </Link>
            <Link
              href="/spendings"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Spendings
            </Link>
            <Link
              href="/savings"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Savings
            </Link>
            {user ? (
              <>
                <Link
                  href="/me"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {user.email}
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
          {/* Mobile menu */}
          <div className="md:hidden">
            <div className="flex items-center space-x-2">
              {user && (
                <Link
                  href="/me"
                  className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium"
                >
                  {user.email?.split('@')[0]}
                </Link>
              )}
              <button
                onClick={() => {
                  const nav = document.getElementById('mobile-nav');
                  if (nav) {
                    nav.classList.toggle('hidden');
                  }
                }}
                className="text-gray-700 hover:text-blue-600 p-2"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        <div id="mobile-nav" className="hidden md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/"
              className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/loans"
              className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
            >
              Loans
            </Link>
            <Link
              href="/spendings"
              className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
            >
              Spendings
            </Link>
            <Link
              href="/savings"
              className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
            >
              Savings
            </Link>
            {user ? (
              <>
                <Link
                  href="/me"
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Nav />
      <main className="min-h-screen bg-gray-50">
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}
