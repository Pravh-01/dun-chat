import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

// Just to check Render is alive
app.get("/", (req, res) => {
  res.send("Server is running fine!");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let waitingUser = null;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("find_partner", () => {
    if (waitingUser) {
      const room = `room_${waitingUser.id}_${socket.id}`;
      socket.join(room);
      waitingUser.join(room);

      io.to(room).emit("partner_found", { room });
      console.log(`Paired: ${waitingUser.id} & ${socket.id}`);
      waitingUser = null;
    } else {
      waitingUser = socket;
      socket.emit("waiting", "Waiting for someone to join...");
      console.log(`${socket.id} is waiting`);
    }
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    if (waitingUser && waitingUser.id === socket.id) waitingUser = null;
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
