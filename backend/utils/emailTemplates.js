exports.welcomeEmail = (name) => `
<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9f9f9;border-radius:8px">
  <h2 style="color:#1a56db">Welcome to LoanEase, ${name}!</h2>
  <p>Your account has been created successfully. You can now apply for loans and track your applications.</p>
  <a href="${process.env.CLIENT_URL}/login" style="background:#1a56db;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px">Login Now</a>
</div>`;

exports.loanApprovedEmail = (name, amount, emi) => `
<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f0fdf4;border-radius:8px">
  <h2 style="color:#16a34a">🎉 Loan Approved!</h2>
  <p>Dear ${name}, your loan of ₹${amount.toLocaleString()} has been approved.</p>
  <p><strong>Monthly EMI:</strong> ₹${emi.toLocaleString()}</p>
  <p>Funds will be disbursed to your account shortly.</p>
</div>`;

exports.loanRejectedEmail = (name, remarks) => `
<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#fef2f2;border-radius:8px">
  <h2 style="color:#dc2626">Loan Application Update</h2>
  <p>Dear ${name}, unfortunately your loan application was not approved at this time.</p>
  <p><strong>Reason:</strong> ${remarks || 'Does not meet current eligibility criteria.'}</p>
  <p>You may re-apply after 30 days.</p>
</div>`;

exports.emiReminderEmail = (name, amount, dueDate) => `
<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#fff7ed;border-radius:8px">
  <h2 style="color:#ea580c">⏰ EMI Reminder</h2>
  <p>Dear ${name}, your EMI of ₹${amount.toLocaleString()} is due on ${new Date(dueDate).toDateString()}.</p>
  <p>Please ensure timely payment to avoid penalties.</p>
</div>`;
