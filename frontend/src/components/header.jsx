import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun, Loader2 } from 'lucide-react';
import { logoutUser } from './utils/authServices'; 
import { useTheme } from './theme-provider'; 
import api from './utils/axios';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isPausing, setIsPausing] = useState(false);

  const token = Cookies.get('sdr_token');
  const isLoginPage = location.pathname === '/login';
  
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleGlobalPause = async () => {
    try {
      setIsPausing(true);
      await api.patch('/campaigns/pause-all');
      window.dispatchEvent(new Event('refreshCampaigns'));
    } catch (err) {
      console.error("Error pausing all campaigns:", err);
    } finally {
      setIsPausing(false);
    }
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

        {/* Right side controls container */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle is ALWAYS visible */}
          <Button 
            variant="outline" 
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="bg-transparent border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-9 hidden md:flex transition-colors w-24 justify-center"
          >
            {isDark ? (
              <><Sun className="w-4 h-4 mr-2" /> Light</>
            ) : (
              <><Moon className="w-4 h-4 mr-2" /> Dark</>
            )}
          </Button>
          
          {/* Global Pause and Logout ONLY visible when logged in and NOT on login page */}
          {token && !isLoginPage && (
            <>
              <Button 
                variant="destructive" 
                onClick={handleGlobalPause}
                disabled={isPausing}
                className="bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900 hover:text-white h-9"
              >
                {isPausing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                )}
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
            </>
          )}
        </div>
        
      </div>
    </header>
  );
}