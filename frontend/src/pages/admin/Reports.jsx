import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import Spinner from '../../components/common/Spinner';
import { getMonthlyReport, getAdminDashboard } from '../../services/adminService';
import { formatCurrency } from '../../utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const Reports = () => {
  const [report, setReport] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMonthlyReport(), getAdminDashboard()]).then(([r, s]) => {
      setReport(r.report.reverse().map((row) => ({ name: `${MONTHS[row._id.month - 1]} ${row._id.year}`, total: row.total, count: row.count })));
      setStats(s.stats);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout isAdmin><Spinner /></DashboardLayout>;

  return (
    <DashboardLayout isAdmin>
      <h1 style={{ fontSize: 26, marginBottom: 4, animation: 'fadeInUp 0.4s ease' }}>Reports</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 24, animation: 'fadeInUp 0.4s ease 0.05s both' }}>Monthly collection trends and loan statistics.</p>

      <div className="card" style={{ marginBottom: 20, animation: 'fadeInUp 0.4s ease 0.1s both' }}>
        <h3 style={{ fontSize: 15, marginBottom: 20 }}>Monthly collections</h3>
        {report.length === 0 ? <p style={{ color: 'var(--color-text-muted)' }}>No payment data yet.</p> : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={report}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="total" fill="#1a3fc4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Total loans issued', value: stats.totalLoans },
          { label: 'Total collected', value: formatCurrency(stats.totalCollected) },
          { label: 'Active loans', value: stats.activeLoans },
        ].map((s, i) => (
          <div key={s.label} className="card" style={{ animation: 'fadeInUp 0.4s ease forwards', animationDelay: `${0.2 + i * 0.08}s`, opacity: 0 }}>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{s.value}</div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
