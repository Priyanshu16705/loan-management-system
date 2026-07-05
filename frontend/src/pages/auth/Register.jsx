import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'fadeIn 0.3s ease' }}>
        <div className="card" style={{ width: 440, animation: 'fadeInUp 0.4s ease' }}>
          <h2 style={{ fontSize: 24, marginBottom: 4 }}>Create your account</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}>Start your loan journey in minutes</p>
          {error && <div style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label>Full name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
            <div className="field">
              <label>Phone</label>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
            </div>
            <div className="field">
              <label>Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="City, State" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
          </form>
          <p style={{ textAlign: 'center', fontSize: 13, marginTop: 20, color: 'var(--color-text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
