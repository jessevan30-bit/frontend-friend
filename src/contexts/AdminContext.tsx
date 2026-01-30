import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Salon } from '@/types';

interface AdminContextType {
  selectedTenant: Salon | null;
  isViewingTenant: boolean;
  selectTenant: (tenant: Salon) => void;
  clearTenantSelection: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  // Charger le tenant sélectionné au démarrage
  const [selectedTenant, setSelectedTenant] = useState<Salon | null>(() => {
    const saved = localStorage.getItem('admin_selected_tenant');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Erreur lors du chargement du tenant:', error);
        localStorage.removeItem('admin_selected_tenant');
        return null;
      }
    }
    return null;
  });

  const selectTenant = useCallback((tenant: Salon) => {
    setSelectedTenant(tenant);
    // Sauvegarder dans localStorage pour persister la sélection
    localStorage.setItem('admin_selected_tenant', JSON.stringify(tenant));
  }, []);

  const clearTenantSelection = useCallback(() => {
    setSelectedTenant(null);
    localStorage.removeItem('admin_selected_tenant');
  }, []);

  return (
    <AdminContext.Provider
      value={{
        selectedTenant,
        isViewingTenant: !!selectedTenant,
        selectTenant,
        clearTenantSelection,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

