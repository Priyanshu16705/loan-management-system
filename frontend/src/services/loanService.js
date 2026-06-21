import api from './api';

export const applyLoan = (formData) => api.post('/loans/apply', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
}).then(r => r.data);

export const getMyLoans = (status) => api.get('/loans', { params: { status } }).then(r => r.data);
export const getLoan = (id) => api.get(`/loans/${id}`).then(r => r.data);
export const calculateEMI = (data) => api.post('/loans/calculate-emi', data).then(r => r.data);
