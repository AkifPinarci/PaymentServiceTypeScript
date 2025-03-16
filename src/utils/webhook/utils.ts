import { PrismaClient } from "@prisma/client";
import { WebhookPaymentIntent } from "../../types/stripe";
const prisma = new PrismaClient();
import { default as stripeClient } from "stripe";
const stripe = new stripeClient(process.env.STRIPE_SECRET_KEY as string);

// TODO: Eger stripe RESTApi faillerse, bunu bizim tekrar handle etmemiz gerekecek.
// Logic: Eger status "succeeded" ise, receipt_url var mi bak. Yoksa cron job ile baske bir zaman tekrar dene.
const paymentSucceeded = async (checkoutSessionId: string, payment_intent: string) => {
	const paymentIntent = (await stripe.paymentIntents.retrieve(payment_intent)) as unknown as WebhookPaymentIntent;
	const receipt_url = paymentIntent.charges.data[0].receipt_url;
	await prisma.payment.update({
		where: { checkout_session_id: checkoutSessionId },
		data: { payment_intent_id: payment_intent, status: "succeeded", receipt_url: receipt_url },
	});
};

const paymentFailed = async (payment_intent_id: string) => {
	const sessions = await stripe.checkout.sessions.list({
		payment_intent: payment_intent_id, // Search by payment intent ID
		limit: 1,
	});
	await prisma.payment.update({
		where: { checkout_session_id: sessions.data[0].id },
		data: {
			payment_intent_id: payment_intent_id,
			stripe_customer_id: sessions.data[0].customer as string,
			status: "failed",
		},
	});
};

const checkoutSessionExpired = async (checkout_session_id: string) => {
	await prisma.payment.update({
		where: { checkout_session_id: checkout_session_id },
		data: {
			status: "expired",
		},
	});
};

export { paymentSucceeded, paymentFailed, checkoutSessionExpired };
