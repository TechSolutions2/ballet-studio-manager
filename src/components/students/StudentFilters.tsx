import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface StudentFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  levelFilter: string;
  onLevelChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

const levels = [
  { value: 'all', label: 'Todos os níveis' },
  { value: 'Baby Class', label: 'Baby Class' },
  { value: 'Iniciante', label: 'Iniciante' },
  { value: 'Preparatório', label: 'Preparatório' },
  { value: 'Intermediário', label: 'Intermediário' },
  { value: 'Avançado', label: 'Avançado' },
  { value: 'Pontas', label: 'Pontas' },
];

const statuses = [
  { value: 'all', label: 'Todos os status' },
  { value: 'em_dia', label: 'Em dia' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'atrasado', label: 'Atrasado' },
];

export function StudentFilters({
  search,
  onSearchChange,
  levelFilter,
  onLevelChange,
  statusFilter,
  onStatusChange,
  onClearFilters,
}: StudentFiltersProps) {
  const hasFilters = search || levelFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar aluno..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 input-focus"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={levelFilter} onValueChange={onLevelChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          <div className="flex flex-wrap gap-2">
            {search && (
              <Badge variant="secondary" className="gap-1">
                Busca: {search}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onSearchChange('')}
                />
              </Badge>
            )}
            {levelFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {levelFilter}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onLevelChange('all')}
                />
              </Badge>
            )}
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {statuses.find(s => s.value === statusFilter)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onStatusChange('all')}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-6 text-xs text-muted-foreground hover:text-foreground"
            >
              Limpar todos
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
