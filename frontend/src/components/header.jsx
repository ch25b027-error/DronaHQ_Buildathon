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
    <header className="w-full bg-[#0e191e] border-b border-slate-800 text-slate-100 py-4 px-6 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Company Logo" 
            className="h-8 lg:h-10 w-auto object-contain" 
          />
          <span className="text-xl font-medium tracking-wide text-white">SDR Control</span>
        </div>

        {token && !isLoginPage && (
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        )}
        
      </div>
    </header>
  );
}