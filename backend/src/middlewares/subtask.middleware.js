import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isProjectAdmin = asyncHandler(async (req, res, next) => {
  const userId = req.user._id.toString();
  const taskId = req.params.taskId;

  if (!taskId) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized! task id not found");
  }
  
  
});

export const isProjectMember = asyncHandler(async (req, res, next) => {});
