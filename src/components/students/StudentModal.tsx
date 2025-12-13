import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Plus, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BalletLevel } from '@/store/mockData';

const guardianSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  relationship: z.string().min(1, 'Selecione o parentesco'),
  address: z.string().optional(),
});

const studentSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  level: z.string().min(1, 'Selecione o nível'),
  class: z.string().min(1, 'Selecione a turma'),
  branchId: z.string().min(1, 'Selecione a unidade'),
  monthlyFee: z.number().min(1, 'Valor da mensalidade é obrigatório'),
  monthlyFeeDate: z.string().min(1, 'Data de pagamento é obrigatória'),
  scholarshipType: z.enum(['none', 'percentage', 'fixed']),
  scholarshipValue: z.string().optional(),
  buyCostume: z.boolean(),
  costumeValue: z.string().optional(),
  costumeInstallments: z.string().optional(),
});

type GuardianForm = z.infer<typeof guardianSchema>;
type StudentForm = z.infer<typeof studentSchema>;

const levels: BalletLevel[] = ['Baby Class', 'Iniciante', 'Preparatório', 'Intermediário', 'Avançado', 'Pontas'];
const levelClasses: Record<BalletLevel, string[]> = {
  'Baby Class': ['Baby A', 'Baby B'],
  'Iniciante': ['Iniciante I', 'Iniciante II'],
  'Preparatório': ['Prep A', 'Prep B'],
  'Intermediário': ['Inter I', 'Inter II'],
  'Avançado': ['Avançado A', 'Avançado B'],
  'Pontas': ['Pontas I', 'Pontas II'],
};

const levelFees: Record<BalletLevel, number> = {
  'Baby Class': 280,
  'Iniciante': 320,
  'Preparatório': 380,
  'Intermediário': 420,
  'Avançado': 480,
  'Pontas': 520,
};

