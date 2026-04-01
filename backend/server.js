const express = require('express');
const os = require('os');
const { sequelize, Account, Transaction } = require('./models');

const app = express();
app.use(express.json());

// Middleware to add Backend ID for Scaling Visibility
app.use((req, res, next) => {
    res.setHeader('X-Backend-Id', os.hostname());
    next();
});

// Middleware to add Backend Name for Scaling Visibility
app.use((req, res, next) => {
    // Fallback to hostname if REPLICA_NAME isn't set (e.g. local dev)
    res.setHeader('X-Backend-Id', process.env.REPLICA_NAME || os.hostname());
    next();
});

app.get('/api/banking/account', async (req, res) => {
    const account = await Account.findOne({ include: [Transaction] });
    res.json(account);
});

app.post('/api/banking/transfer', async (req, res) => {
    const { amount, description } = req.body;
    const account = await Account.findOne();
    
    account.balance = parseFloat(account.balance) + parseFloat(amount);
    await account.save();
    
    await Transaction.create({
        description,
        amount,
        type: 'DEPOSIT',
        AccountId: account.id
    });
    
    res.json({ message: "Success", newBalance: account.balance });
});

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

const init = async () => {
    await sequelize.sync({ force: false }); // Set to false to persist data
    const count = await Account.count();
    if (count === 0) {
        const acc = await Account.create({});
        await Transaction.create({
            description: "Initial Deposit",
            amount: 250000.00,
            type: 'DEPOSIT',
            AccountId: acc.id
        });
        console.log("Database Seeded!");
    }
    app.listen(3000, () => console.log('Backend running on port 3000'));
};

init();
