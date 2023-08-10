const ethers = require("ethers")
require("dotenv").config()

async function main() {
    const from = process.argv[3] * 1 || 11155111
    const to = process.argv[4] * 1 || 80001
    let mumbai = new ethers.JsonRpcProvider(process.env.MUMBAI)
    let sepolia = new ethers.JsonRpcProvider(process.env.SEPOLIA)
    let abi = [
        "event Sent(uint256 messageId,uint256 chainId,address destination,address from,address to,uint256 amount)",
        "event Accepted(uint256 messageId,uint256 chainId,address source,address from,address to,uint256 amount)",
        "function accept(uint256 messageId,uint256 chainId,address source,address from,address to,uint256 amount)public",
    ]
    const bridgeDetails = {
        80001: {
            name: "Polygon Mumbai",
            signer: new ethers.Wallet(process.env.PKEY, mumbai),
            bridgeContract: new ethers.Contract(
                process.env.CON_MUMBAI,
                abi,
                mumbai
            ),
        },
        11155111: {
            name: "Ethereum Sepolia",
            signer: new ethers.Wallet(process.env.PKEY, sepolia),
            bridgeContract: new ethers.Contract(
                process.env.CON_SEPOLIA,
                abi,
                sepolia
            ),
        },
    }

    const sent = bridgeDetails[from].bridgeContract.filters.Sent()
    const sent_events = await bridgeDetails[from].bridgeContract.queryFilter(
        sent
    )
    const accept = bridgeDetails[to].bridgeContract.filters.Accepted()
    const accept_events = await bridgeDetails[to].bridgeContract.queryFilter(
        accept
    )

    for (let i; i < sent_events.length; i++) {
        if (sent_events[i].args[0] == accept_events[0].args[0]) {
            console.log(i)
        }
    }
    s = {}
    sent_events.forEach((el) => {
        s[el.args[0]] = el
    })
    a = {}
    accept_events.forEach((el) => (a[el.args[0]] = el))

    const sent_count = Object.keys(s).length
    Object.keys(a).forEach((el) => {
        delete s[Number.parseInt(el)]
    })

    const response = {
        "Sent Events Count": sent_count,
        "Accepted Events Count": Object.keys(a).length,
        "Unaccepted Events Count": Object.keys(s).length,
        events: s,
    }

    console.log(response)
    return response
}

main().catch((err) => {
    console.log(err)
    process.exitCode = 1
})
