// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "openzeppelin-contracts/contracts/access/AccessControl.sol";

contract UnifiedElectoralRoll is AccessControl {
    bytes32 public constant ECI_ROLE = keccak256("ECI_ROLE");
    bytes32 public constant STATE_ROLE = keccak256("STATE_ROLE");
    bytes32 public constant ERO_ROLE = keccak256("ERO_ROLE");
    bytes32 public constant BLO_ROLE = keccak256("BLO_ROLE");

    /* ─────────────── ROLE HIERARCHY ─────────────── */

    mapping(address => address[]) private stateToEROs;
    mapping(address => address[]) private stateToBLOs;
    mapping(address => address) public officerToState;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ECI_ROLE, msg.sender);

        _setRoleAdmin(STATE_ROLE, ECI_ROLE);
        _setRoleAdmin(ERO_ROLE, STATE_ROLE);
        _setRoleAdmin(BLO_ROLE, STATE_ROLE);
    }

    event StateAuthorityAdded(address indexed eci, address indexed stateEC);
    event EROAdded(address indexed stateEC, address indexed ero);
    event BLOAdded(address indexed stateEC, address indexed blo);

    function addStateAuthority(address stateEC) external onlyRole(ECI_ROLE) {
        grantRole(STATE_ROLE, stateEC);
        emit StateAuthorityAdded(msg.sender, stateEC);
    }

    function addERO(address ero) external onlyRole(STATE_ROLE) {
        grantRole(ERO_ROLE, ero);
        stateToEROs[msg.sender].push(ero);
        officerToState[ero] = msg.sender;
        emit EROAdded(msg.sender, ero);
    }

    function addBLO(address blo) external onlyRole(STATE_ROLE) {
        grantRole(BLO_ROLE, blo);
        stateToBLOs[msg.sender].push(blo);
        officerToState[blo] = msg.sender;
        emit BLOAdded(msg.sender, blo);
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

    /* ─────────────── VOTERS ─────────────── */

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

    event VoterRegistered(bytes32 epicHash, uint256 state);

    function registerVoter(
        bytes32 epicHash,
        uint256 stateCode,
        uint256 constituencyCode
    ) external onlyRole(ERO_ROLE) {
        require(!exists[epicHash], "Already registered");

        voters[epicHash] = Voter(
            stateCode,
            constituencyCode,
            Status.ACTIVE,
            block.timestamp,
            msg.sender
        );

        exists[epicHash] = true;
        emit VoterRegistered(epicHash, stateCode);
    }

    /* ─────────────── MIGRATION ─────────────── */

    event MigrationRequested(bytes32 epicHash);
    event BLOVerified(bytes32 epicHash);
    event MigrationApproved(bytes32 epicHash);
    event MigrationRejected(bytes32 epicHash);

    function requestMigration(
        bytes32 epicHash,
        uint256 toState,
        uint256 toConstituency
    ) external {
        require(exists[epicHash], "Voter not found");
        require(voters[epicHash].status == Status.ACTIVE, "Not active");

        voters[epicHash].status = Status.IN_TRANSIT;

        migrations[epicHash] = MigrationRequest(
            voters[epicHash].stateCode,
            toState,
            toConstituency,
            false,
            Decision.NONE
        );

        emit MigrationRequested(epicHash);
    }

    function verifyByBLO(bytes32 epicHash) external onlyRole(BLO_ROLE) {
        require(voters[epicHash].status == Status.IN_TRANSIT, "Not in transit");
        migrations[epicHash].bloVerified = true;
        emit BLOVerified(epicHash);
    }

    function approveMigration(bytes32 epicHash) external onlyRole(ERO_ROLE) {
        require(
        officerToState[msg.sender] != address(0),
        "ERO state not mapped");
        MigrationRequest storage m = migrations[epicHash];

        require(m.bloVerified, "BLO not verified");
        require(m.decision == Decision.NONE, "Already decided");

        voters[epicHash].stateCode = m.toState;
        voters[epicHash].constituencyCode = m.toConstituency;
        voters[epicHash].status = Status.ACTIVE;
        voters[epicHash].lastUpdated = block.timestamp;
        voters[epicHash].lastApprovedBy = msg.sender;
        migrationCountByState[m.toState]++;

        m.decision = Decision.APPROVED;
        emit MigrationApproved(epicHash);
    }


    function rejectMigration(bytes32 epicHash) external onlyRole(ERO_ROLE) {
        migrations[epicHash].decision = Decision.REJECTED;
        voters[epicHash].status = Status.ACTIVE;
        emit MigrationRejected(epicHash);
    }

    /* ─────────────── ELECTION SNAPSHOT ─────────────── */

    bool public electionDeclared;
    uint256 public electionTimestamp;

    mapping(bytes32 => uint256) public snapshotState;
    mapping(bytes32 => uint256) public snapshotConstituency;

    event ElectionDeclared(uint256 timestamp);

    function declareElection(uint256 timestamp) external onlyRole(ECI_ROLE) {
        require(!electionDeclared, "Already declared");
        electionDeclared = true;
        electionTimestamp = timestamp;
        emit ElectionDeclared(timestamp);
    }

    function snapshotVoter(bytes32 epicHash) external onlyRole(ECI_ROLE) {
        require(electionDeclared, "Election not declared");

        snapshotState[epicHash] = voters[epicHash].stateCode;
        snapshotConstituency[epicHash] = voters[epicHash].constituencyCode;
    }

    function isEligibleToVote(
        bytes32 epicHash,
        uint256 state,
        uint256 constituency
    ) external view returns (bool) {
        if (!electionDeclared) return false;

        return (snapshotState[epicHash] == state &&
            snapshotConstituency[epicHash] == constituency);
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

    /* ─────────────── MIGRATION OBSERVABILITY (ADDITIVE) ─────────────── */

    mapping(uint256 => uint256) public migrationCountByState;
    mapping(uint256 => uint256) public migrationCountAtSnapshot;

    event MigrationSnapshotTaken(uint256 stateCode, uint256 count);

    function snapshotMigrationCount(uint256 stateCode)
        external
        onlyRole(ECI_ROLE)
    {
        require(electionDeclared, "Election not declared");
        migrationCountAtSnapshot[stateCode] = migrationCountByState[stateCode];
        emit MigrationSnapshotTaken(stateCode, migrationCountAtSnapshot[stateCode]);
    }



}
