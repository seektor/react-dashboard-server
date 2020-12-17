import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { APP_CONFIG } from "./appConfig";
import { db } from "./db/db";
import AuthRouter from "./routes/authRoutes";
import { SocketEvents } from "./types/SocketEvents";

const app = express();

app.use(express.json());
app.use(cors());

app.use(AuthRouter);

// TODO: Listeners should depend on each other
const server = app.listen(APP_CONFIG.SERVER_PORT, () => {
  console.log(`Server Started at Port ${APP_CONFIG.SERVER_PORT}.`);
});

db.authenticate()
  .then(async () => {
    console.log(`Database is listening at Port ${APP_CONFIG.POSTGRES_PORT}.`);
  })
  .catch(() => console.log("Error initializing db connection."));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const activeUsers = new Set();
io.on("connection", (socket) => {
  console.log("New socket connection.");

  socket.on(SocketEvents.UserConnected, (userName: string) => {
    socket.userName = userName;
    console.log("loosing time", userName);
    socket.broadcast.emit(SocketEvents.UserConnected, userName);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected.");
    socket.broadcast.emit(SocketEvents.userDisconnected, socket.userName);
  });
});
