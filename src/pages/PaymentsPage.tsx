import { useState } from 'react';
import { Euro, CreditCard, Banknote, Smartphone, TrendingUp, Search, Filter } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockPayments, mockDashboardStats, getClientById } from '@/data/mockData';
import { PaymentMethod, PaymentStatus } from '@/types';
import { cn } from '@/lib/utils';

const methodConfig: Record<PaymentMethod, { label: string; icon: React.ReactNode }> = {
  cash: { label: 'Espèces', icon: <Banknote className="w-4 h-4" /> },
  card: { label: 'Carte', icon: <CreditCard className="w-4 h-4" /> },
  mobile: { label: 'Mobile', icon: <Smartphone className="w-4 h-4" /> },
  online: { label: 'En ligne', icon: <Euro className="w-4 h-4" /> },
};

const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  pending: { label: 'En attente', className: 'bg-secondary text-secondary-foreground' },
  completed: { label: 'Complété', className: 'bg-primary text-primary-foreground' },
  refunded: { label: 'Remboursé', className: 'bg-destructive text-destructive-foreground' },
};

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');

  const filteredPayments = mockPayments.filter(payment => {
    const client = getClientById(payment.clientId);
    const matchesSearch = client 
      ? `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
    const matchesMethod = selectedMethod === 'all' || payment.method === selectedMethod;
    return (searchQuery === '' || matchesSearch) && matchesMethod;
  });

  const totalRevenue = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Caisse & Paiements</h1>
          <p className="text-muted-foreground">Suivi des encaissements et revenus</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border-2 border-border p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary">
                <Euro className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                <p className="text-2xl font-bold">{mockDashboardStats.todayRevenue}€</p>
              </div>
            </div>
          </div>
          <div className="bg-card border-2 border-border p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cette semaine</p>
                <p className="text-2xl font-bold">{mockDashboardStats.weeklyRevenue}€</p>
              </div>
            </div>
          </div>
          <div className="bg-card border-2 border-border p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary">
                <Euro className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ce mois</p>
                <p className="text-2xl font-bold">{mockDashboardStats.monthlyRevenue.toLocaleString()}€</p>
              </div>
            </div>
          </div>
          <div className="bg-primary text-primary-foreground border-2 border-border p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-foreground/20">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm opacity-80">Total filtré</p>
                <p className="text-2xl font-bold">{totalRevenue}€</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Rechercher par client..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedMethod === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMethod('all')}
            >
              <Filter className="w-4 h-4 mr-2" />
              Tous
            </Button>
            {Object.entries(methodConfig).map(([method, config]) => (
              <Button 
                key={method}
                variant={selectedMethod === method ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMethod(method)}
                className="gap-2"
              >
                {config.icon}
                {config.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Payments table */}
        <div className="bg-card border-2 border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 font-medium text-sm uppercase tracking-wide">Date</th>
                  <th className="text-left p-4 font-medium text-sm uppercase tracking-wide">Client</th>
                  <th className="text-left p-4 font-medium text-sm uppercase tracking-wide">Méthode</th>
                  <th className="text-left p-4 font-medium text-sm uppercase tracking-wide">Statut</th>
                  <th className="text-right p-4 font-medium text-sm uppercase tracking-wide">Montant</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, index) => {
                  const client = getClientById(payment.clientId);
                  const method = methodConfig[payment.method];
                  const status = statusConfig[payment.status];
                  
                  return (
                    <tr 
                      key={payment.id}
                      className={cn(
                        "border-t border-border hover:bg-accent/50 transition-colors",
                        index % 2 === 0 && "bg-secondary/30"
                      )}
                    >
                      <td className="p-4 font-mono text-sm">
                        {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            {client ? `${client.firstName[0]}${client.lastName[0]}` : '??'}
                          </div>
                          <span className="font-medium">
                            {client ? `${client.firstName} ${client.lastName}` : 'Client inconnu'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {method.icon}
                          <span>{method.label}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn("px-2 py-1 text-xs font-medium", status.className)}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold font-mono">
                        {payment.amount}€
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              Aucun paiement trouvé
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
