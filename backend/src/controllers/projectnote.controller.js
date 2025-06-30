import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createProjectNoteSchema } from "../schemas/projectnote.schema.js";
import { createProjectNoteService } from "../services/projectnote.service.js";

export const createProjectNoteController = asyncHandler(async (req, res) => {
  const { content, project, createdBy } = createProjectNoteSchema.parse({
    ...req.body,
    createdBy: req.user?._id.toString(),
  });

  const { projectNote } = await createProjectNoteService({ content, project, createdBy });
  return res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, "Note create successfully", {
      projectNote,
    })
  );
});
