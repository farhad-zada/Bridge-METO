const ethers = require("ethers")
require("dotenv").config()
let mumbai = new ethers.JsonRpcProvider(process.env.MUMBAI)
let sepolia = new ethers.JsonRpcProvider(process.env.SEPOLIA)
let abi = [
    "event Sent(uint256 messageId,uint256 chainId,address destination, address from,address to,uint256 amount)",
    "event Accepted(uint256 messageId,uint256 chainId,address source,address from,address to,uint256 amount)",
    "function accept(uint256 messageId,uint256 chainId,address from,address to,uint256 amount)public",
]
module.exports = {
    80001: {
        name: "Polygon Mumbai",
        signer: new ethers.Wallet(process.env.PKEY, mumbai),
        bridgeContract: new ethers.Contract(
            process.env.CON_MUMBAI,
            abi,
            mumbai
        ),
        address: process.env.CON_MUMBAI,
    },
    11155111: {
        name: "Ethereum Sepolia",
        signer: new ethers.Wallet(process.env.PKEY, sepolia),
        bridgeContract: new ethers.Contract(
            process.env.CON_SEPOLIA,
            abi,
            sepolia
        ),
        address: process.env.CON_SEPOLIA,
    },
}
