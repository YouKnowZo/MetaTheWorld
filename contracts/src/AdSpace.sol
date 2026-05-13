// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

/// @title AdSpace
/// @notice Virtual billboard / ad-space marketplace on top of land parcels.
///         Revenue split: 60 % land owner, 40 % platform.
contract AdSpace is ReentrancyGuard, Ownable {
    // ─── Constants ───────────────────────────────────────────────────────────
    uint256 public constant BASIS           = 10_000;
    uint256 public constant OWNER_BPS       = 6_000; // 60 %
    uint256 public constant PLATFORM_BPS    = 4_000; // 40 %
    uint256 public constant CANCEL_WINDOW   = 48 hours;

    // ─── Types ───────────────────────────────────────────────────────────────
    struct AdSlot {
        uint256 id;
        bytes32 parcelId;    // linked land parcel identifier
        address owner;       // land owner who registered the slot
        uint256 dailyRate;   // price per day in wei
        uint256 maxDuration; // maximum booking duration in days
        uint256 ownerEarnings; // claimable by slot owner
        bool    isActive;
    }

    struct Booking {
        uint256 id;
        uint256 slotId;
        address advertiser;
        uint256 startTime;   // unix timestamp
        uint256 endTime;     // unix timestamp
        string  contentCID;  // IPFS CID of ad creative
        uint256 totalPaid;   // wei paid
        bool    cancelled;
    }

    // ─── State ───────────────────────────────────────────────────────────────
    uint256 public nextSlotId;
    uint256 public nextBookingId;
    uint256 public platformFees;

    mapping(uint256 => AdSlot)   public slots;
    mapping(uint256 => Booking)  public bookings;
    /// slotId => array of booking ids (for overlap checks)
    mapping(uint256 => uint256[]) public slotBookings;

    // ─── Events ──────────────────────────────────────────────────────────────
    event SlotRegistered(
        uint256 indexed slotId,
        bytes32 indexed parcelId,
        address indexed owner,
        uint256 dailyRate,
        uint256 maxDuration
    );
    event AdBooked(
        uint256 indexed bookingId,
        uint256 indexed slotId,
        address indexed advertiser,
        uint256 startTime,
        uint256 endTime,
        uint256 totalPaid
    );
    event BookingCancelled(
        uint256 indexed bookingId,
        address indexed advertiser,
        uint256 refundAmount
    );
    event EarningsWithdrawn(address indexed owner, uint256 amount);
    event PlatformFeesWithdrawn(address to, uint256 amount);
    event SlotDeactivated(uint256 indexed slotId);

    // ─── Constructor ─────────────────────────────────────────────────────────
    constructor() Ownable(msg.sender) {}

    // ─── External: Register slot ─────────────────────────────────────────────
    /// @notice Land owner registers their parcel as an ad slot.
    /// @param parcelId       Off-chain parcel identifier (keccak256 hash).
    /// @param dailyRate      Price per day in wei.
    /// @param maxDurationDays Maximum days a single booking may run.
    function registerAdSlot(
        bytes32 parcelId,
        uint256 dailyRate,
        uint256 maxDurationDays
    ) external returns (uint256 slotId) {
        require(dailyRate > 0,        "AdSpace: zero daily rate");
        require(maxDurationDays > 0,  "AdSpace: zero max duration");
        require(maxDurationDays <= 365, "AdSpace: max 365 days");

        slotId = nextSlotId++;
        slots[slotId] = AdSlot({
            id:             slotId,
            parcelId:       parcelId,
            owner:          msg.sender,
            dailyRate:      dailyRate,
            maxDuration:    maxDurationDays,
            ownerEarnings:  0,
            isActive:       true
        });

        emit SlotRegistered(slotId, parcelId, msg.sender, dailyRate, maxDurationDays);
    }

    // ─── External: Book slot ─────────────────────────────────────────────────
    /// @notice Advertiser books an ad slot for a given duration.
    /// @param slotId       Target slot.
    /// @param durationDays Number of days (1–maxDuration).
    /// @param contentCID   IPFS CID of the ad creative.
    function bookAdSlot(
        uint256 slotId,
        uint256 durationDays,
        string calldata contentCID
    ) external payable nonReentrant returns (uint256 bookingId) {
        AdSlot storage s = slots[slotId];
        require(s.isActive, "AdSpace: slot not active");
        require(durationDays > 0 && durationDays <= s.maxDuration, "AdSpace: invalid duration");
        require(bytes(contentCID).length > 0, "AdSpace: empty content CID");

        uint256 totalCost = s.dailyRate * durationDays;
        require(msg.value >= totalCost, "AdSpace: insufficient payment");

        uint256 startTime = block.timestamp;
        uint256 endTime   = startTime + (durationDays * 1 days);

        // Check for overlapping bookings
        uint256[] storage existingBookings = slotBookings[slotId];
        for (uint256 i = 0; i < existingBookings.length; i++) {
            Booking storage b = bookings[existingBookings[i]];
            if (!b.cancelled) {
                require(
                    endTime <= b.startTime || startTime >= b.endTime,
                    "AdSpace: slot overlaps existing booking"
                );
            }
        }

        bookingId = nextBookingId++;
        bookings[bookingId] = Booking({
            id:          bookingId,
            slotId:      slotId,
            advertiser:  msg.sender,
            startTime:   startTime,
            endTime:     endTime,
            contentCID:  contentCID,
            totalPaid:   totalCost,
            cancelled:   false
        });
        slotBookings[slotId].push(bookingId);

        // Distribute revenue
        uint256 platformCut = (totalCost * PLATFORM_BPS) / BASIS;
        uint256 ownerCut    = totalCost - platformCut;
        s.ownerEarnings += ownerCut;
        platformFees    += platformCut;

        // Refund overpayment
        if (msg.value > totalCost) {
            (bool ok,) = payable(msg.sender).call{value: msg.value - totalCost}("");
            require(ok, "AdSpace: refund failed");
        }

        emit AdBooked(bookingId, slotId, msg.sender, startTime, endTime, totalCost);
    }

    // ─── External: Cancel booking ────────────────────────────────────────────
    /// @notice Advertiser cancels a booking. Refund only if >48 h before start.
    function cancelBooking(uint256 bookingId) external nonReentrant {
        Booking storage b = bookings[bookingId];
        require(b.advertiser == msg.sender, "AdSpace: not advertiser");
        require(!b.cancelled, "AdSpace: already cancelled");
        require(block.timestamp < b.startTime, "AdSpace: booking already started");

        b.cancelled = true;

        uint256 refund = 0;
        if (b.startTime - block.timestamp > CANCEL_WINDOW) {
            // Full refund if cancelled more than 48 h before start
            refund = b.totalPaid;

            // Reverse the revenue allocation
            AdSlot storage s = slots[b.slotId];
            uint256 platformCut = (b.totalPaid * PLATFORM_BPS) / BASIS;
            uint256 ownerCut    = b.totalPaid - platformCut;

            if (s.ownerEarnings >= ownerCut) s.ownerEarnings -= ownerCut;
            if (platformFees    >= platformCut) platformFees  -= platformCut;

            (bool ok,) = payable(msg.sender).call{value: refund}("");
            require(ok, "AdSpace: refund transfer failed");
        }
        // No refund if <48 h before start

        emit BookingCancelled(bookingId, msg.sender, refund);
    }

    // ─── External: Withdraw land owner earnings ───────────────────────────────
    function withdrawLandOwnerEarnings(uint256 slotId) external nonReentrant {
        AdSlot storage s = slots[slotId];
        require(s.owner == msg.sender, "AdSpace: not slot owner");

        uint256 amount = s.ownerEarnings;
        require(amount > 0, "AdSpace: no earnings");

        s.ownerEarnings = 0;
        (bool ok,) = payable(msg.sender).call{value: amount}("");
        require(ok, "AdSpace: transfer failed");

        emit EarningsWithdrawn(msg.sender, amount);
    }

    // ─── Admin ───────────────────────────────────────────────────────────────
    function withdrawPlatformFees() external onlyOwner nonReentrant {
        uint256 amount = platformFees;
        require(amount > 0, "AdSpace: no platform fees");
        platformFees = 0;
        (bool ok,) = payable(owner()).call{value: amount}("");
        require(ok, "AdSpace: withdraw failed");
        emit PlatformFeesWithdrawn(owner(), amount);
    }

    function deactivateSlot(uint256 slotId) external {
        AdSlot storage s = slots[slotId];
        require(s.owner == msg.sender || msg.sender == owner(), "AdSpace: not authorised");
        s.isActive = false;
        emit SlotDeactivated(slotId);
    }

    // ─── View ────────────────────────────────────────────────────────────────
    function getSlot(uint256 slotId) external view returns (AdSlot memory) {
        return slots[slotId];
    }

    function getBooking(uint256 bookingId) external view returns (Booking memory) {
        return bookings[bookingId];
    }

    function getSlotBookings(uint256 slotId) external view returns (uint256[] memory) {
        return slotBookings[slotId];
    }

    receive() external payable {}
}
