import React, { useState, useEffect } from 'react';
import { savingsApi } from '../lib/api';
import type { Saving, CreateSavingInput } from '../types';

export default function SavingsPage() {
  const [savings, setSavings] = useState<Saving[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateSavingInput>({
    saverId: 1,
    amount: 0,
    currencyCode: 'USD',
    savingDate: '',
    savingPlace: '',
  });

  // Fetch all savings on mount
  useEffect(() => {
    fetchSavings();
  }, []);

  const fetchSavings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await savingsApi.findAll();
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
      setSavings([...savings, newSaving]);
      setFormData({
        saverId: 1,
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

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      setError('');
      const updated = await savingsApi.update(id, { status: newStatus as any });
      setSavings(savings.map((s) => (s.id === id ? updated : s)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update saving');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Savings Management</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showForm ? 'Cancel' : 'Create Saving'}
      </button>

      {showForm && (
        <form onSubmit={handleCreateSaving} className="mb-6 p-4 bg-gray-100 rounded">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Saver ID"
              value={formData.saverId}
              onChange={(e) => setFormData({ ...formData, saverId: Number(e.target.value) })}
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Currency Code"
              value={formData.currencyCode}
              onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value })}
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="date"
              value={formData.savingDate}
              onChange={(e) => setFormData({ ...formData, savingDate: e.target.value })}
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Saving Place"
              value={formData.savingPlace}
              onChange={(e) => setFormData({ ...formData, savingPlace: e.target.value })}
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Reason (optional)"
              value={formData.reason || ''}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Saving
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading savings...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Saver ID</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Currency</th>
                <th className="border px-4 py-2">Saving Date</th>
                <th className="border px-4 py-2">Saving Place</th>
                <th className="border px-4 py-2">Reason</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {savings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="border px-4 py-2 text-center">
                    No savings found
                  </td>
                </tr>
              ) : (
                savings.map((saving) => (
                  <tr key={saving.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{saving.id}</td>
                    <td className="border px-4 py-2">{saving.saverId}</td>
                    <td className="border px-4 py-2">{saving.amount.toFixed(2)}</td>
                    <td className="border px-4 py-2">{saving.currencyCode}</td>
                    <td className="border px-4 py-2">{saving.savingDate}</td>
                    <td className="border px-4 py-2">{saving.savingPlace}</td>
                    <td className="border px-4 py-2">{saving.reason || '-'}</td>
                    <td className="border px-4 py-2">
                      <select
                        value={saving.status}
                        onChange={(e) => handleUpdateStatus(saving.id, e.target.value)}
                        className="px-2 py-1 border rounded"
                      >
                        <option value="active">Active</option>
                        <option value="withdrawn">Withdrawn</option>
                        <option value="lost">Lost</option>
                        <option value="transferred">Transferred</option>
                      </select>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDeleteSaving(saving.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
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
      )}
    </div>
  );
}
