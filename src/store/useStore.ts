import { create } from 'zustand';
import { branches, students, transactions, categories, guardians, type Branch, type Student, type Transaction, type TransactionCategory, type TransactionType, type Guardian, type BalletLevel, type PaymentStatus } from './mockData';
import { format } from 'date-fns';

interface NewTransaction {
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  branchId: string;
  studentId?: string;
}

interface NewStudent {
  name: string;
  birthDate: string;
  phone: string;
  email: string;
  level: BalletLevel;
  class: string;
  branchId: string;
  monthlyFee: number;
  guardianId: string;
}

interface NewGuardian {
  name: string;
  phone: string;
  email: string;
  cpf: string;
  relationship: string;
  address?: string;
}

interface AppState {
  // Branch management
  selectedBranchId: string;
  branches: Branch[];
  setSelectedBranch: (branchId: string) => void;
  
  // Students
  students: Student[];
  getFilteredStudents: () => Student[];
  getStudentById: (id: string) => Student | undefined;
  addStudent: (student: NewStudent) => string;
  
  // Guardians
  guardians: Guardian[];
  getGuardianById: (id: string) => Guardian | undefined;
  getGuardianByStudentId: (studentId: string) => Guardian | undefined;
  addGuardian: (guardian: NewGuardian) => string;
  
  // Transactions
  transactions: Transaction[];
  categories: TransactionCategory[];
  getFilteredTransactions: () => Transaction[];
  addTransaction: (transaction: NewTransaction) => void;
  
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
  addStudent: (studentData: NewStudent) => {
    const id = `std-${Date.now()}`;
    const birthYear = new Date(studentData.birthDate).getFullYear();
    const age = new Date().getFullYear() - birthYear;
    
    const newStudent: Student = {
      ...studentData,
      id,
      age,
      enrollmentDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'ativo',
      paymentStatus: 'em_dia',
      paymentHistory: [],
    };
    
    set((state) => {
      // Update guardian's studentIds
      const updatedGuardians = state.guardians.map(g => 
        g.id === studentData.guardianId 
          ? { ...g, studentIds: [...g.studentIds, id] }
          : g
      );
      
      return {
        students: [newStudent, ...state.students],
        guardians: updatedGuardians,
      };
    });
    
    return id;
  },
  
  // Guardians
  guardians,
  getGuardianById: (id: string) => {
    return get().guardians.find(g => g.id === id);
  },
  getGuardianByStudentId: (studentId: string) => {
    const student = get().students.find(s => s.id === studentId);
    if (!student) return undefined;
    return get().guardians.find(g => g.id === student.guardianId);
  },
  addGuardian: (guardianData: NewGuardian) => {
    const id = `grd-${Date.now()}`;
    const newGuardian: Guardian = {
      ...guardianData,
      id,
      studentIds: [],
    };
    
    set((state) => ({
      guardians: [newGuardian, ...state.guardians],
    }));
    
    return id;
  },
  
  // Transactions
  transactions,
  categories,
  getFilteredTransactions: () => {
    const { selectedBranchId, transactions } = get();
    if (selectedBranchId === 'all') return transactions;
    return transactions.filter(t => t.branchId === selectedBranchId);
  },
  addTransaction: (transaction: NewTransaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `trx-${Date.now()}-${Math.random()}`,
    };
    set((state) => ({
      transactions: [newTransaction, ...state.transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    }));
  },
  
  // UI State
  sidebarOpen: true,
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
