import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  User, 
  CreditCard,
  Edit,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const levelColors: Record<string, string> = {
  'Baby Class': 'bg-pink-100 text-pink-700 border-pink-200',
  'Iniciante': 'bg-blue-100 text-blue-700 border-blue-200',
  'Preparatório': 'bg-purple-100 text-purple-700 border-purple-200',
  'Intermediário': 'bg-amber-100 text-amber-700 border-amber-200',
  'Avançado': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Pontas': 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStudentById, getGuardianById, branches } = useStore();
  
  const student = getStudentById(id || '');
  const guardian = student ? getGuardianById(student.guardianId) : undefined;

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-lg font-medium">Aluno não encontrado</h2>
        <Button variant="ghost" onClick={() => navigate('/alunos')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para lista
        </Button>
      </div>
    );
  }

  const branch = branches.find(b => b.id === student.branchId);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pago':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pendente':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'atrasado':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate('/alunos')} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold">{student.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge 
                      variant="outline" 
                      className={cn("font-medium", levelColors[student.level])}
                    >
                      {student.level}
                    </Badge>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{student.class}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{branch?.name}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{student.age} anos ({format(parseISO(student.birthDate), 'dd/MM/yyyy')})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>Mensalidade: {formatCurrency(student.monthlyFee)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Guardian Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Responsável Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {guardian ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{guardian.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Parentesco</p>
                  <p className="font-medium">{guardian.relationship}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{guardian.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{guardian.email}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{guardian.cpf}</p>
                </div>
                {guardian.address && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground">Endereço</p>
                    <p className="font-medium">{guardian.address}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Responsável não encontrado</p>
            )}
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Histórico de Pagamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-auto scrollbar-thin">
              {student.paymentHistory.map((payment, index) => (
                <div 
                  key={payment.id} 
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(payment.status)}
                    <div>
                      <p className="text-sm font-medium">Ref: {payment.reference}</p>
                      {payment.date && (
                        <p className="text-xs text-muted-foreground">
                          Pago em {format(parseISO(payment.date), 'dd/MM/yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(payment.amount)}</p>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        payment.status === 'pago' && "badge-success",
                        payment.status === 'pendente' && "badge-warning",
                        payment.status === 'atrasado' && "badge-destructive"
                      )}
                    >
                      {payment.status === 'pago' ? 'Pago' : 
                       payment.status === 'pendente' ? 'Pendente' : 'Atrasado'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
