import sdk from "./1-initialize-sdk.js";

/* Address of ERC-1155 Membership NFT Contract */
const editionDrop = sdk.getEditionDrop("0x11963Eb894f9d99891f855dc111768cE43b688a4");

/* Address of ERC-20 Token Contract */
const token = sdk.getToken("0x9EB12B0b366ceF7a8EC4116aD5D575afEF7Ced47");

(async () => {
    try {
        /* Grabbing all the Addresses of People who own the Membership NFT (which has a TokenId of 0) */
        const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

        if (walletAddresses.length === 0) {
            console.log("No NFTs have been claimed yet",);
            process.exit(0);
        }

        /* Looping through all Addresses with Membership NFT */
        const airdropTargets = walletAddresses.map((address) => {
            /* Business Logic - each Member get a random Number (between 1 and 10) of Vote Token */
            const randomAmount = Math.floor(Math.random() * 10 + 1);
            console.log(`Going to Airdrop ${randomAmount} Token to ${address}`);

            /* Setting up the Target for the Airdrop */
            return {
                toAddress: address,
                amount: randomAmount,
            };
        });

        console.log("Starting Airdrop");
        /* Transferring Token on all Airdrop Targets */
        /* `transferBatch` will automatically loop through all Targets, and send the Token */
        await token.transferBatch(airdropTargets);
        console.log("Successfully airdropped Tokens to all Holders of the Membership NFT");
    } catch (error) {
        console.error("Failed to airdrop Tokens", error);
    }
})();
