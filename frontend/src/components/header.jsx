import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun } from 'lucide-react';
import { logoutUser } from './utils/authServices'; 
import { useTheme } from './theme-provider'; 
import { Link } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const token = Cookies.get('sdr_token');
  const isLoginPage = location.pathname === '/login';
  
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="w-full bg-slate-950 sticky top-0 shadow-xl z-50 border-b border-slate-800 text-slate-100 py-3 px-6 font-sans">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
          <img src="/logo.png" alt="Buildathon Logo" className="w-8 h-8 rounded-lg" />
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-wide text-white leading-tight">SDR Control</span>
            <span className="text-[11px] text-slate-400 leading-tight">Autonomous outreach, managed</span>
          </div>
        </Link>

        {token && !isLoginPage && (
          <div className="flex items-center gap-3">
            
            <Button 
              variant="outline" 
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="bg-transparent border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-9 hidden md:flex transition-colors w-24 justify-center"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </>
              )}
            </Button>
            
            <Button variant="destructive" className="bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900 hover:text-white h-9">
              <span className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
              Global pause
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