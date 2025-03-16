import express from "express";
const router = express.Router();
import { createPayment, getReceiptUrl, getPayments } from "../controllers/paymentsController.js";
import { storePaymentDetails } from "../middlewares/paymentMiddleware.js";
import { query } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";

// Create a checkout session
router.post("/", storePaymentDetails, createPayment);

// Return all succeeded payments associated with the payerid
router.get(
	"/",
	[
		query("payerid").notEmpty().withMessage("payerid is required"),
		query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100"),
		query("offset").optional().isInt({ min: 0 }).withMessage("offset must be a non-negative number"),
	],
	validateRequest,
	getPayments
);

// Return all receipt URLs associated with the id
router.get(
	"/receipts",
	[query("paymentid").notEmpty().withMessage("paymentid is required")],
	validateRequest,
	getReceiptUrl
);

export default router;
