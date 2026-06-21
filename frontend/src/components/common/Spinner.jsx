const Spinner = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: 'spin 0.8s linear infinite' }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <circle cx="12" cy="12" r="10" stroke="var(--color-border)" strokeWidth="3" fill="none" />
    <path d="M12 2 A10 10 0 0 1 22 12" stroke="var(--color-primary)" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);
export default Spinner;
