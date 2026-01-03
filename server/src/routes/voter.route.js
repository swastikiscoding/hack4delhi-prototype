import { Router } from "express";
import { loginVoter, registerVoter, logoutVoter, getVoterProfile } from "../controllers/voter.controller.js";
import { verifyVoter } from "../middlewares/voter.middleware.js";

const router = Router();

router.post("/register", registerVoter);
router.post("/login", loginVoter);
//secured routes
router.post("/logout", verifyVoter,  logoutVoter)
router.get("/profile", verifyVoter, getVoterProfile);

export {router as voterRouter};