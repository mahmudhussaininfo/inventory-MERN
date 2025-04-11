import express from "express";
import cors from "cors";
import "dotenv/config";
import colors from "colors";
import cookieParser from "cookie-parser";
import mongoDbConnection from "./db/config.js";
import { errorHandler } from "./middleware/errorHandle.js";
import router from "./router/api.js";

const app = express();

const PORT = process.env.PORT || 9090;

const allowOrigin = process.env.ALLOWED_ORIGINS.split(",");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: allowOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// routes
app.use("/api", router);

// mongoDb connection
mongoDbConnection();

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.bgYellow.bold);
});
