const ethers = require("ethers")
const bridgeDetails = require("./bridgeDetails")

module.exports = (messageId, chainId, from, to, amount) => {
    const txData = bridgeDetails[
        chainId
    ].bridgeContract.interface.encodeFunctionData("accept", [
        messageId,
        chainId,
        from,
        to,
        amount,
    ])

    let trxParams = {
        to: bridgeDetails[chainId].address,
        data: txData,
        gasPrice: ethers.parseUnits("25", "gwei"),
        gasLimit: 300000,
    }

    const tx = bridgeDetails[chainId].signer.sendTransaction(trxParams)

    return tx
}
