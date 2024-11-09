const express = require('express');
const { handleError } = require('./lib/errorHandler');
const app = express();

// ... your other middleware and routes

// Global error handler - must be last middleware
app.use((err, req, res, next) => {
  handleError(err, res);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: 'Resource not found'
  });
}); 

class DApp {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.account = null;
        
        // Contract details
        this.contractAddress = "YOUR_CONTRACT_ADDRESS";
        this.contractABI = [
            // Your contract ABI here
        ];

        this.init();
    }

    async init() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('connectWallet').addEventListener('click', () => this.connectWallet());
        document.getElementById('sendTransaction').addEventListener('click', () => this.sendTransaction());
    }

    async connectWallet() {
        try {
            // Check if MetaMask is installed
            if (typeof window.ethereum === 'undefined') {
                throw new Error('Please install MetaMask');
            }

            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            this.account = accounts[0];
            
            // Initialize ethers provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            // Initialize contract
            this.contract = new ethers.Contract(
                this.contractAddress,
                this.contractABI,
                signer
            );

            // Update UI
            this.updateWalletInfo();
            
            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts) => {
                this.account = accounts[0];
                this.updateWalletInfo();
            });

        } catch (error) {
            console.error('Error connecting wallet:', error);
            this.showStatus('Error: ' + error.message, 'error');
        }
    }

    async updateWalletInfo() {
        if (this.account) {
            document.getElementById('walletAddress').textContent = 
                `Wallet: ${this.account.substring(0, 6)}...${this.account.substring(38)}`;
            
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const balance = await provider.getBalance(this.account);
            document.getElementById('balance').textContent = 
                `Balance: ${ethers.utils.formatEther(balance)} ETH`;
        }
    }

    async sendTransaction() {
        try {
            const recipient = document.getElementById('recipientAddress').value;
            const amount = document.getElementById('amount').value;

            if (!ethers.utils.isAddress(recipient)) {
                throw new Error('Invalid recipient address');
            }

            if (!amount || amount <= 0) {
                throw new Error('Invalid amount');
            }

            this.showStatus('Processing transaction...', 'pending');

            const tx = await this.contract.transfer(
                recipient,
                ethers.utils.parseEther(amount)
            );

            this.showStatus('Transaction submitted. Waiting for confirmation...', 'pending');
            
            await tx.wait();
            
            this.showStatus('Transaction confirmed!', 'success');
            this.updateWalletInfo();

        } catch (error) {
            console.error('Transaction error:', error);
            this.showStatus('Error: ' + error.message, 'error');
        }
    }

    showStatus(message, type = 'info') {
        const statusElement = document.getElementById('txStatus');
        statusElement.textContent = message;
        statusElement.className = `status ${type}`;
    }
}

// Initialize DApp when page loads
window.addEventListener('load', () => {
    window.dapp = new DApp();
});