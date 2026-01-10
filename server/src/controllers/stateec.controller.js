import { Officer } from "../models/officer.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import getContract from "../blockchain/contract.js";
import { STATE_ROLE, ERO_ROLE, BLO_ROLE } from "../blockchain/roles.js";

/**
 * Check if an address has the STATE_ROLE on-chain
 */
export const verifyStateRole = async (req, res) => {
    try {
        const { address } = req.params;
        
        if (!address) {
            throw new ApiError(400, "Wallet address is required");
        }

        const contract = getContract();
        const hasRole = await contract.hasRole(STATE_ROLE, address);
        
        return res.status(200).json(
            new ApiResponse(200, { hasRole, address }, "Role check completed")
        );
    } catch (error) {
        console.error("Error verifying state role:", error);
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message)
        );
    }
};

/**
 * Get all EROs for a State EC from blockchain
 */
export const getEROsFromChain = async (req, res) => {
    try {
        const { stateAddress } = req.params;
        
        if (!stateAddress) {
            throw new ApiError(400, "State EC address is required");
        }

        const contract = getContract();
        const eros = await contract.getEROsByState(stateAddress);
        
        return res.status(200).json(
            new ApiResponse(200, { eros, count: eros.length }, "EROs fetched from blockchain")
        );
    } catch (error) {
        console.error("Error fetching EROs from chain:", error);
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message)
        );
    }
};

/**
 * Get all BLOs for a State EC from blockchain
 */
export const getBLOsFromChain = async (req, res) => {
    try {
        const { stateAddress } = req.params;
        
        if (!stateAddress) {
            throw new ApiError(400, "State EC address is required");
        }

        const contract = getContract();
        const blos = await contract.getBLOsByState(stateAddress);
        
        return res.status(200).json(
            new ApiResponse(200, { blos, count: blos.length }, "BLOs fetched from blockchain")
        );
    } catch (error) {
        console.error("Error fetching BLOs from chain:", error);
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message)
        );
    }
};

/**
 * Store officer metadata in database after blockchain transaction
 */
export const saveOfficerMetadata = async (req, res) => {
    try {
        const { 
            walletAddress, 
            role, 
            name, 
            state, 
            constituencyCode, 
            constituencyName, 
            addedBy, 
            txHash 
        } = req.body;
        
        if (!walletAddress || !role || !addedBy) {
            throw new ApiError(400, "walletAddress, role, and addedBy are required");
        }

        if (!["ERO", "BLO"].includes(role)) {
            throw new ApiError(400, "Role must be ERO or BLO");
        }

        // Check if officer already exists
        let officer = await Officer.findOne({ walletAddress: walletAddress.toLowerCase() });
        
        if (officer) {
            // Update existing officer
            officer.name = name || officer.name;
            officer.state = state || officer.state;
            officer.constituencyCode = constituencyCode || officer.constituencyCode;
            officer.constituencyName = constituencyName || officer.constituencyName;
            officer.txHash = txHash || officer.txHash;
            officer.status = "ACTIVE";
            await officer.save();
        } else {
            // Create new officer
            officer = await Officer.create({
                walletAddress: walletAddress.toLowerCase(),
                role,
                name: name || "",
                state: state || "",
                constituencyCode: constituencyCode || "",
                constituencyName: constituencyName || "",
                addedBy: addedBy.toLowerCase(),
                txHash,
                status: "ACTIVE"
            });
        }

        return res.status(201).json(
            new ApiResponse(201, officer, "Officer metadata saved successfully")
        );
    } catch (error) {
        console.error("Error saving officer metadata:", error);
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message)
        );
    }
};

/**
 * Get officer metadata from database
 */
export const getOfficerMetadata = async (req, res) => {
    try {
        const { walletAddress } = req.params;
        
        const officer = await Officer.findOne({ walletAddress: walletAddress.toLowerCase() });
        
        if (!officer) {
            return res.status(200).json(
                new ApiResponse(200, null, "Officer not found")
            );
        }

        return res.status(200).json(
            new ApiResponse(200, officer, "Officer metadata fetched")
        );
    } catch (error) {
        console.error("Error fetching officer metadata:", error);
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message)
        );
    }
};

/**
 * Get all officers (EROs/BLOs) added by a specific State EC from database
 */
export const getOfficersByStateEC = async (req, res) => {
    try {
        const { stateAddress } = req.params;
        const { role } = req.query; // Optional filter by role
        
        if (!stateAddress) {
            throw new ApiError(400, "State EC address is required");
        }

        const query = { addedBy: stateAddress.toLowerCase() };
        if (role && ["ERO", "BLO"].includes(role)) {
            query.role = role;
        }

        const officers = await Officer.find(query).sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(200, { officers, count: officers.length }, "Officers fetched")
        );
    } catch (error) {
        console.error("Error fetching officers:", error);
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message)
        );
    }
};

/**
 * Get State EC statistics
 */
export const getStateECStats = async (req, res) => {
    try {
        const { stateAddress } = req.params;
        
        if (!stateAddress) {
            throw new ApiError(400, "State EC address is required");
        }

        const normalizedAddress = stateAddress.toLowerCase();

        // Get counts from database
        const eroCount = await Officer.countDocuments({ 
            addedBy: normalizedAddress, 
            role: "ERO",
            status: "ACTIVE"
        });
        
        const bloCount = await Officer.countDocuments({ 
            addedBy: normalizedAddress, 
            role: "BLO",
            status: "ACTIVE"
        });

        // Get counts from blockchain for verification
        let chainEroCount = 0;
        let chainBloCount = 0;
        
        try {
            const contract = getContract();
            const chainEros = await contract.getEROsByState(stateAddress);
            const chainBlos = await contract.getBLOsByState(stateAddress);
            chainEroCount = chainEros.length;
            chainBloCount = chainBlos.length;
        } catch (chainError) {
            console.warn("Could not fetch chain data:", chainError.message);
        }

        // Get unique constituencies
        const eroConstituencies = await Officer.distinct("constituencyCode", {
            addedBy: normalizedAddress,
            role: "ERO",
            status: "ACTIVE",
            constituencyCode: { $ne: "" }
        });

        return res.status(200).json(
            new ApiResponse(200, {
                eroCount,
                bloCount,
                chainEroCount,
                chainBloCount,
                activeConstituencies: eroConstituencies.length,
                stateAddress: normalizedAddress
            }, "Statistics fetched")
        );
    } catch (error) {
        console.error("Error fetching stats:", error);
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message)
        );
    }
};

/**
 * Check if an address has a specific role
 */
export const checkRole = async (req, res) => {
    try {
        const { address, role } = req.params;
        
        if (!address || !role) {
            throw new ApiError(400, "Address and role are required");
        }

        let roleHash;
        switch (role.toUpperCase()) {
            case "STATE":
            case "STATE_EC":
                roleHash = STATE_ROLE;
                break;
            case "ERO":
                roleHash = ERO_ROLE;
                break;
            case "BLO":
                roleHash = BLO_ROLE;
                break;
            default:
                throw new ApiError(400, "Invalid role. Use STATE, ERO, or BLO");
        }

        const contract = getContract();
        const hasRole = await contract.hasRole(roleHash, address);
        
        return res.status(200).json(
            new ApiResponse(200, { hasRole, address, role }, "Role check completed")
        );
    } catch (error) {
        console.error("Error checking role:", error);
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message)
        );
    }
};
