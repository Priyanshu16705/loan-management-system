const StatCard = ({ label, value, accent, icon }) => (
  <div className="card" style={{
    display: 'flex', alignItems: 'center', gap: 16,
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    cursor: 'default',
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20, background: accent || 'var(--color-primary-light)',
      transition: 'transform 0.25s ease, background 0.25s ease',
    }} className="stat-icon">{icon}</div>
    <div>
      <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, animation: 'countUp 0.4s ease forwards' }} className="display">{value}</div>
    </div>
  </div>
);

export default StatCard;
