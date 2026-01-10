import { Router } from "express";
import {
    verifyECIRole,
    getStateAuthorities,
    saveStateECMetadata,
    verifyStateRoleOnChain,
    getECIStats,
    getRecentEvents
} from "../controllers/eci.controller.js";

const router = Router();

// ECI Role verification
router.get("/verify-role/:address", verifyECIRole);

// State EC management
router.get("/state-authorities", getStateAuthorities);
router.post("/state-authority", saveStateECMetadata);
router.get("/verify-state-role/:address", verifyStateRoleOnChain);

// Statistics and events
router.get("/stats", getECIStats);
router.get("/events", getRecentEvents);

export { router as eciRouter };
