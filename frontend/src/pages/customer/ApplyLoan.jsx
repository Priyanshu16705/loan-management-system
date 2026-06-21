import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import { applyLoan, calculateEMI } from '../../services/loanService';
import { formatCurrency } from '../../utils/format';

const RATES = { Personal: 12, Home: 8, Car: 10, Business: 14, Education: 9 };
const docTypes = ['aadhaar', 'pan', 'salary_slip', 'bank_statement'];

const ApplyLoan = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ loanType: 'Personal', amount: 100000, tenureMonths: 12, purpose: '' });
  const [emi, setEmi] = useState(null);
  const [files, setFiles] = useState([]);
  const [docTypeMap, setDocTypeMap] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const calc = async () => {
      if (form.amount > 0 && form.tenureMonths > 0) {
        try {
          const res = await calculateEMI({ amount: form.amount, interestRate: RATES[form.loanType], tenureMonths: form.tenureMonths });
          setEmi(res);
        } catch {}
      }
    };
    calc();
  }, [form.amount, form.tenureMonths, form.loanType]);

  const handleFiles = (e) => {
    const list = Array.from(e.target.files);
    setFiles(list);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f, i) => {
        fd.append('documents', f);
        fd.append(`docType_${i}`, docTypeMap[i] || 'other');
      });
      await applyLoan(fd);
      navigate('/my-loans');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Apply for a loan</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 28 }}>Fill in the details below — we'll calculate your EMI instantly.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <form onSubmit={submit} className="card">
          {error && <div style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}

          <div className="field">
            <label>Loan type</label>
            <select value={form.loanType} onChange={(e) => setForm({ ...form, loanType: e.target.value })}>
              {Object.keys(RATES).map((t) => <option key={t} value={t}>{t} loan ({RATES[t]}% p.a.)</option>)}
            </select>
          </div>

          <div className="field">
            <label>Loan amount (₹)</label>
            <input type="number" min={1000} required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>

          <div className="field">
            <label>Tenure (months)</label>
            <input type="number" min={1} max={360} required value={form.tenureMonths} onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })} />
          </div>

          <div className="field">
            <label>Purpose (optional)</label>
            <textarea rows={3} value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. Home renovation" />
          </div>

          <div className="field">
            <label>Upload documents</label>
            <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf" onChange={handleFiles} />
            <p className="field-hint">Aadhaar, PAN, salary slip, or bank statement. JPG, PNG or PDF, up to 5MB each.</p>
          </div>

          {files.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              {files.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, flex: 1 }}>{f.name}</span>
                  <select style={{ fontSize: 12, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--color-border)' }}
                    onChange={(e) => setDocTypeMap({ ...docTypeMap, [i]: e.target.value })}>
                    {docTypes.map((d) => <option key={d} value={d}>{d.replace('_', ' ')}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Submitting…' : 'Submit application'}</button>
        </form>

        <div className="card" style={{ alignSelf: 'start' }}>
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Estimated EMI</h3>
          {emi ? (
            <>
              <div style={{ fontSize: 32, fontWeight: 800 }} className="display">{formatCurrency(emi.emi)}<span style={{ fontSize: 14, color: 'var(--color-text-muted)', fontWeight: 500 }}>/mo</span></div>
              <div style={{ marginTop: 16, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Principal</span><strong>{formatCurrency(form.amount)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Total interest</span><strong>{formatCurrency(emi.totalInterest)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Total payable</span><strong>{formatCurrency(emi.totalAmount)}</strong>
                </div>
              </div>
            </>
          ) : <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Enter loan details to see your EMI.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplyLoan;
