var HDWalletProvider = require('truffle-hdwallet-provider');

var mnemonic = 'wait worry size million cable awesome auto erode frog either rail notice';

module.exports = {
  networks: { 
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: "*"
    }, 
    rinkeby: {
      provider: function() { 
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/360d3b276f5d4b78969708a8dde0d710') 
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    }
  }
};