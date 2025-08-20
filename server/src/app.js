import express from "express";
import { createServer } from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { rateLimit } from "express-rate-limit";
import { Server } from "socket.io";

// Imports from folders
import { connectDB } from "./config/connectDB.js";
import "./config/passport.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";

// Importing all routes here
import { healthCheckRouter } from "./routes/healthcheck.route.js";
import { authRouter } from "./routes/auth.route.js";
import { projectRouter } from "./routes/project.route.js";
import { projectNoteRouter } from "./routes/projectnote.route.js";
import { taskRouter } from "./routes/task.route.js";
import { userRouter } from "./routes/user.route.js";
import { adminRouter } from "./routes/admin.route.js";
import { subtaskRouter } from "./routes/subtask.route.js";
import { notificationRouter } from "./routes/notification.route.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(
      `✅ User ${userId} joined room | 👉 Socket ID: ${socket.id} | 👉 Rooms for socket: ${JSON.stringify([...socket.rooms])}`
    );
  });

  socket.on("joinProjectRoom", (projectId) => {
    socket.join(projectId);
    console.log(
      `✅ Project ${projectId} joined room | 👉 Socket ID: ${socket.id} | 👉 Rooms for socket: ${JSON.stringify([...socket.rooms])}`
    );
  });
});
app.set("io", io);

// Cors Configuration
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// For ip
app.set("trust proxy", true);

// Rate Limit Configuration
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 500,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
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
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/projects", projectNoteRouter);
app.use("/api/v1/projects", taskRouter);
app.use("/api/v1/projects", subtaskRouter);
app.use("/api/v1/notifications", notificationRouter);

// Custom Middlewares
app.use(errorHandler);

export { server };
