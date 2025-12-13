import { useState, useMemo } from 'react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Users,
    CheckCircle2,
    Clock,
    AlertCircle,
    UserPlus,
    Filter,
    DollarSign,
    ChevronRight,
    Eye,
    CalendarClock,
    Phone,
    Mail,
    User,
    MapPin,
    X,
    Receipt
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Student, BalletLevel, Guardian } from '@/store/mockData';
import { DebtConsultation } from './DebtConsultation';

const levelClasses: Record<BalletLevel, string[]> = {
    'Baby Class': ['Baby A', 'Baby B'],
    'Iniciante': ['Iniciante I', 'Iniciante II'],
    'Preparatório': ['Prep A', 'Prep B'],
    'Intermediário': ['Inter I', 'Inter II'],
    'Avançado': ['Avançado A', 'Avançado B'],
    'Pontas': ['Pontas I', 'Pontas II'],
};

const allClasses = Object.values(levelClasses).flat();

interface PaymentPromise {
    studentId: string;
    studentName: string;
    guardianName: string;
    promisedDate: string;
    amount: number;
    createdAt: string;
}

export function TuitionManagement() {
    const { getFilteredStudents, getGuardianById, addTransaction, selectedBranchId, branches, categories, students: allStudents } = useStore();
    const { toast } = useToast();

    const students = getFilteredStudents().filter(s => s.status === 'ativo');

    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

    // Guardian view modal
    const [isGuardianModalOpen, setIsGuardianModalOpen] = useState(false);
    const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
    const [guardianStudent, setGuardianStudent] = useState<Student | null>(null);

    // Payment promise modal
    const [isPromiseModalOpen, setIsPromiseModalOpen] = useState(false);
    const [promiseDate, setPromiseDate] = useState('');
    const [paymentPromises, setPaymentPromises] = useState<PaymentPromise[]>([]);

    // Debt consultation modal
    const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
    const [debtGuardian, setDebtGuardian] = useState<Guardian | null>(null);
    const [debtStudents, setDebtStudents] = useState<Student[]>([]);

    // Calculate class summaries
    const classSummaries = useMemo(() => {
        const summaries: Record<string, {
            className: string;
            studentCount: number;
            totalExpected: number;
            totalReceived: number;
            students: Student[];
        }> = {};

        students.forEach(student => {
            const className = student.class;
            if (!summaries[className]) {
                summaries[className] = {
                    className,
                    studentCount: 0,
                    totalExpected: 0,
                    totalReceived: 0,
                    students: [],
                };
            }

            summaries[className].studentCount++;
            summaries[className].totalExpected += student.monthlyFee;
            summaries[className].students.push(student);

            // Check if paid this month
            const currentMonth = format(new Date(), 'MM/yyyy');
            const paidThisMonth = student.paymentHistory.find(
                p => p.reference === currentMonth && p.status === 'pago'
            );
            if (paidThisMonth) {
                summaries[className].totalReceived += paidThisMonth.amount;
            }
        });

        return Object.values(summaries).sort((a, b) => a.className.localeCompare(b.className));
    }, [students]);

    // Get filtered students by class
    const filteredStudents = useMemo(() => {
        if (selectedClass === 'all') return students;
        return students.filter(s => s.class === selectedClass);
    }, [students, selectedClass]);

    // Calculate totals
    const totals = useMemo(() => {
        const data = selectedClass === 'all' ? classSummaries : classSummaries.filter(c => c.className === selectedClass);
        return {
            expected: data.reduce((sum, c) => sum + c.totalExpected, 0),
            received: data.reduce((sum, c) => sum + c.totalReceived, 0),
            studentCount: data.reduce((sum, c) => sum + c.studentCount, 0),
        };
    }, [classSummaries, selectedClass]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const getPaymentStatus = (student: Student) => {
        const currentMonth = format(new Date(), 'MM/yyyy');
        const payment = student.paymentHistory.find(p => p.reference === currentMonth);

        if (!payment) return 'pendente';
        return payment.status;
    };

    const hasPaymentPromise = (studentId: string) => {
        return paymentPromises.some(p => p.studentId === studentId);
    };

    const getPaymentPromise = (studentId: string) => {
        return paymentPromises.find(p => p.studentId === studentId);
    };

    const handleViewGuardian = (e: React.MouseEvent, student: Student) => {
        e.stopPropagation();
        const guardian = getGuardianById(student.guardianId);
        if (guardian) {
            setSelectedGuardian(guardian);
            setGuardianStudent(student);
            setIsGuardianModalOpen(true);
        } else {
            toast({
                title: 'Responsável não encontrado',
                description: 'Não foi possível encontrar as informações do responsável.',
                variant: 'destructive',
            });
        }
    };

    const handleRegisterPayment = (student: Student) => {
        setSelectedStudent(student);
        setPaymentAmount(student.monthlyFee.toString());
        setIsPaymentModalOpen(true);
    };

    const handleOpenPromiseModal = (e: React.MouseEvent, student: Student) => {
        e.stopPropagation();
        setSelectedStudent(student);
        setPromiseDate(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
        setIsPromiseModalOpen(true);
    };

    const confirmPayment = () => {
        if (!selectedStudent || !paymentAmount) return;

        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount <= 0) {
            toast({
                title: 'Erro',
                description: 'Informe um valor válido.',
                variant: 'destructive',
            });
            return;
        }

        // Add transaction
        const mensalidadeCategory = categories.find(c => c.id === 'rec-mensalidade');

        addTransaction({
            date: format(new Date(), 'yyyy-MM-dd'),
            description: `Mensalidade - ${selectedStudent.name}`,
            amount,
            type: 'receita',
            categoryId: mensalidadeCategory?.id || 'rec-mensalidade',
            branchId: selectedStudent.branchId,
            studentId: selectedStudent.id,
            guardianId: selectedStudent.guardianId,
        });

        // Remove payment promise if exists
        setPaymentPromises(prev => prev.filter(p => p.studentId !== selectedStudent.id));

        toast({
            title: 'Pagamento registrado!',
            description: `Mensalidade de ${selectedStudent.name} no valor de ${formatCurrency(amount)} foi registrada.`,
        });

        setIsPaymentModalOpen(false);
        setSelectedStudent(null);
        setPaymentAmount('');
    };

    const confirmPaymentPromise = () => {
        if (!selectedStudent || !promiseDate) return;

        const guardian = getGuardianById(selectedStudent.guardianId);

        const promise: PaymentPromise = {
            studentId: selectedStudent.id,
            studentName: selectedStudent.name,
            guardianName: guardian?.name || 'Responsável',
            promisedDate: promiseDate,
            amount: selectedStudent.monthlyFee,
            createdAt: format(new Date(), 'yyyy-MM-dd'),
        };

        setPaymentPromises(prev => [...prev.filter(p => p.studentId !== selectedStudent.id), promise]);

        toast({
            title: 'Promessa registrada!',
            description: `Lembrete agendado para ${format(new Date(promiseDate), 'dd/MM/yyyy', { locale: ptBR })} - ${selectedStudent.name}`,
        });

        setIsPromiseModalOpen(false);
        setSelectedStudent(null);
        setPromiseDate('');
    };

    const removePromise = (studentId: string) => {
        setPaymentPromises(prev => prev.filter(p => p.studentId !== studentId));
        toast({
            title: 'Promessa removida',
            description: 'O lembrete de pagamento foi removido.',
        });
    };

    const handleOpenDebtConsultation = () => {
        if (selectedGuardian && guardianStudent) {
            // Get all students of this guardian
            const guardianStudents = allStudents.filter(s => s.guardianId === selectedGuardian.id);
            setDebtGuardian(selectedGuardian);
            setDebtStudents(guardianStudents);
            setIsGuardianModalOpen(false);
            setIsDebtModalOpen(true);
        }
    };

    const selectedBranch = branches.find(b => b.id === selectedBranchId);

    return (
        <div className="space-y-6">
            {/* Header with filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">Gerenciamento de Mensalidades</h2>
                    <p className="text-sm text-muted-foreground">
                        {selectedBranchId === 'all'
                            ? 'Todas as unidades'
                            : selectedBranch?.name
                        } • {format(new Date(), 'MMMM yyyy', { locale: ptBR })}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrar por turma" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as turmas</SelectItem>
                            {allClasses.map(className => (
                                <SelectItem key={className} value={className}>
                                    {className}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Payment Promises Alert */}
            {paymentPromises.length > 0 && (
                <Card className="border-warning/50 bg-warning/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CalendarClock className="h-5 w-5 text-warning" />
                            Promessas de Pagamento ({paymentPromises.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {paymentPromises.map(promise => (
                                <div
                                    key={promise.studentId}
                                    className="flex items-center justify-between p-2 rounded-lg bg-background border"
                                >
                                    <div>
                                        <p className="text-sm font-medium">{promise.studentName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Prometeu pagar em {format(new Date(promise.promisedDate), 'dd/MM/yyyy', { locale: ptBR })} • {formatCurrency(promise.amount)}
                                        </p>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => removePromise(promise.studentId)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>A Receber (Mês)</CardDescription>
                        <CardTitle className="text-2xl text-primary">
                            {formatCurrency(totals.expected)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            {totals.studentCount} aluno(s) ativo(s)
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Recebido (Mês)</CardDescription>
                        <CardTitle className="text-2xl text-success">
                            {formatCurrency(totals.received)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            {((totals.received / totals.expected) * 100 || 0).toFixed(0)}% do esperado
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Pendente</CardDescription>
                        <CardTitle className="text-2xl text-warning">
                            {formatCurrency(totals.expected - totals.received)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            {filteredStudents.filter(s => getPaymentStatus(s) !== 'pago').length} aluno(s) pendente(s)
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Class Summary Cards */}
            {selectedClass === 'all' && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {classSummaries.map(summary => (
                        <Card
                            key={summary.className}
                            className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
                            onClick={() => setSelectedClass(summary.className)}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">{summary.className}</CardTitle>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <CardDescription>{summary.studentCount} alunos</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">A receber:</span>
                                    <span className="font-medium">{formatCurrency(summary.totalExpected)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-1">
                                    <span className="text-muted-foreground">Recebido:</span>
                                    <span className="font-medium text-success">{formatCurrency(summary.totalReceived)}</span>
                                </div>
                                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full bg-success rounded-full transition-all"
                                        style={{
                                            width: `${Math.min(100, (summary.totalReceived / summary.totalExpected) * 100)}%`
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Students List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base">
                                {selectedClass === 'all' ? 'Todos os Alunos' : `Turma: ${selectedClass}`}
                            </CardTitle>
                            <CardDescription>
                                {filteredStudents.length} aluno(s) • Clique para registrar pagamento
                            </CardDescription>
                        </div>
                        {selectedClass !== 'all' && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsAddStudentModalOpen(true)}
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Novo Aluno
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {filteredStudents.map(student => {
                            const status = getPaymentStatus(student);
                            const promise = getPaymentPromise(student.id);

                            return (
                                <div
                                    key={student.id}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm",
                                        status === 'pago'
                                            ? "bg-success/5 border-success/20"
                                            : status === 'atrasado'
                                                ? "bg-destructive/5 border-destructive/20"
                                                : "bg-warning/5 border-warning/20"
                                    )}
                                    onClick={() => handleRegisterPayment(student)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                                            status === 'pago'
                                                ? "bg-success/10 text-success"
                                                : status === 'atrasado'
                                                    ? "bg-destructive/10 text-destructive"
                                                    : "bg-warning/10 text-warning"
                                        )}>
                                            {status === 'pago' ? (
                                                <CheckCircle2 className="h-5 w-5" />
                                            ) : status === 'atrasado' ? (
                                                <AlertCircle className="h-5 w-5" />
                                            ) : (
                                                <Clock className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{student.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {student.class} • {student.level}
                                                {promise && (
                                                    <span className="ml-2 text-warning">
                                                        • Promessa: {format(new Date(promise.promisedDate), 'dd/MM', { locale: ptBR })}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-1">
                                            {/* View Guardian Button */}
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={(e) => handleViewGuardian(e, student)}
                                                title="Ver responsável"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>

                                            {/* Payment Promise Button - Only for overdue/pending */}
                                            {status !== 'pago' && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className={cn(
                                                        "h-8 w-8",
                                                        promise
                                                            ? "text-warning hover:text-warning"
                                                            : "text-muted-foreground hover:text-warning"
                                                    )}
                                                    onClick={(e) => handleOpenPromiseModal(e, student)}
                                                    title={promise ? "Editar promessa" : "Registrar promessa de pagamento"}
                                                >
                                                    <CalendarClock className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="text-right ml-2">
                                            <p className="font-semibold text-sm">{formatCurrency(student.monthlyFee)}</p>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-xs",
                                                    status === 'pago'
                                                        ? "border-success text-success"
                                                        : status === 'atrasado'
                                                            ? "border-destructive text-destructive"
                                                            : "border-warning text-warning"
                                                )}
                                            >
                                                {status === 'pago' ? 'Pago' : status === 'atrasado' ? 'Atrasado' : 'Pendente'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredStudents.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>Nenhum aluno encontrado nesta turma.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Guardian View Modal */}
            <Dialog open={isGuardianModalOpen} onOpenChange={setIsGuardianModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Responsável
                        </DialogTitle>
                        <DialogDescription>
                            {guardianStudent && (
                                <>Responsável por <strong>{guardianStudent.name}</strong></>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedGuardian && (
                        <div className="space-y-4 py-2">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">{selectedGuardian.name}</p>
                                    <p className="text-sm text-muted-foreground">{selectedGuardian.relationship}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">{selectedGuardian.phone}</p>
                                        <p className="text-xs text-muted-foreground">Telefone</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">{selectedGuardian.email}</p>
                                        <p className="text-xs text-muted-foreground">Email</p>
                                    </div>
                                </div>

                                {selectedGuardian.address && (
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{selectedGuardian.address}</p>
                                            <p className="text-xs text-muted-foreground">Endereço</p>
                                        </div>
                                    </div>
                                )}

                                {/* <div className="flex items-center gap-3">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className={cn(
                                            "text-sm font-medium",
                                            selectedGuardian.wallet.balance > 0 ? "text-destructive" : "text-success"
                                        )}>
                                            {selectedGuardian.wallet.balance > 0
                                                ? `Débito: ${formatCurrency(selectedGuardian.wallet.balance)}`
                                                : 'Em dia'
                                            }
                                        </p>
                                        <p className="text-xs text-muted-foreground">Situação financeira</p>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => setIsGuardianModalOpen(false)}>
                            Fechar
                        </Button>
                        <Button variant="outline" onClick={handleOpenDebtConsultation}>
                            <Receipt className="h-4 w-4 mr-2" />
                            Consultar Débitos
                        </Button>
                        <Button onClick={() => {
                            if (selectedGuardian) {
                                window.open(`tel:${selectedGuardian.phone}`, '_self');
                            }
                        }}>
                            <Phone className="h-4 w-4 mr-2" />
                            Ligar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Payment Modal */}
            <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar Pagamento</DialogTitle>
                        <DialogDescription>
                            {selectedStudent && (
                                <>
                                    Registrar pagamento de mensalidade para <strong>{selectedStudent.name}</strong>
                                    <br />
                                    Turma: {selectedStudent.class} • Valor padrão: {formatCurrency(selectedStudent.monthlyFee)}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="payment-amount">Valor do Pagamento</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="payment-amount"
                                    type="number"
                                    step="0.01"
                                    placeholder="0,00"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={confirmPayment}>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Confirmar Pagamento
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Payment Promise Modal */}
            <Dialog open={isPromiseModalOpen} onOpenChange={setIsPromiseModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CalendarClock className="h-5 w-5 text-warning" />
                            Promessa de Pagamento
                        </DialogTitle>
                        <DialogDescription>
                            {selectedStudent && (
                                <>
                                    Registrar promessa de pagamento de <strong>{selectedStudent.name}</strong>.
                                    <br />
                                    Um lembrete será criado para a data informada.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="promise-date">Data Prometida</Label>
                            <Input
                                id="promise-date"
                                type="date"
                                value={promiseDate}
                                onChange={(e) => setPromiseDate(e.target.value)}
                                min={format(new Date(), 'yyyy-MM-dd')}
                            />
                        </div>

                        {selectedStudent && (
                            <div className="p-3 rounded-lg bg-muted/50">
                                <p className="text-sm">
                                    <strong>Valor:</strong> {formatCurrency(selectedStudent.monthlyFee)}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    O responsável prometeu realizar o pagamento até a data selecionada.
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPromiseModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={confirmPaymentPromise} className="bg-warning hover:bg-warning/90 text-warning-foreground">
                            <CalendarClock className="h-4 w-4 mr-2" />
                            Registrar Promessa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Student Modal Placeholder */}
            <Dialog open={isAddStudentModalOpen} onOpenChange={setIsAddStudentModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Novo Aluno</DialogTitle>
                        <DialogDescription>
                            Adicione um novo aluno à turma <strong>{selectedClass}</strong>.
                            O valor da mensalidade será automaticamente adicionado ao mês atual.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-8 text-center text-muted-foreground">
                        <UserPlus className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Para adicionar um novo aluno, acesse a página de Alunos.</p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddStudentModalOpen(false)}>
                            Fechar
                        </Button>
                        <Button onClick={() => {
                            setIsAddStudentModalOpen(false);
                            window.location.href = '/alunos';
                        }}>
                            Ir para Alunos
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Debt Consultation Modal */}
            <Dialog open={isDebtModalOpen} onOpenChange={setIsDebtModalOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-primary" />
                            Consulta de Débitos
                        </DialogTitle>
                        <DialogDescription>
                            {debtGuardian && (
                                <>Responsável: <strong>{debtGuardian.name}</strong></>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-auto">
                        {debtGuardian && debtStudents.length > 0 && (
                            <DebtConsultation
                                guardian={debtGuardian}
                                students={debtStudents}
                                onClose={() => setIsDebtModalOpen(false)}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
