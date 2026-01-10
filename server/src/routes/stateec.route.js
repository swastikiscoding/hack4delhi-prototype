import { Router } from "express";
import {
    verifyStateRole,
    getEROsFromChain,
    getBLOsFromChain,
    saveOfficerMetadata,
    getOfficerMetadata,
    getOfficersByStateEC,
    getStateECStats,
    checkRole
} from "../controllers/stateec.controller.js";

const router = Router();

// Role verification
router.get("/verify-role/:address", verifyStateRole);
router.get("/check-role/:address/:role", checkRole);

// Blockchain data
router.get("/chain/eros/:stateAddress", getEROsFromChain);
router.get("/chain/blos/:stateAddress", getBLOsFromChain);

// Officer metadata (database)
router.post("/officer", saveOfficerMetadata);
router.get("/officer/:walletAddress", getOfficerMetadata);
router.get("/officers/:stateAddress", getOfficersByStateEC);

// Statistics
router.get("/stats/:stateAddress", getStateECStats);

export { router as stateECRouter };
