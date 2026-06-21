const StatCard = ({ label, value, accent, icon }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20, background: accent || 'var(--color-primary-light)',
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800 }} className="display">{value}</div>
    </div>
  </div>
);

export default StatCard;
