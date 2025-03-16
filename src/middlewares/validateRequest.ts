import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
const validateRequest = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next({ type: "self", message: errors.array(), statusCode: 400 });
	}
	next();
};

export default validateRequest;
