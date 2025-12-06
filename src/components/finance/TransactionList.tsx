import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDownLeft, ArrowUpRight, Filter, Plus, Download } from 'lucide-react';
import { Transaction } from '@/store/mockData';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const { categories, branches } = useStore();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredTransactions = transactions.filter(t => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && t.categoryId !== categoryFilter) return false;
    return true;
  });

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
    return branch?.name || branchId;
  };

  const totalReceitas = filteredTransactions
    .filter(t => t.type === 'receita')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDespesas = filteredTransactions
    .filter(t => t.type === 'despesa')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-base font-semibold">Transações</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="receita">Receitas</SelectItem>
                <SelectItem value="despesa">Despesas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button size="sm" variant="outline" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>

            <Button size="sm" className="h-9">
              <Plus className="h-4 w-4 mr-2" />
              Nova
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Receitas:</span>
            <span className="text-sm font-semibold text-success">{formatCurrency(totalReceitas)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Despesas:</span>
            <span className="text-sm font-semibold text-destructive">{formatCurrency(totalDespesas)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Saldo:</span>
            <span className={cn(
              "text-sm font-semibold",
              totalReceitas - totalDespesas >= 0 ? "text-success" : "text-destructive"
            )}>
              {formatCurrency(totalReceitas - totalDespesas)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {filteredTransactions.slice(0, 20).map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
                  transaction.type === 'receita' 
                    ? "bg-success/10 text-success" 
                    : "bg-destructive/10 text-destructive"
                )}>
                  {transaction.type === 'receita' 
                    ? <ArrowDownLeft className="h-5 w-5" />
                    : <ArrowUpRight className="h-5 w-5" />
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{transaction.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs">
                      {getCategoryName(transaction.categoryId)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {getBranchName(transaction.branchId).split(' ')[1]}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className={cn(
                  "text-sm font-semibold",
                  transaction.type === 'receita' ? "text-success" : "text-destructive"
                )}>
                  {transaction.type === 'receita' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(parseISO(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length > 20 && (
          <div className="p-4 text-center border-t border-border">
            <Button variant="ghost" size="sm">
              Ver todas as {filteredTransactions.length} transações
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
