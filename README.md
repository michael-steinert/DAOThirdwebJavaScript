# DAO - Agile Software Development (thirdweb)

* DAO stands for Decentralized Autonomous Organization
* A DAO is an Organization without a single Leader; instead, Rules are encoded in the Blockchain (Smart Contracts)
* It is completely transparent and everyone who participates has a Stake
* Decisions are made via Voting amongst those who own non-fungible Tokens (NFTs) from the DAO, which grant Membership
* A DAO is an Entity with no central Leadership
* Decisions get made from the bottom-up, governed by a Community organized around a specific Set of Rules enforced on a Blockchain

## Thirdweb

* The DAO consists of the following three Smart Contracts:

    * EditionDrop Contract (ERC-1155 - NFT), Address: 0x11963Eb894f9d99891f855dc111768cE43b688a4
    * Token Module (ERC-20 - Governance), Address: 0x9EB12B0b366ceF7a8EC4116aD5D575afEF7Ced47
    * Vote Contract, Address: 0x40E8C66c2ee4945a3B0Af628Bfa0462C1489f398

* The Governance Contract is set up to stop Voting after 24-Hours
* That means after 24-Hours, if the Votes __for__ the Proposal are greater than Votes __against__ the Proposal, then any Member would be able to execute the Proposal via the Governance Contract
* Proposals can not be executed automatically
* Once a Proposal passes, any Member of the DAO can trigger the accepted Proposal
* For Example: The Proposal for minting an additional 21 Token has more Votes for the Proposal as against it — then any Member can trigger the Proposal and the Contract will automatically mint the 21 Token
* Therefore, Trust is not needed because the Blockchain will automatically execute the Action

## Token Tracker

* A Token Tracker on an Explorer show the Total Supply of the Token and the following Information
* Who holds these Token
* Who is transferring around Tokens and how much Token are being moved around
