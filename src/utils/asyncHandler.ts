import { NextFunction, Request, Response } from "express";
import qs from "qs";

/**
 * Async handler to eliminate try-catch blocks in controllers
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware function
 */
const asyncHandler = <
	P = {},
	ResBody = {},
	ReqBody = {},
	ReqQuery = qs.ParsedQs,
	Locals extends Record<string, any> = Record<string, any>,
>(
	fn: (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody, Locals>, next: NextFunction) => Promise<void>
) => {
	return (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody, Locals>, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};

export default asyncHandler;
