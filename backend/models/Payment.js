const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amountPaid: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['cash', 'bank_transfer', 'upi', 'cheque'], default: 'bank_transfer' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  receiptNumber: { type: String },
}, { timestamps: true });

paymentSchema.pre('save', function (next) {
  if (!this.receiptNumber) {
    this.receiptNumber = 'RCP' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
