import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createSubTaskController = asyncHandler(async (req, res) => {
  return res
    .status(HTTP_STATUS.CREATED)
    .json(
      new ApiResponse(HTTP_STATUS.CREATED, "Subtask created successfully", {
        subtask: "subtask",
        membership: req.member,
      })
    );
});
