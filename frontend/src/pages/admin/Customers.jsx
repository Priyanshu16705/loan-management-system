import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import Spinner from '../../components/common/Spinner';
import { getAllUsers, blockUser } from '../../services/adminService';
import { formatDate } from '../../utils/format';

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await getAllUsers({});
    setUsers(res.users);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleBlock = async (user) => {
    await blockUser(user._id, !user.isBlocked);
    load();
  };

  return (
    <DashboardLayout isAdmin>
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Customers</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>View and manage registered customers.</p>

      {loading ? <Spinner /> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--color-text-muted)', fontSize: 12, background: 'var(--color-bg)' }}>
                <th style={{ padding: '14px 20px' }}>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderTop: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td><span className={`badge ${u.isBlocked ? 'badge-rejected' : 'badge-approved'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span></td>
                  <td style={{ padding: '14px 20px' }}>
                    <button className={`btn btn-sm ${u.isBlocked ? 'btn-success' : 'btn-danger'}`} onClick={() => toggleBlock(u)}>
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Customers;
