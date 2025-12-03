import React, { useState, useEffect } from 'react';
import { spendingsApi } from '../lib/api';
import type { Spending, CreateSpendingInput } from '../types';

export default function SpendingsPage() {
  const [spendings, setSpendings] = useState<Spending[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateSpendingInput>({
    spenderId: 1,
    amount: 0,
    currencyCode: 'USD',
    spendingDate: '',
    spentOn: '',
  });

  // Fetch all spendings on mount
  useEffect(() => {
    fetchSpendings();
  }, []);

  const fetchSpendings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await spendingsApi.findAll();
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
      setSpendings([...spendings, newSpending]);
      setFormData({
        spenderId: 1,
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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Spendings Management</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showForm ? 'Cancel' : 'Create Spending'}
      </button>

      {showForm && (
        <form onSubmit={handleCreateSpending} className="mb-6 p-4 bg-gray-100 rounded">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Spender ID"
              value={formData.spenderId}
              onChange={(e) => setFormData({ ...formData, spenderId: Number(e.target.value) })}
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
              value={formData.spendingDate}
              onChange={(e) => setFormData({ ...formData, spendingDate: e.target.value })}
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Spent On"
              value={formData.spentOn}
              onChange={(e) => setFormData({ ...formData, spentOn: e.target.value })}
              className="px-3 py-2 border rounded col-span-2"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Spending
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading spendings...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Spender ID</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Currency</th>
                <th className="border px-4 py-2">Spending Date</th>
                <th className="border px-4 py-2">Spent On</th>
                <th className="border px-4 py-2">Created At</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {spendings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="border px-4 py-2 text-center">
                    No spendings found
                  </td>
                </tr>
              ) : (
                spendings.map((spending) => (
                  <tr key={spending.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{spending.id}</td>
                    <td className="border px-4 py-2">{spending.spenderId}</td>
                    <td className="border px-4 py-2">{spending.amount.toFixed(2)}</td>
                    <td className="border px-4 py-2">{spending.currencyCode}</td>
                    <td className="border px-4 py-2">{spending.spendingDate}</td>
                    <td className="border px-4 py-2">{spending.spentOn}</td>
                    <td className="border px-4 py-2 text-sm">
                      {new Date(spending.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDeleteSpending(spending.id)}
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
