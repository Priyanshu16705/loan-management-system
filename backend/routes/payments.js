const router = require('express').Router();
const { makePayment, getLoanPayments, getMyPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', makePayment);
router.get('/', getMyPayments);
router.get('/:loanId', getLoanPayments);

module.exports = router;
