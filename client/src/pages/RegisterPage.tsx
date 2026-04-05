import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../lib/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.register({ username, email, password });
      const data = await authApi.login({ username, password });
      await login(data.access_token);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">🐦‍⬛ Corvus</h1>
          <p className="text-gray-400 mt-2">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Username" value={username} onChange={setUsername} placeholder="your_username" />
          <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
          <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}