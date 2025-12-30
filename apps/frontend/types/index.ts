/**
 * Shared TypeScript interfaces for CRUD models.
 * Used for type-safe API calls and data binding in the frontend.
 */

export type LoanStatus = 'active' | 'overdue' | 'repaid' | 'cancelled';
export type SavingStatus = 'active' | 'withdrawn' | 'lost' | 'transferred';

export interface Loan {
  id: number;
  loanerId: number;
  borrowerId: number;
  amount: number;
  currencyCode: string;
  borrowingDate: string; // ISO date
  dueDate: string; // ISO date
  prolongementDuration?: number;
  status: LoanStatus;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  deletedAt?: string | null; // ISO datetime
}

export interface CreateLoanInput {
  loanerId?: number; // Optional, defaults to authenticated user
  borrowerId: number; // Required, must be different from loaner
  amount: number;
  currencyCode: string;
  borrowingDate: string;
  dueDate: string;
  prolongementDuration?: number;
  status?: LoanStatus;
}

export interface UpdateLoanInput {
  loanerId?: number;
  borrowerId?: number;
  amount?: number;
  currencyCode?: string;
  borrowingDate?: string;
  dueDate?: string;
  prolongementDuration?: number;
  status?: LoanStatus;
}

export interface Spending {
  id: number;
  spenderId: number;
  amount: number;
  currencyCode: string;
  spendingDate: string; // ISO date
  spentOn: string;
  createdAt: string; // ISO datetime
  deletedAt?: string | null; // ISO datetime
}

export interface CreateSpendingInput {
  spenderId: number;
  amount: number;
  currencyCode: string;
  spendingDate: string;
  spentOn: string;
}

export interface UpdateSpendingInput {
  spenderId?: number;
  amount?: number;
  currencyCode?: string;
  spendingDate?: string;
  spentOn?: string;
}

export interface Saving {
  id: number;
  saverId: number;
  amount: number;
  currencyCode: string;
  savingDate: string; // ISO date
  reason?: string;
  savingPlace: string;
  status: SavingStatus;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  deletedAt?: string | null; // ISO datetime
}

export interface CreateSavingInput {
  saverId: number;
  amount: number;
  currencyCode: string;
  savingDate: string;
  reason?: string;
  savingPlace: string;
  status?: SavingStatus;
}

export interface UpdateSavingInput {
  saverId?: number;
  amount?: number;
  currencyCode?: string;
  savingDate?: string;
  reason?: string;
  savingPlace?: string;
  status?: SavingStatus;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  createdAt: string; // ISO datetime
}

export interface User {
  id: number;
  fullname: string;
  username: string;
  email: string;
  lastAccess?: string | null; // ISO datetime
  address?: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  deletedAt?: string | null; // ISO datetime
}
