import { useState } from 'react';
import { Terminal } from 'lucide-react';
import { getModalClasses } from '../utils/themeConfig';

import { api } from '../api';

export default function AuthScreen({ onLogin, darkMode, theme }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await api.login(username, password);
      } else {
        data = await api.register(username, password);
      }
      
      // data contains { _id, username } and the browser silently stores the HttpOnly cookie
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center font-sans ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>
      <div className={`w-full max-w-md p-8 shadow-2xl ${darkMode ? 'bg-[#1a1a2e]/80 border border-white/10' : 'bg-white border border-black/10'} rounded-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300`}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-pink-500/30">
            <Terminal className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-sm opacity-60 mt-2 text-center">Authenticate to access your secure workspace</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center font-medium animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 opacity-80">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={getModalClasses(theme).input}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 opacity-80">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={getModalClasses(theme).input}
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`mt-4 w-full h-12 rounded-lg font-bold text-white transition-all flex items-center justify-center ${isLoading ? 'bg-pink-500/50 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-500/25 active:scale-[0.98]'}`}
          >
            {isLoading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm opacity-70">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="font-bold text-pink-500 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}
