// Optional: run with `node seed.js` after setting MONGO_URI in .env
// Creates one admin and one sample customer for quick testing.
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const adminEmail = 'admin@loanease.com';
  const customerEmail = 'customer@loanease.com';

  await User.deleteOne({ email: adminEmail });
  await User.deleteOne({ email: customerEmail });

  await User.create({
    name: 'Admin User', email: adminEmail, phone: '9999999999',
    password: 'admin123', role: 'admin', address: 'HQ',
  });

  await User.create({
    name: 'Sample Customer', email: customerEmail, phone: '8888888888',
    password: 'customer123', role: 'customer', address: 'Patna, Bihar',
  });

  console.log('Seeded:');
  console.log('  Admin    →', adminEmail, '/ admin123');
  console.log('  Customer →', customerEmail, '/ customer123');
  await mongoose.disconnect();
})();
