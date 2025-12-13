import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, User, Link as LinkIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const transactionSchema = z.object({
  type: z.enum(['receita', 'despesa'], {
    required_error: 'Selecione o tipo de transação',
  }),
  categoryId: z.string({
    required_error: 'Selecione uma categoria',
  }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Valor deve ser maior que zero',
  }),
  description: z.string().min(3, {
    message: 'Descrição deve ter pelo menos 3 caracteres',
  }).max(100, {
    message: 'Descrição deve ter no máximo 100 caracteres',
  }),
  date: z.string().optional(),
  guardianId: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export function TransactionModal() {
  const [open, setOpen] = useState(false);
  const [showGuardianLink, setShowGuardianLink] = useState(false);
  const { categories, selectedBranchId, branches, addTransaction, guardians } = useStore();

  const sortedGuardians = useMemo(() =>
    [...guardians].sort((a, b) => a.name.localeCompare(b.name)),
    [guardians]
  );

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'receita',
      description: '',
      amount: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const selectedType = form.watch('type');
  const filteredCategories = categories.filter((cat) => cat.type === selectedType);

  const onSubmit = (data: TransactionFormData) => {
    const branchId = selectedBranchId === 'all' ? branches[1]?.id || 'centro' : selectedBranchId;

    // Auto-append guardian name to description if linked and description doesn't already have it
    let finalDescription = data.description.trim();
    if (data.guardianId) {
      const guardian = guardians.find(g => g.id === data.guardianId);
      if (guardian && !finalDescription.toLowerCase().includes(guardian.name.toLowerCase())) {
        finalDescription += ` - Pago por ${guardian.name}`;
      }
    }

    addTransaction({
      date: data.date || format(new Date(), 'yyyy-MM-dd'),
      description: finalDescription,
      amount: Number(data.amount),
      type: data.type,
      categoryId: data.categoryId,
      branchId,
      guardianId: data.guardianId,
    });

    toast({
      title: 'Transação adicionada',
      description: `${data.type === 'receita' ? 'Receita' : 'Despesa'} de R$ ${Number(data.amount).toFixed(2)} registrada com sucesso.`,
    });

    form.reset();
    setShowGuardianLink(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>
            Registre uma nova receita ou despesa no sistema.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('categoryId', '');
                      if (value === 'despesa') {
                        setShowGuardianLink(false);
                        form.setValue('guardianId', undefined);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background">
                      <SelectItem value="receita">💰 Receita</SelectItem>
                      <SelectItem value="despesa">💸 Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background">
                      {filteredCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedType === 'receita' && (
              <div className="space-y-3 p-3 border rounded-md bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="link-guardian" className="text-sm font-medium cursor-pointer">
                      Vincular a responsável
                    </Label>
                  </div>
                  <Switch
                    id="link-guardian"
                    checked={showGuardianLink}
                    onCheckedChange={(checked) => {
                      setShowGuardianLink(checked);
                      if (!checked) {
                        form.setValue('guardianId', undefined);
                      }
                    }}
                  />
                </div>

                {showGuardianLink && (
                  <FormField
                    control={form.control}
                    name="guardianId"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o responsável" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background max-h-[200px]">
                            {sortedGuardians.map((guardian) => (
                              <SelectItem key={guardian.id} value={guardian.id}>
                                {guardian.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a transação..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
