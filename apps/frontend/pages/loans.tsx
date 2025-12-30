import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import { loansApi, usersApi } from '../lib/api';
import type { Loan, CreateLoanInput, LoanStatus } from '../types';

interface User {
  id: number;
  email: string;
  fullname: string | null;
  username: string | null;
}

export default function LoansPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<{
    status?: LoanStatus;
    currencyCode?: string;
    startDate?: string;
    endDate?: string;
  }>({});
  const [formData, setFormData] = useState<CreateLoanInput>({
    borrowerId: 0,
    amount: 0,
    currencyCode: 'USD',
    borrowingDate: '',
    dueDate: '',
  });

  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth to finish loading
    }

    if (!user) {
      router.push('/login');
      return;
    }

    fetchLoans();
    fetchUsers();
  }, [user, authLoading, router, filters]);

  const fetchUsers = async () => {
    try {
      const data = await usersApi.findAll();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await loansApi.findAll(filters);
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
      setLoans([newLoan, ...loans]);
      setFormData({
        borrowerId: 0,
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
    if (!confirm('Are you sure you want to delete this loan?')) return;
    try {
      setError('');
      await loansApi.delete(id);
      setLoans(loans.filter((l) => l.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete loan');
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: LoanStatus) => {
    try {
      setError('');
      const updated = await loansApi.update(id, { status: newStatus });
      setLoans(loans.map((l) => (l.id === id ? updated : l)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update loan');
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

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Loans Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base"
        >
          {showForm ? 'Cancel' : '+ Create Loan'}
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
              setFilters({ ...filters, status: e.target.value as LoanStatus || undefined })
            }
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="overdue">Overdue</option>
            <option value="repaid">Repaid</option>
            <option value="cancelled">Cancelled</option>
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
        <div className="mb-6 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Loan</h2>
          <form onSubmit={handleCreateLoan} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Borrower <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.borrowerId || ''}
                  onChange={(e) => setFormData({ ...formData, borrowerId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select a borrower</option>
                  {users
                    .filter((u) => u.id !== user?.id)
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullname || u.username || u.email} ({u.email})
                      </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  You are the loaner (lending money to the selected borrower)
                </p>
              </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Borrowing Date
                </label>
                <input
                  type="date"
                  value={formData.borrowingDate}
                  onChange={(e) => setFormData({ ...formData, borrowingDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Create Loan
            </button>
          </form>
        </div>
      )}

      {/* Loans Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-base">Loading loans...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Borrower
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Currency
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Borrowing Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Due Date
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
                {loans.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 text-base">
                      No loans found
                    </td>
                  </tr>
                ) : (
                  loans.map((loan: any) => (
                    <tr key={loan.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900">
                        {loan.borrower?.fullname ||
                          loan.borrower?.username ||
                          loan.borrower?.email ||
                          'N/A'}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900">
                        {loan.amount}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-700">
                        {loan.currencyCode}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-700">
                        {new Date(loan.borrowingDate).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-700">
                        {new Date(loan.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <select
                          value={loan.status}
                          onChange={(e) => handleUpdateStatus(loan.id, e.target.value as LoanStatus)}
                          className="w-full sm:w-auto px-2 sm:px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="overdue">Overdue</option>
                          <option value="repaid">Repaid</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteLoan(loan.id)}
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
