import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import { getProfile, updateProfile, changePassword } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => {
    getProfile().then((r) => setForm({ name: r.user.name, phone: r.user.phone, address: r.user.address || '' }));
  }, []);

  const submitProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await updateProfile(form);
      setMsg('Profile updated successfully.');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed');
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setPwMsg('');
    try {
      await changePassword(pwForm);
      setPwMsg('Password changed successfully.');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPwMsg(err.response?.data?.message || 'Change failed');
    }
  };

  return (
    <DashboardLayout>
      <h1 style={{ fontSize: 26, marginBottom: 24, animation: 'fadeInUp 0.4s ease' }}>Profile settings</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 800 }}>
        <form onSubmit={submitProfile} className="card" style={{ animation: 'fadeInUp 0.4s ease 0.1s both' }}>
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Personal information</h3>
          {msg && <div style={{ background: 'var(--color-success-light)', color: 'var(--color-success)', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{msg}</div>}
          <div className="field"><label>Full name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field"><label>Email</label><input value={user?.email} disabled style={{ opacity: 0.6 }} /></div>
          <div className="field"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="field"><label>Address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <button type="submit" className="btn btn-primary">Save changes</button>
        </form>

        <form onSubmit={submitPassword} className="card" style={{ animation: 'fadeInUp 0.4s ease 0.15s both' }}>
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Change password</h3>
          {pwMsg && <div style={{ background: pwMsg.includes('success') ? 'var(--color-success-light)' : 'var(--color-danger-light)', color: pwMsg.includes('success') ? 'var(--color-success)' : 'var(--color-danger)', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{pwMsg}</div>}
          <div className="field"><label>Current password</label><input type="password" required value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} /></div>
          <div className="field"><label>New password</label><input type="password" required minLength={6} value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} /></div>
          <button type="submit" className="btn btn-primary">Update password</button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
