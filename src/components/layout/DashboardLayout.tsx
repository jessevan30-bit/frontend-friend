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
  ChevronRight,
  Sun,
  Moon
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
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background flex pattern-mudcloth">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-sidebar transform transition-all duration-300 ease-bounce-in lg:transform-none shadow-xl",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo with gradient accent */}
          <div className="p-6 border-b border-sidebar-border relative overflow-hidden">
            <div className="absolute inset-0 gradient-sunset opacity-10" />
            <div className="relative flex items-center justify-between">
              <div className="animate-fade-in-left">
                <h1 className="text-2xl font-bold tracking-tight text-sidebar-foreground">{mockSalon.name}</h1>
                <p className="text-sm text-sidebar-foreground/70 mt-1">{mockSalon.address.split(',')[0]}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg group",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:translate-x-1"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className={cn(
                    "transition-transform duration-200",
                    !isActive && "group-hover:scale-110"
                  )}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto animate-fade-in-right" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-4 py-3 bg-sidebar-accent rounded-lg">
              <div className="w-10 h-10 gradient-sunset flex items-center justify-center font-bold rounded-full animate-pulse-glow">
                MD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Marie Dupont</p>
                <p className="text-xs text-sidebar-foreground/60">Administrateur</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="lg:hidden hover:scale-105 transition-transform"
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
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleDarkMode}
              className="hover:scale-105 transition-transform"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
