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
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Reports</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>Monthly collection trends and loan statistics.</p>

      <div className="card" style={{ marginBottom: 20 }}>
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
        <div className="card"><div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Total loans issued</div><div style={{ fontSize: 24, fontWeight: 800 }}>{stats.totalLoans}</div></div>
        <div className="card"><div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Total collected</div><div style={{ fontSize: 24, fontWeight: 800 }}>{formatCurrency(stats.totalCollected)}</div></div>
        <div className="card"><div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Active loans</div><div style={{ fontSize: 24, fontWeight: 800 }}>{stats.activeLoans}</div></div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
