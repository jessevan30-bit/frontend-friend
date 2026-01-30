import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'coiffeur' | 'receptionniste';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utilisateurs mock pour la démo
const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@salon-mireille.ga',
    firstName: 'Marie',
    lastName: 'Dupont',
    role: 'admin',
  },
  {
    id: 'user-2',
    email: 'lucas@salon-mireille.ga',
    firstName: 'Lucas',
    lastName: 'Martin',
    role: 'coiffeur',
  },
  {
    id: 'user-3',
    email: 'sophie@salon-mireille.ga',
    firstName: 'Sophie',
    lastName: 'Bernard',
    role: 'coiffeur',
  },
];

// Mot de passe par défaut pour tous les utilisateurs (en production, utiliser un vrai système d'auth)
const DEFAULT_PASSWORD = 'admin123';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulation d'un délai de connexion
    await new Promise(resolve => setTimeout(resolve, 800));

    // Vérifier les identifiants
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === DEFAULT_PASSWORD) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

