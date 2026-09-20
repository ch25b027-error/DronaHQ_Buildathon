import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginUser } from './utils/authServices';
import Header from './header';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await loginUser(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
      setUsername('');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 w-full flex flex-col transition-colors duration-200'>
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-[420px] p-8 md:p-10 shadow-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl">
          
          <div className="flex flex-col items-center text-center space-y-2 mb-8">
            <img 
              src="/logo.png" 
              alt="Logo"
              className="h-12 lg:h-13 rounded-lg w-auto object-contain mb-3" 
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">SDR Control</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Autonomous outreach, managed
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center transition-colors">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2 text-left">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-200" htmlFor="username">Email</label>
                <Input 
                  id="username"
                  name="username"
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="off"
                  className="h-11 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm transition-colors"
                  required
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-200" htmlFor="password">Password</label>
                <div className="relative">
                  <Input 
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="h-11 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-12 shadow-sm transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold shadow-sm transition-colors flex items-center justify-center gap-2" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}