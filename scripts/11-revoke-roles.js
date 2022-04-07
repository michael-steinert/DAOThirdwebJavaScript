import sdk from "./1-initialize-sdk.js";

/* Governance Token - ERC-20 contract */
const token = sdk.getToken("0x9EB12B0b366ceF7a8EC4116aD5D575afEF7Ced47");

/* Revoking Permissions so no one can create more Tokens (only the DAO) */
(async () => {
    try {
        /* Logging the current Roles */
        console.log("Roles that exist right now on the Governance Token (ERC-20):", await token.roles.getAll());

        /* Revoking all Permissions from the ERC-20 Contract */
        /* 0x0 Address means everyone can do the Action */
        await token.roles.setAll({
            admin: [],
            minter: [],
            // transfer: []
        });

        /* Logging the current Roles */
        console.log("Roles after Revoking on the Governance Token (ERC-20):", await token.roles.getAll());

        console.log("Successfully revoked Permissions from the Governance Token (ERC-20)");
    } catch (error) {
        console.error("Failed to revoke Permissions from the Governance Token (ERC-20)", error);
    }
})();
