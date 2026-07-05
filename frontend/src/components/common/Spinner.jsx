const Spinner = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: 'spin 0.8s linear infinite' }}>
    <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes spinDash {
        0%   { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
        50%  { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
        100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
      }
    `}</style>
    <circle cx="12" cy="12" r="10" stroke="var(--color-border)" strokeWidth="3" fill="none" opacity="0.3" />
    <circle cx="12" cy="12" r="10" stroke="var(--color-primary)" strokeWidth="3" fill="none" strokeLinecap="round"
      strokeDasharray="60, 150" style={{ animation: 'spinDash 1.4s ease-in-out infinite' }} />
  </svg>
);
export default Spinner;
