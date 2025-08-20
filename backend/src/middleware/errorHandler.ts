import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(`❌ Error on ${req.method} ${req.url}: ${err.message}`, {
    stack: err.stack,
  });

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}
