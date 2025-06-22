import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    if (process.env.NODE_ENV === "development") {
      console.error("ZodError:", err);
    }

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      success: false,
      message: "Validation failed",
      data: null,
      error: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof ApiError) {
    if (process.env.NODE_ENV === "development") {
      console.error("ApiError:", err.message);
      console.error("Stack:", err.stack);
    }

    return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      statusCode: err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      success: false,
      message: err.message || "Something went wrong",
      data: null,
      error: Array.isArray(err.errors) && err.errors.length > 0 ? err.errors : null,
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.error("Unhandled error:", err);
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    success: false,
    message: "Internal Server Error",
    data: null,
    error: null,
  });
};
