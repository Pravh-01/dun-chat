import { io } from "socket.io-client";
// const socket = io("https://dun-chat-server.onrender.com", {
//   transports: ["websocket"],
// });

const socket = io("http://localhost:10000");

export default socket;
