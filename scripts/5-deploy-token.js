import sdk from "./1-initialize-sdk.js";
import {AddressZero} from "@ethersproject/constants";

/* Governance Token allows Users to vote on Proposals */
(async () => {
    try {
        /* Deploying a standard ERC-20 Contract */
        const tokenAddress = await sdk.deployer.deployToken({
            name: "AgileDAO Governance Token",
            symbol: "AGILE",
            /* `AddressZero` means that Token should not be sold */
            primary_sale_recipient: AddressZero
        });
        console.log("Successfully deployed Token Module, Address:", tokenAddress);
    } catch (error) {
        console.error("Failed to deploy Token Module", error);
    }
})();
