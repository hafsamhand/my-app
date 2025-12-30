import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import { savingsApi } from '../lib/api';
import type { Saving, CreateSavingInput, SavingStatus } from '../types';
import CreateSaving from './createSaving';

export default function SavingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [savings, setSavings] = useState<Saving[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<{
    status?: SavingStatus;
    currencyCode?: string;
    startDate?: string;
    endDate?: string;
    savingPlace?: string;
  }>({});
  const [formData, setFormData] = useState<CreateSavingInput>({
    amount: 0,
    currencyCode: 'USD',
    savingDate: '',
    savingPlace: '',
  });

  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth to finish loading
    }

    if (!user) {
      router.push('/login');
      return;
    }

    fetchSavings();
  }, [user, authLoading, router, filters]);

  const fetchSavings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await savingsApi.findAll(filters);
      setSavings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch savings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSaving = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const newSaving = await savingsApi.create(formData);
      setSavings([newSaving, ...savings]);
      setFormData({
        amount: 0,
        currencyCode: 'USD',
        savingDate: '',
        savingPlace: '',
      });
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create saving');
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

  const handleDeleteSaving = async (id: number) => {
    if (!confirm('Delete this saving?')) return;
    try {
      setError('');
      await savingsApi.delete(id);
      setSavings(savings.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete saving');
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: SavingStatus) => {
    try {
      setError('');
      const updated = await savingsApi.update(id, { status: newStatus });
      setSavings(savings.map((s) => (s.id === id ? updated : s)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update saving');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Savings Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base"
        >
          {showForm ? 'Cancel' : '+ Create Saving'}
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
          <select
            value={filters.status || ''}
            onChange={(e) =>
              setFilters({ ...filters, status: (e.target.value as SavingStatus) || undefined })
            }
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="withdrawn">Withdrawn</option>
            <option value="lost">Lost</option>
            <option value="transferred">Transferred</option>
          </select>
          <input
            type="text"
            placeholder="Currency Code"
            value={filters.currencyCode || ''}
            onChange={(e) => setFilters({ ...filters, currencyCode: e.target.value || undefined })}
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
        <CreateSaving
          formData={formData}
          setFormData={setFormData}
          handleCreateSaving={handleCreateSaving}
        />
      )}

      {/* Savings Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading savings...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
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
                    Place
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {savings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 text-base">
                      No savings found
                    </td>
                  </tr>
                ) : (
                  savings.map((saving) => (
                    <tr key={saving.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900">
                        {saving.amount}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-700">
                        {saving.currencyCode}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-700">
                        {new Date(saving.savingDate).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-700">
                        {saving.savingPlace}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-700">
                        {saving.reason || '-'}
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <select
                          value={saving.status}
                          onChange={(e) =>
                            handleUpdateStatus(saving.id, e.target.value as SavingStatus)
                          }
                          className="w-full sm:w-auto px-2 sm:px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="withdrawn">Withdrawn</option>
                          <option value="lost">Lost</option>
                          <option value="transferred">Transferred</option>
                        </select>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteSaving(saving.id)}
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
