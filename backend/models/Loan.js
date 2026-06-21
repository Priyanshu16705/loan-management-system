const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loanType: { type: String, required: true, enum: ['Personal', 'Home', 'Car', 'Business', 'Education'] },
  amount: { type: Number, required: true, min: 1000 },
  interestRate: { type: Number, required: true },
  tenureMonths: { type: Number, required: true },
  monthlyEMI: { type: Number },
  totalAmount: { type: Number },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'disbursed', 'closed'],
    default: 'pending',
  },
  remarks: { type: String },
  purpose: { type: String },
  disbursedAt: { type: Date },
}, { timestamps: true });

loanSchema.pre('save', function (next) {
  if (this.isModified('amount') || this.isModified('interestRate') || this.isModified('tenureMonths')) {
    const P = this.amount;
    const R = this.interestRate / 12 / 100;
    const N = this.tenureMonths;
    this.monthlyEMI = parseFloat((P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1)).toFixed(2));
    this.totalAmount = parseFloat((this.monthlyEMI * N).toFixed(2));
  }
  next();
});

module.exports = mongoose.model('Loan', loanSchema);
