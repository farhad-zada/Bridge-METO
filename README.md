# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

Steps

1. Deploy contract (add token address to initializer as parameter)
2. Make the contract admin of token
3. Add chains to the contract
4. Make admin the address that will send `accept` trnxs
