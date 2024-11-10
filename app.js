const express = require('express');
const { handleError } = require('./lib/errorHandler');
const DApp = require('./lib/DApp');
const config = require('./config');

const app = express();
const dapp = new DApp(config);

// Middleware
app.use(express.json());

// Initialize DApp
dapp.initialize().catch(console.error);

// Routes
app.post('/api/wallet/connect', async (req, res, next) => {
    try {
        const account = await dapp.connectWallet();
        res.json({ success: true, account });
    } catch (error) {
        next(error);
    }
});

app.post('/api/transaction/send', async (req, res, next) => {
    try {
        const { recipient, amount } = req.body;
        const receipt = await dapp.sendTransaction(recipient, amount);
        res.json({ success: true, receipt });
    } catch (error) {
        next(error);
    }
});

// Error handlers
app.use(handleError);

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        status: 404,
        message: 'Resource not found'
    });
});

module.exports = app;