import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { logoutUser } from './utils/authServices';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = Cookies.get('sdr_token');
  const isLoginPage = location.pathname === '/login';

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 text-slate-800 py-2 lg:py-3 px-6 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div className="flex items-center gap-1.5">
          <img 
            src="/logo.png" 
            alt="Company Logo" 
            className="h-8 lg:h-10 rounded-lg w-auto object-contain" 
          />
          <span className="text-xl font-bold tracking-wide text-slate-900">Buildathon</span>
        </div>

        {token && !isLoginPage && (
          <Button 
            onClick={handleLogout}
            className="bg-sky-500 hover:bg-sky-600 text-white font-medium px-4 h-10 shadow-sm transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        )}
        
      </div>
    </header>
  );
}