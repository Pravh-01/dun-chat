import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./chat.css";

const socket = io("https://dun-chat.onrender.com");

export default function Chat() {
  const [room, setRoom] = useState("");
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Click to find a partner");

  useEffect(() => {
    socket.on("waiting", (msg) => setStatus(msg));
    socket.on("partner_found", ({ room }) => {
      setRoom(room);
      setConnected(true);
      setStatus("Connected!");
    });
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, { ...data, self: false }]);
    });

    return () => {
      socket.off("waiting");
      socket.off("partner_found");
      socket.off("receive_message");
    };
  }, []);

  const findPartner = () => {
    setStatus("Searching...");
    socket.emit("find_partner");
  };

  const sendMessage = () => {
    if (message.trim()) {
      const data = { room, message };
      socket.emit("send_message", data);
      setMessages((prev) => [...prev, { ...data, self: true }]);
      setMessage("");
    }
  };

  if (!connected)
    return (
      <div className="waiting-screen">
        <p>{status}</p>
        <button onClick={findPartner}>Find Partner</button>
      </div>
    );

  return (
    <div className="chat-container">
      <h3>Connected to a stranger!</h3>
      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i} className={`message-row ${m.self ? "self" : "other"}`}>
            <div className={`message-bubble ${m.self ? "self" : "other"}`}>
              {m.message}
            </div>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
