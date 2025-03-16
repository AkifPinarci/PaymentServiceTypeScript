import express, { NextFunction, Request, Response } from "express";
const app = express();
import bodyParser from "body-parser";
import dotenv from "dotenv";

import paymentsRoutes from "./routes/paymentsRoutes.js";
import webhookRoutes from "./routes/stripeWebhookRoutes.js";
import healthcheckRoutes from "./routes/healthcheckRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import morgan from "morgan";

app.use(morgan("combined"));

// Apply body-parser to all routes except webhook
app.use((req: Request, res: Response, next: NextFunction) => {
	if (req.originalUrl === "/api/v1/webhook") {
		next();
	} else {
		bodyParser.json()(req, res, next);
	}
});

app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/v1/webhook", express.raw({ type: "application/json" }), webhookRoutes);
app.use("/api/v1/healthcheck", healthcheckRoutes);

app.use(errorMiddleware);

app.use((req, res) => {
	res.status(404).json({ error: { message: "Route not found!" } });
});

app.listen(process.env.PORT, () => {
	console.log(`Running on port ${process.env.PORT}`);
});
