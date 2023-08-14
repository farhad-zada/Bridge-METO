module.exports = (messageId, chainId, destination, from, to, amount) => {
    console.log(
        `Event Received:\n` +
            `Message ID: ${messageId.toString()}\n` +
            `Chain ID: ${chainId.toString()}\n` +
            `Destination: ${destination}\n` +
            `From: ${from}\n` +
            `To: ${to}\n` +
            `Amount: ${amount.toString()}\n`
    )
}
