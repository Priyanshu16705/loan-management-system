import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const customerLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/apply-loan', label: 'Apply for a loan', icon: '📝' },
  { to: '/my-loans', label: 'My loans', icon: '💰' },
  { to: '/repayments', label: 'Repayments', icon: '🔁' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/loans', label: 'Loan applications', icon: '📋' },
  { to: '/admin/users', label: 'Customers', icon: '👥' },
  { to: '/admin/payments', label: 'Payments', icon: '💳' },
  { to: '/admin/reports', label: 'Reports', icon: '📈' },
];

const Sidebar = ({ isAdmin = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : customerLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      width: 240, minHeight: '100vh', background: 'var(--color-surface)',
      borderRight: '1px solid var(--color-border)', padding: '24px 16px',
      display: 'flex', flexDirection: 'column', position: 'sticky', top: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 18, padding: '0 8px', marginBottom: 32 }} className="display">
        <span style={{ width: 30, height: 30, background: 'var(--color-primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15, transition: 'transform 0.3s ease, border-radius 0.3s ease' }} className="sidebar-logo">₹</span>
        LoanEase
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/admin'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
              fontSize: 14, fontWeight: 600,
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
              background: isActive ? 'var(--color-primary-light)' : 'transparent',
              transition: 'background 0.2s ease, color 0.2s ease, transform 0.2s ease',
              transform: isActive ? 'translateX(2px)' : 'none',
            })}
            onMouseEnter={(e) => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'var(--color-bg)'; }}
            onMouseLeave={(e) => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'transparent'; }}
          >
            <span>{l.icon}</span> {l.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16, marginTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, padding: '0 8px' }}>{user?.name}</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', padding: '0 8px', marginBottom: 12 }}>{user?.email}</div>
        <button onClick={handleLogout} className="btn btn-outline btn-sm btn-block">Log out</button>
      </div>
    </aside>
  );
};

export default Sidebar;
