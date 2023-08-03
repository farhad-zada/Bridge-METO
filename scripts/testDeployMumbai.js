const hre = require("hardhat");
async function main() {
  const contract = await hre.ethers.deployContract("Peripheral", [], {
    initializer: "initialize",
  });

  await contract.waitForDeployment(2);
  console.log(`Peripheral deployed to address: ${contract.target}`);
}

main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});

//0xE7Ef500A6ba6D690d3CB31Dab729DA7Ef08Cce0a
