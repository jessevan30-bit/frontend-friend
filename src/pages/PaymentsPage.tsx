import { useState } from 'react';
import { CreditCard, Banknote, Smartphone, TrendingUp, Search, Filter, Receipt, Wallet } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockPayments, mockDashboardStats } from '@/data/mockData';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { PaymentMethod, PaymentStatus } from '@/types';
import { cn } from '@/lib/utils';

const methodConfig: Record<PaymentMethod, { label: string; icon: React.ReactNode }> = {
  cash: { label: 'Espèces', icon: <Banknote className="w-4 h-4" /> },
  card: { label: 'Carte', icon: <CreditCard className="w-4 h-4" /> },
  mobile: { label: 'Mobile', icon: <Smartphone className="w-4 h-4" /> },
  online: { label: 'En ligne', icon: <Wallet className="w-4 h-4" /> },
  airtel_money: { label: 'Airtel Money', icon: <Smartphone className="w-4 h-4" /> },
  cash_on_arrival: { label: 'À l\'arrivée', icon: <CreditCard className="w-4 h-4" /> },
};

const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  pending: { label: 'En attente', className: 'bg-secondary text-secondary-foreground' },
  completed: { label: 'Complété', className: 'bg-primary/10 text-primary' },
  refunded: { label: 'Remboursé', className: 'bg-destructive/10 text-destructive' },
};

export default function PaymentsPage() {
  const { getClientById } = useAppointments();
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
        <div className="animate-fade-in-left">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Receipt className="w-6 h-6 text-primary" />
            </div>
            Caisse & Paiements
          </h1>
          <p className="text-muted-foreground mt-1">Suivi des encaissements et revenus</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Aujourd'hui", value: mockDashboardStats.todayRevenue, icon: Banknote, delay: 0 },
            { label: "Cette semaine", value: mockDashboardStats.weeklyRevenue, icon: TrendingUp, delay: 50 },
            { label: "Ce mois", value: mockDashboardStats.monthlyRevenue.toLocaleString(), icon: Banknote, delay: 100 },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up"
              style={{ animationDelay: `${stat.delay}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary rounded-lg group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value} FCFA</p>
                </div>
              </div>
            </div>
          ))}
          
          <div 
            className="gradient-sunset text-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: '150ms' }}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm opacity-80">Total filtré</p>
                <p className="text-2xl font-bold">{totalRevenue} FCFA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Rechercher par client..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl border-border focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedMethod === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMethod('all')}
              className="transition-all duration-200 hover:scale-105"
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
                className="gap-2 transition-all duration-200 hover:scale-105"
              >
                {config.icon}
                {config.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Payments table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm animate-fade-in-up">
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
                      className="border-t border-border hover:bg-accent/50 transition-all duration-200 group animate-fade-in"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="p-4 font-mono text-sm">
                        {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 gradient-sunset flex items-center justify-center text-xs font-bold rounded-full group-hover:shadow-glow transition-shadow">
                            {client ? `${client.firstName[0]}${client.lastName[0]}` : '??'}
                          </div>
                          <span className="font-medium group-hover:text-primary transition-colors">
                            {client ? `${client.firstName} ${client.lastName}` : 'Client inconnu'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                          {method.icon}
                          <span>{method.label}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn("px-3 py-1 text-xs font-medium rounded-full", status.className)}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold font-mono text-lg text-primary">
                        {payment.amount} FCFA
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                <Receipt className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Aucun paiement trouvé</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
