const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' },
  fileUrl: { type: String, required: true },
  fileName: { type: String },
  documentType: {
    type: String,
    enum: ['aadhaar', 'pan', 'salary_slip', 'bank_statement', 'other'],
    required: true,
  },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
