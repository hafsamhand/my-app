import React, { useState, useEffect } from 'react';
import { loansApi } from '../lib/api';
import type { Loan, CreateLoanInput } from '../types';

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateLoanInput>({
    loanerId: 1,
    borrowerId: 2,
    amount: 0,
    currencyCode: 'USD',
    borrowingDate: '',
    dueDate: '',
  });

  // Fetch all loans on mount
  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await loansApi.findAll();
      setLoans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const newLoan = await loansApi.create(formData);
      setLoans([...loans, newLoan]);
      setFormData({
        loanerId: 1,
        borrowerId: 2,
        amount: 0,
        currencyCode: 'USD',
        borrowingDate: '',
        dueDate: '',
      });
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create loan');
    }
  };

  const handleDeleteLoan = async (id: number) => {
    if (!confirm('Delete this loan?')) return;
    try {
      setError('');
      await loansApi.delete(id);
      setLoans(loans.filter((l) => l.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete loan');
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      setError('');
      const updated = await loansApi.update(id, { status: newStatus as any });
      setLoans(loans.map((l) => (l.id === id ? updated : l)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update loan');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Loans Management</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showForm ? 'Cancel' : 'Create Loan'}
      </button>

      {showForm && (
        <form onSubmit={handleCreateLoan} className="mb-6 p-4 bg-gray-100 rounded">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Loaner ID"
              value={formData.loanerId}
              onChange={(e) => setFormData({ ...formData, loanerId: Number(e.target.value) })}
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Borrower ID"
              value={formData.borrowerId}
              onChange={(e) => setFormData({ ...formData, borrowerId: Number(e.target.value) })}
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
              value={formData.borrowingDate}
              onChange={(e) => setFormData({ ...formData, borrowingDate: e.target.value })}
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Loan
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading loans...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Loaner ID</th>
                <th className="border px-4 py-2">Borrower ID</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Currency</th>
                <th className="border px-4 py-2">Borrowing Date</th>
                <th className="border px-4 py-2">Due Date</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.length === 0 ? (
                <tr>
                  <td colSpan={9} className="border px-4 py-2 text-center">
                    No loans found
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{loan.id}</td>
                    <td className="border px-4 py-2">{loan.loanerId}</td>
                    <td className="border px-4 py-2">{loan.borrowerId}</td>
                    <td className="border px-4 py-2">{loan.amount.toFixed(2)}</td>
                    <td className="border px-4 py-2">{loan.currencyCode}</td>
                    <td className="border px-4 py-2">{loan.borrowingDate}</td>
                    <td className="border px-4 py-2">{loan.dueDate}</td>
                    <td className="border px-4 py-2">
                      <select
                        value={loan.status}
                        onChange={(e) => handleUpdateStatus(loan.id, e.target.value)}
                        className="px-2 py-1 border rounded"
                      >
                        <option value="active">Active</option>
                        <option value="overdue">Overdue</option>
                        <option value="repaid">Repaid</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDeleteLoan(loan.id)}
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
