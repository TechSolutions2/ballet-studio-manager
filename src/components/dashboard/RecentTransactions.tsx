import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function RecentTransactions() {
  const { getFilteredTransactions, categories, branches } = useStore();
  const transactions = getFilteredTransactions().slice(0, 8);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Outros';
  };

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch?.name.split(' ')[1] || branchId;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Últimas Transações de Caixa</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  transaction.type === 'receita' 
                    ? "bg-success/10 text-success" 
                    : "bg-destructive/10 text-destructive"
                )}>
                  {transaction.type === 'receita' 
                    ? <ArrowDownLeft className="h-4 w-4" />
                    : <ArrowUpRight className="h-4 w-4" />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium line-clamp-1">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {getCategoryName(transaction.categoryId)} • {getBranchName(transaction.branchId)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-sm font-semibold",
                  transaction.type === 'receita' ? "text-success" : "text-destructive"
                )}>
                  {transaction.type === 'receita' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(parseISO(transaction.date), 'dd MMM', { locale: ptBR })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
