import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { swaggerSpecs, swaggerUi } from "./config/swagger";
import authRoutes from "./routes/auth.route";
import { logger } from "./utils/logger";
import cors from "cors";
dotenv.config();

const app: Express = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Expose Swagger JSON spec
app.get("/api/v1/docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpecs);
});

app.use("/api/v1/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  logger.info("Server is running on port", `${process.env.PORT}`);
  logger.info(
    "Swagger is running on",
    `http://localhost:${process.env.PORT}/api/v1/docs`
  );
});
