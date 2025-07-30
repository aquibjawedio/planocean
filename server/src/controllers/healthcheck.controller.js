import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const healthCheckController = async (req, res, next) => {
  try {
    const healthData = {
      status: "OK",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(new ApiResponse(200, "Healthcheck passed", healthData));
  } catch (error) {
    return new ApiError(500, "Healthcheck failed", error?.message, error.stack);
  }
};

export { healthCheckController };
