import { useMemo } from 'react';
import { Users, Wallet, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { subMonths, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { UserPlus, Plus } from 'lucide-react';

export default function Dashboard() {
  const { getFilteredStudents, getFilteredTransactions, selectedBranchId, branches } = useStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

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

  if (user?.role === 'employee') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold">Olá, {user.name}</h1>
          <p className="text-muted-foreground">
            Painel do Funcionário - {selectedBranchId === 'all' ? 'Todas as Unidades' : selectedBranch?.name}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/alunos')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeStudents}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingPayments} com mensalidade pendente
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 flex flex-col items-center justify-center p-6 space-y-4" onClick={() => navigate('/alunos')}>
            <div className="p-3 bg-primary/10 rounded-full">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <span className="font-medium text-primary">Novo Aluno</span>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 flex flex-col items-center justify-center p-6 space-y-4" onClick={() => navigate('/financeiro')}>
            <div className="p-3 bg-primary/10 rounded-full">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <span className="font-medium text-primary">Nova Transação</span>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Caixa Diário / Recentes</h2>
          <RecentTransactions />
        </div>
      </div>
    );
  }

  // Admin View
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

      {/* Monthly Goal Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-3 min-h-[320px] flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Meta Mensal: {formatCurrency(21000)}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 w-full">
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <p className="text-sm font-medium text-muted-foreground">Progresso Atual</p>
                <p className="text-3xl font-bold">{formatCurrency(stats.currentRevenue)}</p>
                <div className="space-y-1">
                  {21000 > stats.currentRevenue ? (
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-warning text-primary-foreground hover:bg-warning/80">
                      Faltam {formatCurrency(21000 - stats.currentRevenue)}
                    </div>
                  ) : (
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-success text-primary-foreground hover:bg-success/80">
                      Meta Atingida!
                    </div>
                  )}
                </div>
              </div>
              <div className="h-[180px] w-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Atual', value: stats.currentRevenue },
                        { name: 'Restante', value: Math.max(0, 21000 - stats.currentRevenue) },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="hsl(var(--primary))" />
                      <Cell fill="hsl(var(--muted))" />
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions or Summary could go here, or just let Stats Grid take full width below */}
        <div className="col-span-4 lg:col-span-4 min-h-[320px] flex flex-col p-6 border rounded-xl bg-card shadow-sm">
          <CardTitle className="mb-2">Resumo Financeiro</CardTitle>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              Você já atingiu {((stats.currentRevenue / 21000) * 100).toFixed(1)}% da sua meta mensal de R$ 21.000,00.
              Continue assim!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div className="p-4 rounded-lg bg-primary/10">
              <p className="text-sm font-medium text-muted-foreground">Média Diária</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(stats.currentRevenue / new Date().getDate())}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-success/10">
              <p className="text-sm font-medium text-muted-foreground">Projeção</p>
              <p className="text-2xl font-bold text-success">
                {formatCurrency((stats.currentRevenue / new Date().getDate()) * 30)}
              </p>
            </div>
          </div>
        </div>
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
