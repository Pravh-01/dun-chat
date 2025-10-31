import { io } from "socket.io-client";
const socket = io("https://dun-chat.onrender.com");  // backend port
export default socket;
