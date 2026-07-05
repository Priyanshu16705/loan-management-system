import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { getLoan } from '../../services/loanService';
import { getLoanPayments } from '../../services/paymentService';
import { formatCurrency, formatDate } from '../../utils/format';

const LoanDetail = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [docs, setDocs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const loanRes = await getLoan(id);
        setLoan(loanRes.loan);
        setDocs(loanRes.documents);
        if (['approved', 'disbursed', 'closed'].includes(loanRes.loan.status)) {
          const payRes = await getLoanPayments(id);
          setPayments(payRes.payments);
          setTotalPaid(payRes.totalPaid);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <DashboardLayout><Spinner /></DashboardLayout>;
  if (!loan) return <DashboardLayout><p>Loan not found.</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <Link to="/my-loans" style={{ fontSize: 13, color: 'var(--color-primary)', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.7'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>← Back to my loans</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0 24px', animation: 'fadeInUp 0.4s ease' }}>
        <h1 style={{ fontSize: 26 }}>{loan.loanType} loan</h1>
        <Badge status={loan.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ animation: 'fadeInUp 0.4s ease 0.1s both' }}>
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Loan details</h3>
          {[
            ['Principal amount', formatCurrency(loan.amount)],
            ['Interest rate', `${loan.interestRate}% p.a.`],
            ['Tenure', `${loan.tenureMonths} months`],
            ['Monthly EMI', formatCurrency(loan.monthlyEMI)],
            ['Total payable', formatCurrency(loan.totalAmount)],
            ['Applied on', formatDate(loan.createdAt)],
          ].map(([label, val], i) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)', fontSize: 14, animation: 'fadeIn 0.3s ease forwards', animationDelay: `${0.2 + i * 0.05}s`, opacity: 0 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>{label}</span><strong>{val}</strong>
            </div>
          ))}
          {loan.remarks && (
            <div style={{ marginTop: 16, padding: 12, background: 'var(--color-bg)', borderRadius: 8, fontSize: 13 }}>
              <strong>Admin remarks:</strong> {loan.remarks}
            </div>
          )}
        </div>

        <div className="card" style={{ animation: 'fadeInUp 0.4s ease 0.15s both' }}>
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Uploaded documents</h3>
          {docs.length === 0 ? <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No documents uploaded.</p> : (
            <div style={{ display: 'grid', gap: 8 }}>
              {docs.map((d) => (
                <a key={d._id} href={`http://localhost:5000${d.fileUrl}`} target="_blank" rel="noreferrer" style={{ display: 'flex', justifyContent: 'space-between', padding: 10, border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 13 }}>
                  <span style={{ textTransform: 'capitalize' }}>{d.documentType.replace('_', ' ')}</span>
                  <span style={{ color: 'var(--color-primary)' }}>View →</span>
                </a>
              ))}
            </div>
          )}

          {['approved', 'disbursed', 'closed'].includes(loan.status) && (
            <>
              <h3 style={{ fontSize: 15, margin: '24px 0 12px' }}>Payment history</h3>
              <div style={{ fontSize: 13, marginBottom: 12, color: 'var(--color-text-muted)' }}>
                Paid {formatCurrency(totalPaid)} of {formatCurrency(loan.totalAmount)}
              </div>
              {payments.length === 0 ? <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No payments made yet.</p> : (
                <div style={{ display: 'grid', gap: 6 }}>
                  {payments.map((p) => (
                    <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                      <span>{formatDate(p.paymentDate)}</span>
                      <span style={{ textTransform: 'capitalize' }}>{p.paymentMethod.replace('_', ' ')}</span>
                      <strong>{formatCurrency(p.amountPaid)}</strong>
                    </div>
                  ))}
                </div>
              )}
              {loan.status !== 'closed' && (
                <Link to="/repayments" className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>Make a payment</Link>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LoanDetail;
