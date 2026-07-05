import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import Spinner from '../../components/common/Spinner';
import { getAllPayments } from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/format';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getAllPayments().then((r) => setPayments(r.payments)).finally(() => setLoading(false)); }, []);

  return (
    <DashboardLayout isAdmin>
      <h1 style={{ fontSize: 26, marginBottom: 4, animation: 'fadeInUp 0.4s ease' }}>Payments</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 24, animation: 'fadeInUp 0.4s ease 0.05s both' }}>All repayments received from customers.</p>

      {loading ? <Spinner /> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', animation: 'fadeInUp 0.4s ease 0.1s both' }}>
          <table style={{ width: '100%', fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--color-text-muted)', fontSize: 12, background: 'var(--color-bg)' }}>
                <th style={{ padding: '14px 20px' }}>Customer</th><th>Loan</th><th>Amount</th><th>Method</th><th>Date</th><th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={p._id} style={{ borderTop: '1px solid var(--color-border)', animation: 'fadeIn 0.3s ease forwards', animationDelay: `${i * 0.03}s`, opacity: 0 }}>
                  <td style={{ padding: '14px 20px' }}>{p.userId?.name}</td>
                  <td>{p.loanId?.loanType}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(p.amountPaid)}</td>
                  <td style={{ textTransform: 'capitalize' }}>{p.paymentMethod.replace('_', ' ')}</td>
                  <td>{formatDate(p.paymentDate)}</td>
                  <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{p.receiptNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Payments;
