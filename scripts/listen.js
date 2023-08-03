const hre = require("hardhat");
require("dotenv").config();

const bridgeDetails = {
  1: {
    signer: new hre.ethers.Wallet(
      process.env.PKEY,
      new hre.ethers.AlchemyProvider(null, proccess.env.ETHEREUM)
    ),
    bidgeContract: (await hre.ethers.getContractFactory("Sender")).attach(
      "0x8Fe5cB2CA521054b505DB6caA34d916ADad1c6Ec" // Address for ETHEREUM mainnet
    ),
    tokenContract: (await hre.ethers.getContractFactory("SocialToken")).attach(
      "0xE8c3295FacA5E560002252De2b3eb4A0293C84f3"
    ),
  },
  137: {
    signer: new hre.ethers.Wallet(
      process.env.PKEY,
      new hre.ethers.AlchemyProvider(null, proccess.env.POLYGON)
    ),
    bidgeContract: (await hre.ethers.getContractFactory("Sender")).attach(
      "0x8Fe5cB2CA521054b505DB6caA34d916ADad1c6Ec" // Address for Polygon mainnet
    ),
    tokenContract: (await hre.ethers.getContractFactory("SocialToken")).attach(
      "0xE8c3295FacA5E560002252De2b3eb4A0293C84f3"
    ),
  },
  56: {
    signer: new hre.ethers.Wallet(
      process.env.PKEY,
      new hre.ethers.AlchemyProvider(null, proccess.env.BINANCE)
    ),
    bidgeContract: (await hre.ethers.getContractFactory("Sender")).attach(
      "0x8Fe5cB2CA521054b505DB6caA34d916ADad1c6Ec" // Address for Binance mainnet
    ),
    tokenContract: (await hre.ethers.getContractFactory("SocialToken")).attach(
      "0xE8c3295FacA5E560002252De2b3eb4A0293C84f3"
    ),
  },
};

async function main() {
  senderSepolia.on(
    "Sent",
    async (message_id, chain_id, destinaton, from, to, amount) => {
      console.log(message_id, chain_id, destinaton, from, to, amount);

      let txData = bridgeDetails[
        chain_id
      ].tokenContract.interface.encodeFunctionData("mint", {
        to,
        amount,
      });

      let trxParams = {
        to: destinaton,
        data: txData,
        gasPrice: hre.ethers.parseUnits("20", "gwei"),
        gasLimit: 300000,
      };

      const trx = await signerMumbai.sendTransaction(trxParams);
      console.log(trx);
    }
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
