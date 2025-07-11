import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

// Imports from folders
import { connectDB } from "./config/connectDB.js";
import "./config/passport.js";

// Importing all routes here
import { healthCheckRouter } from "./routes/healthcheck.route.js";
import { authRouter } from "./routes/auth.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { projectRouter } from "./routes/project.route.js";
import { projectNoteRouter } from "./routes/projectnote.route.js";
import { taskRouter } from "./routes/task.route.js";
import { userRouter } from "./routes/user.route.js";
import { adminRouter } from "./routes/admin.route.js";
import { subtaskRouter } from "./routes/subtask.route.js";
import { env } from "./config/env.js";

const app = express();

// Cors Configuration
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Database connection
connectDB();

// Routes configuration
app.use("/api/v1/health", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/project", taskRouter);
app.use("/api/v1/project", subtaskRouter);
app.use("/api/v1/projectnote", projectNoteRouter);

// Custom Middlewares
app.use(errorHandler);

export { app };
