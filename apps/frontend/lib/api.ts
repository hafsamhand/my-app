/**
 * API service layer for CRUD operations.
 * Provides type-safe methods for calling backend endpoints.
 */

import {
  Loan,
  CreateLoanInput,
  UpdateLoanInput,
  Spending,
  CreateSpendingInput,
  UpdateSpendingInput,
  Saving,
  CreateSavingInput,
  UpdateSavingInput,
} from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper to make API calls with credentials
async function apiCall<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  endpoint: string,
  body?: any,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

// Loans API
export const loansApi = {
  create: (input: CreateLoanInput): Promise<Loan> => apiCall<Loan>('POST', '/api/loans', input),
  findAll: (): Promise<Loan[]> => apiCall<Loan[]>('GET', '/api/loans'),
  findOne: (id: number): Promise<Loan> => apiCall<Loan>('GET', `/api/loans/${id}`),
  update: (id: number, input: UpdateLoanInput): Promise<Loan> =>
    apiCall<Loan>('PATCH', `/api/loans/${id}`, input),
  delete: (id: number): Promise<Loan> => apiCall<Loan>('DELETE', `/api/loans/${id}`),
};

// Spendings API
export const spendingsApi = {
  create: (input: CreateSpendingInput): Promise<Spending> =>
    apiCall<Spending>('POST', '/api/spendings', input),
  findAll: (): Promise<Spending[]> => apiCall<Spending[]>('GET', '/api/spendings'),
  findOne: (id: number): Promise<Spending> => apiCall<Spending>('GET', `/api/spendings/${id}`),
  update: (id: number, input: UpdateSpendingInput): Promise<Spending> =>
    apiCall<Spending>('PATCH', `/api/spendings/${id}`, input),
  delete: (id: number): Promise<Spending> => apiCall<Spending>('DELETE', `/api/spendings/${id}`),
};

// Savings API
export const savingsApi = {
  create: (input: CreateSavingInput): Promise<Saving> =>
    apiCall<Saving>('POST', '/api/savings', input),
  findAll: (): Promise<Saving[]> => apiCall<Saving[]>('GET', '/api/savings'),
  findOne: (id: number): Promise<Saving> => apiCall<Saving>('GET', `/api/savings/${id}`),
  update: (id: number, input: UpdateSavingInput): Promise<Saving> =>
    apiCall<Saving>('PATCH', `/api/savings/${id}`, input),
  delete: (id: number): Promise<Saving> => apiCall<Saving>('DELETE', `/api/savings/${id}`),
};
