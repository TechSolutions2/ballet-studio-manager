import { addMonths, subMonths, format, subDays } from 'date-fns';

// Types
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export type BalletLevel = 'Baby Class' | 'Iniciante' | 'Preparatório' | 'Intermediário' | 'Avançado' | 'Pontas';
export type PaymentStatus = 'em_dia' | 'pendente' | 'atrasado';
export type StudentStatus = 'ativo' | 'inativo' | 'trancado';

export interface Guardian {
  id: string;
  name: string;
  phone: string;
  email: string;
  cpf: string;
  relationship: string;
  address?: string;
  studentIds: string[];
}

export interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: 'pago' | 'pendente' | 'atrasado';
  reference: string;
}

export interface Student {
  id: string;
  name: string;
  birthDate: string;
  age: number;
  phone: string;
  email: string;
  level: BalletLevel;
  class: string;
  branchId: string;
  enrollmentDate: string;
  status: StudentStatus;
  paymentStatus: PaymentStatus;
  monthlyFee: number;
  guardianId: string;
  paymentHistory: PaymentHistory[];
  photoUrl?: string;
}

export type TransactionType = 'receita' | 'despesa';

export interface TransactionCategory {
  id: string;
  name: string;
  type: TransactionType;
  parentId?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  branchId: string;
  studentId?: string;
}

// Branches
export const branches: Branch[] = [
  { id: 'all', name: 'Todas as Unidades', address: '', phone: '' },
  { id: 'centro', name: 'Unidade Centro', address: 'Rua das Flores, 123 - Centro', phone: '(11) 3456-7890' },
  { id: 'zona-sul', name: 'Unidade Zona Sul', address: 'Av. Paulista, 1500 - Zona Sul', phone: '(11) 3456-7891' },
  { id: 'zona-norte', name: 'Unidade Zona Norte', address: 'Rua Voluntários da Pátria, 800 - Zona Norte', phone: '(11) 3456-7892' },
];

// Categories
export const categories: TransactionCategory[] = [
  // Receitas
  { id: 'rec-mensalidade', name: 'Mensalidades', type: 'receita' },
  { id: 'rec-matricula', name: 'Matrículas', type: 'receita' },
  { id: 'rec-uniforme', name: 'Venda de Uniformes', type: 'receita' },
  { id: 'rec-material', name: 'Venda de Materiais', type: 'receita' },
  { id: 'rec-evento', name: 'Eventos e Apresentações', type: 'receita' },
  { id: 'rec-outros', name: 'Outras Receitas', type: 'receita' },
  // Despesas
  { id: 'desp-aluguel', name: 'Aluguel', type: 'despesa' },
  { id: 'desp-salarios', name: 'Salários e Encargos', type: 'despesa' },
  { id: 'desp-professores', name: 'Professores', type: 'despesa' },
  { id: 'desp-manutencao', name: 'Manutenção', type: 'despesa' },
  { id: 'desp-utilidades', name: 'Água/Luz/Internet', type: 'despesa' },
  { id: 'desp-marketing', name: 'Marketing', type: 'despesa' },
  { id: 'desp-material', name: 'Material de Escritório', type: 'despesa' },
  { id: 'desp-limpeza', name: 'Limpeza e Higiene', type: 'despesa' },
  { id: 'desp-outros', name: 'Outras Despesas', type: 'despesa' },
];

// Helper functions
const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomBetween = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const firstNames = ['Ana', 'Beatriz', 'Carolina', 'Diana', 'Elena', 'Fernanda', 'Gabriela', 'Helena', 'Isabela', 'Julia', 'Larissa', 'Marina', 'Natália', 'Olivia', 'Paula', 'Rafaela', 'Sofia', 'Valentina', 'Yasmin', 'Bianca', 'Camila', 'Daniela', 'Eduarda', 'Flávia', 'Giovanna'];
const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa'];

const levels: BalletLevel[] = ['Baby Class', 'Iniciante', 'Preparatório', 'Intermediário', 'Avançado', 'Pontas'];
const levelClasses: Record<BalletLevel, string[]> = {
  'Baby Class': ['Baby A', 'Baby B'],
  'Iniciante': ['Iniciante I', 'Iniciante II'],
  'Preparatório': ['Prep A', 'Prep B'],
  'Intermediário': ['Inter I', 'Inter II'],
  'Avançado': ['Avançado A', 'Avançado B'],
  'Pontas': ['Pontas I', 'Pontas II'],
};

