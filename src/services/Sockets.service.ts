import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { SocketEvent } from "../types/SocketEvent";

class SocketsService {
  private static instance: SocketsService;
  private io: SocketServer;

  private activeUsers = new Set<string>();

  private constructor(server: HttpServer) {
    this.io = new SocketServer(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });
    this.initSocketEvents();
  }

  public static init(server: HttpServer): SocketsService {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new SocketsService(server);
    return this.instance;
  }

  public static getInstance(): SocketsService | null {
    if (!SocketsService.instance) {
      return null;
    }
    return SocketsService.instance;
  }

  private initSocketEvents(): void {
    this.io.on("connection", (socket) => {
      console.log("[Socket] New User Connection.");

      socket.on(SocketEvent.UserConnected, (userName: string) => {
        console.log("[Socket] User Connected.");
        this.activeUsers.add(userName);
        socket.broadcast.emit(SocketEvent.UserConnected, userName);
      });

      socket.on("disconnect", () => {
        console.log("[Socket] User Disconnected.");
        socket.broadcast.emit(SocketEvent.UserDisconnected, socket.userName);
      });

      socket.on(
        SocketEvent.UserMessage,
        (data: { userName: string; message: string }) => {
          console.log("[Socket] User Message.");
          this.io.emit(SocketEvent.UserMessage, data);
        }
      );

      socket.on(SocketEvent.UsersCount, () => {
        console.log("[Socket] Users Count.");
        socket.emit(SocketEvent.UsersCount, this.activeUsers.size);
      });
    });
  }
}

export default SocketsService;
