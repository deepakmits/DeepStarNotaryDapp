# DeepStarNotaryDapp
## Remix-Ganache-Metamask
Remix - Develop smart contract on Remix(In Browser UI) <br>
Ganache - "The Ethereum Blockchain" <br>
Metamask - Chrome plugin to talk to Ganache.
### Steps -
1) Start Ganache - The Blockchain , This blockchain comes with 10 account with some ether already assigned. 
    Ganache runs RPC Server at HTTP://127.0.0.1:7545 providing services to interact and manipulate the blockchain.
2) Start Metamask - Connect to Ganache using MNEMONIC from Ganache. 
3) Remix - Develop smart contract "StarNotary.sol" using Remix. Configure web3 Provider as Ganache RPC Server, Deploy your smart contract.
4) Index.html -
Use web3 from metamask injected.
``` 
            if(typeof web3 != 'undefined') { 
                web3 = new Web3(web3.currentProvider) // what Metamask injected 
            } else {
                // Instantiate and set Ganache as your provider
                //running it thru ui
                web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
            }
```
Copy deployed smart contract address from Remix console - 
```
            var starNotary = StarNotary.at('0xe0b7d855180ede9d4490552f5a63e06fe96cfa7b');
```
5) Install http-server using npm
```
npm install -g http-server
```
6) Change directory to where index.html is there.
```
http-server
```
By default index.html is run at http://127.0.0.1:8080
Use above to launch your star notary to display star, owner and button to claim star.

## Unit testing with Truffle - Javascript - Solidity
1) install truffle globally - 
```
npm install -global truffle
```
2) change directory to your project folder 
```
mkdir smart_contracts
cd smart_contracts
truffle init
```
3) Above creates 3 new directories in smart_contracts folder <br>
   a) contracts
   b) test
   c) migrations and 2 files "truffle-config.js" and "truffle.js" <br>
4) Move StarNotary.sol contract created using Remix to "contracts" folder
5) Create StarNotaryTest.js file with unit tests in "tests" directory.
6) Command to run unit tests (from smart_contracts directory)
```
truffle test
```
 
 ## ERC721 interface and its implementation via ERC721Token
 ERC721 inteface is standard interface for implementing NFT ( non fungible token) like registry etc.<br>
 ERC721Token is ERC721 interface implementation as per our requirement of Star Notary.<br>
 Unit tests of the above ERC721Token are covered in ERC721TokenTest.js . <br>
 Below is the test report of above unit tests run using truffle.<br>
![RC721Token Unit test report](images/ERC721TokenUT.png "ERC721Token Unit test report")
 
 




