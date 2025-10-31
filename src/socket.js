import { io } from "socket.io-client";
const socket = io("http://localhost:8000"); // backend port
export default socket;
