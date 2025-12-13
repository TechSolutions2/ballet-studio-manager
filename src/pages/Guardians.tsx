import { useState, useMemo } from 'react';
import { Search, UserPlus, Phone, Mail, Users, Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, History, DollarSign, Receipt, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Guardian, Student, BalletLevel } from '@/store/mockData';
import { DebtConsultation } from '@/components/finance/DebtConsultation';

const levelClasses: Record<BalletLevel, string[]> = {
  'Baby Class': ['Baby A', 'Baby B'],
  'Iniciante': ['Iniciante I', 'Iniciante II'],
  'Preparatório': ['Prep A', 'Prep B'],
  'Intermediário': ['Inter I', 'Inter II'],
  'Avançado': ['Avançado A', 'Avançado B'],
  'Pontas': ['Pontas I', 'Pontas II'],
};

const allClasses = Object.values(levelClasses).flat();

export default function Guardians() {
  const navigate = useNavigate();
  const { guardians, students } = useStore();
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);

  // Debt consultation modal
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [debtGuardian, setDebtGuardian] = useState<Guardian | null>(null);
  const [debtStudents, setDebtStudents] = useState<Student[]>([]);

  const filteredGuardians = useMemo(() => {
    let result = guardians;

    // Filter by class first (get guardian IDs of students in selected class)
    if (selectedClass !== 'all') {
      const guardianIdsInClass = students
        .filter(s => s.class === selectedClass)
        .map(s => s.guardianId);
      result = result.filter(g => guardianIdsInClass.includes(g.id));
    }

    // Then filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(g =>
        g.name.toLowerCase().includes(searchLower) ||
        g.email.toLowerCase().includes(searchLower) ||
        g.cpf.includes(search)
      );
    }

    return result;
  }, [guardians, students, search, selectedClass]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const getStudentsByGuardian = (guardianId: string) => {
    return students.filter(s => s.guardianId === guardianId);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleOpenDebtConsultation = (guardian: Guardian) => {
    const guardianStudents = students.filter(s => s.guardianId === guardian.id);
    setDebtGuardian(guardian);
    setDebtStudents(guardianStudents);
    setIsDebtModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Responsáveis</h1>
          <p className="text-muted-foreground">
            {filteredGuardians.length} responsáveis cadastrados
          </p>
        </div>
        <Button onClick={() => navigate('/alunos')}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Aluno com Responsável
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou CPF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
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

          {selectedClass !== 'all' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setSelectedClass('all')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Guardians Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGuardians.map((guardian) => {
          const guardianStudents = getStudentsByGuardian(guardian.id);

          return (
            <Card key={guardian.id} className="hover:shadow-md transition-shadow flex flex-col">
              <CardContent className="pt-6 flex-1 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(guardian.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-semibold truncate">{guardian.name}</h3>
                    <p className="text-sm text-muted-foreground">{guardian.relationship}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span className="truncate">{guardian.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  {/* Wallet Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => handleOpenDebtConsultation(guardian)}
                  >
                    <Wallet className="h-4 w-4" />
                    Consultar Carteira
                  </Button>

                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {guardianStudents.length} aluno(s)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {guardianStudents.slice(0, 3).map(student => (
                        <Badge
                          key={student.id}
                          variant="secondary"
                          className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => navigate(`/alunos/${student.id}`)}
                        >
                          {student.name.split(' ')[0]}
                        </Badge>
                      ))}
                      {guardianStudents.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{guardianStudents.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredGuardians.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Nenhum responsável encontrado</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedClass !== 'all'
              ? `Não há responsáveis com alunos na turma ${selectedClass}.`
              : 'Tente ajustar a busca.'
            }
          </p>
          {selectedClass !== 'all' && (
            <Button
              variant="link"
              className="mt-2"
              onClick={() => setSelectedClass('all')}
            >
              Ver todos os responsáveis
            </Button>
          )}
        </div>
      )}

      {/* Debt Consultation Modal */}
      <Dialog open={isDebtModalOpen} onOpenChange={setIsDebtModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Carteira do Responsável
            </DialogTitle>
            <DialogDescription>
              {debtGuardian && (
                <><strong>{debtGuardian.name}</strong> • {debtStudents.length} aluno(s)</>
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
