import { Officer } from "../models/officer.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import getContract from "../blockchain/contract.js";
import { ECI_ROLE, STATE_ROLE, ERO_ROLE, BLO_ROLE } from "../blockchain/roles.js";

/**
 * Check if an address has the ECI_ROLE on-chain
 */
export const verifyECIRole = async (req, res) => {
    try {
        const { address } = req.params;
        
        if (!address) {
            throw new ApiError(400, "Wallet address is required");
        }

        const contract = getContract();
        const hasRole = await contract.hasRole(ECI_ROLE, address);
        
        return res.status(200).json(
            new ApiResponse(200, { hasRole, address }, "ECI role check completed")
        );
    } catch (error) {
        console.error("Error verifying ECI role:", error);
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message)
        );
    }
};

/**
 * Get all State ECs that have STATE_ROLE
 * This queries the Officer collection for STATE_EC entries
 */
export const getStateAuthorities = async (req, res) => {
    try {
        const stateECs = await Officer.find({ role: "STATE_EC" }).sort({ createdAt: -1 });
        
        return res.status(200).json(
            new ApiResponse(200, { stateECs, count: stateECs.length }, "State authorities fetched")
        );
    } catch (error) {
        console.error("Error fetching state authorities:", error);
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message)
        );
    }
};

/**
 * Save State EC metadata after blockchain transaction
 */
export const saveStateECMetadata = async (req, res) => {
    try {
        const { 
            walletAddress, 
            state,
            name,
            txHash,
            addedBy
        } = req.body;
        
        if (!walletAddress) {
            throw new ApiError(400, "walletAddress is required");
        }

        // Check if State EC already exists
        let stateEC = await Officer.findOne({ 
            walletAddress: walletAddress.toLowerCase(),
            role: "STATE_EC"
        });
        
        if (stateEC) {
            // Update existing
            stateEC.state = state || stateEC.state;
            stateEC.name = name || stateEC.name;
            stateEC.txHash = txHash || stateEC.txHash;
            stateEC.status = "ACTIVE";
            await stateEC.save();
        } else {
            // Create new State EC entry
            stateEC = await Officer.create({
                walletAddress: walletAddress.toLowerCase(),
                role: "STATE_EC",
                name: name || "",
                state: state || "",
                addedBy: addedBy?.toLowerCase() || "",
                txHash,
                status: "ACTIVE"
            });
        }

        return res.status(201).json(
            new ApiResponse(201, stateEC, "State EC metadata saved successfully")
        );
    } catch (error) {
        console.error("Error saving State EC metadata:", error);
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message)
        );
    }
};

/**
 * Verify if address has STATE_ROLE on chain
 */
export const verifyStateRoleOnChain = async (req, res) => {
    try {
        const { address } = req.params;
        
        if (!address) {
            throw new ApiError(400, "Address is required");
        }

        const contract = getContract();
        const hasRole = await contract.hasRole(STATE_ROLE, address);
        
        return res.status(200).json(
            new ApiResponse(200, { hasRole, address }, "State role verification completed")
        );
    } catch (error) {
        console.error("Error verifying state role:", error);
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message)
        );
    }
};

/**
 * Get ECI dashboard statistics
 */
export const getECIStats = async (req, res) => {
    try {
        // Get counts from database
        const stateECCount = await Officer.countDocuments({ 
            role: "STATE_EC",
            status: "ACTIVE"
        });
        
        const eroCount = await Officer.countDocuments({ 
            role: "ERO",
            status: "ACTIVE"
        });
        
        const bloCount = await Officer.countDocuments({ 
            role: "BLO",
            status: "ACTIVE"
        });

        // Get unique states with officers
        const activeStates = await Officer.distinct("state", {
            role: "STATE_EC",
            status: "ACTIVE",
            state: { $ne: "" }
        });

        return res.status(200).json(
            new ApiResponse(200, {
                stateECCount,
                eroCount,
                bloCount,
                activeStatesCount: activeStates.length,
                totalStates: 36 // Total states/UTs in India
            }, "ECI statistics fetched")
        );
    } catch (error) {
        console.error("Error fetching ECI stats:", error);
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message)
        );
    }
};

/**
 * Get recent audit events (State EC additions)
 */
export const getRecentEvents = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        
        // Get recent officer additions
        const recentOfficers = await Officer.find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .select("walletAddress role state name createdAt txHash");

        const events = recentOfficers.map(officer => ({
            id: officer._id,
            type: officer.role === "STATE_EC" ? "auth" : 
                  officer.role === "ERO" ? "ero" : "blo",
            title: officer.role === "STATE_EC" 
                ? `State Authority Granted` 
                : `${officer.role} Added`,
            desc: officer.state 
                ? `${officer.state} - ${officer.walletAddress.slice(0, 6)}...${officer.walletAddress.slice(-4)}`
                : `${officer.walletAddress.slice(0, 6)}...${officer.walletAddress.slice(-4)}`,
            time: officer.createdAt,
            txHash: officer.txHash
        }));

        return res.status(200).json(
            new ApiResponse(200, { events }, "Recent events fetched")
        );
    } catch (error) {
        console.error("Error fetching recent events:", error);
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message)
        );
    }
};
