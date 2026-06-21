const router = require('express').Router();
const { applyLoan, getMyLoans, getLoan, calculateEMI } = require('../controllers/loanController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);
router.post('/apply', upload.array('documents', 5), applyLoan);
router.get('/', getMyLoans);
router.get('/:id', getLoan);
router.post('/calculate-emi', calculateEMI);

module.exports = router;
