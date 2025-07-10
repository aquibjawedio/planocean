import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    if (process.env.NODE_ENV === "development") {
      console.error("ZodError:", err);
    }

    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Validation failed",
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

    return res.status(err.statusCode || 500).json({
      statusCode: err.statusCode || 500,
      success: false,
      message: err.message || "Something went wrong",
      error: Array.isArray(err.errors) && err.errors.length > 0 ? err.errors : null,
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.error("Unhandled error:", err);
  }

  return res.status(500).json({
    statusCode: 500,
    success: false,
    message: "Internal Server Error",
    error: err,
  });
};
