import { useState, useMemo } from 'react';
import { format, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    ArrowUpRight,
    ArrowDownLeft,
    CheckCircle2,
    Clock,
    X,
    Shirt,
    GraduationCap,
    Calendar,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Guardian, Student } from '@/store/mockData';

interface DebtConsultationProps {
    guardian: Guardian;
    students: Student[];
    onClose: () => void;
    onRegisterPayment?: (category: string, month: string, amount: number) => void;
}

interface MonthlyDebt {
    month: string;
    monthLabel: string;
    tuition: number;
    tuitionPaid: boolean;
    costume: number;
    costumePaid: boolean;
    other: number;
    otherPaid: boolean;
}

export function DebtConsultation({ guardian, students, onClose, onRegisterPayment }: DebtConsultationProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>('tuition');

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    // Calculate monthly debts based on students
    const monthlyDebts = useMemo(() => {
        const debts: MonthlyDebt[] = [];
        const now = new Date();
        const startMonth = new Date(now.getFullYear(), 0, 1); // Janeiro do ano atual

        // Create 12 months of data
        for (let i = 0; i < 12; i++) {
            const monthDate = addMonths(startMonth, i);
            const monthKey = format(monthDate, 'MM/yyyy');
            const monthLabel = format(monthDate, 'MMMM', { locale: ptBR });

            let tuitionTotal = 0;
            let costumeTotal = 0;
            let tuitionPaid = true;
            let costumePaid = true;

            students.forEach(student => {
                // Tuition
                tuitionTotal += student.monthlyFee;

                // Check if paid
                const payment = student.paymentHistory.find(p => p.reference === monthKey);
                if (!payment || payment.status !== 'pago') {
                    tuitionPaid = false;
                }

                // Costume (divided by installments)
                if (student.costume?.purchased && student.costume.installments > 0) {
                    const costumePerMonth = student.costume.totalAmount / student.costume.installments;
                    if (i < student.costume.installments) {
                        costumeTotal += costumePerMonth;
                        // Check if costume is paid (simplified - based on paidAmount)
                        const expectedPaid = costumePerMonth * (i + 1);
                        if (student.costume.paidAmount < expectedPaid) {
                            costumePaid = false;
                        }
                    }
                }
            });

            debts.push({
                month: monthKey,
                monthLabel: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
                tuition: tuitionTotal,
                tuitionPaid,
                costume: costumeTotal,
                costumePaid,
                other: 0,
                otherPaid: true,
            });
        }

        return debts;
    }, [students]);

    // Calculate totals
    const totals = useMemo(() => {
        const tuitionTotal = monthlyDebts.reduce((sum, m) => sum + m.tuition, 0);
        const tuitionPaid = monthlyDebts.filter(m => m.tuitionPaid).reduce((sum, m) => sum + m.tuition, 0);
        const costumeTotal = monthlyDebts.reduce((sum, m) => sum + m.costume, 0);
        const costumePaid = monthlyDebts.filter(m => m.costumePaid).reduce((sum, m) => sum + m.costume, 0);

        return {
            tuition: { total: tuitionTotal, paid: tuitionPaid, pending: tuitionTotal - tuitionPaid },
            costume: { total: costumeTotal, paid: costumePaid, pending: costumeTotal - costumePaid },
            grandTotal: tuitionTotal + costumeTotal,
            grandPaid: tuitionPaid + costumePaid,
            grandPending: (tuitionTotal - tuitionPaid) + (costumeTotal - costumePaid),
        };
    }, [monthlyDebts]);

    const categories = [
        {
            id: 'tuition',
            name: 'Mensalidades',
            icon: GraduationCap,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            data: totals.tuition,
            months: monthlyDebts.map(m => ({
                month: m.month,
                label: m.monthLabel,
                amount: m.tuition,
                paid: m.tuitionPaid
            })),
        },
        {
            id: 'costume',
            name: 'Figurino',
            icon: Shirt,
            color: 'text-info',
            bgColor: 'bg-info/10',
            data: totals.costume,
            months: monthlyDebts.filter(m => m.costume > 0).map(m => ({
                month: m.month,
                label: m.monthLabel,
                amount: m.costume,
                paid: m.costumePaid
            })),
        },
    ];

    return (
        <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="text-center">
                    <CardContent className="pt-4 pb-3">
                        <p className="text-xs text-muted-foreground mb-1">Total Anual</p>
                        <p className="text-lg font-bold">{formatCurrency(totals.grandTotal)}</p>
                    </CardContent>
                </Card>
                <Card className="text-center bg-success/5 border-success/20">
                    <CardContent className="pt-4 pb-3">
                        <p className="text-xs text-muted-foreground mb-1">Pago</p>
                        <p className="text-lg font-bold text-success">{formatCurrency(totals.grandPaid)}</p>
                    </CardContent>
                </Card>
                <Card className="text-center bg-destructive/5 border-destructive/20">
                    <CardContent className="pt-4 pb-3">
                        <p className="text-xs text-muted-foreground mb-1">Pendente</p>
                        <p className="text-lg font-bold text-destructive">{formatCurrency(totals.grandPending)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Students Info */}
            <div className="flex flex-wrap gap-2">
                {students.map(student => (
                    <Badge key={student.id} variant="secondary" className="text-xs">
                        {student.name} - {formatCurrency(student.monthlyFee)}/mês
                        {student.costume?.purchased && ` + Figurino ${formatCurrency(student.costume.totalAmount)}`}
                    </Badge>
                ))}
            </div>

            <Separator />

            {/* Categories Accordion */}
            <ScrollArea className="h-[350px] pr-2">
                <div className="space-y-3">
                    {categories.map(category => (
                        <Card key={category.id} className="overflow-hidden">
                            <CardHeader
                                className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("p-2 rounded-lg", category.bgColor)}>
                                            <category.icon className={cn("h-4 w-4", category.color)} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm">{category.name}</CardTitle>
                                            <CardDescription className="text-xs">
                                                {formatCurrency(category.data.paid)} de {formatCurrency(category.data.total)}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {category.data.pending > 0 ? (
                                            <Badge variant="destructive" className="text-xs">
                                                {formatCurrency(category.data.pending)} pendente
                                            </Badge>
                                        ) : (
                                            <Badge className="text-xs bg-success hover:bg-success/90">
                                                Quitado
                                            </Badge>
                                        )}
                                        {expandedCategory === category.id ? (
                                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all",
                                            category.data.pending > 0 ? "bg-primary" : "bg-success"
                                        )}
                                        style={{
                                            width: `${Math.min(100, (category.data.paid / category.data.total) * 100 || 0)}%`
                                        }}
                                    />
                                </div>
                            </CardHeader>

                            {expandedCategory === category.id && category.months.length > 0 && (
                                <CardContent className="p-0 border-t">
                                    <div className="divide-y">
                                        {category.months.map(month => (
                                            <div
                                                key={month.month}
                                                className={cn(
                                                    "flex items-center justify-between p-3 text-sm",
                                                    month.paid ? "bg-success/5" : "bg-warning/5"
                                                )}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {month.paid ? (
                                                        <CheckCircle2 className="h-4 w-4 text-success" />
                                                    ) : (
                                                        <Clock className="h-4 w-4 text-warning" />
                                                    )}
                                                    <span className="font-medium">{month.label}</span>
                                                    <span className="text-xs text-muted-foreground">({month.month})</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "font-semibold",
                                                        month.paid ? "text-success" : "text-foreground"
                                                    )}>
                                                        {formatCurrency(month.amount)}
                                                    </span>
                                                    {!month.paid && onRegisterPayment && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-7 text-xs"
                                                            onClick={() => onRegisterPayment(category.id, month.month, month.amount)}
                                                        >
                                                            Pagar
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            )}

                            {expandedCategory === category.id && category.months.length === 0 && (
                                <CardContent className="p-4 text-center text-sm text-muted-foreground border-t">
                                    Nenhum lançamento nesta categoria.
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            </ScrollArea>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={onClose}>
                    Fechar
                </Button>
            </div>
        </div>
    );
}
