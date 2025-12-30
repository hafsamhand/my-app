import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import { loansApi, spendingsApi, savingsApi } from '../lib/api';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loansStats, setLoansStats] = useState<any>(null);
  const [spendingsStats, setSpendingsStats] = useState<any>(null);
  const [savingsStats, setSavingsStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth to finish loading
    }

    if (!user) {
      router.push('/login');
      return;
    }

    loadStatistics();
  }, [user, authLoading, router]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError('');
      const [loans, spendings, savings] = await Promise.all([
        loansApi.getStatistics(),
        spendingsApi.getStatistics(),
        savingsApi.getStatistics(),
      ]);
      setLoansStats(loans);
      setSpendingsStats(spendings);
      setSavingsStats(savings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* Loans Statistics */}
      {loansStats && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Loans Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Loaned Out</h3>
              <p className="text-2xl font-bold text-blue-600">{loansStats.asLoaner.totalAmount}</p>
              <p className="text-sm text-gray-600">{loansStats.asLoaner.count} loans</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Borrowed</h3>
              <p className="text-2xl font-bold text-green-600">
                {loansStats.asBorrower.totalAmount}
              </p>
              <p className="text-sm text-gray-600">{loansStats.asBorrower.count} loans</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Overdue Loans</h3>
              <p className="text-2xl font-bold text-red-600">{loansStats.overdueCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">By Status</h3>
              <div className="mt-2 space-y-1">
                {loansStats.byStatus.map((item: any) => (
                  <div key={item.status} className="flex justify-between text-sm">
                    <span className="capitalize">{item.status}:</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spendings Statistics */}
      {spendingsStats && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Spendings Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Spending</h3>
              <p className="text-2xl font-bold text-red-600">{spendingsStats.total.amount}</p>
              <p className="text-sm text-gray-600">{spendingsStats.total.count} transactions</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Average Spending</h3>
              <p className="text-2xl font-bold text-orange-600">
                {spendingsStats.total.average.toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Top Categories</h3>
              <div className="space-y-1">
                {spendingsStats.topCategories.slice(0, 5).map((item: any) => (
                  <div key={item.category} className="flex justify-between text-sm">
                    <span>{item.category}:</span>
                    <span className="font-medium">{item.totalAmount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Savings Statistics */}
      {savingsStats && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Savings Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Active Savings</h3>
              <p className="text-2xl font-bold text-green-600">{savingsStats.activeTotal.amount}</p>
              <p className="text-sm text-gray-600">{savingsStats.activeTotal.count} savings</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">By Status</h3>
              <div className="mt-2 space-y-1">
                {savingsStats.byStatus.map((item: any) => (
                  <div key={item.status} className="flex justify-between text-sm">
                    <span className="capitalize">{item.status}:</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">By Place</h3>
              <div className="space-y-1">
                {savingsStats.byPlace.slice(0, 5).map((item: any) => (
                  <div key={item.place} className="flex justify-between text-sm">
                    <span>{item.place}:</span>
                    <span className="font-medium">{item.totalAmount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
