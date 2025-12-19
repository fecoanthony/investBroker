import express from "express";
import { connectDB } from "./config/database.js";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import cors from "cors";
import planRoutes from "./routes/planRoute.js";
import transactionRoute from "./routes/transactionRoute.js";
import adminRoute from "./routes/adminRoute.js";
import investmentRoute from "./routes/investmentRoute.js";
import walletRoute from "./routes/walletRoute.js";
import cookieParser from "cookie-parser";
import referralRoute from "./routes/referralRoute.js";
import withdrawalRoute from "./routes/withdrawalRoute.js";
import adminUserRoutes from "./routes/adminUserRoute.js";
import adminInvestmentRoutes from "./routes/adminInvestmentRoute.js";
import adminTransactionRoutes from "./routes/adminTransactionRoutes.js";
import adminUserRoutes from "./routes/admin/adminUserRoutes.js";
import investmentAdminRoutes from "./routes/admin/investmentAdminRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import userDashboardRoute from "./routes/userDashboardRoute.js";

// import "./cron/cronjob.js";

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
app.use("/api", referralRoute);
app.use("/api", walletRoute);
app.use("/api/", withdrawalRoute);
app.use("/api/admin", adminUserRoutes);
// app.use("/api/admin", adminInvestmentRoutes);
app.use("/api/admin/transactions", adminTransactionRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api/admin", investmentAdminRoutes);
app.use("/admin", adminDashboardRoutes);
app.use("/api/user", userDashboardRoute);

app.listen(port, () => {
  console.log("server connected");
  console.log(port);
  connectDB();
});
