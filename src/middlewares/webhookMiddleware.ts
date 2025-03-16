import { default as stripeClient } from "stripe";
const stripe = new stripeClient(process.env.STRIPE_SECRET_KEY as string);
import { Request, Response, NextFunction } from "express";

const stripeWebhookMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const sig = req.headers["stripe-signature"];
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

	if (!sig || !webhookSecret) {
		return next({ type: "self", message: "Missing stripe signature or webhook secret", statusCode: 400 });
	}

	const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
	req.body.stripeEvent = event;
	next();
};

export default stripeWebhookMiddleware;
