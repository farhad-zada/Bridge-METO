const ethers = require("ethers")
require("dotenv").config()
const bridgeDetails = require("./main/bridgeDetails")
const proccessTrnx = require("./main/proccessTrnx")
const execute = require("./main/execute")
const logEventReceived = require("./loggers/logEventReceived")

const MAX_RETRIES = 10
const RETRIE_INTERVAL = 10

async function main(id, retrie) {
    console.log(`\nListening to ${id}...🤫\n`)

    bridgeDetails[id].bridgeContract.on(
        "Sent",
        async (messageId, chainId, destination, from, to, amount, event) => {
            try {
                logEventReceived(
                    messageId,
                    chainId,
                    destination,
                    from,
                    to,
                    amount
                )

                const tx = execute(messageId, chainId, from, to, amount)
                proccessTrnx(id, chainId, event.log.transactionHash, tx)
            } catch (err) {
                console.error(`Error proccessing event: ${err}`)
                if (retrie < MAX_RETRIES) {
                    console.log(`Retrying in ${RETRIE_INTERVAL / 1000} seconds`)
                    setTimeout(() => main(id, retrie + 1), RETRIE_INTERVAL)
                } else {
                    console.log(`Max retries reached!`)
                    process.exitCode = 1
                }
            }
        }
    )
}

main(80001, 1).catch((err) => {
    console.log(err)
    process.exitCode = 1
})
main(11155111, 1).catch((err) => {
    console.log(err)
    process.exitCode = 1
})
