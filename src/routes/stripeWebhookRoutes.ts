import express from "express";
const router = express.Router();
import stripeWebhook from "../controllers/stripeWebhookController.js";
import stripeWebhookMiddleware from "../middlewares/webhookMiddleware.js";

// Apply the webhook middleware to verify Stripe signatures
router.post("/", stripeWebhookMiddleware, stripeWebhook);

export default router;
