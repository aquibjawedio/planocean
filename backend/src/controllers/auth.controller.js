import { loginUserSchema, registerUserSchema } from "../schemas/auth.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { loginUserService, registerUserService } from "../services/auth.service.js";

export const registerUserController = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = registerUserSchema.parse(req.body);

  const user = await registerUserService(fullname, username, email, password);

  return res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, "User registered successfully", user));
});

export const loginUserController = asyncHandler(async (req, res) => {
  const { email, password } = loginUserSchema.parse(req.body);

  const user = await loginUserService(username, email, password);
});
