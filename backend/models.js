const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

const Account = sequelize.define('Account', {
  accountNumber: { type: DataTypes.STRING, defaultValue: "GB-777-999" },
  ownerName: { type: DataTypes.STRING, defaultValue: "John Doe" },
  balance: { type: DataTypes.DECIMAL(15, 2), defaultValue: 250000.00 },
  currency: { type: DataTypes.STRING, defaultValue: "DZD" }
});

const Transaction = sequelize.define('Transaction', {
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  description: { type: DataTypes.STRING },
  amount: { type: DataTypes.DECIMAL(15, 2) },
  type: { type: DataTypes.ENUM('DEPOSIT', 'TRANSFER') }
});

Account.hasMany(Transaction);
module.exports = { sequelize, Account, Transaction };
