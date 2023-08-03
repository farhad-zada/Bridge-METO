const hre = require("hardhat");
async function main() {
  const contract = await hre.ethers.deployContract("Lock", [], {
    initializer: "initialize",
  });

  await contract.waitForDeployment(2);
  console.log(`Lock deployed to address: ${contract.target}`);
}

main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});
