import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="card" style={{ width: 400 }}>
          <h2 style={{ fontSize: 24, marginBottom: 4 }}>Welcome back</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}>Log in to manage your loans</p>
          {error && <div style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
              <div style={{ textAlign: 'right', marginTop: 6 }}>
                <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--color-primary)' }}>Forgot password?</Link>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</button>
          </form>
          <p style={{ textAlign: 'center', fontSize: 13, marginTop: 20, color: 'var(--color-text-muted)' }}>
            New here? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Create an account</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
