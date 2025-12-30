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

import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = window.localStorage.getItem('accessToken');
  if (token) {
    return token.split('; ')[0];
  }
  return null;
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function apiCall<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  endpoint: string,
  body?: unknown,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  try {
    let response;
    const config: { params?: Record<string, string | number | undefined> } = {};
    if (params) {
      config.params = params;
    }

    if (method === 'GET' || method === 'DELETE') {
      response = await axiosInstance.request<T>({ method, url: endpoint, ...config });
    } else {
      response = await axiosInstance.request<T>({ method, url: endpoint, data: body, ...config });
    }
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('API error');
  }
}

// Loans API
export const loansApi = {
  create: (input: CreateLoanInput): Promise<Loan> => apiCall<Loan>('POST', '/api/loans', input),
  findAll: (filters?: {
    status?: string;
    currencyCode?: string;
    startDate?: string;
    endDate?: string;
    loanerId?: number;
    borrowerId?: number;
  }): Promise<Loan[]> => apiCall<Loan[]>('GET', '/api/loans', undefined, filters),
  findOne: (id: number): Promise<Loan> => apiCall<Loan>('GET', `/api/loans/${id}`),
  update: (id: number, input: UpdateLoanInput): Promise<Loan> =>
    apiCall<Loan>('PATCH', `/api/loans/${id}`, input),
  delete: (id: number): Promise<Loan> => apiCall<Loan>('DELETE', `/api/loans/${id}`),
  getStatistics: (): Promise<{
    asLoaner: { totalAmount: number; count: number };
    asBorrower: { totalAmount: number; count: number };
    byStatus: Array<{ status: string; count: number; totalAmount: number }>;
    byCurrency: Array<{ currencyCode: string; count: number; totalAmount: number }>;
    overdueCount: number;
  }> => apiCall('GET', '/api/loans/statistics'),
};

// Spendings API
export const spendingsApi = {
  create: (input: CreateSpendingInput): Promise<Spending> =>
    apiCall<Spending>('POST', '/api/spendings', input),
  findAll: (filters?: {
    currencyCode?: string;
    startDate?: string;
    endDate?: string;
    spentOn?: string;
  }): Promise<Spending[]> => apiCall<Spending[]>('GET', '/api/spendings', undefined, filters),
  findOne: (id: number): Promise<Spending> => apiCall<Spending>('GET', `/api/spendings/${id}`),
  update: (id: number, input: UpdateSpendingInput): Promise<Spending> =>
    apiCall<Spending>('PATCH', `/api/spendings/${id}`, input),
  delete: (id: number): Promise<Spending> => apiCall<Spending>('DELETE', `/api/spendings/${id}`),
  getStatistics: (): Promise<{
    total: { amount: number; count: number; average: number };
    byCurrency: Array<{ currencyCode: string; count: number; totalAmount: number }>;
    byMonth: Array<{ month: string; total: number; count: number }>;
    topCategories: Array<{ category: string; count: number; totalAmount: number }>;
  }> => apiCall('GET', '/api/spendings/statistics'),
};

// Savings API
export const savingsApi = {
  create: (input: CreateSavingInput): Promise<Saving> =>
    apiCall<Saving>('POST', '/api/savings', input),
  findAll: (filters?: {
    status?: string;
    currencyCode?: string;
    startDate?: string;
    endDate?: string;
    savingPlace?: string;
  }): Promise<Saving[]> => apiCall<Saving[]>('GET', '/api/savings', undefined, filters),
  findOne: (id: number): Promise<Saving> => apiCall<Saving>('GET', `/api/savings/${id}`),
  update: (id: number, input: UpdateSavingInput): Promise<Saving> =>
    apiCall<Saving>('PATCH', `/api/savings/${id}`, input),
  delete: (id: number): Promise<Saving> => apiCall<Saving>('DELETE', `/api/savings/${id}`),
  getStatistics: (): Promise<{
    activeTotal: { amount: number; count: number };
    byStatus: Array<{ status: string; count: number; totalAmount: number }>;
    byCurrency: Array<{ currencyCode: string; count: number; totalAmount: number }>;
    byPlace: Array<{ place: string; count: number; totalAmount: number }>;
    byMonth: Array<{ month: string; total: number; count: number }>;
  }> => apiCall('GET', '/api/savings/statistics'),
};

// Users API
export const usersApi = {
  findAll: (): Promise<Array<{ id: number; email: string; fullname: string | null; username: string | null }>> =>
    apiCall('GET', '/api/users'),
};
