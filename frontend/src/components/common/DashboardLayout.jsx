import Sidebar from './Sidebar';

const DashboardLayout = ({ children, isAdmin = false }) => (
  <div style={{ display: 'flex' }}>
    <Sidebar isAdmin={isAdmin} />
    <main style={{ flex: 1, padding: 32, maxWidth: 'calc(100% - 240px)', animation: 'fadeIn 0.3s ease' }}>{children}</main>
  </div>
);

export default DashboardLayout;
