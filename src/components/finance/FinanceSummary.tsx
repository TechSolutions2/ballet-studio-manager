import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from 'lucide-react';
import { parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { Transaction } from '@/store/mockData';

interface FinanceSummaryProps {
    transactions: Transaction[];
}

export function FinanceSummary({ transactions }: FinanceSummaryProps) {
    const stats = useMemo(() => {
        const now = new Date();
        const currentMonthStart = startOfMonth(now);
        const currentMonthEnd = endOfMonth(now);

        const currentMonthTx = transactions.filter(t => {
            const txDate = parseISO(t.date);
            return isWithinInterval(txDate, { start: currentMonthStart, end: currentMonthEnd });
        });

        const totalReceitas = transactions
            .filter(t => t.type === 'receita')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalDespesas = transactions
            .filter(t => t.type === 'despesa')
            .reduce((sum, t) => sum + t.amount, 0);

        const currentReceitas = currentMonthTx
            .filter(t => t.type === 'receita')
            .reduce((sum, t) => sum + t.amount, 0);

        const currentDespesas = currentMonthTx
            .filter(t => t.type === 'despesa')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            totalReceitas,
            totalDespesas,
            saldoTotal: totalReceitas - totalDespesas,
            currentReceitas,
            currentDespesas,
            saldoMes: currentReceitas - currentDespesas,
            transactionCount: transactions.length,
        };
    }, [transactions]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Receitas (6 meses)"
                    value={formatCurrency(stats.totalReceitas)}
                    icon={TrendingUp}
                    iconColor="text-success"
                />
                <StatCard
                    title="Total Despesas (6 meses)"
                    value={formatCurrency(stats.totalDespesas)}
                    icon={TrendingDown}
                    iconColor="text-destructive"
                />
                <StatCard
                    title="Saldo Período"
                    value={formatCurrency(stats.saldoTotal)}
                    change={stats.saldoTotal >= 0 ? 'Positivo' : 'Negativo'}
                    changeType={stats.saldoTotal >= 0 ? 'positive' : 'negative'}
                    icon={Wallet}
                    iconColor="text-primary"
                />
                <StatCard
                    title="Transações"
                    value={stats.transactionCount.toString()}
                    change="Últimos 6 meses"
                    changeType="neutral"
                    icon={BarChart3}
                    iconColor="text-info"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <RevenueChart />
                <CategoryChart type="despesa" title="Despesas por Categoria" />
            </div>
        </div>
    );
}
