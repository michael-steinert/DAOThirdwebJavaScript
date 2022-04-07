import {AddressZero} from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import {readFileSync} from "fs";

/* Not creating NFT, instead creating the ERC-1155 Contract and setting up the Metadata around the Collection itself */
/* In der ERC-721 Standard every NFT is unique, even if they have the same Image, Name, and Properties */
/* In der ERC-1155 Standard multiple User can be the Holder of the same NFT */
/* In this Case, of the `Agile DAO Membership` NFT is the same for every User, so instead of making a new NFT every Time it is simply assign the same NFT to all User */
/* This is more Gas efficient - This is a pretty common Approach for Cases where the NFT is the same for all Holders */
(async () => {
    try {
        const editionDropAddress = await sdk.deployer.deployEditionDrop({
            name: "Agile DAO Membership",
            description: "A DAO for Agile Software Development",
            /* thirdweb will upload and pin the Collection's Image to IPFS */
            /* PNG, JPG or GIF */
            image: readFileSync("scripts/assets/agile-dao.png"),
            /* Address of the Person who will be receiving the Proceeds from Sales of NFTs in the Contract */
            primary_sale_recipient: AddressZero
        });

        /* Using `editionDropAddress` to initialize the Contract on the thirdweb SDK */
        const editionDrop = sdk.getEditionDrop(editionDropAddress);

        /* Getting the Metadata of Contract */
        const metadata = await editionDrop.metadata.get();

        console.log("Successfully deployed editionDrop Contract, Address:", editionDropAddress);

        console.log("editionDrop Metadata:", metadata);
    } catch (error) {
        console.log("Failed to deploy editionDrop Contract", error);
    }
})();
