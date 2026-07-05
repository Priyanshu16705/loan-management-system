import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import Spinner from '../../components/common/Spinner';
import { getMyLoans } from '../../services/loanService';
import { makePayment, getMyPayments } from '../../services/paymentService';
import { formatCurrency, formatDate } from '../../utils/format';

const Repayments = () => {
  const [activeLoans, setActiveLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ loanId: '', amountPaid: '', paymentMethod: 'upi' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const [loansRes, paymentsRes] = await Promise.all([getMyLoans(), getMyPayments()]);
    setActiveLoans(loansRes.loans.filter((l) => ['approved', 'disbursed'].includes(l.status)));
    setPayments(paymentsRes.payments);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);
    try {
      await makePayment(form);
      setMessage('Payment recorded successfully.');
      setForm({ loanId: '', amountPaid: '', paymentMethod: 'upi' });
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DashboardLayout><Spinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 style={{ fontSize: 26, marginBottom: 4, animation: 'fadeInUp 0.4s ease' }}>Repayments</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 28, animation: 'fadeInUp 0.4s ease 0.05s both' }}>Make a payment toward an active loan and track EMI dues.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24 }}>
        <div className="card" style={{ animation: 'fadeInUp 0.4s ease 0.1s both' }}>
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Make a payment</h3>
          {activeLoans.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>You have no active loans to repay yet.</p>
          ) : (
            <form onSubmit={submit}>
              {message && <div style={{ background: message.includes('success') ? 'var(--color-success-light)' : 'var(--color-danger-light)', color: message.includes('success') ? 'var(--color-success)' : 'var(--color-danger)', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{message}</div>}
              <div className="field">
                <label>Select loan</label>
                <select required value={form.loanId} onChange={(e) => setForm({ ...form, loanId: e.target.value })}>
                  <option value="">Choose a loan</option>
                  {activeLoans.map((l) => <option key={l._id} value={l._id}>{l.loanType} — EMI {formatCurrency(l.monthlyEMI)}/mo</option>)}
                </select>
              </div>
              <div className="field">
                <label>Amount (₹)</label>
                <input type="number" min={1} required value={form.amountPaid} onChange={(e) => setForm({ ...form, amountPaid: e.target.value })} />
              </div>
              <div className="field">
                <label>Payment method</label>
                <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank transfer</option>
                  <option value="cheque">Cheque</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>{submitting ? 'Processing…' : 'Submit payment'}</button>
            </form>
          )}
        </div>

        <div className="card" style={{ animation: 'slideInRight 0.4s ease 0.15s both' }}>
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Payment history</h3>
          {payments.length === 0 ? <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No payments yet.</p> : (
            <table style={{ width: '100%', fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--color-text-muted)', fontSize: 12 }}>
                  <th style={{ paddingBottom: 10 }}>Date</th><th>Loan</th><th>Method</th><th>Amount</th><th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} style={{ borderTop: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '10px 0' }}>{formatDate(p.paymentDate)}</td>
                    <td>{p.loanId?.loanType}</td>
                    <td style={{ textTransform: 'capitalize' }}>{p.paymentMethod.replace('_', ' ')}</td>
                    <td>{formatCurrency(p.amountPaid)}</td>
                    <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{p.receiptNumber}</td>
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

export default Repayments;
