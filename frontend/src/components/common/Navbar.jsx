import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)',
      position: 'sticky', top: 0, zIndex: 50,
      transition: 'box-shadow 0.3s ease',
      boxShadow: scrolled ? '0 4px 20px rgba(20, 23, 43, 0.08)' : 'none',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 19, transition: 'opacity 0.2s' }} className="display" onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          <span style={{ width: 32, height: 32, background: 'var(--color-primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, transition: 'transform 0.3s ease' }} className="sidebar-logo">₹</span>
          LoanEase
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {!user && (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
            </>
          )}
          {user && (
            <>
              <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Hi, {user.name?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Log out</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
