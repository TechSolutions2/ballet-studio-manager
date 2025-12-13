import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import { TransactionList } from '@/components/finance/TransactionList';
import { TransactionModal } from '@/components/finance/TransactionModal';
import { FinanceSummary } from '@/components/finance/FinanceSummary';
import { TuitionManagement } from '@/components/finance/TuitionManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, List, Receipt } from 'lucide-react';

export default function Finance() {
  const { getFilteredTransactions, selectedBranchId, branches } = useStore();
  const { user } = useAuthStore();
  const transactions = getFilteredTransactions();

  const selectedBranch = branches.find(b => b.id === selectedBranchId);
  const isEmployee = user?.role === 'employee';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Financeiro</h1>
          <p className="text-muted-foreground">
            {selectedBranchId === 'all'
              ? 'Controle financeiro consolidado'
              : `Finanças da ${selectedBranch?.name}`
            }
          </p>
        </div>
        <TransactionModal />
      </div>

      {/* Tabs */}
      <Tabs defaultValue={isEmployee ? "tuition" : "summary"} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          {!isEmployee && (
            <TabsTrigger value="summary" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Resumo</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="transactions" className="gap-2">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Transações</span>
          </TabsTrigger>
          <TabsTrigger value="tuition" className="gap-2">
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">Mensalidades</span>
          </TabsTrigger>
        </TabsList>

        {!isEmployee && (
          <TabsContent value="summary" className="mt-6">
            <FinanceSummary transactions={transactions} />
          </TabsContent>
        )}

        <TabsContent value="transactions" className="mt-6">
          <TransactionList transactions={transactions} />
        </TabsContent>

        <TabsContent value="tuition" className="mt-6">
          <TuitionManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
