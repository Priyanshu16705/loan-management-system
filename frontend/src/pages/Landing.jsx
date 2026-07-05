import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const features = [
  { icon: '⚡', title: 'Fast approvals', desc: 'Apply online and get a decision in as little as 24 hours.' },
  { icon: '🔒', title: 'Bank-grade security', desc: 'Your data is encrypted and protected with JWT-based authentication.' },
  { icon: '📊', title: 'Clear tracking', desc: 'Watch your application move from pending to disbursed in real time.' },
  { icon: '🧮', title: 'Transparent EMI', desc: 'See your exact monthly payment before you apply — no surprises.' },
];

const loanTypes = [
  { name: 'Personal', rate: '12%', icon: '👤' },
  { name: 'Home', rate: '8%', icon: '🏠' },
  { name: 'Car', rate: '10%', icon: '🚗' },
  { name: 'Business', rate: '14%', icon: '💼' },
  { name: 'Education', rate: '9%', icon: '🎓' },
];

const Landing = () => (
  <>
    <Navbar />
    <section style={{ padding: '88px 0 64px', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
      <div className="container">
        <span style={{ display: 'inline-block', background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontWeight: 600, fontSize: 13, padding: '6px 14px', borderRadius: 20, marginBottom: 20, animation: 'fadeInDown 0.4s ease 0.1s both' }}>
          Loans made simple
        </span>
        <h1 className="display" style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, maxWidth: 720, margin: '0 auto 20px', animation: 'fadeInUp 0.5s ease 0.2s both' }}>
          Borrow with clarity, repay with confidence
        </h1>
        <p style={{ fontSize: 18, color: 'var(--color-text-muted)', maxWidth: 540, margin: '0 auto 32px', animation: 'fadeInUp 0.5s ease 0.3s both' }}>
          Apply for a loan in minutes, track every step of approval, and manage repayments — all from one dashboard.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', animation: 'fadeInUp 0.5s ease 0.4s both' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '13px 28px', fontSize: 15 }}>Apply for a loan</Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '13px 28px', fontSize: 15 }}>Log in</Link>
        </div>
      </div>
    </section>

    <section style={{ padding: '48px 0', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', fontSize: 26, marginBottom: 8, animation: 'fadeInUp 0.4s ease both' }}>Loans for every need</h2>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: 36, animation: 'fadeInUp 0.4s ease 0.1s both' }}>Competitive rates, calculated transparently</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {loanTypes.map((l, i) => (
            <div key={l.name} className="card" style={{ textAlign: 'center', animation: 'fadeInUp 0.4s ease forwards', animationDelay: `${0.1 + i * 0.08}s`, opacity: 0 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{l.icon}</div>
              <div style={{ fontWeight: 700 }}>{l.name}</div>
              <div style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: 14 }}>from {l.rate} p.a.</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section style={{ padding: '64px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {features.map((f, i) => (
            <div key={f.title} style={{ animation: 'fadeInUp 0.4s ease forwards', animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <footer style={{ padding: '32px 0', borderTop: '1px solid var(--color-border)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
      © {new Date().getFullYear()} LoanEase. Built as a demonstration loan management system.
    </footer>
  </>
);

export default Landing;
