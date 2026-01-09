import { Router } from "express";

import { STATE_NUMBER_MAP } from "../models/statemap.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

router.get("/states", (_req, res) => {
  const states = Object.entries(STATE_NUMBER_MAP)
    .map(([name, code]) => ({ name, code }))
    .sort((a, b) => a.name.localeCompare(b.name));

  res.json(new ApiResponse(200, states, "States fetched"));
});

export { router as metaRouter };
