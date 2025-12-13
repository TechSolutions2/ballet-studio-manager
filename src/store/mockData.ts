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
  wallet: Wallet;
}

export interface Wallet {
  balance: number; // Positive means debt (owes money), negative could mean credit
  ledger: LedgerEntry[];
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit'; // debit = charge (increase debt), credit = payment (decrease debt)
  category: 'tuition' | 'costume' | 'material' | 'other';
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
  scholarship?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  costume?: {
    purchased: boolean;
    totalAmount: number;
    installments: number;
    paidAmount: number;
  };
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
  guardianId?: string;
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

  for (let i = 0; i < 300; i++) {
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
    const monthlyFee = level === 'Baby Class' ? 70 :
      level === 'Iniciante' ? 100 :
        level === 'Preparatório' ? 150 :
          level === 'Intermediário' ? 200 :
            level === 'Avançado' ? 250 : 300;

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
      wallet: {
        balance: 0,
        ledger: [],
      }
    });

    const isScholarship = Math.random() > 0.8;
    const isCostume = Math.random() > 0.6;
    const costumePrice = randomBetween(150, 300);

    // Create student
    const newStudent: Student = {
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
      scholarship: isScholarship ? {
        type: Math.random() > 0.5 ? 'percentage' : 'fixed',
        value: Math.random() > 0.5 ? 10 : 50,
      } : undefined,
      costume: isCostume ? {
        purchased: true,
        totalAmount: costumePrice,
        installments: randomBetween(1, 3),
        paidAmount: Math.random() > 0.5 ? costumePrice : 0,
      } : undefined,
    };

    // Update guardian wallet based on student
    const guardian = guardians.find(g => g.id === guardianId);
    if (guardian) {
      // Mock some initial debt: Tuition * 10 (yearly contract)
      const contractValue = monthlyFee * 10;
      guardian.wallet.ledger.push({
        id: `ldg-${Date.now()}-${i}-1`,
        date: format(enrollmentDate, 'yyyy-MM-dd'),
        description: `Contrato Anual - ${newStudent.name}`,
        amount: contractValue,
        type: 'debit',
        category: 'tuition'
      });
      guardian.wallet.balance += contractValue;

      // Add costume debt if applicable
      if (newStudent.costume?.purchased) {
        guardian.wallet.ledger.push({
          id: `ldg-${Date.now()}-${i}-2`,
          date: format(enrollmentDate, 'yyyy-MM-dd'),
          description: `Figurino - ${newStudent.name}`,
          amount: newStudent.costume.totalAmount,
          type: 'debit',
          category: 'costume'
        });
        guardian.wallet.balance += newStudent.costume.totalAmount;
      }

      // Simulate Payments to reduce balance (so not everyone has huge debt)
      // Improve probability of payments:
      const paidAmount = guardian.wallet.balance * (randomBetween(50, 95) / 100);

      guardian.wallet.ledger.push({
        id: `ldg-${Date.now()}-${i}-3`,
        date: format(new Date(), 'yyyy-MM-dd'),
        description: `Pagamentos parciais acumulados`,
        amount: paidAmount,
        type: 'credit',
        category: 'other'
      });
      guardian.wallet.balance -= paidAmount;
    }

    students.push(newStudent);
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
        // High probability of payment (95%)
        if (Math.random() > 0.05) {
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

      // Despesas fixas (valores reduzidos)
      transactions.push({
        id: `trx-${Date.now()}-${Math.random()}`,
        date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), 5), 'yyyy-MM-dd'),
        description: 'Aluguel mensal',
        amount: branchId === 'centro' ? 1500 : branchId === 'zona-sul' ? 1800 : 1200,
        type: 'despesa',
        categoryId: 'desp-aluguel',
        branchId,
      });

      // Salários professores (valores reduzidos)
      const numProfessors = branchId === 'centro' ? 2 : branchId === 'zona-sul' ? 3 : 2;
      for (let i = 0; i < numProfessors; i++) {
        transactions.push({
          id: `trx-${Date.now()}-${Math.random()}`,
          date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), 5), 'yyyy-MM-dd'),
          description: `Professora ${i + 1}`,
          amount: randomBetween(800, 1500),
          type: 'despesa',
          categoryId: 'desp-professores',
          branchId,
        });
      }

      // Utilidades (valores reduzidos)
      transactions.push({
        id: `trx-${Date.now()}-${Math.random()}`,
        date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), 15), 'yyyy-MM-dd'),
        description: 'Energia elétrica',
        amount: randomBetween(150, 300),
        type: 'despesa',
        categoryId: 'desp-utilidades',
        branchId,
      });

      transactions.push({
        id: `trx-${Date.now()}-${Math.random()}`,
        date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), 10), 'yyyy-MM-dd'),
        description: 'Água',
        amount: randomBetween(80, 150),
        type: 'despesa',
        categoryId: 'desp-utilidades',
        branchId,
      });

      transactions.push({
        id: `trx-${Date.now()}-${Math.random()}`,
        date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), 8), 'yyyy-MM-dd'),
        description: 'Internet',
        amount: 100,
        type: 'despesa',
        categoryId: 'desp-utilidades',
        branchId,
      });

      // Manutenção ocasional (valores reduzidos)
      if (Math.random() > 0.7) {
        transactions.push({
          id: `trx-${Date.now()}-${Math.random()}`,
          date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), randomBetween(1, 28)), 'yyyy-MM-dd'),
          description: randomFrom(['Reparo ar-condicionado', 'Manutenção piso', 'Pintura', 'Conserto espelhos']),
          amount: randomBetween(100, 500),
          type: 'despesa',
          categoryId: 'desp-manutencao',
          branchId,
        });
      }

      // Limpeza (valores reduzidos)
      transactions.push({
        id: `trx-${Date.now()}-${Math.random()}`,
        date: format(new Date(monthDate.getFullYear(), monthDate.getMonth(), 1), 'yyyy-MM-dd'),
        description: 'Serviço de limpeza mensal',
        amount: randomBetween(300, 500),
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

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export const notifications: Notification[] = [
  {
    id: '1',
    title: 'Mensalidades a receber',
    message: 'Há 5 mensalidades pendentes vencendo hoje. Confira agora.',
    time: 'Há 2 horas',
    read: false,
    type: 'warning',
  },
  {
    id: '2',
    title: 'Pagamento recebido',
    message: 'Maria Silva (Responsável por: Ana Silva) realizou o pagamento via PIX.',
    time: 'Há 30 minutos',
    read: false,
    type: 'success',
  },
  {
    id: '3',
    title: 'Nova matrícula',
    message: 'Novo aluno matriculado na Unidade Centro: Pedro Santos.',
    time: 'Há 4 horas',
    read: true,
    type: 'info',
  },
  {
    id: '4',
    title: 'Pagamento recebido',
    message: 'Roberto Oliveira (Responsável por: Julia Oliveira) realizou o pagamento em dinheiro.',
    time: 'Há 5 horas',
    read: true,
    type: 'success',
  },
];


