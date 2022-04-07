import sdk from "./1-initialize-sdk.js";
import {ethers} from "ethers";

/* Voting / Governance Contract */
const vote = sdk.getVote("0x40E8C66c2ee4945a3B0Af628Bfa0462C1489f398");

/* Governance Token - ERC-20 contract */
const token = sdk.getToken("0x9EB12B0b366ceF7a8EC4116aD5D575afEF7Ced47");

(async () => {
    try {
        /* Creating Proposal to mint 21 Token to the Treasury */
        const amount = 21;
        const description = `Should the DAO mint an additional ${amount} Tokens into the Treasury?`;
        const executions = [
            {
                /* Token Contract that actually executes the Action (Mint) */
                toAddress: token.getAddress(),
                /* Amount of ETH to send in this Proposal */
                nativeTokenValue: 0,
                /* Minting Token to the Vote Contract which is acting as the Treasury */
                transactionData: token.encoder.encode(
                    /* Voting Contract has the Permission to mint new Token */
                    "mintTo", [
                        vote.getAddress(),
                        ethers.utils.parseUnits(amount.toString(), 18)
                    ]
                )
            }
        ];

        /* Creating Proposal */
        await vote.propose(description, executions);

        console.log(`Successfully created Proposal to mint ${amount} Tokens`);
    } catch (error) {
        console.error("Failed to create first Proposal", error);
        process.exit(1);
    }

    try {
        /* Creating Proposal to transfer 2 Token to the Deployer */
        const amount = 2;
        const description = `Should the DAO transfer ${amount} Tokens from the Treasury to ${process.env.WALLET_ADDRESS}?`;
        const executions = [
            {
                toAddress: token.getAddress(),
                nativeTokenValue: 0,
                transactionData: token.encoder.encode(
                    /* Transferring Token from Treasury to Deployer */
                    "transfer",
                    [
                        process.env.WALLET_ADDRESS,
                        ethers.utils.parseUnits(amount.toString(), 18)
                    ]
                )
            }
        ];

        /* Creating Proposal */
        await vote.propose(description, executions);

        console.log("Successfully created Proposal to reward Deployer from the Treasury");
    } catch (error) {
        console.error("Failed to create second Proposal", error);
    }
})();
