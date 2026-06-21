const User = require('../models/User');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, address }, { new: true, runValidators: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(req.body.currentPassword)))
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.password = req.body.newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const loans = await Loan.find({ userId });
    const payments = await Payment.find({ userId });

    const totalLoans = loans.length;
    const activeLoans = loans.filter(l => ['approved', 'disbursed'].includes(l.status)).length;
    const paidAmount = payments.reduce((sum, p) => sum + p.amountPaid, 0);
    const totalEmi = loans.filter(l => l.status === 'disbursed').reduce((sum, l) => sum + l.totalAmount, 0);
    const remainingBalance = Math.max(0, totalEmi - paidAmount);

    res.json({ success: true, stats: { totalLoans, activeLoans, paidAmount, remainingBalance } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
