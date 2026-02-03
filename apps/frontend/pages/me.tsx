import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import Link from 'next/link';

export default function Me() {
  const { user: authUser, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<{
    id?: number;
    email?: string;
    username?: string;
    fullname?: string;
    address?: string;
    createdAt?: string;
    lastAccess?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!authUser) {
      router.push('/login');
      return;
    }

    fetchUserData();
  }, [authUser, authLoading, router]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('accessToken') : null;
      
      const res = await fetch(`${apiUrl}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      const data = await res.json();
      if (data.user) {
        setUserData({
          id: typeof data.user.sub === 'string' ? parseInt(data.user.sub, 10) : data.user.sub,
          email: data.user.email,
          username: data.user.username,
          fullname: data.user.fullname,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-base">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-base">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-base sm:text-lg text-gray-600">
          Manage your account information and preferences
        </p>
      </div>

      {userData && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:py-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-blue-600">
                {userData.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-center sm:text-left text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                  {userData.fullname || userData.username || userData.email?.split('@')[0] || 'User'}
                </h2>
                <p className="text-blue-100 text-base sm:text-lg">{userData.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">User ID</label>
                <p className="text-base text-gray-900 font-mono">{userData.id}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Email Address</label>
                <p className="text-base text-gray-900">{userData.email}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Username</label>
                <p className="text-base text-gray-900">{userData.username || 'Not set'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-base text-gray-900">{userData.fullname || 'Not set'}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/loans"
                  className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-base font-medium"
                >
                  View Loans
                </Link>
                <Link
                  href="/spendings"
                  className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-base font-medium"
                >
                  View Spendings
                </Link>
                <Link
                  href="/savings"
                  className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-base font-medium"
                >
                  View Savings
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center justify-center px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-base font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
