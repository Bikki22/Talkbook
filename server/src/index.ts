import express from "express";
import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { registerRoutes } from "./routes";
import { errorHandler } from "./middleware/error-handler.middleware";
import { inngest } from "./inngest/client";
import { serve } from "inngest/express";
import { functions } from "./inngest/index";

const app = express();

const PORT = process.env.PORT || 8081;
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3000";

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  }),
);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

registerRoutes(app);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
