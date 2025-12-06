import { useState, useMemo } from 'react';
import { Search, UserPlus, Phone, Mail, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function Guardians() {
  const navigate = useNavigate();
  const { guardians, students } = useStore();
  const [search, setSearch] = useState('');

  const filteredGuardians = useMemo(() => {
    if (!search) return guardians;
    const searchLower = search.toLowerCase();
    return guardians.filter(g => 
      g.name.toLowerCase().includes(searchLower) ||
      g.email.toLowerCase().includes(searchLower) ||
      g.cpf.includes(search)
    );
  }, [guardians, search]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const getStudentsByGuardian = (guardianId: string) => {
    return students.filter(s => s.guardianId === guardianId);
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

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email ou CPF..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Guardians Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGuardians.map((guardian) => {
          const guardianStudents = getStudentsByGuardian(guardian.id);
          
          return (
            <Card key={guardian.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(guardian.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <h3 className="font-semibold truncate">{guardian.name}</h3>
                      <p className="text-sm text-muted-foreground">{guardian.relationship}</p>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span className="truncate">{guardian.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{guardian.email}</span>
                      </div>
                    </div>

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
            Tente ajustar a busca.
          </p>
        </div>
      )}
    </div>
  );
}
