import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from './utils/axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send credentials to your Node Express backend
      const res = await api.post('/login', { username, password });
      
      if (res.data.token) {
        // Save the JWT in a cookie that expires in 1 day
        Cookies.set('sdr_token', res.data.token, { expires: 1 });
        // Force navigation to the protected dashboard
        navigate('/');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl shadow-xl border border-slate-700 w-96">
        <h2 className="text-xl font-bold text-slate-100 mb-6">SDR Control Plane Login</h2>
        
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
        
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 mb-4"
          placeholder="Admin Username"
          required
        />
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 mb-6"
          placeholder="Password"
          required
        />
        
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg">
          Sign In
        </button>
      </form>
    </div>
  );
}