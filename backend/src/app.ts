import express from "express";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import dressesRouter from "./routes/dresses";
import reviewsRouter, { updateRouter as reviewsUpdateRouter } from "./routes/reviews";
import generatorRouter from "./routes/generator";
import { schema, rootValue } from "./graphql";

const app = express();

app.use(cors());
app.use(express.json());

// REST endpoints
app.use("/api/dresses", dressesRouter);
app.use("/api/dresses/:dressId/reviews", reviewsRouter);
app.use("/api/reviews", reviewsUpdateRouter);
app.use("/api/generator", generatorRouter);

// GraphQL endpoint
app.use(
  "/graphql",
  createHandler({ schema, rootValue })
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
