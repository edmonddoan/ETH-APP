const { ethers } = require('ethers');
const { AppError } = require('./errorHandler');
const { debugLog } = require('./debug');

class DApp {
    constructor(config) {
        this.web3 = null;
        this.contract = null;
        this.account = null;
        this.provider = null;
        this.signer = null;
        
        // Configuration
        this.config = config || {
            contractAddress: process.env.CONTRACT_ADDRESS,
            networkId: process.env.NETWORK_ID || '1', // mainnet by default
            rpcUrl: process.env.RPC_URL
        };
        
        // Contract ABI should be imported separately
        this.contractABI = require('../artifacts/contracts/YourContract.sol/YourContract.json').abi;
    }

    async initialize() {
        try {
            debugLog('app', 'Initializing DApp');
            await this.setupProvider();
            await this.setupEventListeners();
            return true;
        } catch (error) {
            debugLog('error', 'Failed to initialize DApp', error);
            throw new AppError('Failed to initialize DApp: ' + error.message);
        }
    }

    async setupProvider() {
        if (typeof window !== 'undefined' && window.ethereum) {
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
        } else {
            this.provider = new ethers.providers.JsonRpcProvider(this.config.rpcUrl);
        }
    }

    async setupEventListeners() {
        if (typeof window !== 'undefined' && window.ethereum) {
            window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
            window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));
        }
    }

    async connectWallet() {
        try {
            if (!window.ethereum) {
                throw new AppError('MetaMask not installed', 400);
            }

            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            await this.handleAccountsChanged(accounts);
            await this.validateNetwork();
            
            return this.account;
        } catch (error) {
            debugLog('error', 'Wallet connection failed', error);
            throw new AppError(error.message, 400);
        }
    }

    async validateNetwork() {
        const chainId = await this.provider.getNetwork().then(net => net.chainId);
        if (chainId.toString() !== this.config.networkId) {
            throw new AppError(`Please switch to network ${this.config.networkId}`, 400);
        }
    }

    async handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            this.account = null;
            this.signer = null;
            throw new AppError('Please connect to MetaMask', 401);
        }

        this.account = accounts[0];
        this.signer = this.provider.getSigner();
        this.contract = new ethers.Contract(
            this.config.contractAddress,
            this.contractABI,
            this.signer
        );

        debugLog('app', 'Account changed', this.account);
    }

    handleChainChanged() {
        window.location.reload();
    }

    async sendTransaction(recipient, amount) {
        try {
            if (!this.contract) {
                throw new AppError('Contract not initialized', 400);
            }

            if (!ethers.utils.isAddress(recipient)) {
                throw new AppError('Invalid recipient address', 400);
            }

            if (!amount || amount <= 0) {
                throw new AppError('Invalid amount', 400);
            }

            debugLog('tx', 'Sending transaction', { recipient, amount });

            const tx = await this.contract.transfer(
                recipient,
                ethers.utils.parseEther(amount.toString())
            );

            debugLog('tx', 'Transaction submitted', tx.hash);
            
            const receipt = await tx.wait();
            debugLog('tx', 'Transaction confirmed', receipt);
            
            return receipt;
        } catch (error) {
            debugLog('error', 'Transaction failed', error);
            throw new AppError(error.message, 400);
        }
    }

    async getBalance(address = null) {
        try {
            const targetAddress = address || this.account;
            if (!targetAddress) {
                throw new AppError('No address specified', 400);
            }

            const balance = await this.provider.getBalance(targetAddress);
            return ethers.utils.formatEther(balance);
        } catch (error) {
            debugLog('error', 'Failed to get balance', error);
            throw new AppError(error.message, 400);
        }
    }
}

module.exports = DApp; 