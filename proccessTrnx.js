const logTrnx = require("./loggers/logTrnx")

module.exports = async (from, to, sourceHash, trnx) => {
    console.log("Waiting transaction to be sent...")
    await trnx
    console.log(`Waiting transaction {${trnx.hash}} to be mined #2...`)
    const receip = await trnx.wait(2)
    console.log(`Transaction {${trnx.hash}} has been mined!`)
    logTrnx(from, to, sourceHash, receip.hash)
    return trnx.hash
}
