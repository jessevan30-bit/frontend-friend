import { createContext, useContext, ReactNode } from 'react';
import { Salon } from '@/types';
import { mockSalon } from '@/data/mockData';
import { useAdmin } from './AdminContext';

interface TenantContextType {
  salon: Salon;
  isPublic: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
  salon?: Salon;
  isPublic?: boolean;
}

export function TenantProvider({ 
  children, 
  salon: providedSalon,
  isPublic = false 
}: TenantProviderProps) {
  // Si on est en mode admin et qu'un tenant est sélectionné, utiliser ce tenant
  let adminContext;
  try {
    adminContext = useAdmin();
  } catch {
    // Si AdminContext n'est pas disponible, on ignore
    adminContext = null;
  }

  const salon = adminContext?.selectedTenant || providedSalon || mockSalon;

  return (
    <TenantContext.Provider value={{ salon, isPublic }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

