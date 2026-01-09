import { keccak256, toUtf8Bytes } from "ethers";

import getContract from "../blockchain/contract.js";
import { TransferRequest } from "../models/transfer.model.js";
import { Voter } from "../models/voter.model.js";
import { STATE_NUMBER_MAP } from "../models/statemap.js";
import { getConstituencyName } from "../utils/constituencyMap.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getEpicHash = (epicId) => keccak256(toUtf8Bytes(epicId));

export const applyForMigration = asyncHandler(async (req, res) => {
  const voter = req.voter;
  const { toAddress, toState, toConstituency, proof } = req.body;

  if (!toAddress || !toState || toConstituency === undefined || !proof) {
    throw new ApiError(400, "toAddress, toState, toConstituency and proof are required");
  }

  const toStateNumber = STATE_NUMBER_MAP[toState];
  if (!toStateNumber) {
    throw new ApiError(400, `Invalid state/UT: ${toState}`);
  }

  const toConstituencyNum = Number(toConstituency);
  if (!Number.isFinite(toConstituencyNum) || toConstituencyNum <= 0) {
    throw new ApiError(400, "toConstituency must be a positive number");
  }

  const fromState = voter.state;
  const fromStateNumber = voter.state_number;
  const fromConstituency = Number(voter.constituency_number);

  const epicHash = getEpicHash(voter.epicId);

  // Only allow one active request at a time.
  const existingActive = await TransferRequest.findOne({
    epicId: voter.epicId,
    status: { $in: ["PENDING_BLO", "BLO_VERIFIED"] },
  });

  if (existingActive) {
    throw new ApiError(409, "A migration request is already pending for this voter");
  }

  const created = await TransferRequest.create({
    epicHash,
    epicId: voter.epicId,
    fromState,
    fromStateNumber,
    fromConstituency,
    toState,
    toStateNumber,
    toConstituency: toConstituencyNum,
    toAddress,
    proof,
    status: "PENDING_BLO",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, created, "Migration request submitted"));
});

export const getMyMigrationRequest = asyncHandler(async (req, res) => {
  const voter = req.voter;
  const request = await TransferRequest.findOne({ epicId: voter.epicId }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, request, "Migration request fetched"));
});

export const listForBLO = asyncHandler(async (_req, res) => {
  const requests = await TransferRequest.find({ status: "PENDING_BLO" }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, requests, "Pending BLO requests fetched"));
});

export const bloReject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { bloAddress } = req.body;

  const request = await TransferRequest.findById(id);
  if (!request) throw new ApiError(404, "Transfer request not found");

  if (request.status !== "PENDING_BLO") {
    throw new ApiError(409, `Cannot reject request in status ${request.status}`);
  }

  request.status = "BLO_REJECTED";
  request.bloAddress = bloAddress;
  request.bloVerifiedAt = new Date();
  await request.save();

  return res.status(200).json(new ApiResponse(200, request, "BLO rejected the request"));
});

export const bloMarkVerified = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { bloAddress, bloTxHash, requestMigrationTxHash } = req.body;

  const request = await TransferRequest.findById(id);
  if (!request) throw new ApiError(404, "Transfer request not found");

  if (request.status !== "PENDING_BLO") {
    throw new ApiError(409, `Cannot verify request in status ${request.status}`);
  }

  // Light consistency check: ensure migration exists (read-only).
  // If this fails, it's still useful to save BLO decision, so we don't hard-fail.
  try {
    const contract = getContract();
    await contract.getMigration(request.epicHash);
  } catch {
    // ignore
  }

  request.status = "BLO_VERIFIED";
  request.bloAddress = bloAddress;
  request.bloVerifiedAt = new Date();
  request.bloTxHash = bloTxHash;
  request.requestMigrationTxHash = requestMigrationTxHash;
  await request.save();

  return res.status(200).json(new ApiResponse(200, request, "BLO verified the request"));
});

export const listForERO = asyncHandler(async (_req, res) => {
  // Return all requests so the ERO UI filters can show every state.
  const requests = await TransferRequest.find({}).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, requests, "ERO queue fetched"));
});

export const eroFinalize = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { decision, eroAddress, eroTxHash } = req.body;

  if (!decision || !["APPROVE", "REJECT"].includes(decision)) {
    throw new ApiError(400, "decision must be APPROVE or REJECT");
  }

  const request = await TransferRequest.findById(id);
  if (!request) throw new ApiError(404, "Transfer request not found");

  if (request.status !== "BLO_VERIFIED") {
    throw new ApiError(409, `Cannot finalize request in status ${request.status}`);
  }

  // Optional on-chain consistency check (read-only)
  try {
    const contract = getContract();
    const voterOnChain = await contract.getVoter(request.epicHash);
    // Expect voter to still exist; ignore values.
    void voterOnChain;
  } catch {
    // ignore
  }

  if (decision === "APPROVE") {
    const constituencyName = getConstituencyName(request.toState, request.toConstituency);
    if (!constituencyName) {
      throw new ApiError(400, `Invalid constituency number ${request.toConstituency} for state ${request.toState}`);
    }

    // Update voter model
    await Voter.findOneAndUpdate(
      { epicId: request.epicId },
      {
        $set: {
          address: request.toAddress,
          state: request.toState,
          state_number: request.toStateNumber,
          constituency_number: String(request.toConstituency),
          constituency_name: constituencyName,
        },
      },
      { new: true }
    );

    // Keep transfer request for audit/history
    request.status = "ERO_APPROVED";
    request.eroAddress = eroAddress;
    request.eroDecidedAt = new Date();
    request.eroTxHash = eroTxHash;
    await request.save();

    return res
      .status(200)
      .json(new ApiResponse(200, request, "Migration approved by ERO"));
  }

  // REJECT: keep request for audit, but mark rejected
  request.status = "ERO_REJECTED";
  request.eroAddress = eroAddress;
  request.eroDecidedAt = new Date();
  request.eroTxHash = eroTxHash;
  await request.save();

  return res.status(200).json(new ApiResponse(200, request, "Migration rejected by ERO"));
});
