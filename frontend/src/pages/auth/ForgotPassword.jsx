import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as authService from '../../services/authService';
import Navbar from '../../components/common/Navbar';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'fadeIn 0.3s ease' }}>
        <div className="card" style={{ width: 400, animation: 'fadeInUp 0.4s ease' }}>
          <h2 style={{ fontSize: 22, marginBottom: 4 }}>Reset your password</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}>We'll email you a reset link</p>
          {sent ? (
            <div style={{ background: 'var(--color-success-light)', color: 'var(--color-success)', padding: 14, borderRadius: 8, fontSize: 14 }}>
              If an account exists for {email}, a reset link is on its way.
            </div>
          ) : (
            <form onSubmit={submit}>
              {error && <div style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
              <div className="field">
                <label>Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</button>
            </form>
          )}
          <p style={{ textAlign: 'center', fontSize: 13, marginTop: 20, color: 'var(--color-text-muted)' }}>
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Back to login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
