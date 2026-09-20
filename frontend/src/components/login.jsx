import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen w-full flex bg-slate-50 text-slate-900 font-sans">
      
      <div className="hidden md:flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4 px-8">
          <img 
            src="/logo.png" 
            alt="Company Logo"
            className="h-18 lg:h-22 rounded-2xl w-auto object-contain" 
          />
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-800">Buildathon</h1>
        </div>
      </div>

      <div className="hidden md:block w-px h-[80vh] my-auto bg-blue-200"></div>

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-10">
          
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-semibold tracking-tight text-slate-900">Welcome</h2>
            <p className="text-sm text-slate-500">
              Please login to Dashboard with credentials.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm text-center">
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
                  placeholder="Username"
                  className="h-12 bg-white text-slate-900 rounded-md border border-slate-300 focus-visible:ring-2 focus-visible:ring-sky-500 placeholder:text-slate-400 text-md px-4 shadow-sm"
                  required
                />
              </div>

              <div className="relative">
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="h-12 bg-white text-slate-900 rounded-md border border-slate-300 focus-visible:ring-2 focus-visible:ring-sky-500 placeholder:text-slate-400 text-md px-4 pr-12 shadow-sm"
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
                className="w-full h-12 bg-sky-500 hover:bg-sky-600 hover:cursor-pointer text-gray-50 hover:text-white rounded-md font-semibold border-0 shadow-sm transition-colors flex items-center justify-center gap-2" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>

        </div>
      </div>
      
    </div>
  );
}