# 📚 Ballet Studio Manager - Documentação do Projeto

> Sistema de gerenciamento para escolas de ballet com controle de alunos, responsáveis, financeiro e múltiplas unidades.

---

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Stack Tecnológica](#-stack-tecnológica)
3. [Estrutura do Projeto](#-estrutura-do-projeto)
4. [Funcionalidades](#-funcionalidades)
5. [Arquitetura de Estado](#-arquitetura-de-estado)
6. [Sistema de Design](#-sistema-de-design)
7. [Componentes](#-componentes)
8. [Rotas](#-rotas)
9. [Tipos/Interfaces](#-tiposinterfaces)
10. [Scripts Disponíveis](#-scripts-disponíveis)
11. [Como Usar Este Projeto Como Base](#-como-usar-este-projeto-como-base)

---

## 🎯 Visão Geral

**Ballet Studio Manager** é uma aplicação web completa para gerenciamento de escolas de ballet. O sistema permite:

- Gerenciamento de **múltiplas unidades/filiais**
- Cadastro e controle de **alunos** com níveis de ballet
- Gerenciamento de **responsáveis** (guardians) com sistema de carteira/débitos
- Controle **financeiro** completo (receitas/despesas)
- **Dashboard** com gráficos e métricas
- Sistema de **autenticação** com roles (admin/employee)
- **PWA** (Progressive Web App) com suporte offline

---

## 🛠️ Stack Tecnológica

### Core
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **React** | ^18.3.1 | Framework UI |
| **TypeScript** | ^5.8.3 | Tipagem estática |
| **Vite** | ^5.4.19 | Build tool e dev server |
| **React Router DOM** | ^6.30.1 | Roteamento SPA |

### Estado e Dados
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Zustand** | ^5.0.9 | Gerenciamento de estado global |
| **TanStack Query** | ^5.83.0 | Fetching, caching e sincronização de dados |

### UI e Estilização
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Tailwind CSS** | ^3.4.17 | Utility-first CSS |
| **shadcn/ui** | - | Componentes UI (Radix-based) |
| **Lucide React** | ^0.462.0 | Ícones |
| **Recharts** | ^2.15.4 | Gráficos e visualizações |
| **date-fns** | ^3.6.0 | Manipulação de datas |
| **Sonner** | ^1.7.4 | Toast notifications |

### Formulários e Validação
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **React Hook Form** | ^7.61.1 | Gerenciamento de formulários |
| **Zod** | ^3.25.76 | Validação de schemas |
| **@hookform/resolvers** | ^3.10.0 | Integração RHF + Zod |

### PWA
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **vite-plugin-pwa** | ^1.2.0 | PWA integration |
| **workbox-window** | ^7.4.0 | Service worker management |

---

## 📁 Estrutura do Projeto

```
ballet-studio-manager/
├── public/
│   ├── fonts/                    # Fontes customizadas (Great Vibes)
│   ├── icons/                    # Ícones PWA (192x192, 512x512)
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── manifest.json             # Manifest do PWA
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── dashboard/            # Componentes do Dashboard
│   │   │   ├── CategoryChart.tsx
│   │   │   ├── RecentTransactions.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   └── StatCard.tsx
│   │   ├── finance/              # Componentes de Financeiro
│   │   │   ├── DebtConsultation.tsx
│   │   │   ├── FinanceSummary.tsx
│   │   │   ├── TransactionList.tsx
│   │   │   ├── TransactionModal.tsx
│   │   │   └── TuitionManagement.tsx
│   │   ├── layout/               # Layout e Navegação
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── pwa/                  # Componentes PWA
│   │   │   └── PwaInstallPrompt.tsx
│   │   ├── students/             # Componentes de Alunos
│   │   │   ├── StudentFilters.tsx
│   │   │   ├── StudentModal.tsx
│   │   │   └── StudentTable.tsx
│   │   ├── ui/                   # shadcn/ui Components (49 arquivos)
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (+ 36 componentes)
│   │   └── NavLink.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx        # Hook para detectar mobile
│   │   └── use-toast.ts          # Hook para toasts
│   ├── lib/
│   │   └── utils.ts              # Utilitários (cn function)
│   ├── pages/
│   │   ├── Auth.tsx              # Login/Registro
│   │   ├── Dashboard.tsx         # Dashboard principal
│   │   ├── Finance.tsx           # Financeiro
│   │   ├── Guardians.tsx         # Responsáveis
│   │   ├── Index.tsx             # Redirect
│   │   ├── NotFound.tsx          # 404
│   │   ├── Settings.tsx          # Configurações
│   │   ├── StudentProfile.tsx    # Perfil do Aluno
│   │   └── Students.tsx          # Lista de Alunos
│   ├── store/
│   │   ├── mockData.ts           # Dados mock + Types
│   │   ├── useAuthStore.ts       # Store de autenticação
│   │   └── useStore.ts           # Store principal da aplicação
│   ├── App.tsx                   # Componente raiz + Rotas
│   ├── index.css                 # Estilos globais + Tema
│   ├── main.tsx                  # Entry point
│   └── vite-env.d.ts             # Types do Vite
├── components.json               # Configuração shadcn/ui
├── eslint.config.js
├── index.html                    # HTML template
├── package.json
├── postcss.config.js
├── tailwind.config.ts            # Configuração Tailwind
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts                # Configuração Vite + PWA
```

---

## ✨ Funcionalidades

### 🎓 Gestão de Alunos
- Listagem com filtros (nível, status, unidade)
- Cadastro completo com bolsa e figurino
- Perfil individual com histórico
- Níveis: Baby Class, Iniciante, Preparatório, Intermediário, Avançado, Pontas

### 👨‍👩‍👧 Gestão de Responsáveis
- Cadastro com CPF e endereço
- Sistema de **Wallet/Carteira** com saldo devedor
- **Ledger** (livro-razão) com débitos e créditos
- Consulta de débitos por aluno

### 💰 Financeiro
- Transações (receitas/despesas) por categoria
- Controle por unidade/filial
- Gestão de mensalidades
- Relatórios e gráficos

### 📊 Dashboard
- Estatísticas em tempo real
- Gráfico de receitas (últimos 6 meses)
- Gráfico de categorias (pizza)
- Meta mensal com progresso
- Transações recentes
- **View diferenciada** por role (admin vs employee)

### 🔐 Autenticação
- Login/Registro
- Roles: `admin` | `employee`
- Persistência com Zustand + localStorage
- Rotas protegidas

### 📱 PWA
- Instalável como app
- Suporte offline (cache de fontes)
- Prompt de instalação

---

## 🗄️ Arquitetura de Estado

### Zustand Stores

#### `useAuthStore.ts`
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'employee';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<Result>;
  register: (name: string, email: string, password: string) => Promise<Result>;
  logout: () => void;
}
```

#### `useStore.ts`
```typescript
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
```

---

## 🎨 Sistema de Design

### Cores (CSS Variables)
```css
:root {
  --primary: 346 77% 50%;           /* Rosa/Magenta */
  --secondary: 215 25% 95%;         /* Cinza claro */
  --destructive: 0 84% 60%;         /* Vermelho */
  --success: 142 71% 45%;           /* Verde */
  --warning: 38 92% 50%;            /* Amarelo/Laranja */
  --info: 199 89% 48%;              /* Azul */
  --background: 210 20% 98%;        /* Branco off-white */
  --foreground: 222 47% 11%;        /* Quase preto */
}
```

### Tipografia
- **Fonte principal**: Inter (Google Fonts)
- **Fonte decorativa**: Great Vibes (cursiva)

### Classes Customizadas
```css
.stat-card      /* Cards de estatística com hover */
.nav-item       /* Itens de navegação */
.table-row-hover
.badge-success
.badge-warning
.badge-destructive
.glass-effect   /* Glassmorphism */
```

### Dark Mode
- Suporte completo via classe `.dark`
- Cores ajustadas automaticamente

---

## 🧩 Componentes

### Layout
| Componente | Descrição |
|------------|-----------|
| `AppLayout` | Layout principal com Sidebar + Content |
| `Header` | Cabeçalho com seletor de unidade, busca, notificações |
| `Sidebar` | Menu lateral responsivo |
| `ProtectedRoute` | Wrapper para rotas autenticadas |

### Dashboard
| Componente | Descrição |
|------------|-----------|
| `StatCard` | Card de estatística com ícone e variação |
| `RevenueChart` | Gráfico de área (receitas x despesas) |
| `CategoryChart` | Gráfico de pizza por categoria |
| `RecentTransactions` | Lista das últimas transações |

### Students
| Componente | Descrição |
|------------|-----------|
| `StudentTable` | Tabela com alunos, ordenação e ações |
| `StudentFilters` | Filtros por nível, status, busca |
| `StudentModal` | Modal de cadastro/edição |

### Finance
| Componente | Descrição |
|------------|-----------|
| `TransactionList` | Lista de transações com filtros |
| `TransactionModal` | Modal de nova transação |
| `FinanceSummary` | Resumo de receitas/despesas |
| `TuitionManagement` | Gestão de mensalidades |
| `DebtConsultation` | Consulta de débitos por responsável |

### UI (shadcn/ui)
49 componentes prontos incluindo: `Button`, `Card`, `Dialog`, `Form`, `Input`, `Select`, `Table`, `Tabs`, `Toast`, `Sidebar`, `Chart`, etc.

---

## 🚀 Rotas

| Rota | Componente | Descrição | Proteção |
|------|------------|-----------|----------|
| `/auth` | `Auth` | Login/Registro | Pública |
| `/` | `Index` → `Dashboard` | Dashboard | Autenticada |
| `/alunos` | `Students` | Lista de alunos | Autenticada |
| `/alunos/:id` | `StudentProfile` | Perfil do aluno | Autenticada |
| `/responsaveis` | `Guardians` | Responsáveis | Autenticada |
| `/financeiro` | `Finance` | Financeiro | Autenticada |
| `/configuracoes` | `Settings` | Configurações | Autenticada |
| `*` | `NotFound` | Página 404 | Pública |

---

## 📝 Tipos/Interfaces

### Entidades Principais

```typescript
// Unidade/Filial
interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
}

// Níveis de Ballet
type BalletLevel = 
  | 'Baby Class' 
  | 'Iniciante' 
  | 'Preparatório' 
  | 'Intermediário' 
  | 'Avançado' 
  | 'Pontas';

// Status de Pagamento
type PaymentStatus = 'em_dia' | 'pendente' | 'atrasado';

// Status do Aluno
type StudentStatus = 'ativo' | 'inativo' | 'trancado';

// Aluno
interface Student {
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

// Responsável
interface Guardian {
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

// Carteira/Débitos
interface Wallet {
  balance: number; // Positivo = deve, Negativo = crédito
  ledger: LedgerEntry[];
}

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category: 'tuition' | 'costume' | 'material' | 'other';
}

// Transação Financeira
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'receita' | 'despesa';
  categoryId: string;
  branchId: string;
  studentId?: string;
  guardianId?: string;
}

// Categoria de Transação
interface TransactionCategory {
  id: string;
  name: string;
  type: 'receita' | 'despesa';
  parentId?: string;
}
```

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev           # Inicia dev server (porta 8080)

# Build
npm run build         # Build para produção
npm run build:dev     # Build em modo development

# Outros
npm run lint          # Executa ESLint
npm run preview       # Preview do build de produção
```

---

## 🔧 Como Usar Este Projeto Como Base

### 1. Clone e Renomeie
```bash
# Clone o projeto
git clone <url> novo-projeto
cd novo-projeto

# Remova o histórico git
rm -rf .git
git init
```

### 2. Atualize `package.json`
- Altere o `name`
- Atualize `description` se necessário

### 3. Configure o Tema
Edite `src/index.css`:
- Altere `--primary` para a cor principal
- Ajuste outras cores conforme necessidade

### 4. Atualize o PWA
Edite `public/manifest.json`:
- `name`, `short_name`
- Gere novos ícones
- Atualize `theme_color` e `background_color`

### 5. Adapte as Entidades
Em `src/store/mockData.ts`:
- Renomeie/crie tipos
- Ajuste os dados mock

### 6. Ajuste o Store
Em `src/store/useStore.ts`:
- Adapte as interfaces
- Modifique as actions

### 7. Crie Novas Páginas
1. Adicione em `src/pages/`
2. Registre em `src/App.tsx`
3. Adicione no menu em `src/components/layout/Sidebar.tsx`

### 8. Comandos Úteis shadcn/ui
```bash
# Adicionar novos componentes
npx shadcn@latest add [component-name]

# Listar componentes disponíveis
npx shadcn@latest add --all
```

---

## 📦 Dependências Principais

### Produção
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.30.1",
  "zustand": "^5.0.9",
  "@tanstack/react-query": "^5.83.0",
  "react-hook-form": "^7.61.1",
  "zod": "^3.25.76",
  "recharts": "^2.15.4",
  "date-fns": "^3.6.0",
  "lucide-react": "^0.462.0",
  "sonner": "^1.7.4",
  "tailwind-merge": "^2.6.0",
  "class-variance-authority": "^0.7.1"
}
```

### Desenvolvimento
```json
{
  "vite": "^5.4.19",
  "typescript": "^5.8.3",
  "tailwindcss": "^3.4.17",
  "eslint": "^9.32.0",
  "autoprefixer": "^10.4.21",
  "postcss": "^8.5.6"
}
```

---

## 📄 Licença

Projeto privado. Todos os direitos reservados.

---

## 🤝 Créditos

- **shadcn/ui** - Componentes UI
- **Radix UI** - Primitivos acessíveis
- **Recharts** - Gráficos
- **Lucide** - Ícones

---

*Documentação gerada em 13/12/2024*
