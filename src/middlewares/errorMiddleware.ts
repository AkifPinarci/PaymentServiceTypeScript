/**
 * Global error handling middleware
 * This middleware catches all errors thrown within the application
 * and returns a standardized error response
 */

import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
	console.error("Error:", err);

	if (err.type === "self") {
		throw AppError.create(err.message, err.statusCode);
	}

	// Default error status and message
	const status = err.statusCode || 500;
	const message = err.message || "Internal Server Error";

	// Send error response
	throw AppError.create(message, status);
};

export default errorMiddleware;
