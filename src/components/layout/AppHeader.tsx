import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoImage from '@/assets/Untitled design (1).png';

export default function AppHeader() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b bg-card">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src={logoImage} alt="KSU GECT logo" className="h-12 w-auto object-contain py-1" />
          <div>
            <h1 className="text-lg font-heading font-bold leading-none">KEAM 2026 Mock Test</h1>
            <p className="text-xs text-muted-foreground">Kerala Engineering Entrance by KSU GECT</p>
          </div>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.email} • <span className="capitalize font-medium text-foreground">{role}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
