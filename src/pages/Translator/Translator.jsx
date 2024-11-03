import io from "socket.io-client";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Collapse } from "antd";
import { LanguageDetector } from "../../utils/language-detection";
import { TranscriptTranslator } from "../../utils/translator";
import ISO6391 from "iso-639-1";

const socket = io.connect("http://localhost:3001");

function Translator() {
  // Room State
  const [room, setRoom] = useState("");
  const [isActiveRoom, setIsActiveRoom] = useState(false);

  // Messages State
  const [messageReceived, setMessageReceived] = useState("");
  const [translatedReceivedMessage, setTranslatedReceivedMessage] =
    useState("");

  // Speech recognition setup
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [myLanguageDetected, setMyLanguageDetected] = useState({});
  const [otherUserlanguageDetected, setOtherLanguageDetected] = useState({});

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
    LanguageDetector(transcript)
      .then((detectedLanguage) => {
        // console.log("detected Language", detectedLanguage);
        if (detectedLanguage) {
          let lang = ISO6391.getName(`${detectedLanguage?.detectedLanguage}`);
          setMyLanguageDetected({
            langCode: detectedLanguage?.detectedLanguage,
            language: lang,
          });
        }
      })
      .catch((error) => {
        console.error("Error detecting language:", error);
      });

    LanguageDetector(messageReceived)
      .then((detectedLanguage) => {
        // console.log("detected Language", detectedLanguage);
        if (detectedLanguage) {
          let lang = ISO6391.getName(`${detectedLanguage?.detectedLanguage}`);
          setOtherLanguageDetected({
            langCode: detectedLanguage?.detectedLanguage,
            language: lang,
          });
        }
      })
      .catch((error) => {
        console.error("Error detecting language:", error);
      });

    const transcriptLanguage = {
      sourceLanguage: otherUserlanguageDetected?.langCode || "ja",
      targetLanguage: myLanguageDetected?.langCode || "en",
    };
    TranscriptTranslator(messageReceived || "", transcriptLanguage)
      .then((translated) => {
        if (translated) {
          console.log("translated Language", translated);
          setTranslatedReceivedMessage(translated);
        }
      })
      .catch((error) => {
        console.error("Error translating language:", error);
      });
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
    setMyLanguageDetected({});
    setOtherLanguageDetected({});
    setTranslatedReceivedMessage("");
    SpeechRecognition.stopListening();
    resetTranscript();
  };

  const handleStartListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: myLanguageDetected?.langCode || "en-IN",
    });
    setIsListening(true);
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Speech recognition is not supported in this browser.</p>;
  }

  const collpaseItems = [
    {
      key: "1",
      label: "Translated transcript from other user",
      children: (
        <p>
          {translatedReceivedMessage ||
            "Translated transcripts are not available."}
        </p>
      ),
    },
    {
      key: "2",
      label: "Your translated transcript",
      children: <p>Translated transcripts are not available.</p>,
    },
  ];

  const summarizeMeeting = () => {};

  const saveDetails = () => {};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* speech to text section */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
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

          <h2 className="text-lg font-semibold">
            Transcript from other user in{" "}
            {otherUserlanguageDetected?.language || <span>&#129300;</span>}
          </h2>
          <div className="p-3 border border-gray-200 rounded bg-gray-100 mt-2 text-gray-700">
            {messageReceived || "No transcript received yet."}
          </div>
        </div>

        {/* Transalted transcript section */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <Collapse items={collpaseItems} defaultActiveKey={["1"]} />
        </div>
      </div>
      <div className="footer-buttons mt-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={summarizeMeeting}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            Summarize
          </button>

          <button
            onClick={saveDetails}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Translator;
