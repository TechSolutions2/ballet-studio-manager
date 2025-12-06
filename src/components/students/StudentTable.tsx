import { format, parseISO } from 'date-fns';
import { Eye, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Student } from '@/store/mockData';
import { useStore } from '@/store/useStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface StudentTableProps {
  students: Student[];
}

const levelColors: Record<string, string> = {
  'Baby Class': 'bg-pink-100 text-pink-700 border-pink-200',
  'Iniciante': 'bg-blue-100 text-blue-700 border-blue-200',
  'Preparatório': 'bg-purple-100 text-purple-700 border-purple-200',
  'Intermediário': 'bg-amber-100 text-amber-700 border-amber-200',
  'Avançado': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Pontas': 'bg-rose-100 text-rose-700 border-rose-200',
};

const statusLabels: Record<string, { label: string; className: string }> = {
  'em_dia': { label: 'Em dia', className: 'badge-success' },
  'pendente': { label: 'Pendente', className: 'badge-warning' },
  'atrasado': { label: 'Atrasado', className: 'badge-destructive' },
};

export function StudentTable({ students }: StudentTableProps) {
  const navigate = useNavigate();
  const { getGuardianById } = useStore();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Aluno
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Nível / Turma
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                Idade
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                Responsável
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pagamento
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((student) => {
              const guardian = getGuardianById(student.guardianId);
              
              return (
                <tr 
                  key={student.id} 
                  className="table-row-hover cursor-pointer"
                  onClick={() => navigate(`/alunos/${student.id}`)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {getInitials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs font-medium", levelColors[student.level])}
                      >
                        {student.level}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{student.class}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm">{student.age} anos</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div>
                      <p className="text-sm">{guardian?.name || '-'}</p>
                      <p className="text-xs text-muted-foreground">{guardian?.relationship || ''}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge 
                      variant="outline"
                      className={cn("text-xs font-medium border", statusLabels[student.paymentStatus].className)}
                    >
                      {statusLabels[student.paymentStatus].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/alunos/${student.id}`);
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Mail className="h-4 w-4 mr-2" />
                          Enviar email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Phone className="h-4 w-4 mr-2" />
                          Ligar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
