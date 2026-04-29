pragma solidity ^0.8.20;

import "lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol"; // Assuming parcels are ERC721 tokens
import "lib/openzeppelin-contracts/contracts/utils/math/SafeMath.sol";

contract AdSpace {
    using SafeMath for uint256;

    // Event for when an ad space is listed
    event AdSpaceListed(uint256 indexed listingId, address indexed owner, uint256 parcelId, uint256 price, uint256 duration, string metadataURI);
    // Event for when an ad space is rented
    event AdSpaceRented(uint256 indexed listingId, address indexed lister, address indexed renter, uint256 parcelId, uint256 startTime, uint256 endTime);
    // Event for when an ad space listing is cancelled
    event AdSpaceListingCancelled(uint256 indexed listingId);
    // Event for when an ad space rental ends
    event AdSpaceRentalEnded(uint256 indexed listingId, address indexed lister, address indexed renter, uint256 parcelId);

    struct AdSpaceListing {
        address owner;
        uint256 parcelId;
        uint256 price; // Price per duration unit (e.g., per day)
        uint256 duration; // Duration in seconds (e.g., 1 day = 86400 seconds)
        string metadataURI; // URI to ad content/details
        bool isAvailable;
        uint256 rentalEndTime; // When current rental ends (0 if not rented)
    }

    // Mapping from listing ID to AdSpaceListing struct
    mapping(uint256 => AdSpaceListing) public listings;
    // Counter for unique listing IDs
    uint256 private _listingIdCounter;

    IERC721 public immutable parcelNFT;

    constructor(address _parcelNFTAddress) {
        require(_parcelNFTAddress != address(0), "Invalid Parcel NFT address");
        parcelNFT = IERC721(_parcelNFTAddress);
    }

    function listAdSpace(uint256 _parcelId, uint256 _price, uint256 _duration, string calldata _metadataURI) external {
        // Ensure the caller owns the parcel
        require(parcelNFT.ownerOf(_parcelId) == msg.sender, "Caller does not own the parcel");
        // Ensure price and duration are positive
        require(_price > 0, "Price must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");

        _listingIdCounter = _listingIdCounter.add(1);
        uint256 newListingId = _listingIdCounter;

        listings[newListingId] = AdSpaceListing({
            owner: msg.sender,
            parcelId: _parcelId,
            price: _price,
            duration: _duration,
            metadataURI: _metadataURI,
            isAvailable: true,
            rentalEndTime: 0
        });

        emit AdSpaceListed(newListingId, msg.sender, _parcelId, _price, _duration, _metadataURI);
    }

    function rentAdSpace(uint256 _listingId) external payable {
        AdSpaceListing storage listing = listings[_listingId];

        // Basic checks
        require(listing.isAvailable, "Ad space not available");
        require(listing.owner != address(0), "Listing does not exist");
        require(listing.owner != msg.sender, "Cannot rent your own ad space");
        require(msg.value >= listing.price, "Insufficient payment");

        // Transfer payment to the owner
        payable(listing.owner).transfer(msg.value);

        // Update listing status
        listing.isAvailable = false;
        listing.rentalEndTime = block.timestamp.add(listing.duration);

        emit AdSpaceRented(_listingId, listing.owner, msg.sender, listing.parcelId, block.timestamp, listing.rentalEndTime);
    }

    function endRental(uint256 _listingId) external {
        AdSpaceListing storage listing = listings[_listingId];

        require(listing.owner != address(0), "Listing does not exist");
        require(listing.rentalEndTime > 0, "Ad space is not currently rented");
        // Only the lister or renter can end the rental, or after the rental period has passed
        require(msg.sender == listing.owner || msg.sender == address(this) || block.timestamp >= listing.rentalEndTime, "Not authorized to end rental");

        listing.isAvailable = true;
        listing.rentalEndTime = 0;

        emit AdSpaceRentalEnded(_listingId, listing.owner, msg.sender, listing.parcelId);
    }

    function cancelListing(uint256 _listingId) external {
        AdSpaceListing storage listing = listings[_listingId];

        require(listing.owner == msg.sender, "Only the owner can cancel a listing");
        require(listing.isAvailable, "Cannot cancel a rented ad space");

        delete listings[_listingId]; // Remove the listing

        emit AdSpaceListingCancelled(_listingId);
    }

    // View function to get a listing's details
    function getListing(uint256 _listingId) external view returns (
        address owner,
        uint256 parcelId,
        uint256 price,
        uint256 duration,
        string memory metadataURI,
        bool isAvailable,
        uint256 rentalEndTime
    ) {
        AdSpaceListing storage listing = listings[_listingId];
        return (
            listing.owner,
            listing.parcelId,
            listing.price,
            listing.duration,
            listing.metadataURI,
            listing.isAvailable,
            listing.rentalEndTime
        );
    }
}