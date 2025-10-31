import { io } from "socket.io-client";
const socket = io("https://dun-chat-server.onrender.com", {
  transports: ["websocket"],
});
export default socket;
