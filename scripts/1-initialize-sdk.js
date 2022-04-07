import {ThirdwebSDK} from "@thirdweb-dev/sdk";
import ethers from "ethers";
/* Importing and configuring Environment Variables */
import dotenv from "dotenv";

dotenv.config();

if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
    console.log("Private key not found");
}

if (!process.env.RINKEBY_RPC_URL || process.env.RINKEBY_RPC_URL === "") {
    console.log("Rinkeby RPC URL not found");
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
    console.log("Wallet Address not found");
}

const sdk = new ThirdwebSDK(
    new ethers.Wallet(
        process.env.PRIVATE_KEY,
        ethers.getDefaultProvider(process.env.RINKEBY_RPC_URL)
    )
);

(async () => {
    try {
        const address = await sdk.getSigner().getAddress();
        console.log("SDK initialized by Address:", address);
    } catch (error) {
        console.error("Failed to get Apps from the SDK", error);
        process.exit(1);
    }
})();

/* Exporting initialized thirdweb SDK to use it in other Scripts */
export default sdk;
