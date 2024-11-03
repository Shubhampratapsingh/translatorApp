import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3001");

function Translator() {
  // Room State
  const [room, setRoom] = useState("");
  const [isActiveRoom, setIsActiveRoom] = useState(false);

  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      setIsActiveRoom(true);
    }
  };

  const handleMessageChange = (event) => {
    const newMessage = event.target.value;
    setMessage(newMessage);

    if (newMessage.trim() !== "") {
      socket.emit("send_message", { message: newMessage, room });
    }
  };

  const leaveRoom = () => {
    socket.emit("leave_room", room);
    setIsActiveRoom(false);
    setMessage("");
    setMessageReceived("");
    setRoom("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });

    // Clean up on unmount
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {!isActiveRoom ? (
        <div className="flex flex-col mb-4 w-full max-w-md">
          <input
            type="text"
            placeholder="Enter Room Number..."
            className="p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button
            onClick={joinRoom}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Create/Join Room
          </button>
        </div>
      ) : (
        <div className="flex mb-4 w-full max-w-md items-center justify-center">
          <h1 className="text-2xl font-bold mb-6 mr-2">{room}</h1>
          <button
            onClick={leaveRoom}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition mb-4 text-sm"
          >
            Leave Room
          </button>
        </div>
      )}

      <div className="flex flex-col mb-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter Your Message..."
          className="p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={handleMessageChange}
        />
      </div>

      <h2 className="text-xl font-semibold mt-6">Message:</h2>
      <p className="text-yellow-800">{message}</p>
      <p className="text-gray-600">{messageReceived}</p>
    </div>
  );
}

export default Translator;
