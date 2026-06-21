import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as authService from '../../services/authService';
import Navbar from '../../components/common/Navbar';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="card" style={{ width: 400 }}>
          <h2 style={{ fontSize: 22, marginBottom: 4 }}>Set a new password</h2>
          {success ? (
            <div style={{ background: 'var(--color-success-light)', color: 'var(--color-success)', padding: 14, borderRadius: 8, fontSize: 14, marginTop: 16 }}>
              Password updated. Redirecting to login…
            </div>
          ) : (
            <form onSubmit={submit} style={{ marginTop: 20 }}>
              {error && <div style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
              <div className="field">
                <label>New password</label>
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Updating…' : 'Update password'}</button>
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

export default ResetPassword;
