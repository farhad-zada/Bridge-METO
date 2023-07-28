// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const mumbai = new hre.ethers.JsonRpcProvider(process.env.MUMBAI);
  const signerMumbai = new hre.ethers.Wallet(process.env.PKEY, mumbai);

  const sepolia = new hre.ethers.JsonRpcApiProvider(process.env.SEPOLIA);
  const signerSepolia = new hre.ethers.Wallet(process.env.PKEY, sepolia);

  const signers = {
    mumbai: signerMumbai,
    sepolia: signerSepolia,
  };

  const senderSepolia = (await hre.ethers.getContractFactory("Sender")).attach(
    "0x8Fe5cB2CA521054b505DB6caA34d916ADad1c6Ec"
  );

  const sotoMumbai = (
    await hre.ethers.getContractFactory("SocialToken")
  ).attach("0xE8c3295FacA5E560002252De2b3eb4A0293C84f3");

  senderSepolia.on(
    "Sent",
    async (message_id, chain_id, destinaton, from, to, amount) => {
      console.log(message_id, chain_id, destinaton, from, to, amount);

      let txData = sotoMumbai.interface.encodeFunctionData("mint", [
        to,
        amount,
      ]);

      let trxParams = {
        to: "0xE8c3295FacA5E560002252De2b3eb4A0293C84f3",
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
