const router = require('express').Router();
const { getProfile, updateProfile, changePassword, getDashboardStats } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/dashboard-stats', getDashboardStats);

module.exports = router;
