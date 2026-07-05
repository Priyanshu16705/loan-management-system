import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { getAllLoans, approveLoan, rejectLoan } from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/format';

const filters = ['all', 'pending', 'approved', 'disbursed', 'rejected', 'closed'];

const LoanApplications = () => {
  const [loans, setLoans] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [activeLoan, setActiveLoan] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState(null);

  const load = async () => {
    setLoading(true);
    const res = await getAllLoans({ status: filter === 'all' ? undefined : filter });
    setLoans(res.loans);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const openAction = (loan, type) => { setActiveLoan(loan); setActionType(type); setRemarks(''); };

  const confirmAction = async () => {
    if (actionType === 'approve') await approveLoan(activeLoan._id, remarks);
    else await rejectLoan(activeLoan._id, remarks);
    setActiveLoan(null);
    load();
  };

  return (
    <DashboardLayout isAdmin>
      <h1 style={{ fontSize: 26, marginBottom: 4, animation: 'fadeInUp 0.4s ease' }}>Loan applications</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 20, animation: 'fadeInUp 0.4s ease 0.05s both' }}>Review, approve, or reject customer applications.</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, animation: 'fadeInUp 0.3s ease 0.1s both' }}>
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} style={{ textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <div style={{ display: 'grid', gap: 12 }}>
          {loans.length === 0 && <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)', animation: 'fadeInUp 0.3s ease 0.15s both' }}>No applications in this category.</div>}
          {loans.map((l, i) => (
            <div key={l._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, animation: 'fadeInUp 0.3s ease forwards', animationDelay: `${i * 0.04}s`, opacity: 0 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{l.userId?.name} <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: 13 }}>· {l.userId?.email}</span></div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{l.loanType} loan · {formatCurrency(l.amount)} · {l.tenureMonths} months · Applied {formatDate(l.createdAt)}</div>
              </div>
              <Badge status={l.status} />
              {l.status === 'pending' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-success btn-sm" onClick={() => openAction(l, 'approve')}>Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => openAction(l, 'reject')}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeLoan && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, animation: 'fadeIn 0.15s ease' }}>
          <div className="card" style={{ width: 420, animation: 'fadeInScale 0.2s ease' }}>
            <h3 style={{ fontSize: 17, marginBottom: 8 }}>{actionType === 'approve' ? 'Approve' : 'Reject'} loan application</h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>{activeLoan.userId?.name} — {formatCurrency(activeLoan.amount)} {activeLoan.loanType} loan</p>
            <div className="field">
              <label>Remarks {actionType === 'reject' && '(reason for rejection)'}</label>
              <textarea rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add a note for the customer" />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline btn-block" onClick={() => setActiveLoan(null)}>Cancel</button>
              <button className={`btn btn-block ${actionType === 'approve' ? 'btn-success' : 'btn-danger'}`} onClick={confirmAction}>
                Confirm {actionType === 'approve' ? 'approval' : 'rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LoanApplications;
