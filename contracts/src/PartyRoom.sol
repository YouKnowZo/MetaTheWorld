// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

/// @title PartyRoom
/// @notice On-chain VIP party rooms with creator-controlled entry fees.
///         Revenue split: 85 % creator, 15 % platform DAO.
contract PartyRoom is ReentrancyGuard, Ownable {
    // ─── Constants ───────────────────────────────────────────────────────────
    uint256 public constant BASIS         = 10_000;
    uint256 public constant CREATOR_BPS   = 8_500; // 85 %
    uint256 public constant PLATFORM_BPS  = 1_500; // 15 %

    // ─── Types ───────────────────────────────────────────────────────────────
    struct Room {
        uint256 id;
        string  name;
        address creator;
        uint256 entryFee;        // in wei
        uint256 maxCapacity;
        uint256 currentOccupancy;
        uint256 totalRevenue;    // gross revenue in wei
        uint256 creatorEarnings; // claimable by creator
        bool    isActive;
    }

    // ─── State ───────────────────────────────────────────────────────────────
    uint256 public nextRoomId;
    uint256 public platformFees;

    mapping(uint256 => Room)                      public rooms;
    /// roomId => user => isInRoom
    mapping(uint256 => mapping(address => bool))  public isInRoom;
    /// roomId => user => entryTimestamp
    mapping(uint256 => mapping(address => uint256)) public entryTime;

    // ─── Events ──────────────────────────────────────────────────────────────
    event RoomCreated(
        uint256 indexed roomId,
        string  name,
        address indexed creator,
        uint256 entryFee,
        uint256 maxCapacity
    );
    event RoomEntered(
        uint256 indexed roomId,
        address indexed user,
        uint256 feePaid
    );
    event RoomLeft(
        uint256 indexed roomId,
        address indexed user
    );
    event EarningsWithdrawn(
        uint256 indexed roomId,
        address indexed creator,
        uint256 amount
    );
    event PlatformFeesWithdrawn(address to, uint256 amount);
    event RoomDeactivated(uint256 indexed roomId);

    // ─── Constructor ─────────────────────────────────────────────────────────
    constructor() Ownable(msg.sender) {}

    // ─── External: Create ────────────────────────────────────────────────────
    /// @notice Create a new VIP room.
    /// @param name         Human-readable room name.
    /// @param entryFee     Entry cost in wei (0 = free room).
    /// @param maxCapacity  Maximum simultaneous occupants.
    function createRoom(
        string calldata name,
        uint256 entryFee,
        uint256 maxCapacity
    ) external returns (uint256 roomId) {
        require(bytes(name).length > 0,  "PartyRoom: empty name");
        require(maxCapacity > 0,          "PartyRoom: zero capacity");

        roomId = nextRoomId++;
        rooms[roomId] = Room({
            id:               roomId,
            name:             name,
            creator:          msg.sender,
            entryFee:         entryFee,
            maxCapacity:      maxCapacity,
            currentOccupancy: 0,
            totalRevenue:     0,
            creatorEarnings:  0,
            isActive:         true
        });

        emit RoomCreated(roomId, name, msg.sender, entryFee, maxCapacity);
    }

    // ─── External: Enter ─────────────────────────────────────────────────────
    /// @notice Pay entry fee and enter a room.
    function enterRoom(uint256 roomId) external payable nonReentrant {
        Room storage r = rooms[roomId];
        require(r.isActive, "PartyRoom: room not active");
        require(!isInRoom[roomId][msg.sender], "PartyRoom: already in room");
        require(r.currentOccupancy < r.maxCapacity, "PartyRoom: room full");
        require(msg.value >= r.entryFee, "PartyRoom: insufficient fee");

        isInRoom[roomId][msg.sender]  = true;
        entryTime[roomId][msg.sender] = block.timestamp;
        r.currentOccupancy++;

        if (r.entryFee > 0) {
            uint256 platformCut = (r.entryFee * PLATFORM_BPS) / BASIS;
            uint256 creatorCut  = r.entryFee - platformCut;

            r.totalRevenue    += r.entryFee;
            r.creatorEarnings += creatorCut;
            platformFees      += platformCut;
        }

        // Refund overpayment
        if (msg.value > r.entryFee) {
            (bool ok,) = payable(msg.sender).call{value: msg.value - r.entryFee}("");
            require(ok, "PartyRoom: refund failed");
        }

        emit RoomEntered(roomId, msg.sender, r.entryFee);
    }

    // ─── External: Leave ─────────────────────────────────────────────────────
    /// @notice Leave a room (no refund — fees are non-refundable).
    function leaveRoom(uint256 roomId) external {
        require(isInRoom[roomId][msg.sender], "PartyRoom: not in room");

        isInRoom[roomId][msg.sender] = false;
        if (rooms[roomId].currentOccupancy > 0) {
            rooms[roomId].currentOccupancy--;
        }

        emit RoomLeft(roomId, msg.sender);
    }

    // ─── External: Withdraw creator earnings ─────────────────────────────────
    /// @notice Room creator withdraws their accumulated earnings.
    function withdrawCreatorEarnings(uint256 roomId) external nonReentrant {
        Room storage r = rooms[roomId];
        require(r.creator == msg.sender, "PartyRoom: not room creator");

        uint256 amount = r.creatorEarnings;
        require(amount > 0, "PartyRoom: no earnings");

        r.creatorEarnings = 0;
        (bool ok,) = payable(msg.sender).call{value: amount}("");
        require(ok, "PartyRoom: transfer failed");

        emit EarningsWithdrawn(roomId, msg.sender, amount);
    }

    // ─── Admin ───────────────────────────────────────────────────────────────
    /// @notice Platform owner withdraws accumulated platform fees.
    function withdrawPlatformFees() external onlyOwner nonReentrant {
        uint256 amount = platformFees;
        require(amount > 0, "PartyRoom: no platform fees");
        platformFees = 0;
        (bool ok,) = payable(owner()).call{value: amount}("");
        require(ok, "PartyRoom: withdraw failed");
        emit PlatformFeesWithdrawn(owner(), amount);
    }

    /// @notice Deactivate a room. Only owner or creator.
    function deactivateRoom(uint256 roomId) external {
        Room storage r = rooms[roomId];
        require(
            msg.sender == r.creator || msg.sender == owner(),
            "PartyRoom: not authorised"
        );
        r.isActive = false;
        emit RoomDeactivated(roomId);
    }

    // ─── View ────────────────────────────────────────────────────────────────
    function getRoom(uint256 roomId) external view returns (Room memory) {
        return rooms[roomId];
    }

    function isUserInRoom(uint256 roomId, address user) external view returns (bool) {
        return isInRoom[roomId][user];
    }

    receive() external payable {}
}
