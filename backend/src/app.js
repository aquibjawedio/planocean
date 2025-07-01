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

const app = express();

// Cors Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Database connection
connectDB();

// Routes configuration
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/projectnote", projectNoteRouter);
app.use("/api/v1/task", taskRouter);

// Custom Middlewares
app.use(errorHandler);

export { app };
