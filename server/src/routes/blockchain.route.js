import { Router } from "express";
import { getVoterStatus } from "../controllers/blockchain.controller.js";

const router = Router();

router.get("/voter/:epic", getVoterStatus);

export {router as blockchainRouter};
