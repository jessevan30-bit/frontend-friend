import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  UserCircle,
  CreditCard,
  Settings,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { mockSalon } from '@/data/mockData';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Tableau de bord', href: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Rendez-vous', href: '/appointments', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Clients', href: '/clients', icon: <Users className="w-5 h-5" /> },
  { label: 'Services', href: '/services', icon: <Scissors className="w-5 h-5" /> },
  { label: 'Employés', href: '/employees', icon: <UserCircle className="w-5 h-5" /> },
  { label: 'Caisse', href: '/payments', icon: <CreditCard className="w-5 h-5" /> },
  { label: 'Paramètres', href: '/settings', icon: <Settings className="w-5 h-5" /> },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card border-r-2 border-border transform transition-transform duration-200 ease-in-out lg:transform-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{mockSalon.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{mockSalon.address.split(',')[0]}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all border-2",
                    isActive 
                      ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                      : "bg-transparent text-foreground border-transparent hover:bg-accent hover:border-border"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t-2 border-border">
            <div className="flex items-center gap-3 px-4 py-3 bg-secondary">
              <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-bold">
                MD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Marie Dupont</p>
                <p className="text-xs text-muted-foreground">Administrateur</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background border-b-2 border-border px-4 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
