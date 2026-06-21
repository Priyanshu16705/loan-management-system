const Payment = require('../models/Payment');
const Loan = require('../models/Loan');

exports.makePayment = async (req, res) => {
  try {
    const { loanId, amountPaid, paymentMethod } = req.body;
    const loan = await Loan.findOne({ _id: loanId, userId: req.user._id });
    if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });
    if (!['approved', 'disbursed'].includes(loan.status))
      return res.status(400).json({ success: false, message: 'Loan is not active' });

    const payment = await Payment.create({ loanId, userId: req.user._id, amountPaid, paymentMethod });

    // Check if loan is fully paid
    const payments = await Payment.find({ loanId, status: 'completed' });
    const totalPaid = payments.reduce((s, p) => s + p.amountPaid, 0);
    if (totalPaid >= loan.totalAmount) await Loan.findByIdAndUpdate(loanId, { status: 'closed' });

    res.status(201).json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLoanPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ loanId: req.params.loanId, userId: req.user._id }).sort({ paymentDate: -1 });
    const totalPaid = payments.reduce((s, p) => s + p.amountPaid, 0);
    res.json({ success: true, payments, totalPaid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).populate('loanId', 'loanType amount').sort({ paymentDate: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
