import sdk from "./1-initialize-sdk.js";
import {MaxUint256} from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0x11963Eb894f9d99891f855dc111768cE43b688a4");

/* Setting up the Claim Conditions */
(async () => {
    try {
        /* Defining Claim Conditions */
        /* This is an Array of Objects because it is possible to have multiple Phases starting at different Times*/
        const claimConditions = [{
            /* Start Time of Claiming / Minting the NFTs */
            startTime: new Date(),
            /* Maximum Number of NFTs that can be claimed */
            maxQuantity: 50_000,
            /* The Price of the NFT (free) */
            price: 0,
            /* The Amount of NFTs Peoples can claim in one Transaction */
            quantityLimitPerTransaction: 1,
            /* Setting the Wait between Transactions to MaxUint256, which means People are only allowed to claim once */
            waitInSeconds: MaxUint256,
        }]

        /* Interacting with deployed Contract (on-chain) and adjusting the Claim Conditions */
        /* Membership NFT has a `tokenId` of 0 since it is the first Token in the deployed ERC-1155 Contract */
        await editionDrop.claimConditions.set("0", claimConditions);
        console.log("Successfully set Claim Condition!");
    } catch (error) {
        console.error("Failed to set Claim Condition", error);
    }
})();
