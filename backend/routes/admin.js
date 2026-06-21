const router = require('express').Router();
const { getDashboard, getAllLoans, approveLoan, rejectLoan, getAllUsers, blockUser, getAllPayments, getMonthlyReport } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);
router.get('/dashboard', getDashboard);
router.get('/loans', getAllLoans);
router.put('/loans/:id/approve', approveLoan);
router.put('/loans/:id/reject', rejectLoan);
router.get('/users', getAllUsers);
router.put('/users/:id/block', blockUser);
router.get('/payments', getAllPayments);
router.get('/reports/monthly', getMonthlyReport);

module.exports = router;
