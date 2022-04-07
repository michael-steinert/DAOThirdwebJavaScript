import sdk from "./1-initialize-sdk.js";

/* Voting / Governance Contract */
const vote = sdk.getVote("0x40E8C66c2ee4945a3B0Af628Bfa0462C1489f398");

/* Governance Token - ERC-20 contract */
const token = sdk.getToken("0x9EB12B0b366ceF7a8EC4116aD5D575afEF7Ced47");

(async () => {
    try {
        /* Giving Treasury the Power to mint additional Token if needed */
        await token.roles.grant("minter", vote.getAddress());

        console.log("Successfully gave Vote Contract Permissions to act on Token Contract");
    } catch (error) {
        console.error("Failed to grant Vote Contract Permissions on Token Contract", error);
        process.exit(1);
    }

    try {
        /* Grabbing Token Balance of Deployer that holds currently all Token from the Airdrop */
        const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS);

        /* Grabbing a Quarter of the Total Supply */
        const ownedAmount = ownedTokenBalance.displayValue;
        const oneQuarterOfAmount = Number(ownedAmount) / 100 * 25;

        /* Transfer a Quarter of the Total Supply to Voting Contract */
        await token.transfer(vote.getAddress(), oneQuarterOfAmount);

        console.log(`Successfully transferred ${oneQuarterOfAmount} Tokens to Vote Contract`);
    } catch (error) {
        console.error("Failed to transfer Tokens to Vote Contract", error);
    }
})();
