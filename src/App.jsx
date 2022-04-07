import {useState, useEffect, useMemo} from "react";
import {useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork} from "@thirdweb-dev/react";
import {ChainId} from "@thirdweb-dev/sdk";
import {AddressZero} from "@ethersproject/constants";

const App = () => {
    const address = useAddress();
    const network = useNetwork();
    const connectWithMetamask = useMetamask();
    console.log("Address:", address);

    /* Initializing EditionDrop Contract ERC-1155 */
    /* ERC-1155 Contract contains all Member Addresses */
    const editionDrop = useEditionDrop("0x11963Eb894f9d99891f855dc111768cE43b688a4");
    /* Initializing Token Contract ERC-20 */
    /* ERC-20 contains Number of Tokens for each Member */
    const token = useToken("0x9EB12B0b366ceF7a8EC4116aD5D575afEF7Ced47");
    /* Initializing Voting Contract */
    const vote = useVote("0x40E8C66c2ee4945a3B0Af628Bfa0462C1489f398");
    /* State Variable to know if User has a Membership NFT */
    const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
    /* `isClaiming` keep a Loading State while the NFT is minting */
    const [isClaiming, setIsClaiming] = useState(false);
    /* Amount of Token each Member has in State */
    const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
    /* All Member Addresses */
    const [memberAddresses, setMemberAddresses] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [isVoting, setIsVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }

        const getAllProposals = async () => {
            try {
                /* Grabbing all Proposals */
                const proposals = await vote.getAll();
                setProposals(proposals);
            } catch (error) {
                console.log("Failed to get Proposals", error);
            }
        };
        getAllProposals().catch(console.error);
    }, [hasClaimedNFT, vote]);

    /* Checking if User has already voted */
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }

        /* If the Retrieving of the Proposals have not finished then it is not possible to check if the User has voted yet */
        if (!proposals.length) {
            return;
        }

        const checkIfUserHasVoted = async () => {
            try {
                /* Checking if the User has voted yet */
                const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
                /* If `hasVoted` is true then the User can not vote again */
                setHasVoted(hasVoted);
                if (hasVoted) {
                    console.log("User has already voted");
                } else {
                    console.log("User has not voted yet");
                }
            } catch (error) {
                console.error("Failed to check if User has voted yet", error);
            }
        };
        checkIfUserHasVoted().catch(console.error);

    }, [hasClaimedNFT, proposals, address, vote]);


    /* Grabbing all the Addresses of Members that hole the NFT */
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }

        /* Grabbing all Users who hold the NFT with TokenId 0 */
        const getAllAddresses = async () => {
            try {
                /* Getting all Addresses of Members who hold a Member NFT from the ERC-1155 Contract */
                const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
                setMemberAddresses(memberAddresses);
                console.log("Members Addresses", memberAddresses);
            } catch (error) {
                console.error("Failed to get Members that hold the Membership Token", error);
            }

        };
        getAllAddresses().catch(console.error);
    }, [hasClaimedNFT, editionDrop.history]);

    /* Grabbing Number of ERC-20 Token of each Member holds */
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }

        const getAllBalances = async () => {
            try {
                /* Getting the Token Balances (ERC-20) of every User who holds the Membership NFT (ERC-1155) */
                const amounts = await token.history.getAllHolderBalances();
                setMemberTokenAmounts(amounts);
                console.log("Amounts of Governance Token", amounts);
            } catch (error) {
                console.error("Failed to get Member Balances of Goernance Token", error);
            }
        };
        getAllBalances().catch(console.error);
    }, [hasClaimedNFT, token.history]);

    /* Combining `memberAddresses` and `memberTokenAmounts` into a single List */
    const memberList = useMemo(() => {
        return memberAddresses.map((address) => {
            /* Checking if Address are present in the `memberTokenAmounts` */
            const member = memberTokenAmounts?.find(({holder}) => holder === address);
            /* Returning Amount of Token the User has, otherwise 0 */
            return {
                address,
                tokenAmount: member?.balance.displayValue || "0"
            }
        });
    }, [memberAddresses, memberTokenAmounts]);

    useEffect(() => {
        /* If User do not have a connected Wallet then exit */
        if (!address) {
            return;
        }

        const checkBalance = async () => {
            try {
                /* Getting Balance of User with TokenId 0 - querying deployed Smart Contract for the Data */
                const balance = await editionDrop.balanceOf(address, 0);
                if (balance.gt(0)) {
                    setHasClaimedNFT(true);
                    console.log("This User has a Membership NFT");
                } else {
                    setHasClaimedNFT(false);
                    console.log("This User does not have a Membership NFT");
                }
            } catch (error) {
                setHasClaimedNFT(false);
                console.error("Failed to get Balance", error);
            }
        };
        checkBalance().catch(console.error);
    }, [address, editionDrop]);

    const mintNft = async () => {
        try {
            setIsClaiming(true);
            /* Minting the one NFT with TokenId 0 to the Users Wallet */
            await editionDrop.claim("0", 1);
            console.log(`Successfully minted - NFT on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
            setHasClaimedNFT(true);
        } catch (error) {
            setHasClaimedNFT(false);
            console.error("Failed to mint NFT", error);
        } finally {
            setIsClaiming(false);
        }
    };

    if (network?.[0].data.chain.id !== ChainId.Rinkeby) {
        return (
            <div className={"unsupported-network"}>
                <h2>Please connect to the Rinkeby Chain</h2>
                <p>This decentralized Application only works on the Rinkeby Network</p>
            </div>
        );
    }

    const handleSubmit = async (formEvent) => {
        formEvent.preventDefault();
        formEvent.stopPropagation();

        /* Before asynchronous Functions disable Button to prevent double Clicks */
        setIsVoting(true);

        /* Getting Values from the Form for the Votes */
        const votes = proposals.map((proposal) => {
            const voteResult = {
                proposalId: proposal.proposalId,
                /* Abstain by Default */
                vote: 2
            };
            proposal.votes.forEach((vote) => {
                const voteElement = document.getElementById(proposal.proposalId + "-" + vote.type);

                if (voteElement.checked) {
                    voteResult.vote = vote.type;
                }
            });
            return voteResult;
        });

        /* Making sure that the User delegates his Token to vote */
        try {
            /* Checking if the User still needs to delegate his Token before he can vote */
            const delegation = await token.getDelegationOf(address);
            /* If the delegation is the 0x0 Address that means the User has not delegated his Governance Tokens yet */
            if (delegation === AddressZero) {
                /* If User has not delegated his Token yet, he will have to delegate them before voting */
                await token.delegateTo(address);
            }
            /* Voting on the Proposals */
            try {
                await Promise.all(
                    votes.map(async ({proposalId, vote: _vote}) => {
                        /* Checking before Voting whether the Proposal is open for Voting by getting the latest State of Proposal */
                        const proposal = await vote.get(proposalId);
                        /* Checking if the Proposal is open for Voting (state === 1 means it is open) */
                        if (proposal.state === 1) {
                            /* If the Proposal is open for Voting then vote on it */
                            return vote.vote(proposalId, _vote);
                        }
                    })
                );
                try {
                    /* Checking inf any of the Proposals are ready to be executed then execute them */
                    /* A Proposal is ready to be executed if its is in State 4 */
                    await Promise.all(
                        votes.map(async ({proposalId}) => {
                            /* Getting the latest State of the Proposal again, since it could have just be voted before */
                            const proposal = await vote.get(proposalId);

                            /* If the State is in State 4 (meaning that the Proposal is ready to be executed), then execute the Proposal */
                            if (proposal.state === 4) {
                                return vote.execute(proposalId);
                            }
                        })
                    );
                    /* On this Point the User has successfully voted */
                    setHasVoted(true);
                    console.log(`${address} has successfully voted`);
                } catch (error) {
                    console.error("Failed to execute Votes", error);
                }
            } catch (error) {
                console.error("Failed to vote", error);
            }
        } catch (error) {
            console.error("Failed to delegate Tokens", error);
        } finally {
            /* Enabling Button again after asynchronous Functions */
            setIsVoting(false);
        }
    }

    /* Shortening Address of Members */
    const shortenAddress = (address) => {
        return (`${address.substring(0, 6)}...${address.substring(address.length - 4)}`);
    };

    /* User has not connected their Wallet */
    if (!address) {
        return (
            <div className={"landing"}>
                <h1>Welcome to Agile Development DAO</h1>
                <button onClick={connectWithMetamask} className={"btn-hero"}>
                    Connect wallet
                </button>
            </div>
        );
    }

    /* User has already claimed his NFT */
    if (hasClaimedNFT) {
        return (
            <div className={"member-page"}>
                <h1>Agile DAO Member Page</h1>
                <p>Congratulations on being a Member</p>
                <div>
                    <div>
                        <h2>Member List</h2>
                        <table className={"card"}>
                            <thead>
                            <tr>
                                <th>Address</th>
                                <th>Token Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                memberList.map((member) => {
                                    return (
                                        <tr key={member.address}>
                                            <td>{shortenAddress(member.address)}</td>
                                            <td>{member.tokenAmount}</td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h2>Active Proposals</h2>
                        <form onSubmit={handleSubmit}>
                            {
                                proposals.map((proposal) => (
                                    <div key={proposal.proposalId} className={"card"}>
                                        <h5>{proposal.description}</h5>
                                        <div>
                                            {
                                                proposal.votes.map(({type, label}) => (
                                                    <div key={type}>
                                                        <input
                                                            type={"radio"}
                                                            id={proposal.proposalId + "-" + type}
                                                            name={proposal.proposalId}
                                                            value={type}
                                                            /* Default is abstain Vote to be checked */
                                                            defaultChecked={type === 2}
                                                        />
                                                        <label htmlFor={proposal.proposalId + "-" + type}>
                                                            {label}
                                                        </label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                            <button disabled={isVoting || hasVoted} type={"submit"}>
                                {
                                    isVoting
                                        ? (
                                            "Voting..."
                                        ) : (
                                            hasVoted
                                                ? (
                                                    "You Already Voted"
                                                ) : (
                                                    "Submit Votes"
                                                )
                                        )
                                }
                            </button>
                            {
                                !hasVoted && (
                                    <small>
                                        This will trigger multiple Transactions that have to be sign
                                    </small>
                                )
                            }
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    /* User has connected his Wallet */
    return (
        <div className={"mint-nft"}>
            <h1>Mint your Agile DAO Membership NFT</h1>
            <button
                disabled={isClaiming}
                onClick={mintNft}
            >
                {
                    isClaiming ? (
                        "Minting"
                    ) : (
                        "Mint your Agile NFT"
                    )
                }
            </button>
        </div>
    );
}

export default App;
