import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/client';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const tokens = await login({ username, password });
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      navigate('/');
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Invoice Manager
          </h1>
          <p className="text-slate-500">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-slate-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-slate-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="bg-slate-900 text-white px-4 py-2.5 rounded-lg w-full hover:bg-slate-800 disabled:bg-slate-400 font-medium transition-colors"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 mb-2">Demo credentials:</p>
          <p className="text-xs font-mono text-slate-600 bg-slate-50 px-3 py-2 rounded border border-slate-200">
            admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
