import sdk from "./1-initialize-sdk.js";

// This is the address of our ERC-20 contract printed out in the step before.
const token = sdk.getToken("0x9EB12B0b366ceF7a8EC4116aD5D575afEF7Ced47");

(async () => {
    try {
        const amount = 42;
        /* Interacting with deployed ERC-20 Contract and mint 42 Token */
        await token.mint(amount);
        const totalSupply = await token.totalSupply();

        console.log(`There now is ${totalSupply.displayValue} $AGILE in Circulation`);
    } catch (error) {
        console.error("Failed to create Token", error);
    }
})();
