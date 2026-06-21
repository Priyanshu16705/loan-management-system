import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatCard from '../../components/customer/StatCard';
import Spinner from '../../components/common/Spinner';
import { getAdminDashboard, getAllLoans } from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/format';
import Badge from '../../components/common/Badge';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentLoans, setRecentLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, l] = await Promise.all([getAdminDashboard(), getAllLoans({ limit: 6 })]);
      setStats(s.stats);
      setRecentLoans(l.loans);
      setLoading(false);
    })();
  }, []);

  if (loading) return <DashboardLayout isAdmin><Spinner /></DashboardLayout>;

  return (
    <DashboardLayout isAdmin>
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Admin dashboard</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 28 }}>Overview of all customers, loans, and payments.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total customers" value={stats.totalUsers} icon="👥" />
        <StatCard label="Total loans" value={stats.totalLoans} icon="📂" />
        <StatCard label="Pending review" value={stats.pendingLoans} icon="⏳" accent="var(--color-pending-light)" />
        <StatCard label="Active loans" value={stats.activeLoans} icon="✅" accent="var(--color-success-light)" />
        <StatCard label="Total collected" value={formatCurrency(stats.totalCollected)} icon="💰" accent="var(--color-accent-light)" />
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16 }}>Recent loan applications</h3>
          <Link to="/admin/loans" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>View all →</Link>
        </div>
        <table style={{ width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--color-text-muted)', fontSize: 12 }}>
              <th style={{ paddingBottom: 10 }}>Customer</th><th>Type</th><th>Amount</th><th>Applied</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentLoans.map((l) => (
              <tr key={l._id} style={{ borderTop: '1px solid var(--color-border)' }}>
                <td style={{ padding: '10px 0' }}>{l.userId?.name}</td>
                <td>{l.loanType}</td>
                <td>{formatCurrency(l.amount)}</td>
                <td>{formatDate(l.createdAt)}</td>
                <td><Badge status={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
