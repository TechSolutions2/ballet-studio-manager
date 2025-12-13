import { useState } from 'react';
import { Building2, User, Bell, Shield, Palette, Database, UserPlus, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  createdAt: string;
}

// Mock users storage - in a real app this would be in a database
const initialMockUsers: MockUser[] = [
  { id: '1', name: 'Admin Principal', email: 'admin@ballet.com', role: 'admin', createdAt: '2024-01-01' },
  { id: '2', name: 'Funcionário Balcão', email: 'balcao@ballet.com', role: 'employee', createdAt: '2024-06-15' },
];

export default function Settings() {
  const { branches } = useStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const activeBranches = branches.filter(b => b.id !== 'all');

  const [mockUsers, setMockUsers] = useState<MockUser[]>(initialMockUsers);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee' as 'admin' | 'employee',
  });

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    if (mockUsers.some(u => u.email === newUser.email)) {
      toast({
        title: 'Erro',
        description: 'Este email já está cadastrado.',
        variant: 'destructive',
      });
      return;
    }

    const createdUser: MockUser = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setMockUsers([...mockUsers, createdUser]);
    setNewUser({ name: '', email: '', password: '', role: 'employee' });
    setIsCreateDialogOpen(false);

    toast({
      title: 'Usuário criado!',
      description: `${createdUser.name} foi adicionado com sucesso.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = mockUsers.find(u => u.id === userId);
    if (userToDelete?.email === user?.email) {
      toast({
        title: 'Erro',
        description: 'Você não pode excluir sua própria conta.',
        variant: 'destructive',
      });
      return;
    }

    setMockUsers(mockUsers.filter(u => u.id !== userId));
    toast({
      title: 'Usuário excluído',
      description: 'O acesso foi removido com sucesso.',
    });
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Perfil do Usuário</CardTitle>
          </div>
          <CardDescription>
            Informações da sua conta de {user?.role === 'admin' ? 'administrador' : 'funcionário'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" defaultValue={user?.name || 'Usuário'} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email || ''} />
            </div>
          </div>
          <Button>Salvar alterações</Button>
        </CardContent>
      </Card>

      {/* User Management Section - Only for Admins */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Gerenciar Acessos</CardTitle>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Novo Acesso
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Acesso</DialogTitle>
                    <DialogDescription>
                      Adicione um novo usuário ao sistema. Ele receberá as credenciais por email.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-name">Nome *</Label>
                      <Input
                        id="new-name"
                        placeholder="Nome completo"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-email">Email *</Label>
                      <Input
                        id="new-email"
                        type="email"
                        placeholder="email@exemplo.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Senha Temporária *</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-role">Tipo de Acesso</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value: 'admin' | 'employee') => setNewUser({ ...newUser, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Funcionário (Acesso Limitado)</SelectItem>
                          <SelectItem value="admin">Administrador (Acesso Total)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateUser}>
                      Criar Acesso
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription>
              Gerencie os usuários que têm acesso ao sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUsers.map((mockUser) => (
                <div
                  key={mockUser.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{mockUser.name}</p>
                      <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${mockUser.role === 'admin'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                      }`}>
                      {mockUser.role === 'admin' ? 'Admin' : 'Funcionário'}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteUser(mockUser.id)}
                      disabled={mockUser.email === user?.email}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Branches Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Unidades</CardTitle>
          </div>
          <CardDescription>
            Gerencie as filiais da sua escola
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeBranches.map((branch) => (
              <div
                key={branch.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border"
              >
                <div>
                  <p className="font-medium">{branch.name}</p>
                  <p className="text-sm text-muted-foreground">{branch.address}</p>
                  <p className="text-sm text-muted-foreground">{branch.phone}</p>
                </div>
                <Button variant="outline" size="sm">Editar</Button>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Building2 className="h-4 w-4 mr-2" />
              Adicionar Unidade
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Notificações</CardTitle>
          </div>
          <CardDescription>
            Configure suas preferências de notificação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificações de pagamento</p>
              <p className="text-sm text-muted-foreground">
                Receba notificações sobre pagamentos pendentes e recebidos
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Resumo semanal</p>
              <p className="text-sm text-muted-foreground">
                Receba um resumo financeiro toda semana
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Novos alunos</p>
              <p className="text-sm text-muted-foreground">
                Seja notificado quando houver novas matrículas
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Sistema</CardTitle>
          </div>
          <CardDescription>
            Informações sobre o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Versão</p>
              <p className="font-medium">BalletManager v1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ambiente</p>
              <p className="font-medium">Produção (Mock)</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Última atualização</p>
              <p className="font-medium">13/12/2025</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Suporte</p>
              <p className="font-medium">suporte@balletmanager.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
