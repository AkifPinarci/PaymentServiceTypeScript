import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { PaymentRequestBody } from "../types/payment";
import asyncHandler from "../utils/asyncHandler";

const storePaymentDetails = asyncHandler(
	async (req: Request<{}, {}, PaymentRequestBody, {}>, res: Response, next: NextFunction) => {
		let amount = 0;
		req.body.items.forEach((item) => {
			amount += item.price_data.unit_amount * item.quantity;
		});
		const newPayment = await prisma.payment.create({
			data: {
				items: req.body.items,
				amount: amount,
				currency: "usd",
				status: "initiated",
				payer_id: req.body.customer_id,
			},
		});
		req.body.new_payment = newPayment.id;
		next();
	}
);

export { storePaymentDetails };
