import path from "node:path";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import config from "./config/config.env";
import logger from "./config/logger";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(helmet());

// Request limit for same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "To many request from this IP, Please try in an hour",
});

app.use("/ap", limiter);

// Request log middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info("Incoming Request...", {
    method: req.method,
    url: req.url,
    ip: req.ip,
  });
  next();
});

export default app;
