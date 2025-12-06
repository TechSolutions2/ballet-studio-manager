import { create } from 'zustand';
import { branches, students, transactions, categories, type Branch, type Student, type Transaction, type TransactionCategory } from './mockData';

interface AppState {
  // Branch management
  selectedBranchId: string;
  branches: Branch[];
  setSelectedBranch: (branchId: string) => void;
  
  // Students
  students: Student[];
  getFilteredStudents: () => Student[];
  getStudentById: (id: string) => Student | undefined;
  
  // Transactions
  transactions: Transaction[];
  categories: TransactionCategory[];
  getFilteredTransactions: () => Transaction[];
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Branch management
  selectedBranchId: 'all',
  branches,
  setSelectedBranch: (branchId: string) => set({ selectedBranchId: branchId }),
  
  // Students
  students,
  getFilteredStudents: () => {
    const { selectedBranchId, students } = get();
    if (selectedBranchId === 'all') return students;
    return students.filter(s => s.branchId === selectedBranchId);
  },
  getStudentById: (id: string) => {
    return get().students.find(s => s.id === id);
  },
  
  // Transactions
  transactions,
  categories,
  getFilteredTransactions: () => {
    const { selectedBranchId, transactions } = get();
    if (selectedBranchId === 'all') return transactions;
    return transactions.filter(t => t.branchId === selectedBranchId);
  },
  
  // UI State
  sidebarOpen: true,
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
