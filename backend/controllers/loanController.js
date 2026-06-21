const Loan = require('../models/Loan');
const Document = require('../models/Document');

const INTEREST_RATES = { Personal: 12, Home: 8, Car: 10, Business: 14, Education: 9 };

exports.applyLoan = async (req, res) => {
  try {
    const { loanType, amount, tenureMonths, purpose } = req.body;
    const interestRate = INTEREST_RATES[loanType] || 12;
    const loan = await Loan.create({ userId: req.user._id, loanType, amount, interestRate, tenureMonths, purpose });

    if (req.files && req.files.length > 0) {
      const docs = req.files.map((f, i) => ({
        userId: req.user._id, loanId: loan._id,
        fileUrl: `/uploads/${f.filename}`, fileName: f.originalname,
        documentType: req.body[`docType_${i}`] || 'other',
      }));
      await Document.insertMany(docs);
    }
    res.status(201).json({ success: true, loan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyLoans = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    const loans = await Loan.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, loans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLoan = async (req, res) => {
  try {
    const loan = await Loan.findOne({ _id: req.params.id, userId: req.user._id }).populate('userId', 'name email');
    if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });
    const docs = await Document.find({ loanId: loan._id });
    res.json({ success: true, loan, documents: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.calculateEMI = (req, res) => {
  try {
    const { amount, interestRate, tenureMonths } = req.body;
    const P = Number(amount), R = Number(interestRate) / 12 / 100, N = Number(tenureMonths);
    const emi = parseFloat((P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1)).toFixed(2));
    const total = parseFloat((emi * N).toFixed(2));
    const interest = parseFloat((total - P).toFixed(2));
    res.json({ success: true, emi, totalAmount: total, totalInterest: interest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
