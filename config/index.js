require('dotenv').config();

const config = {
    network: {
        sepoliaUrl: process.env.SEPOLIA_URL,
        privateKey: process.env.PRIVATE_KEY
    },
    contract: {
        address: process.env.CONTRACT_ADDRESS
    },
    development: {
        debug: process.env.DEBUG,
        nodeEnv: process.env.NODE_ENV
    },
    api: {
        etherscanKey: process.env.ETHERSCAN_API_KEY
    }
};

module.exports = config; 