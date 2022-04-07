import sdk from "./1-initialize-sdk.js";

/* The Voting Contract let People vote on Proposals */
/* It automatically counts up those Votes, and then any Member would be able to execute the Proposal on-chain */
(async () => {
    try {
        const voteContractAddress = await sdk.deployer.deployVote({
            name: "Agile DAO Governance",
            /* Location of Governance Token (ERC-20 Contract) to accept from the Vote Contract */
            voting_token_address: "0x9EB12B0b366ceF7a8EC4116aD5D575afEF7Ced47",
            /* The following Parameters are specified in Number of Blocks */
            /* After a Proposal is created, the Members start voting immediately */
            voting_delay_in_blocks: 0,
            /* Members have to vote for one Day on a Proposal */
            /* Assuming Block Time of around 13.14 Seconds (for Ethereum) times 6570 Blocks corresponds to one Day */
            voting_period_in_blocks: 6570,
            /* The Minimum Percentage of the Total Supply that need to vote for the Proposal to be valid after the Time for the Proposal has ended */
            /* `voting_quorum_fraction` of 0 means the Proposal will pass regardless of what Percentage of Token was used on the Vote */
            /* The Worst Case: One Person could technically pass a Proposal themselves if the other Members do not vote */
            voting_quorum_fraction: 0,
            /* The Minimum Number of Tokens a Member needs to be allowed to create a Proposal? */
            proposal_token_threshold: 0
        });

        console.log("Successfully deployed Vote Contract, Address:", voteContractAddress);
    } catch (error) {
        console.error("Failed to deploy Vote Contract", error);
    }
})();
