import express from "express";
import { connectDB } from "./config/database.js";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import cors from "cors";
import planRoutes from "./routes/planRoute.js";
import transactionRoute from "./routes/transactionRoute.js";
import adminRoute from "./routes/adminRoute.js";
import investmentRoute from "./routes/investmentRoute.js";
import cookieParser from "cookie-parser";
import { listReferralsForUser } from "./controllers/referralController.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json()); // parses JSON body
app.use(express.urlencoded({ extended: true })); // optional, for form submissions
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/plan", planRoutes);
app.use("/api/transactions", transactionRoute);
app.use("/api", adminRoute);
app.use("/api", investmentRoute);
app.use("/api", listReferralsForUser);

app.listen(port, () => {
  console.log("server connected");
  console.log(port);
  connectDB();
});
