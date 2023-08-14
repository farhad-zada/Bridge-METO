const ethers = require("ethers")
require("dotenv").config()
const response = require("./response")
const handleUnaccepted = require("./handleUnaccepted")
const fs = require("fs")

async function main(from, to) {
    const resp = await response(from, to)

    fs.writeFile("./data/unaccepted.json", JSON.stringify(resp), {}, (err) => {
        if (err) {
            console.log(err)
        }
    })
    const tmp = Object.assign({}, resp)
    delete tmp["unaccepted"]
    console.log(tmp)

    if (
        (process.argv[2] === "--execute") &
        (resp["Unaccepted Events Count"] > 0)
    ) {
        console.log(
            "Executing unsuccessful transfers. This may take some time. Please, wait till we handle it...💫"
        )
        const executedReceips = await handleUnaccepted(
            from,
            to,
            resp.unaccepted
        )

        console.log("Execution done! ✅")
        console.log(
            "In order to check if all the unsuccessful transfers has been handled " +
                "please run the previous command again!"
        )
    } else if (resp["Unaccepted Events Count"] === 0) {
        console.log(
            `Congrats! 🍺 0 unaccepted transfers from: ${from} to: ${to}`
        )
    }
    console.log("Finished the CMD ✅")
}

main(80001, 11155111).catch((err) => {
    console.log(err)
    process.exitCode = 1
})
