import { Building2, User, Bell, Shield, Palette, Database } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
  const { branches } = useStore();
  const activeBranches = branches.filter(b => b.id !== 'all');

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
            Informações da sua conta de administrador
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" defaultValue="Administrador" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="admin@balletmanager.com" />
            </div>
          </div>
          <Button>Salvar alterações</Button>
        </CardContent>
      </Card>

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
              <p className="font-medium">Alertas de pagamento</p>
              <p className="text-sm text-muted-foreground">
                Receba notificações sobre pagamentos pendentes
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
              <p className="font-medium">06/12/2024</p>
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
