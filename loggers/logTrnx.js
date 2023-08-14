const bridgeDetails = require("../main/bridgeDetails")

module.exports = (from, to, sourceHash, trnxHash) => {
    console.log(
        `Tokens have been moved:\n` +
            `From: ${bridgeDetails[from].name}\n` +
            `To: ${bridgeDetails[to].name}\n` +
            `Status: Success 🍺\n\n` +
            `Source trx hash: ${sourceHash}\n` +
            `Destination trx hash: ${trnxHash}\n\n` +
            `From: ${from}\n` +
            `To: ${to}\n`
    )
}
