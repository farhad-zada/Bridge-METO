const logTrnx = require("../loggers/logTrnx")

module.exports = async (from, to, sourceHash, tx) => {
    const transactionResponse = await tx
    console.log("Waiting transaction to be sent...")
    await transactionResponse
    console.log(
        `Waiting transaction {${transactionResponse.hash}} to be mined #2...`
    )
    const receip = await transactionResponse.wait(1)
    console.log(`Transaction {${transactionResponse.hash}} has been mined!`)
    logTrnx(from, to, sourceHash, receip.hash)
    return transactionResponse.hash
}
