import App from "./app";

const app = new App();
app.listen();

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("New socket connection.");

//   socket.on(SocketEvents.UserConnected, (userName: string) => {
//     socket.userName = userName;
//     console.log("loosing time", userName);
//     socket.broadcast.emit(SocketEvents.UserConnected, userName);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected.");
//     socket.broadcast.emit(SocketEvents.userDisconnected, socket.userName);
//   });
// });