export function StudentModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'guardian' | 'student'>('guardian');
  const [guardianTab, setGuardianTab] = useState<'new' | 'existing'>('new');
  const [selectedGuardianId, setSelectedGuardianId] = useState<string>('');
  const [createdGuardianId, setCreatedGuardianId] = useState<string>('');

  const { toast } = useToast();
  const { branches, guardians, addGuardian, addStudent } = useStore();

  const guardianForm = useForm<GuardianForm>({
    resolver: zodResolver(guardianSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      cpf: '',
      relationship: '',
      address: '',
    },
  });

  const studentForm = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      birthDate: '',
      phone: '',
      email: '',
      level: '',
      class: '',
      branchId: '',
      monthlyFee: 70,
      monthlyFeeDate: '',
      scholarshipType: 'none',
      scholarshipValue: '',
      buyCostume: false,
      costumeValue: '',
      costumeInstallments: '1',
    },
  });

  const selectedLevel = studentForm.watch('level') as BalletLevel;
  const availableClasses = selectedLevel ? levelClasses[selectedLevel] : [];

  const handleGuardianSubmit = (data: GuardianForm) => {
    const id = addGuardian({
      name: data.name,
      phone: data.phone,
      email: data.email,
      cpf: data.cpf,
      relationship: data.relationship,
      address: data.address,
    });
    setCreatedGuardianId(id);
    setStep('student');
    toast({ title: 'Responsável cadastrado!', description: 'Agora cadastre os dados do aluno.' });
  };

  const handleSelectExistingGuardian = () => {
    if (!selectedGuardianId) {
      toast({ title: 'Erro', description: 'Selecione um responsável', variant: 'destructive' });
      return;
    }
    setStep('student');
  };

  const handleStudentSubmit = (data: StudentForm) => {
    const guardianId = guardianTab === 'new' ? createdGuardianId : selectedGuardianId;

    if (!guardianId) {
      toast({ title: 'Erro', description: 'Responsável não selecionado', variant: 'destructive' });
      return;
    }

    addStudent({
      name: data.name,
      birthDate: data.birthDate,
      phone: data.phone || '',
      email: data.email || '',
      level: data.level as BalletLevel,
      class: data.class,
      branchId: data.branchId,
      monthlyFee: data.monthlyFee,
      guardianId,
      scholarship: data.scholarshipType !== 'none' ? {
        type: data.scholarshipType as 'percentage' | 'fixed',
        value: Number(data.scholarshipValue),
      } : undefined,
      costume: data.buyCostume ? {
        purchased: true,
        totalAmount: Number(data.costumeValue),
        installments: Number(data.costumeInstallments),
      } : undefined,
    });

    toast({ title: 'Aluno cadastrado!', description: 'O aluno foi adicionado com sucesso.' });
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setStep('guardian');
    setGuardianTab('new');
    setSelectedGuardianId('');
    setCreatedGuardianId('');
    guardianForm.reset();
    studentForm.reset();
  };

  const handleLevelChange = (level: string) => {
    studentForm.setValue('level', level);
    studentForm.setValue('class', '');
    studentForm.setValue('monthlyFee', levelFees[level as BalletLevel]);
  };

  const activeBranches = branches.filter(b => b.id !== 'all');

  return (
    <Dialog open={open} onOpenChange={(isOpen) => isOpen ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Aluno
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {step === 'guardian' ? 'Passo 1: Responsável' : 'Passo 2: Dados do Aluno'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          {step === 'guardian' ? (
            <Tabs value={guardianTab} onValueChange={(v) => setGuardianTab(v as 'new' | 'existing')}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="new">Novo Responsável</TabsTrigger>
                <TabsTrigger value="existing">Responsável Existente</TabsTrigger>
              </TabsList>

              <TabsContent value="new">
                <form onSubmit={guardianForm.handleSubmit(handleGuardianSubmit)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="guardian-name">Nome Completo *</Label>
                      <Input
                        id="guardian-name"
                        placeholder="Nome do responsável"
                        {...guardianForm.register('name')}
                      />
                      {guardianForm.formState.errors.name && (
                        <p className="text-sm text-destructive">{guardianForm.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guardian-relationship">Parentesco *</Label>
                      <Select
                        value={guardianForm.watch('relationship')}
                        onValueChange={(v) => guardianForm.setValue('relationship', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mãe">Mãe</SelectItem>
                          <SelectItem value="Pai">Pai</SelectItem>
                          <SelectItem value="Avó">Avó</SelectItem>
                          <SelectItem value="Avô">Avô</SelectItem>
                          <SelectItem value="Tio(a)">Tio(a)</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      {guardianForm.formState.errors.relationship && (
                        <p className="text-sm text-destructive">{guardianForm.formState.errors.relationship.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guardian-cpf">CPF *</Label>
                      <Input
                        id="guardian-cpf"
                        placeholder="000.000.000-00"
                        {...guardianForm.register('cpf')}
                      />
                      {guardianForm.formState.errors.cpf && (
                        <p className="text-sm text-destructive">{guardianForm.formState.errors.cpf.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guardian-phone">Telefone *</Label>
                      <Input
                        id="guardian-phone"
                        placeholder="(11) 99999-9999"
                        {...guardianForm.register('phone')}
                      />
                      {guardianForm.formState.errors.phone && (
                        <p className="text-sm text-destructive">{guardianForm.formState.errors.phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="guardian-email">Email *</Label>
                      <Input
                        id="guardian-email"
                        type="email"
                        placeholder="email@exemplo.com"
                        {...guardianForm.register('email')}
                      />
                      {guardianForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{guardianForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="guardian-address">Endereço</Label>
                      <Input
                        id="guardian-address"
                        placeholder="Rua, número, bairro"
                        {...guardianForm.register('address')}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit">
                      Próximo: Dados do Aluno
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="existing">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Selecione um responsável existente</Label>
                    <Select value={selectedGuardianId} onValueChange={setSelectedGuardianId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Buscar responsável..." />
                      </SelectTrigger>
                      <SelectContent>
                        {guardians.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name} ({g.relationship}) - {g.cpf}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedGuardianId && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Responsável Selecionado</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const g = guardians.find(g => g.id === selectedGuardianId);
                          if (!g) return null;
                          return (
                            <div className="text-sm space-y-1">
                              <p><strong>Nome:</strong> {g.name}</p>
                              <p><strong>Parentesco:</strong> {g.relationship}</p>
                              <p><strong>Telefone:</strong> {g.phone}</p>
                              <p><strong>Email:</strong> {g.email}</p>
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSelectExistingGuardian} disabled={!selectedGuardianId}>
                      Próximo: Dados do Aluno
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <form onSubmit={studentForm.handleSubmit(handleStudentSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="student-name">Nome Completo do Aluno *</Label>
                  <Input
                    id="student-name"
                    placeholder="Nome do aluno"
                    {...studentForm.register('name')}
                  />
                  {studentForm.formState.errors.name && (
                    <p className="text-sm text-destructive">{studentForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-birthDate">Data de Nascimento *</Label>
                  <Input
                    id="student-birthDate"
                    type="date"
                    {...studentForm.register('birthDate')}
                  />
                  {studentForm.formState.errors.birthDate && (
                    <p className="text-sm text-destructive">{studentForm.formState.errors.birthDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-phone">Telefone</Label>
                  <Input
                    id="student-phone"
                    placeholder="(11) 99999-9999"
                    {...studentForm.register('phone')}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="email@exemplo.com"
                    {...studentForm.register('email')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-branch">Unidade *</Label>
                  <Select
                    value={studentForm.watch('branchId')}
                    onValueChange={(v) => studentForm.setValue('branchId', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeBranches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {studentForm.formState.errors.branchId && (
                    <p className="text-sm text-destructive">{studentForm.formState.errors.branchId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-level">Nível *</Label>
                  <Select
                    value={studentForm.watch('level')}
                    onValueChange={handleLevelChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {studentForm.formState.errors.level && (
                    <p className="text-sm text-destructive">{studentForm.formState.errors.level.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-class">Turma *</Label>
                  <Select
                    value={studentForm.watch('class')}
                    onValueChange={(v) => studentForm.setValue('class', v)}
                    disabled={!selectedLevel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableClasses.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {studentForm.formState.errors.class && (
                    <p className="text-sm text-destructive">{studentForm.formState.errors.class.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-fee">Mensalidade (R$)</Label>
                  <Input
                    id="student-fee"
                    type="number"
                    {...studentForm.register('monthlyFee', { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-fee">Data para pagamento da mensalidade</Label>
                  <Input
                    id="student-fee"
                    type="date"
                    {...studentForm.register('monthlyFeeDate')}
                  />
                </div>

                {/* Scholarship Section */}
                <div className="space-y-4 pt-4 border-t sm:col-span-2">
                  <h3 className="font-semibold text-sm">Bolsa de Estudos</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="scholarship-type">Tipo de Bolsa</Label>
                      <Select
                        value={studentForm.watch('scholarshipType')}
                        onValueChange={(v) => studentForm.setValue('scholarshipType', v as 'none' | 'percentage' | 'fixed')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhuma</SelectItem>
                          <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                          <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {studentForm.watch('scholarshipType') !== 'none' && (
                      <div className="space-y-2">
                        <Label htmlFor="scholarship-value">
                          {studentForm.watch('scholarshipType') === 'percentage' ? 'Porcentagem (%)' : 'Valor (R$)'}
                        </Label>
                        <Input
                          id="scholarship-value"
                          type="number"
                          placeholder="0"
                          {...studentForm.register('scholarshipValue')}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Costume Section */}
                <div className="space-y-4 pt-4 border-t sm:col-span-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="buy-costume"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      {...studentForm.register('buyCostume')}
                    />
                    <Label htmlFor="buy-costume" className="font-semibold text-sm">Incluir Figurino</Label>
                  </div>

                  {studentForm.watch('buyCostume') && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="costume-value">Valor do Figurino (R$)</Label>
                        <Input
                          id="costume-value"
                          type="number"
                          placeholder="0,00"
                          {...studentForm.register('costumeValue')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="costume-installments">Parcelas</Label>
                        <Select
                          value={studentForm.watch('costumeInstallments')}
                          onValueChange={(v) => studentForm.setValue('costumeInstallments', v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">À vista</SelectItem>
                            <SelectItem value="2">2x</SelectItem>
                            <SelectItem value="3">3x</SelectItem>
                            <SelectItem value="4">4x</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>


              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setStep('guardian')}>
                  Voltar
                </Button>
                <Button type="submit">
                  <Check className="h-4 w-4 mr-2" />
                  Cadastrar Aluno
                </Button>
              </div>
            </form>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
