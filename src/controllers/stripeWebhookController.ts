import { paymentFailed, paymentSucceeded, checkoutSessionExpired } from "../utils/webhook/utils.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Request, Response } from "express";
import { default as stripeClient } from "stripe";
import StripeWebhookEvent, { WebhookPaymentIntent } from "../types/stripe.js";

function isStripeObject(obj: string | object): obj is stripeClient.Event {
	return typeof obj === "object" && obj !== null;
}

const stripeWebhook = asyncHandler(async (request: Request<{}, {}, StripeWebhookEvent, {}>, response: Response) => {
	const event = request.body.stripeEvent;
	const stripeEvent = isStripeObject(event) ? event : JSON.parse(event);

	switch (stripeEvent.type) {
		// case "charge.failed":
		// 	break;

		case "payment_intent.payment_failed":
			const paymentIntentFailed = stripeEvent.data.object as stripeClient.PaymentIntent;
			await paymentFailed(paymentIntentFailed.id);
			break;

		case "checkout.session.completed":
			const checkoutSessionCompleted = stripeEvent.data.object as stripeClient.Checkout.Session;
			await paymentSucceeded(checkoutSessionCompleted.id, checkoutSessionCompleted.payment_intent as string);
			break;

		// case "payment_intent.created":
		// 	break;

		// case "payment_intent.succeeded":
		// 	break;

		// case "payment_intent.cancelled":
		// 	break;

		case "checkout.session.expired":
			const checkoutSession = stripeEvent.data.object as stripeClient.Checkout.Session;
			await checkoutSessionExpired(checkoutSession.id);

			break;

		default:
			console.log(`Unhandled event type: ${stripeEvent.type}`);
	}

	response.json({ received: true });
});

export default stripeWebhook;
