import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatCard from '../../components/customer/StatCard';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import { getDashboardStats } from '../../services/userService';
import { getMyLoans } from '../../services/loanService';
import { formatCurrency, formatDate } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, l] = await Promise.all([getDashboardStats(), getMyLoans()]);
        setStats(s.stats);
        setLoans(l.loans.slice(0, 5));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <DashboardLayout><Spinner /></DashboardLayout>;

  const paidPct = stats.paidAmount + stats.remainingBalance > 0
    ? Math.round((stats.paidAmount / (stats.paidAmount + stats.remainingBalance)) * 100)
    : 0;

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 28, animation: 'fadeInUp 0.4s ease' }}>
        <h1 style={{ fontSize: 26 }}>Welcome back, {user.name?.split(' ')[0]}</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Here's what's happening with your loans today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total loans', value: stats.totalLoans, icon: '📂' },
          { label: 'Active loans', value: stats.activeLoans, icon: '✅', accent: 'var(--color-success-light)' },
          { label: 'Paid so far', value: formatCurrency(stats.paidAmount), icon: '💸', accent: 'var(--color-accent-light)' },
          { label: 'Remaining balance', value: formatCurrency(stats.remainingBalance), icon: '⏳', accent: 'var(--color-pending-light)' },
        ].map((s, i) => (
          <div key={s.label} style={{ animation: 'fadeInUp 0.4s ease forwards', animationDelay: `${i * 0.08}s`, opacity: 0 }}>
            <StatCard label={s.label} value={s.value} icon={s.icon} accent={s.accent} />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        <div className="card" style={{ animation: 'fadeInUp 0.4s ease 0.3s both' }}>
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Repayment progress</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke="var(--color-border)" strokeWidth="14" />
              <circle
                cx="80" cy="80" r="68" fill="none" stroke="var(--color-primary)" strokeWidth="14"
                strokeDasharray={`${2 * Math.PI * 68}`}
                strokeDashoffset={`${2 * Math.PI * 68 * (1 - paidPct / 100)}`}
                strokeLinecap="round" transform="rotate(-90 80 80)"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
              <text x="80" y="76" textAnchor="middle" fontSize="28" fontWeight="800" fill="var(--color-text)">{paidPct}%</text>
              <text x="80" y="98" textAnchor="middle" fontSize="12" fill="var(--color-text-muted)">repaid</text>
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Paid</span>
            <strong>{formatCurrency(stats.paidAmount)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Remaining</span>
            <strong>{formatCurrency(stats.remainingBalance)}</strong>
          </div>
        </div>

        <div className="card" style={{ animation: 'fadeInUp 0.4s ease 0.4s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16 }}>Recent loan applications</h3>
            <Link to="/my-loans" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>View all →</Link>
          </div>
          {loans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>You haven't applied for a loan yet.</p>
              <Link to="/apply-loan" className="btn btn-primary btn-sm">Apply now</Link>
            </div>
          ) : (
            <table style={{ width: '100%', fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--color-text-muted)', fontSize: 12 }}>
                  <th style={{ paddingBottom: 10 }}>Type</th>
                  <th>Amount</th>
                  <th>Applied</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((l, i) => (
                  <tr key={l._id} style={{ borderTop: '1px solid var(--color-border)', animation: 'fadeIn 0.3s ease forwards', animationDelay: `${i * 0.06}s`, opacity: 0 }}>
                    <td style={{ padding: '10px 0' }}>{l.loanType}</td>
                    <td>{formatCurrency(l.amount)}</td>
                    <td>{formatDate(l.createdAt)}</td>
                    <td><Badge status={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
