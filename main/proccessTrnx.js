const logtransactionResponse = require("./loggers/logtransactionResponse")

module.exports = async (from, to, sourceHash, tx) => {
    const transactionResponse = await tx
    console.log("Waiting transaction to be sent...")
    await transactionResponse
    console.log(
        `Waiting transaction {${transactionResponse.hash}} to be mined #2...`
    )
    const receip = await transactionResponse.wait(2)
    console.log(`Transaction {${transactionResponse.hash}} has been mined!`)
    logtransactionResponse(from, to, sourceHash, receip.hash)
    return transactionResponse.hash
}
