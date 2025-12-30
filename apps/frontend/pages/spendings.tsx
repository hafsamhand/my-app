import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import { spendingsApi } from '../lib/api';
import type { Spending, CreateSpendingInput } from '../types';

export default function SpendingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [spendings, setSpendings] = useState<Spending[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<{
    currencyCode?: string;
    startDate?: string;
    endDate?: string;
    spentOn?: string;
  }>({});
  const [formData, setFormData] = useState<CreateSpendingInput>({
    amount: 0,
    currencyCode: 'USD',
    spendingDate: '',
    spentOn: '',
  });

  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth to finish loading
    }

    if (!user) {
      router.push('/login');
      return;
    }

    fetchSpendings();
  }, [user, authLoading, router, filters]);

  const fetchSpendings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await spendingsApi.findAll(filters);
      setSpendings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch spendings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSpending = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const newSpending = await spendingsApi.create(formData);
      setSpendings([newSpending, ...spendings]);
      setFormData({
        amount: 0,
        currencyCode: 'USD',
        spendingDate: '',
        spentOn: '',
      });
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create spending');
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const handleDeleteSpending = async (id: number) => {
    if (!confirm('Delete this spending?')) return;
    try {
      setError('');
      await spendingsApi.delete(id);
      setSpendings(spendings.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete spending');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Spendings Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base"
        >
          {showForm ? 'Cancel' : '+ Create Spending'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 p-4 sm:p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Currency Code"
            value={filters.currencyCode || ''}
            onChange={(e) => setFilters({ ...filters, currencyCode: e.target.value || undefined })}
            className="px-3 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Spent On"
            value={filters.spentOn || ''}
            onChange={(e) => setFilters({ ...filters, spentOn: e.target.value || undefined })}
            className="px-3 py-2 border rounded-lg"
          />
          <input
            type="date"
            placeholder="Start Date"
            value={filters.startDate || ''}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
            className="px-3 py-2 border rounded-lg"
          />
          <div className="flex gap-2">
            <input
              type="date"
              placeholder="End Date"
              value={filters.endDate || ''}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
              className="px-3 py-2 border rounded-lg flex-1"
            />
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Spending</h2>
          <form onSubmit={handleCreateSpending} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <input
                  type="text"
                  value={formData.currencyCode}
                  onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spending Date</label>
                <input
                  type="date"
                  value={formData.spendingDate}
                  onChange={(e) => setFormData({ ...formData, spendingDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spent On</label>
                <input
                  type="text"
                  placeholder="What did you spend on?"
                  value={formData.spentOn}
                  onChange={(e) => setFormData({ ...formData, spentOn: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Create Spending
            </button>
          </form>
        </div>
      )}

      {/* Spendings Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading spendings...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Currency
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Spent On
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {spendings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-base">
                      No spendings found
                    </td>
                  </tr>
                ) : (
                  spendings.map((spending) => (
                    <tr key={spending.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900">
                        {spending.amount}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-700">
                        {spending.currencyCode}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-700">
                        {new Date(spending.spendingDate).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-700">{spending.spentOn}</td>
                      <td className="px-3 sm:px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteSpending(spending.id)}
                          className="w-full sm:w-auto px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
