import sdk from "./1-initialize-sdk.js";
import {readFileSync} from "fs";

const editionDrop = sdk.getEditionDrop("0x11963Eb894f9d99891f855dc111768cE43b688a4");

/* Deploying Metadata associated with the Membership NFT */
(async () => {
    try {
        await editionDrop.createBatch([
            {
                name: "Agile Development",
                description: "This NFT will give Access to Agile Development DAO",
                image: readFileSync("scripts/assets/agile-dao.png")
            }
        ]);
        console.log("Successfully created a new NFT in the EditionDrop");
    } catch (error) {
        console.error("Failed to create the new NFT", error);
    }
})();
