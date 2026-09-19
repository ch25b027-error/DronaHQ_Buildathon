import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from 'lucide-react';
import { loginUser } from './utils/authServices';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0B1519] text-slate-100 font-sans">
      
      <div className="hidden md:flex flex-1 items-center justify-center ">
        <div className="flex flex-wrap items-center gap-4 px-8">
          <img 
            src="/logo.png" 
            alt="Company Logo" 
            className="h-24 w-auto object-contain" 
          />
          <h1 className="text-3xl font-medium tracking-wide">SDR Control</h1>
        </div>
      </div>

      <div className="hidden md:block w-px h-[75vh] my-auto bg-slate-600/50"></div>

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-10">
          
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-light tracking-wide text-white">Welcome</h2>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-300">
              Please login to Dashboard with credentials.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-950/50 border border-red-900 text-red-400 p-3 rounded text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Input 
                  id="username"
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="USERNAME"
                  className="h-12 bg-white text-slate-900 rounded-sm border-0 focus-visible:ring-2 focus-visible:ring-orange-500 placeholder:text-slate-400 placeholder:tracking-wider text-sm tracking-wider px-4 shadow-none"
                  required
                />
              </div>

              <div className="relative">
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="PASSWORD"
                  className="h-12 bg-white text-slate-900 rounded-sm border-0 focus-visible:ring-2 focus-visible:ring-orange-500 placeholder:text-slate-400 placeholder:tracking-wider text-sm tracking-wider px-4 pr-12 shadow-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full h-12 bg-[#F26B22] hover:bg-[#D95B1A] text-white rounded-sm uppercase tracking-wider font-semibold border-0 transition-colors" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>

        </div>
      </div>
      
    </div>
  );
}