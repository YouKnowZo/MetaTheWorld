// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

/// @title PlatformRevenue
/// @notice Central treasury that aggregates platform fees from all revenue sources.
///         Internal allocation: Development 30%, Marketing 20%, DAO Treasury 30%, Team 20%.
contract PlatformRevenue is Ownable, ReentrancyGuard {
    // ─── Types ───────────────────────────────────────────────────────────────
    enum RevenueSource {
        MARKETPLACE,
        PARTY_ROOM,
        AD_SPACE,
        TRANSACTION_FEE
    }

    struct RevenueSplit {
        address development;
        address marketing;
        address daoTreasury;
        address team;
    }

    struct MonthlyRecord {
        uint256 year;
        uint256 month;
        uint256 total;
        uint256[4] bySource; // indexed by RevenueSource
    }

    // ─── Constants ───────────────────────────────────────────────────────────
    uint256 public constant BASIS             = 10_000;
    uint256 public constant DEVELOPMENT_BPS   = 3_000; // 30 %
    uint256 public constant MARKETING_BPS     = 2_000; // 20 %
    uint256 public constant DAO_TREASURY_BPS  = 3_000; // 30 %
    uint256 public constant TEAM_BPS          = 2_000; // 20 %

    // ─── State ───────────────────────────────────────────────────────────────
    RevenueSplit public split;
    uint256 public totalDeposited;
    uint256 public totalWithdrawn;

    /// source => total received
    mapping(uint8 => uint256) public revenueBySource;
    /// year*12 + month => MonthlyRecord
    mapping(uint256 => MonthlyRecord) internal _monthlyRecords;
    /// Authorised depositor contracts
    mapping(address => bool) public authorisedDepositors;

    // ─── Events ──────────────────────────────────────────────────────────────
    event RevenueDeposited(
        address indexed from,
        RevenueSource indexed source,
        uint256 amount
    );
    event RevenueWithdrawn(
        address indexed to,
        uint256 development,
        uint256 marketing,
        uint256 daoTreasury,
        uint256 team
    );
    event SplitUpdated(address development, address marketing, address daoTreasury, address team);
    event DepositorAuthorised(address depositor, bool status);

    // ─── Constructor ─────────────────────────────────────────────────────────
    constructor(
        address development,
        address marketing,
        address daoTreasury,
        address team
    ) Ownable(msg.sender) {
        require(development  != address(0), "PlatformRevenue: zero development");
        require(marketing    != address(0), "PlatformRevenue: zero marketing");
        require(daoTreasury  != address(0), "PlatformRevenue: zero daoTreasury");
        require(team         != address(0), "PlatformRevenue: zero team");
        split = RevenueSplit(development, marketing, daoTreasury, team);
    }

    // ─── External: Deposit ───────────────────────────────────────────────────
    /// @notice Accept ETH from the contract itself or authorised sources.
    receive() external payable {
        _recordDeposit(RevenueSource.TRANSACTION_FEE, msg.value);
    }

    /// @notice Labelled deposit from another platform contract.
    function depositRevenue(RevenueSource source) external payable {
        require(
            authorisedDepositors[msg.sender] || msg.sender == owner(),
            "PlatformRevenue: not authorised"
        );
        require(msg.value > 0, "PlatformRevenue: zero deposit");
        _recordDeposit(source, msg.value);
    }

    // ─── External: Withdraw ──────────────────────────────────────────────────
    /// @notice Owner triggers distribution of all held ETH across the four buckets.
    function withdrawToTreasury() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "PlatformRevenue: nothing to withdraw");

        uint256 devAmt  = (balance * DEVELOPMENT_BPS)  / BASIS;
        uint256 mktAmt  = (balance * MARKETING_BPS)    / BASIS;
        uint256 daoAmt  = (balance * DAO_TREASURY_BPS) / BASIS;
        uint256 teamAmt = balance - devAmt - mktAmt - daoAmt; // remainder → team

        totalWithdrawn += balance;

        _sendEth(split.development, devAmt);
        _sendEth(split.marketing,   mktAmt);
        _sendEth(split.daoTreasury, daoAmt);
        _sendEth(split.team,        teamAmt);

        emit RevenueWithdrawn(msg.sender, devAmt, mktAmt, daoAmt, teamAmt);
    }

    /// @notice Withdraw a specific amount to owner (for partial withdrawals).
    function withdrawAmount(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "PlatformRevenue: zero amount");
        require(address(this).balance >= amount, "PlatformRevenue: insufficient balance");

        uint256 devAmt  = (amount * DEVELOPMENT_BPS)  / BASIS;
        uint256 mktAmt  = (amount * MARKETING_BPS)    / BASIS;
        uint256 daoAmt  = (amount * DAO_TREASURY_BPS) / BASIS;
        uint256 teamAmt = amount - devAmt - mktAmt - daoAmt;

        totalWithdrawn += amount;

        _sendEth(split.development, devAmt);
        _sendEth(split.marketing,   mktAmt);
        _sendEth(split.daoTreasury, daoAmt);
        _sendEth(split.team,        teamAmt);

        emit RevenueWithdrawn(msg.sender, devAmt, mktAmt, daoAmt, teamAmt);
    }

    // ─── Admin ───────────────────────────────────────────────────────────────
    function updateSplit(
        address development,
        address marketing,
        address daoTreasury,
        address team
    ) external onlyOwner {
        require(development != address(0) && marketing != address(0)
            && daoTreasury != address(0) && team != address(0),
            "PlatformRevenue: zero address");
        split = RevenueSplit(development, marketing, daoTreasury, team);
        emit SplitUpdated(development, marketing, daoTreasury, team);
    }

    function setAuthorisedDepositor(address depositor, bool status) external onlyOwner {
        authorisedDepositors[depositor] = status;
        emit DepositorAuthorised(depositor, status);
    }

    // ─── View ────────────────────────────────────────────────────────────────
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getRevenueBySource(RevenueSource source) external view returns (uint256) {
        return revenueBySource[uint8(source)];
    }

    /// @notice Monthly revenue report (year as uint, month 1–12).
    function getMonthlyReport(uint256 year, uint256 month)
        external view
        returns (MonthlyRecord memory)
    {
        require(month >= 1 && month <= 12, "PlatformRevenue: invalid month");
        return _monthlyRecords[year * 12 + month];
    }

    function getSummary() external view returns (
        uint256 balance,
        uint256 deposited,
        uint256 withdrawn,
        uint256 marketplaceFees,
        uint256 partyRoomFees,
        uint256 adSpaceFees,
        uint256 txFees
    ) {
        balance         = address(this).balance;
        deposited       = totalDeposited;
        withdrawn       = totalWithdrawn;
        marketplaceFees = revenueBySource[uint8(RevenueSource.MARKETPLACE)];
        partyRoomFees   = revenueBySource[uint8(RevenueSource.PARTY_ROOM)];
        adSpaceFees     = revenueBySource[uint8(RevenueSource.AD_SPACE)];
        txFees          = revenueBySource[uint8(RevenueSource.TRANSACTION_FEE)];
    }

    // ─── Internal ────────────────────────────────────────────────────────────
    function _recordDeposit(RevenueSource source, uint256 amount) internal {
        totalDeposited += amount;
        revenueBySource[uint8(source)] += amount;

        // Record in monthly ledger
        // Using block.timestamp — approximate but sufficient for reporting
        uint256 year  = _year(block.timestamp);
        uint256 month = _month(block.timestamp);
        uint256 key   = year * 12 + month;

        MonthlyRecord storage rec = _monthlyRecords[key];
        if (rec.year == 0) {
            rec.year  = year;
            rec.month = month;
        }
        rec.total += amount;
        rec.bySource[uint8(source)] += amount;

        emit RevenueDeposited(msg.sender, source, amount);
    }

    function _sendEth(address to, uint256 amount) internal {
        if (amount == 0) return;
        (bool ok,) = payable(to).call{value: amount}("");
        require(ok, "PlatformRevenue: ETH transfer failed");
    }

    /// @dev Approximate year from unix timestamp (ignores leap-seconds).
    function _year(uint256 ts) internal pure returns (uint256) {
        return 1970 + ts / 365.25 days;
    }

    /// @dev Approximate month (1–12) from unix timestamp.
    function _month(uint256 ts) internal pure returns (uint256) {
        uint256 secondsInYear = ts % uint256(365.25 days);
        return (secondsInYear / (30 days)) + 1 > 12 ? 12 : (secondsInYear / (30 days)) + 1;
    }
}
