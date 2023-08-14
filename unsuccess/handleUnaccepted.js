const execute = require("../main/execute")
module.exports = async (from, to, unaccepted) => {
    const keys = Object.keys(unaccepted)
    const executedTrnxs = []
    for (let i = 0; i < keys.length; i++) {
        const args = unaccepted[keys[i]].args
        const tx = execute(args[0], args[1], args[3], args[4], args[5])
        const resp = await tx
        executedTrnxs.push(resp)
    }

    const receips = executedTrnxs.map((trnx) => {
        return trnx.wait(1)
    })

    const executedReceips = await Promise.all(receips)

    executedReceips.forEach((receip) => {
        if (receip.status != 1) {
            console.log("!!! Unsuccess 🔥")
            console.log(receip)
        }
    })

    return executedReceips
}
