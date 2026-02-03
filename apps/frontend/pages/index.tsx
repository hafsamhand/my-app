import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import { loansApi, spendingsApi, savingsApi } from '../lib/api';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Home() {
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
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-base">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-base">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900">Dashboard</h1>

      {/* Loans Statistics */}
      {loansStats && (
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Loans Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Loaned Out</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{loansStats.asLoaner.totalAmount}</p>
              <p className="text-sm text-gray-600 mt-1">{loansStats.asLoaner.count} loans</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Borrowed</h3>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {loansStats.asBorrower.totalAmount}
              </p>
              <p className="text-sm text-gray-600 mt-1">{loansStats.asBorrower.count} loans</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Overdue Loans</h3>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">{loansStats.overdueCount}</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-600 mb-2">By Status</h3>
              <div className="mt-2 space-y-1">
                {loansStats.byStatus.map((item: any) => (
                  <div key={item.status} className="flex justify-between text-sm">
                    <span className="capitalize text-gray-700">{item.status}:</span>
                    <span className="font-medium text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Loans Charts */}
          {loansStats.byStatus.length > 0 || loansStats.byCurrency.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {loansStats.byStatus.length > 0 && (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Loans by Status</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={loansStats.byStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {loansStats.byStatus.map((entry: any, index: number) => {
                          const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              {loansStats.byCurrency.length > 0 && (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Loans by Currency</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={loansStats.byCurrency}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="currencyCode" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="totalAmount" fill="#8884d8" name="Total Amount" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500 text-base">
              No loan data available for charts
            </div>
          )}
        </div>
      )}

      {/* Spendings Statistics */}
      {spendingsStats && (
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Spendings Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Spending</h3>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">{spendingsStats.total.amount}</p>
              <p className="text-sm text-gray-600 mt-1">{spendingsStats.total.count} transactions</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Average Spending</h3>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                {spendingsStats.total.average.toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow sm:col-span-2">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Top Categories</h3>
              <div className="space-y-1">
                {spendingsStats.topCategories.slice(0, 5).map((item: any) => (
                  <div key={item.category} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.category}:</span>
                    <span className="font-medium text-gray-900">{item.totalAmount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Spendings Charts */}
          {(spendingsStats.byMonth?.length > 0 || spendingsStats.topCategories?.length > 0) ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {spendingsStats.byMonth?.length > 0 && (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Spending Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={spendingsStats.byMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Spending" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              {spendingsStats.topCategories?.length > 0 && (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Top Spending Categories</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={spendingsStats.topCategories.slice(0, 5)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percent }) =>
                          `${category.substring(0, 15)}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="totalAmount"
                      >
                        {spendingsStats.topCategories.slice(0, 5).map((entry: any, index: number) => {
                          const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500 text-base">
              No spending data available for charts
            </div>
          )}
        </div>
      )}

      {/* Savings Statistics */}
      {savingsStats && (
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Savings Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Active Savings</h3>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{savingsStats.activeTotal.amount}</p>
              <p className="text-sm text-gray-600 mt-1">{savingsStats.activeTotal.count} savings</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-600 mb-2">By Status</h3>
              <div className="mt-2 space-y-1">
                {savingsStats.byStatus.map((item: any) => (
                  <div key={item.status} className="flex justify-between text-sm">
                    <span className="capitalize text-gray-700">{item.status}:</span>
                    <span className="font-medium text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow sm:col-span-2">
              <h3 className="text-sm font-medium text-gray-600 mb-2">By Place</h3>
              <div className="space-y-1">
                {savingsStats.byPlace.slice(0, 5).map((item: any) => (
                  <div key={item.place} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.place}:</span>
                    <span className="font-medium text-gray-900">{item.totalAmount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Savings Charts */}
          {(savingsStats.byMonth?.length > 0 || savingsStats.byStatus?.length > 0) ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {savingsStats.byMonth?.length > 0 && (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Savings Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={savingsStats.byMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="total" stroke="#00C49F" name="Total Savings" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              {savingsStats.byStatus?.length > 0 && (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Savings by Status</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={savingsStats.byStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {savingsStats.byStatus.map((entry: any, index: number) => {
                          const colors = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE'];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500 text-base">
              No savings data available for charts
            </div>
          )}
        </div>
      )}
    </div>
  );
}
