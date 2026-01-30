import { useState } from 'react';
import { Search, Plus, Phone, Mail, Calendar, MoreHorizontal } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockClients } from '@/data/mockData';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredClients = mockClients.filter(client => 
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Clients</h1>
            <p className="text-muted-foreground">{mockClients.length} clients enregistrés</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nouveau client
              </Button>
            </DialogTrigger>
            <DialogContent className="border-2 border-border">
              <DialogHeader>
                <DialogTitle>Ajouter un client</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" placeholder="Prénom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" placeholder="Nom" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" placeholder="+33 6 XX XX XX XX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Input id="notes" placeholder="Préférences, allergies..." />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un client..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Client list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map(client => (
            <div 
              key={client.id}
              className="bg-card border-2 border-border p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {client.firstName[0]}{client.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold">{client.firstName} {client.lastName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Client depuis {new Date(client.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{client.phone}</span>
                </div>
                {client.lastVisit && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Dernière visite: {new Date(client.lastVisit).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Voir profil
                </Button>
                <Button size="sm" className="flex-1">
                  Nouveau RDV
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12 bg-card border-2 border-border">
            <p className="text-muted-foreground">Aucun client trouvé</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
