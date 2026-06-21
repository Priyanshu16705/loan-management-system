import api from './api';

export const makePayment = (data) => api.post('/payments', data).then(r => r.data);
export const getMyPayments = () => api.get('/payments').then(r => r.data);
export const getLoanPayments = (loanId) => api.get(`/payments/${loanId}`).then(r => r.data);
