import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { getMyLoans } from '../../services/loanService';
import { formatCurrency, formatDate } from '../../utils/format';

const filters = ['all', 'pending', 'approved', 'disbursed', 'rejected', 'closed'];

const MyLoans = () => {
  const [loans, setLoans] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMyLoans(filter === 'all' ? undefined : filter).then((r) => setLoans(r.loans)).finally(() => setLoading(false));
  }, [filter]);

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, animation: 'fadeInUp 0.4s ease' }}>
        <div>
          <h1 style={{ fontSize: 26 }}>My loans</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Track every application you've submitted.</p>
        </div>
        <Link to="/apply-loan" className="btn btn-primary">+ New application</Link>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, animation: 'fadeInUp 0.3s ease 0.1s both' }}>
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} style={{ textTransform: 'capitalize' }}>
            {f}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : loans.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48, animation: 'fadeInUp 0.3s ease 0.2s both' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>No loans found for this filter.</p>
          <Link to="/apply-loan" className="btn btn-primary btn-sm">Apply for a loan</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {loans.map((l, i) => (
            <Link to={`/my-loans/${l._id}`} key={l._id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'fadeInUp 0.3s ease forwards', animationDelay: `${i * 0.05}s`, opacity: 0 }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{l.loanType} loan</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Applied {formatDate(l.createdAt)} · {l.tenureMonths} months</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{formatCurrency(l.amount)}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>EMI {formatCurrency(l.monthlyEMI)}/mo</div>
              </div>
              <Badge status={l.status} />
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyLoans;
