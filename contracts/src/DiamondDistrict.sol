// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RoyaltyDistributor.sol";

/**
 * @title DiamondDistrict
 * @dev Provably fair gambling protocol using Chainlink VRF v2.5.
 * Note: Chainlink VRF v2.5 interfaces are defined here as they are not available in the local environment.
 */

interface IVRFCoordinatorV2Plus {
    function requestRandomWords(
        VRFV2PlusClient.RandomWordsRequest calldata req
    ) external returns (uint256 requestId);
}

library VRFV2PlusClient {
    struct ExtraArgsV1 {
        bool nativePayment;
    }
    struct RandomWordsRequest {
        bytes32 keyHash;
        uint256 subId;
        uint16 requestConfirmations;
        uint32 callbackGasLimit;
        uint32 numWords;
        bytes extraArgs;
    }
    function _argsToBytes(ExtraArgsV1 memory extraArgs) internal pure returns (bytes memory) {
        return abi.encode(extraArgs);
    }
}

abstract contract VRFConsumerBaseV2Plus {
    IVRFCoordinatorV2Plus public immutable s_vrfCoordinator;
    constructor(address _vrfCoordinator) {
        s_vrfCoordinator = IVRFCoordinatorV2Plus(_vrfCoordinator);
    }
    function fulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) internal virtual;
    function rawFulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) external {
        require(msg.sender == address(s_vrfCoordinator), "Only coordinator can fulfill");
        fulfillRandomWords(requestId, randomWords);
    }
}

contract DiamondDistrict is VRFConsumerBaseV2Plus, Ownable {
    IERC20 public mtwToken;
    RoyaltyDistributor public royaltyDistributor;

    uint256 public s_subscriptionId;
    bytes32 public keyHash;
    uint32 public callbackGasLimit = 100000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 1;

    struct Bet {
        address player;
        uint256 amount;
        uint256 gameType; // 0: Dice, 1: CoinFlip, 2: Roulette
        string parcelId;
        bool resolved;
        bool won;
        uint256 result;
    }

    mapping(uint256 => Bet) public bets;

    event BetPlaced(uint256 indexed requestId, address indexed player, uint256 amount, uint256 gameType);
    event BetResolved(uint256 indexed requestId, address indexed player, bool won, uint256 result);

    constructor(
        address _mtwToken,
        address _royaltyDistributor,
        address _vrfCoordinator,
        uint256 _subscriptionId,
        bytes32 _keyHash
    ) VRFConsumerBaseV2Plus(_vrfCoordinator) Ownable(msg.sender) {
        mtwToken = IERC20(_mtwToken);
        royaltyDistributor = RoyaltyDistributor(_royaltyDistributor);
        s_subscriptionId = _subscriptionId;
        keyHash = _keyHash;
    }

    function placeBet(uint256 amount, uint256 gameType, string calldata parcelId) external returns (uint256 requestId) {
        require(amount > 0, "Amount must be > 0");
        require(mtwToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: false}))
            })
        );

        bets[requestId] = Bet({
            player: msg.sender,
            amount: amount,
            gameType: gameType,
            parcelId: parcelId,
            resolved: false,
            won: false,
            result: 0
        });

        emit BetPlaced(requestId, msg.sender, amount, gameType);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) internal override {
        Bet storage bet = bets[requestId];
        require(!bet.resolved, "Bet already resolved");

        uint256 result = randomWords[0];
        bet.result = result;
        bet.resolved = true;

        bool won = false;
        uint256 payout = 0;

        if (bet.gameType == 0) { // Dice (Over 50)
            won = (result % 100) > 50;
        } else if (bet.gameType == 1) { // CoinFlip
            won = (result % 2) == 0;
        } else if (bet.gameType == 2) { // Roulette (Basic Red/Black)
            won = (result % 2) == 0;
        }

        bet.won = won;

        if (won) {
            payout = bet.amount * 2;
            uint256 fee = (payout * 3) / 100; // 3% fee
            uint256 finalPayout = payout - fee;

            require(mtwToken.transfer(bet.player, finalPayout), "Payout failed");
            
            // Send fee to royalty distributor
            mtwToken.approve(address(royaltyDistributor), fee);
            royaltyDistributor.distribute(fee, bet.parcelId);
        }

        emit BetResolved(requestId, bet.player, won, result);
    }

    function withdrawMTW(uint256 amount) external onlyOwner {
        require(mtwToken.transfer(msg.sender, amount), "Withdrawal failed");
    }

    function setVrfConfig(uint256 _subscriptionId, bytes32 _keyHash) external onlyOwner {
        s_subscriptionId = _subscriptionId;
        keyHash = _keyHash;
    }
}
