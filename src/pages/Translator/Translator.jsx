import io from "socket.io-client";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const socket = io.connect("http://localhost:3001");

function Translator() {
  // Room State
  const [room, setRoom] = useState("");
  const [isActiveRoom, setIsActiveRoom] = useState(false);

  // Messages State
  const [messageReceived, setMessageReceived] = useState("");

  // Speech recognition setup
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);

  // useEffect to handle incoming messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });

    // Clean up on unmount
    return () => {
      socket.off("receive_message");
    };
  }, []);

  // Emit transcript in real-time
  useEffect(() => {
    if (isActiveRoom && transcript.trim() !== "") {
      socket.emit("send_message", { message: transcript, room });
    }
  }, [transcript, isActiveRoom, room]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      setIsActiveRoom(true);
    }
  };

  const leaveRoom = () => {
    socket.emit("leave_room", room);
    setIsActiveRoom(false);
    setMessageReceived("");
    setRoom("");
    SpeechRecognition.stopListening();
    resetTranscript();
  };

  const handleStartListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    setIsListening(true);
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Speech recognition is not supported in this browser.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        {!isActiveRoom ? (
          <div className="flex flex-col mb-6">
            <input
              type="text"
              placeholder="Enter Room Number..."
              className="p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(event) => setRoom(event.target.value)}
            />
            <button
              onClick={joinRoom}
              className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Create/Join Room
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">{`Room: ${room}`}</h1>
            <button
              onClick={leaveRoom}
              className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 transition"
            >
              Leave Room
            </button>
          </div>
        )}

        <div className="flex flex-col mb-4">
          <div className="main-content p-3 border border-gray-300 rounded bg-gray-50">
            <p>{transcript || "Start speaking to see text..."}</p>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          {isListening ? (
            <button
              onClick={handleStopListening}
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
            >
              Stop Listening
            </button>
          ) : (
            <button
              onClick={handleStartListening}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
            >
              Start Listening
            </button>
          )}
        </div>

        <h2 className="text-lg font-semibold">Transcript from other user:</h2>
        <div className="p-3 border border-gray-200 rounded bg-gray-100 mt-2 text-gray-700">
          {messageReceived || "No transcript received yet."}
        </div>
      </div>
    </div>
  );
}

export default Translator;
