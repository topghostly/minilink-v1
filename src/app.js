import express from "express";
import AppError from "#utils/error.js";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "#routes/auth.route.js";
import linkRoutes from "#routes/links.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: "minilink-api",
      status: "ok",
      version: process.env.API_VERSION,
      environment: process.env.NODE_ENV,
    },
    error: null,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

// Health check for pod health and whotnot
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "healthy",
      version: process.env.API_VERSION,
      environment: process.env.NODE_ENV,
    },
    error: null,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/links", linkRoutes);

// Handle 404 errors
app.use((req, res, next) => {
  next(
    new AppError(
      "The requested endpoint does not exist.",
      404,
      "ROUTE_NOT_FOUND"
    )
  );
});

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) console.log(err);

  res.status(status).json({
    success: false,
    data: null,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: isProd && status === 500 ? "Something went wrong." : err.message,
    },
    meta: null,
  });
});

export default app;
