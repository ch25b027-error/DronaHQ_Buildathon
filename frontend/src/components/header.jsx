import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";
import { LogOut, Moon } from 'lucide-react';
import { logoutUser } from './utils/authServices'; // Adjust path if needed

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
    <header className="w-full bg-[#0B1519] border-b border-slate-800 text-slate-100 py-3 px-6 font-sans">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-sky-500 rounded text-white flex items-center justify-center font-bold text-lg">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-wide text-white leading-tight">SDR Control</span>
            <span className="text-[11px] text-slate-400 leading-tight">Autonomous outreach, managed</span>
          </div>
        </div>

        {/* Right: Controls */}
        {token && !isLoginPage && (
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-transparent border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-9 hidden md:flex">
              <Moon className="w-4 h-4 mr-2" />
              Dark
            </Button>
            
            <Button variant="destructive" className="bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900 hover:text-white h-9">
              <span className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
              Stop all autonomous activity
            </Button>

            <div className="w-px h-6 bg-slate-700 mx-1"></div>

            <Button 
              onClick={handleLogout}
              className="bg-sky-500 hover:bg-sky-600 text-white font-medium px-4 h-9 shadow-sm transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        )}
        
      </div>
    </header>
  );
}