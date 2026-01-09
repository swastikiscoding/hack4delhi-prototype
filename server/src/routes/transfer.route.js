import { Router } from "express";

import { verifyVoter } from "../middlewares/voter.middleware.js";
import {
  applyForMigration,
  getMyMigrationRequest,
  listForBLO,
  bloReject,
  bloMarkVerified,
  listForERO,
  eroFinalize,
} from "../controllers/transfer.controller.js";

const router = Router();

// Citizen
router.post("/apply", verifyVoter, applyForMigration);
router.get("/me", verifyVoter, getMyMigrationRequest);

// BLO (wallet-gated on frontend)
router.get("/blo/pending", listForBLO);
router.post("/:id/blo/reject", bloReject);
router.post("/:id/blo/verified", bloMarkVerified);

// ERO (wallet-gated on frontend)
router.get("/ero/queue", listForERO);
router.post("/:id/ero/finalize", eroFinalize);

export { router as transferRouter };
