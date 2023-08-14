const bridgeDetails = require("../main/bridgeDetails")

module.exports = async (from, to) => {
    console.log("Getting events...")

    const sentFilter = bridgeDetails[from].bridgeContract.filters.Sent()
    console.log(`\tGetting sent events from: ${from}`)
    const sentEvents = await bridgeDetails[from].bridgeContract.queryFilter(
        sentFilter
    )
    const acceptedFilter = bridgeDetails[to].bridgeContract.filters.Accepted()
    console.log(`\tGetting accepted events in ${to}`)
    const acceptedEvents = await bridgeDetails[to].bridgeContract.queryFilter(
        acceptedFilter
    )

    let sentDict = {}
    sentEvents.forEach((el) => {
        sentDict[el.args[0]] = el
    })
    console.log("Has built dictionary of sent events by message IDs.")
    let acceptedDict = {}
    acceptedEvents.forEach((el) => {
        acceptedDict[el.args[0]] = el
    })
    console.log("Has built dictionary of accepted events by message IDs.")

    const sentCount = Object.keys(sentDict).length
    const acceptedCount = Object.keys(acceptedDict).length
    const unacceptedDict = {}
    Object.keys(sentDict).forEach((el) => {
        if (!acceptedDict[el]) {
            unacceptedDict[el] = sentDict[el]
        }
    })
    console.log("Has built dictionary of unaccepted events by message IDs.")

    const unacceptedCount = Object.keys(unacceptedDict).length

    const response = {
        "Sent Events Count": sentCount,
        "Accepted Events Count": acceptedCount,
        "Unaccepted Events Count": unacceptedCount,
        unaccepted: unacceptedDict,
    }
    console.log("Returned response.")

    return response
}
