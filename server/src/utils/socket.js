import cookie from "cookie";
import { Server, Socket } from "socket.io";
import { ApiError } from "./ApiError.js";
import { verifyJWTAccessToken } from "./jwt.js";
import { ProjectMember } from "../models/projectmember.model.js";
import { SocketEventsEnum } from "../constants/socket.constant.js";

const initializeSocketIO = async (io) => {
  return io.on("connection", (socket) => {
    let decodedToken;
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

      let token = cookies?.accessToken;
      console.log("SOCKET TOKEN : ", token);

      if (!token) {
        token = socket.handshake.auth?.token;
      }

      if (!token) {
        throw new ApiError(401, "Un-authorized handshake. Token is missing");
      }

      decodedToken = verifyJWTAccessToken(token);
      console.log("USER\n : ", decodedToken);
    } catch (error) {
      console.log("ERROR IN SOCKET : ", error);
    }

    socket.on(SocketEventsEnum.JOIN_ROOM, (userId) => {
      socket.join(userId);
      console.log(
        `✅ User ${decodedToken?.email} joined room | 👉 Socket ID: ${socket.id} | 👉 Rooms for socket: ${JSON.stringify([...socket.rooms])}`
      );
    });

    socket.on(SocketEventsEnum.JOIN_PROJECT_EVENT, async (projectId) => {
      const member = await ProjectMember.findOne({
        project: projectId,
        user: decodedToken._id.toString(),
      });

      if (!member) {
        throw new ApiError(404, "Un-authorize! You are not a legal member of this project");
      }

      socket.join(projectId);
      console.log(
        `✅ Project ${projectId} joined room by : ${decodedToken?.email} | 👉 Socket ID: ${socket.id} | 👉 Rooms for socket: ${JSON.stringify([...socket.rooms])}`
      );
    });
  });
};

export { initializeSocketIO };
