import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/customer/Dashboard';
import ApplyLoan from './pages/customer/ApplyLoan';
import MyLoans from './pages/customer/MyLoans';
import LoanDetail from './pages/customer/LoanDetail';
import Repayments from './pages/customer/Repayments';
import Profile from './pages/customer/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import LoanApplications from './pages/admin/LoanApplications';
import Customers from './pages/admin/Customers';
import Payments from './pages/admin/Payments';
import Reports from './pages/admin/Reports';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/apply-loan" element={<ProtectedRoute><ApplyLoan /></ProtectedRoute>} />
      <Route path="/my-loans" element={<ProtectedRoute><MyLoans /></ProtectedRoute>} />
      <Route path="/my-loans/:id" element={<ProtectedRoute><LoanDetail /></ProtectedRoute>} />
      <Route path="/repayments" element={<ProtectedRoute><Repayments /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/loans" element={<ProtectedRoute adminOnly><LoanApplications /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><Customers /></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute adminOnly><Payments /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute adminOnly><Reports /></ProtectedRoute>} />

      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

export default App;
