export const formatCurrency = (num) => {
  if (num === undefined || num === null) return '₹0';
  return '₹' + Number(num).toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

export const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
