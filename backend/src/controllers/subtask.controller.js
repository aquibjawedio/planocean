import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createSubTaskController = asyncHandler(async (req, res) => {
  return res.status(201).json(
    new ApiResponse(201, "Subtask created successfully", {
      subtask: "subtask",
      membership: req.member,
    })
  );
});
