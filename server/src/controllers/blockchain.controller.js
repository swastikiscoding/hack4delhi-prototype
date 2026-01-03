import contract from "../blockchain/contract.js";
import { keccak256, toUtf8Bytes } from "ethers";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getVoterStatus = async (req, res) => {
  try {
    const { epic } = req.params;
    const epicHash = keccak256(toUtf8Bytes(epic));

    const voter = await contract.getVoter(epicHash);

    res.json(new ApiResponse(200, {
      state: Number(voter[0]),
      constituency: Number(voter[1]),
      status: Number(voter[2]),
      updatedAt: Number(voter[3]),
      approvedBy: voter[4],
    }, "Voter status fetched successfully"));
  } catch (err) {
    res.status(400).json({
      error: err.reason ?? err.message
    });
  }
};
