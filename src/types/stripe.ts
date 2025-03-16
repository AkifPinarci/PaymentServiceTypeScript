import { default as stripeClient } from "stripe";
type StripeWebhookEvent = {
	stripeEvent: stripeClient.Event;
};

interface WebhookPaymentIntent extends stripeClient.PaymentIntent {
	charges: {
		object: string;
		data: stripeClient.Charge[];
		has_more: boolean;
		total_count: number;
		url: string;
	};
}

export default StripeWebhookEvent;
export { WebhookPaymentIntent };
