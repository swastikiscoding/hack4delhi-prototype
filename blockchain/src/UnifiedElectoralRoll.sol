// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "openzeppelin-contracts/contracts/access/AccessControl.sol";

contract UnifiedElectoralRoll is AccessControl {
    bytes32 public constant ECI_ROLE = keccak256("ECI_ROLE");
    bytes32 public constant STATE_ROLE = keccak256("STATE_ROLE");
    bytes32 public constant ERO_ROLE = keccak256("ERO_ROLE");
    bytes32 public constant BLO_ROLE = keccak256("BLO_ROLE");

    // State EC => list of EROs
    mapping(address => address[]) private stateToEROs;

    // State EC => list of BLOs
    mapping(address => address[]) private stateToBLOs;

    // Track which state an officer belongs to (reverse lookup)
    mapping(address => address) public officerToState;

    constructor() {
        // ECI is the root admin
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        // Explicitly assign ECI role
        _grantRole(ECI_ROLE, msg.sender);

        // Role hierarchy
        _setRoleAdmin(STATE_ROLE, ECI_ROLE);
        _setRoleAdmin(ERO_ROLE, STATE_ROLE);
        _setRoleAdmin(BLO_ROLE, STATE_ROLE);
    }

    enum Status {
        NONE,
        ACTIVE,
        IN_TRANSIT
    }
    enum Decision {
        NONE,
        APPROVED,
        REJECTED
    }

    struct Voter {
        uint256 stateCode;
        uint256 constituencyCode;
        Status status;
        uint256 lastUpdated;
        address lastApprovedBy;
    }

    struct MigrationRequest {
        uint256 fromState;
        uint256 toState;
        uint256 toConstituency;
        bool bloVerified;
        Decision decision;
    }

    mapping(bytes32 => Voter) public voters;
    mapping(bytes32 => MigrationRequest) public migrations;
    mapping(bytes32 => bool) public exists;

    function addStateAuthority(address stateEC) external onlyRole(ECI_ROLE) {
        require(!hasRole(STATE_ROLE, stateEC), "Already State EC");

        grantRole(STATE_ROLE, stateEC);

        emit StateAuthorityAdded(msg.sender, stateEC);
    }

    function addERO(address ero) external onlyRole(STATE_ROLE) {
        require(!hasRole(ERO_ROLE, ero), "Already ERO");

        grantRole(ERO_ROLE, ero);

        stateToEROs[msg.sender].push(ero);
        officerToState[ero] = msg.sender;

        emit EROAdded(msg.sender, ero);
    }

    function addBLO(address blo) external onlyRole(STATE_ROLE) {
        require(!hasRole(BLO_ROLE, blo), "Already BLO");

        grantRole(BLO_ROLE, blo);

        stateToBLOs[msg.sender].push(blo);
        officerToState[blo] = msg.sender;

        emit BLOAdded(msg.sender, blo);
    }

    event VoterRegistered(bytes32 epicHash, uint256 state);
    event StateAuthorityAdded(address indexed eci, address indexed stateEC);
    event EROAdded(address indexed stateEC, address indexed ero);
    event BLOAdded(address indexed stateEC, address indexed blo);

    function registerVoter(
        bytes32 epicHash,
        uint256 stateCode,
        uint256 constituencyCode
    ) external onlyRole(ERO_ROLE) {
        require(!exists[epicHash], "Already registered");

        voters[epicHash] = Voter({
            stateCode: stateCode,
            constituencyCode: constituencyCode,
            status: Status.ACTIVE,
            lastUpdated: block.timestamp,
            lastApprovedBy: msg.sender
        });

        exists[epicHash] = true;

        emit VoterRegistered(epicHash, stateCode);
    }

    event MigrationRequested(bytes32 epicHash, uint256 toState);

    function requestMigration(
        bytes32 epicHash,
        uint256 toState,
        uint256 toConstituency
    ) external {
        require(exists[epicHash], "Voter not found");
        require(voters[epicHash].status == Status.ACTIVE, "Not active");
        require(
            voters[epicHash].status != Status.IN_TRANSIT,
            "Already in transit"
        );

        voters[epicHash].status = Status.IN_TRANSIT;

        migrations[epicHash] = MigrationRequest({
            fromState: voters[epicHash].stateCode,
            toState: toState,
            toConstituency: toConstituency,
            bloVerified: false,
            decision: Decision.NONE
        });

        emit MigrationRequested(epicHash, toState);
    }

    event BLOVerified(bytes32 epicHash);

    function verifyByBLO(bytes32 epicHash) external onlyRole(BLO_ROLE) {
        require(voters[epicHash].status == Status.IN_TRANSIT, "Not in transit");

        migrations[epicHash].bloVerified = true;

        emit BLOVerified(epicHash);
    }

    event MigrationApproved(bytes32 epicHash);
    event MigrationRejected(bytes32 epicHash);

    function approveMigration(bytes32 epicHash) external onlyRole(ERO_ROLE) {
        MigrationRequest storage m = migrations[epicHash];

        require(voters[epicHash].status == Status.IN_TRANSIT, "Invalid status");
        require(m.bloVerified, "BLO not verified");
        require(
            migrations[epicHash].decision == Decision.NONE,
            "Already decided"
        );

        voters[epicHash].stateCode = m.toState;
        voters[epicHash].constituencyCode = m.toConstituency;
        voters[epicHash].status = Status.ACTIVE;
        voters[epicHash].lastUpdated = block.timestamp;
        voters[epicHash].lastApprovedBy = msg.sender;

        m.decision = Decision.APPROVED;

        emit MigrationApproved(epicHash);
    }

    function rejectMigration(bytes32 epicHash) external onlyRole(ERO_ROLE) {
        require(
            migrations[epicHash].decision == Decision.NONE,
            "Already decided"
        );

        voters[epicHash].status = Status.ACTIVE;
        migrations[epicHash].decision = Decision.REJECTED;

        emit MigrationRejected(epicHash);
    }

    function getVoter(
        bytes32 epicHash
    )
        external
        view
        returns (
            uint256 stateCode,
            uint256 constituencyCode,
            Status status,
            uint256 lastUpdated,
            address lastApprovedBy
        )
    {
        Voter memory v = voters[epicHash];
        return (
            v.stateCode,
            v.constituencyCode,
            v.status,
            v.lastUpdated,
            v.lastApprovedBy
        );
    }

    function getMigration(
        bytes32 epicHash
    )
        external
        view
        returns (
            uint256 fromState,
            uint256 toState,
            uint256 toConstituency,
            bool bloVerified,
            Decision decision
        )
    {
        MigrationRequest memory m = migrations[epicHash];
        return (
            m.fromState,
            m.toState,
            m.toConstituency,
            m.bloVerified,
            m.decision
        );
    }

    function getEROsByState(
        address stateEC
    ) external view returns (address[] memory) {
        return stateToEROs[stateEC];
    }

    function getBLOsByState(
        address stateEC
    ) external view returns (address[] memory) {
        return stateToBLOs[stateEC];
    }
}
