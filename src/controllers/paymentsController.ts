import { default as stripeClient } from "stripe";
const stripe = new stripeClient(process.env.STRIPE_SECRET_KEY as string);
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../errors/AppError.js";
import { PaymentQueryParams, PaymentRequestBody } from "../types/payment.js";
import { NextFunction, Request, Response } from "express";
import { ReceiptQueryParams } from "../types/receipt.js";

const createPayment = asyncHandler(
	async (req: Request<{}, {}, PaymentRequestBody, {}>, res: Response, next: NextFunction) => {
		try {
			const session = await stripe.checkout.sessions.create({
				mode: "payment",
				line_items: req.body.items,
				success_url: req.body.success_url,
				cancel_url: req.body.cancel_url,
				expires_at: Math.floor(Date.now() / 1000) + 1800,
				payment_intent_data: {
					metadata: { postgresCustomerId: req.body.customer_id },
				},
			});

			await prisma.payment.update({
				where: { id: req.body.new_payment },
				data: {
					checkout_session_id: session.id,
					status: "created",
				},
			});

			res.json({ url: session.url });
		} catch (error) {
			return next(error);
		}
	}
);

const getReceiptUrl = asyncHandler(
	async (req: Request<{}, {}, {}, ReceiptQueryParams>, res: Response, next: NextFunction) => {
		try {
			const { paymentid } = req.query;
			const payment = await prisma.payment.findUnique({
				where: { id: paymentid },
				select: {
					receipt_url: true,
					status: true,
				},
			});

			if (!payment?.receipt_url) {
				throw AppError.notFound(`Succeeded payment not found, status: ${payment?.status}`);
			}

			res.json({ receiptUrl: payment.receipt_url });
		} catch (error) {
			return next(error);
		}
	}
);

const getPayments = asyncHandler(
	async (req: Request<{}, {}, {}, PaymentQueryParams>, res: Response, next: NextFunction) => {
		try {
			const { payerid, status, offset, limit } = req.query;

			if (!payerid) {
				return next({
					type: "self",
					statusCode: 400,
					message: "Payer ID is required",
				});
			}

			const skip = offset ? parseInt(offset) : 0;
			const take = limit ? parseInt(limit) : 10;
			const whereClause = {
				payer_id: payerid,
				...(status && { status: status }),
			};

			const payments = await prisma.payment.findMany({
				where: whereClause,
				select: {
					id: true,
					amount: true,
					currency: true,
					status: true,
					created_at: true,
					items: true,
				},
				skip,
				take,
			});

			res.json(payments);
		} catch (error) {
			return next(error);
		}
	}
);

export { createPayment, getReceiptUrl, getPayments };
