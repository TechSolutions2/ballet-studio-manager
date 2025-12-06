import { useMemo } from 'react';
import { Users, Wallet, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { subMonths, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export default function Dashboard() {
  const { getFilteredStudents, getFilteredTransactions, selectedBranchId, branches } = useStore();
  
  const students = getFilteredStudents();
  const transactions = getFilteredTransactions();

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const currentMonthTx = transactions.filter(t => {
      const txDate = parseISO(t.date);
      return isWithinInterval(txDate, { start: currentMonthStart, end: currentMonthEnd });
    });

    const lastMonthTx = transactions.filter(t => {
      const txDate = parseISO(t.date);
      return isWithinInterval(txDate, { start: lastMonthStart, end: lastMonthEnd });
    });

    const currentRevenue = currentMonthTx
      .filter(t => t.type === 'receita')
      .reduce((sum, t) => sum + t.amount, 0);

    const lastRevenue = lastMonthTx
      .filter(t => t.type === 'receita')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpenses = currentMonthTx
      .filter(t => t.type === 'despesa')
      .reduce((sum, t) => sum + t.amount, 0);

    const lastExpenses = lastMonthTx
      .filter(t => t.type === 'despesa')
      .reduce((sum, t) => sum + t.amount, 0);

    const revenueChange = lastRevenue > 0 
      ? ((currentRevenue - lastRevenue) / lastRevenue * 100).toFixed(1)
      : '0';

    const expenseChange = lastExpenses > 0 
      ? ((currentExpenses - lastExpenses) / lastExpenses * 100).toFixed(1)
      : '0';

    const activeStudents = students.filter(s => s.status === 'ativo').length;
    const pendingPayments = students.filter(s => s.paymentStatus !== 'em_dia').length;

    return {
      activeStudents,
      pendingPayments,
      currentRevenue,
      currentExpenses,
      revenueChange: Number(revenueChange),
      expenseChange: Number(expenseChange),
      balance: currentRevenue - currentExpenses,
    };
  }, [students, transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const selectedBranch = branches.find(b => b.id === selectedBranchId);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          {selectedBranchId === 'all' 
            ? 'Visão consolidada de todas as unidades'
            : `Dados da ${selectedBranch?.name}`
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Alunos Ativos"
          value={stats.activeStudents.toString()}
          change={`${stats.pendingPayments} com pendência`}
          changeType={stats.pendingPayments > 0 ? 'negative' : 'neutral'}
          icon={Users}
          iconColor="text-primary"
        />
        <StatCard
          title="Receitas (Mês)"
          value={formatCurrency(stats.currentRevenue)}
          change={`${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange}% vs mês anterior`}
          changeType={stats.revenueChange >= 0 ? 'positive' : 'negative'}
          icon={TrendingUp}
          iconColor="text-success"
        />
        <StatCard
          title="Despesas (Mês)"
          value={formatCurrency(stats.currentExpenses)}
          change={`${stats.expenseChange >= 0 ? '+' : ''}${stats.expenseChange}% vs mês anterior`}
          changeType={stats.expenseChange <= 0 ? 'positive' : 'negative'}
          icon={TrendingDown}
          iconColor="text-destructive"
        />
        <StatCard
          title="Saldo do Mês"
          value={formatCurrency(stats.balance)}
          change={stats.balance >= 0 ? 'Positivo' : 'Negativo'}
          changeType={stats.balance >= 0 ? 'positive' : 'negative'}
          icon={Wallet}
          iconColor="text-info"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <div className="grid gap-6">
          <CategoryChart type="receita" title="Receitas por Categoria" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryChart type="despesa" title="Despesas por Categoria" />
        <RecentTransactions />
      </div>
    </div>
  );
}
