import { useState, useMemo } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { StudentTable } from '@/components/students/StudentTable';
import { StudentFilters } from '@/components/students/StudentFilters';
import { Button } from '@/components/ui/button';

export default function Students() {
  const { getFilteredStudents, selectedBranchId, branches } = useStore();
  const allStudents = getFilteredStudents();

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesName = student.name.toLowerCase().includes(searchLower);
        const matchesEmail = student.email.toLowerCase().includes(searchLower);
        const matchesGuardian = student.guardian.name.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesEmail && !matchesGuardian) return false;
      }

      // Level filter
      if (levelFilter !== 'all' && student.level !== levelFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && student.paymentStatus !== statusFilter) return false;

      // Only active students by default
      if (student.status !== 'ativo') return false;

      return true;
    });
  }, [allStudents, search, levelFilter, statusFilter]);

  const handleClearFilters = () => {
    setSearch('');
    setLevelFilter('all');
    setStatusFilter('all');
  };

  const selectedBranch = branches.find(b => b.id === selectedBranchId);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Alunos</h1>
          <p className="text-muted-foreground">
            {filteredStudents.length} alunos 
            {selectedBranchId !== 'all' && ` na ${selectedBranch?.name}`}
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Aluno
        </Button>
      </div>

      {/* Filters */}
      <StudentFilters
        search={search}
        onSearchChange={setSearch}
        levelFilter={levelFilter}
        onLevelChange={setLevelFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Table */}
      {filteredStudents.length > 0 ? (
        <StudentTable students={filteredStudents} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Nenhum aluno encontrado</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tente ajustar os filtros ou adicione um novo aluno.
          </p>
        </div>
      )}
    </div>
  );
}