const generatePaymentHistory = (enrollmentDate: Date, monthlyFee: number): PaymentHistory[] => {
  const history: PaymentHistory[] = [];
  const now = new Date();
  let currentDate = new Date(enrollmentDate);
  
  while (currentDate <= now) {
    const isPaid = Math.random() > 0.15;
    const monthRef = format(currentDate, 'MM/yyyy');
    
    history.push({
      id: `pay-${Date.now()}-${Math.random()}`,
      date: isPaid ? format(addMonths(currentDate, 0), 'yyyy-MM-dd') : '',
      amount: monthlyFee,
      status: isPaid ? 'pago' : (Math.random() > 0.5 ? 'pendente' : 'atrasado'),
      reference: monthRef,
    });
    
    currentDate = addMonths(currentDate, 1);
  }
  
  return history.slice(-12);
};

// Generate guardians and students
const generateGuardiansAndStudents = (): { guardians: Guardian[]; students: Student[] } => {
  const guardians: Guardian[] = [];
  const students: Student[] = [];
  const branchIds = ['centro', 'zona-sul', 'zona-norte'];
  
  for (let i = 0; i < 60; i++) {
    const firstName = randomFrom(firstNames);
    const lastName = randomFrom(lastNames);
    const level = randomFrom(levels);
    const branchId = randomFrom(branchIds);
    const birthYear = level === 'Baby Class' ? randomBetween(2019, 2021) : 
                      level === 'Iniciante' ? randomBetween(2015, 2018) :
                      level === 'Preparatório' ? randomBetween(2012, 2016) :
                      level === 'Intermediário' ? randomBetween(2008, 2014) :
                      level === 'Avançado' ? randomBetween(2004, 2012) :
                      randomBetween(2000, 2010);
    const birthDate = new Date(birthYear, randomBetween(0, 11), randomBetween(1, 28));
    const age = new Date().getFullYear() - birthYear;
    const enrollmentDate = subMonths(new Date(), randomBetween(1, 36));
    const monthlyFee = level === 'Baby Class' ? 280 : 
                       level === 'Iniciante' ? 320 :
                       level === 'Preparatório' ? 380 :
                       level === 'Intermediário' ? 420 :
                       level === 'Avançado' ? 480 : 520;
    
    const paymentHistory = generatePaymentHistory(enrollmentDate, monthlyFee);
    const lastPayment = paymentHistory[paymentHistory.length - 1];
    const paymentStatus: PaymentStatus = lastPayment?.status === 'pago' ? 'em_dia' : 
                                          lastPayment?.status === 'pendente' ? 'pendente' : 'atrasado';
    
    const studentId = `std-${i + 1}`;
    const guardianId = `grd-${i + 1}`;
    
    // Create guardian
    guardians.push({
      id: guardianId,
      name: `${randomFrom(['Maria', 'Ana', 'Claudia', 'Patricia', 'Fernanda', 'Roberto', 'Carlos', 'João'])} ${lastName}`,
      phone: `(11) 9${randomBetween(1000, 9999)}-${randomBetween(1000, 9999)}`,
      email: `responsavel.${lastName.toLowerCase()}${i}@email.com`,
      cpf: `${randomBetween(100, 999)}.${randomBetween(100, 999)}.${randomBetween(100, 999)}-${randomBetween(10, 99)}`,
      relationship: randomFrom(['Mãe', 'Pai', 'Avó', 'Avô', 'Tio(a)']),
      address: `Rua ${randomFrom(['das Flores', 'Brasil', 'São Paulo', 'Voluntários', 'Augusta'])}, ${randomBetween(1, 999)} - ${randomFrom(['Centro', 'Jardins', 'Vila Mariana', 'Pinheiros'])}`,
      studentIds: [studentId],
    });
    
    // Create student
    students.push({
      id: studentId,
      name: `${firstName} ${lastName}`,
      birthDate: format(birthDate, 'yyyy-MM-dd'),
      age,
      phone: `(11) 9${randomBetween(1000, 9999)}-${randomBetween(1000, 9999)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      level,
      class: randomFrom(levelClasses[level]),
      branchId,
      enrollmentDate: format(enrollmentDate, 'yyyy-MM-dd'),
      status: Math.random() > 0.1 ? 'ativo' : (Math.random() > 0.5 ? 'inativo' : 'trancado'),
      paymentStatus,
      monthlyFee,
      guardianId,
      paymentHistory,
    });
  }
  
  return { guardians, students };
};

// Generate transactions for the last 6 months
const generateTransactions = (students: Student[]): Transaction[] => {
  const transactions: Transaction[] = [];
  const branchIds = ['centro', 'zona-sul', 'zona-norte'];
  const now = new Date();
  
  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const monthDate = subMonths(now, monthOffset);
    
    branchIds.forEach(branchId => {
      const branchStudents = students.filter(s => s.branchId === branchId && s.status === 'ativo');
      
      // Mensalidades
      branchStudents.forEach(student => {
        if (Math.random() > 0.12) {
          transactions.push({
            id: `trx-${Date.now()}-${Math.random()}`,
            date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), randomBetween(1, 10)), 'yyyy-MM-dd'),
            description: `Mensalidade - ${student.name}`,
            amount: student.monthlyFee,
            type: 'receita',
            categoryId: 'rec-mensalidade',
            branchId,
            studentId: student.id,
          });
        }
      });
      
      // Matrículas (ocasionalmente)
      if (Math.random() > 0.7) {
        transactions.push({
          id: `trx-${Date.now()}-${Math.random()}`,
          date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), randomBetween(1, 28)), 'yyyy-MM-dd'),
          description: 'Nova matrícula',
          amount: randomBetween(150, 250),
          type: 'receita',
          categoryId: 'rec-matricula',
          branchId,
        });
      }
      
      // Venda de uniformes
      for (let i = 0; i < randomBetween(2, 6); i++) {
        transactions.push({
          id: `trx-${Date.now()}-${Math.random()}`,
          date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), randomBetween(1, 28)), 'yyyy-MM-dd'),
          description: randomFrom(['Collant', 'Sapatilha', 'Meia-calça', 'Saia', 'Conjunto completo']),
          amount: randomBetween(50, 200),
          type: 'receita',
          categoryId: 'rec-uniforme',
          branchId,
        });
      }
      
      // Despesas fixas
      transactions.push({
        id: `trx-${Date.now()}-${Math.random()}`,
        date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), 5), 'yyyy-MM-dd'),
        description: 'Aluguel mensal',
        amount: branchId === 'centro' ? 4500 : branchId === 'zona-sul' ? 5200 : 3800,
        type: 'despesa',
        categoryId: 'desp-aluguel',
        branchId,
      });
      
      // Salários professores
      const numProfessors = branchId === 'centro' ? 4 : branchId === 'zona-sul' ? 5 : 3;
      for (let i = 0; i < numProfessors; i++) {
        transactions.push({
          id: `trx-${Date.now()}-${Math.random()}`,
          date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), 5), 'yyyy-MM-dd'),
          description: `Professora ${i + 1}`,
          amount: randomBetween(2500, 4000),
          type: 'despesa',
          categoryId: 'desp-professores',
          branchId,
        });
      }
      
      // Utilidades
      transactions.push({
        id: `trx-${Date.now()}-${Math.random()}`,
        date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), 15), 'yyyy-MM-dd'),
        description: 'Energia elétrica',
        amount: randomBetween(400, 800),
        type: 'despesa',
        categoryId: 'desp-utilidades',
        branchId,
      });
      
      transactions.push({
        id: `trx-${Date.now()}-${Math.random()}`,
        date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), 10), 'yyyy-MM-dd'),
        description: 'Água',
        amount: randomBetween(150, 300),
        type: 'despesa',
        categoryId: 'desp-utilidades',
        branchId,
      });
      
      transactions.push({
        id: `trx-${Date.now()}-${Math.random()}`,
        date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), 8), 'yyyy-MM-dd'),
        description: 'Internet',
        amount: 200,
        type: 'despesa',
        categoryId: 'desp-utilidades',
        branchId,
      });
      
      // Manutenção ocasional
      if (Math.random() > 0.6) {
        transactions.push({
          id: `trx-${Date.now()}-${Math.random()}`,
          date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), randomBetween(1, 28)), 'yyyy-MM-dd'),
          description: randomFrom(['Reparo ar-condicionado', 'Manutenção piso', 'Pintura', 'Conserto espelhos']),
          amount: randomBetween(200, 1500),
          type: 'despesa',
          categoryId: 'desp-manutencao',
          branchId,
        });
      }
      
      // Limpeza
      transactions.push({
        id: `trx-${Date.now()}-${Math.random()}`,
        date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), 1), 'yyyy-MM-dd'),
        description: 'Serviço de limpeza mensal',
        amount: randomBetween(800, 1200),
        type: 'despesa',
        categoryId: 'desp-limpeza',
        branchId,
      });
      
      // Marketing ocasional
      if (Math.random() > 0.7) {
        transactions.push({
          id: `trx-${Date.now()}-${Math.random()}`,
          date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), randomBetween(1, 28)), 'yyyy-MM-dd'),
          description: randomFrom(['Anúncios Instagram', 'Flyers', 'Banner externo']),
          amount: randomBetween(200, 800),
          type: 'despesa',
          categoryId: 'desp-marketing',
          branchId,
        });
      }
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const generatedData = generateGuardiansAndStudents();
export const guardians = generatedData.guardians;
export const students = generatedData.students;
export const transactions = generateTransactions(students);
