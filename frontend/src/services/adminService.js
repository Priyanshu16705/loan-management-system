import api from './api';

export const getAdminDashboard = () => api.get('/admin/dashboard').then(r => r.data);
export const getAllLoans = (params) => api.get('/admin/loans', { params }).then(r => r.data);
export const approveLoan = (id, remarks) => api.put(`/admin/loans/${id}/approve`, { remarks }).then(r => r.data);
export const rejectLoan = (id, remarks) => api.put(`/admin/loans/${id}/reject`, { remarks }).then(r => r.data);
export const getAllUsers = (params) => api.get('/admin/users', { params }).then(r => r.data);
export const blockUser = (id, isBlocked) => api.put(`/admin/users/${id}/block`, { isBlocked }).then(r => r.data);
export const getAllPayments = () => api.get('/admin/payments').then(r => r.data);
export const getMonthlyReport = () => api.get('/admin/reports/monthly').then(r => r.data);
