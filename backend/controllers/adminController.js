const User = require('../models/User');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');
const Document = require('../models/Document');
const sendEmail = require('../utils/sendEmail');
const { loanApprovedEmail, loanRejectedEmail } = require('../utils/emailTemplates');

exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalLoans, pendingLoans, activeLoans, totalPayments] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Loan.countDocuments(),
      Loan.countDocuments({ status: 'pending' }),
      Loan.countDocuments({ status: { $in: ['approved', 'disbursed'] } }),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amountPaid' } } }]),
    ]);
    res.json({ success: true, stats: { totalUsers, totalLoans, pendingLoans, activeLoans, totalCollected: totalPayments[0]?.total || 0 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllLoans = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};
    const loans = await Loan.find(filter).populate('userId', 'name email phone').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Loan.countDocuments(filter);
    res.json({ success: true, loans, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.approveLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(req.params.id, { status: 'approved', remarks: req.body.remarks, disbursedAt: new Date() }, { new: true }).populate('userId', 'name email');
    if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });
    try { await sendEmail({ to: loan.userId.email, subject: 'Loan Approved!', html: loanApprovedEmail(loan.userId.name, loan.amount, loan.monthlyEMI) }); } catch {}
    res.json({ success: true, loan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.rejectLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(req.params.id, { status: 'rejected', remarks: req.body.remarks }, { new: true }).populate('userId', 'name email');
    if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });
    try { await sendEmail({ to: loan.userId.email, subject: 'Loan Application Update', html: loanRejectedEmail(loan.userId.name, req.body.remarks) }); } catch {}
    res.json({ success: true, loan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await User.countDocuments({ role: 'customer' });
    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: req.body.isBlocked }, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('userId', 'name email').populate('loanId', 'loanType amount').sort({ paymentDate: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMonthlyReport = async (req, res) => {
  try {
    const report = await Payment.aggregate([
      { $group: { _id: { year: { $year: '$paymentDate' }, month: { $month: '$paymentDate' } }, total: { $sum: '$amountPaid' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
