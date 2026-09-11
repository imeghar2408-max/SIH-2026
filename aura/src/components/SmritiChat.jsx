import { useEffect, useRef, useState } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  Trash2,
  Volume2,
  Mic,
} from "lucide-react";
import patientData from "../data/patientData";

const detectLanguage = (text) =>
  /[\u0900-\u097F]/.test(text) ? "hi-IN" : "en-IN";

const base64ToBlob = (base64Audio, contentType) => {
  const bytes = atob(base64Audio.replace(/^data:.*;base64,/, ""));
  const byteArray = new Uint8Array(bytes.length);

  for (let index = 0; index < bytes.length; index += 1) {
    byteArray[index] = bytes.charCodeAt(index);
  }

  return new Blob([byteArray], { type: contentType });
};

const SmritiChat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "नमस्ते जी। मैं स्मृति हूँ। मैं आपकी मदद करने के लिए यहाँ हूँ। ❤️",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentlyPlayingMessage, setCurrentlyPlayingMessage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [voiceLanguageCode, setVoiceLanguageCode] = useState("");
  const currentAudioRef = useRef(null);
  const currentAudioUrlRef = useRef(null);
  const speechRequestRef = useRef(0);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }

      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());

      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }

      if (currentAudioUrlRef.current) {
        URL.revokeObjectURL(currentAudioUrlRef.current);
      }
    };
  }, []);

  const stopCurrentAudio = () => {
    speechRequestRef.current += 1;

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.onended = null;
      currentAudioRef.current.onerror = null;
      currentAudioRef.current = null;
    }

    if (currentAudioUrlRef.current) {
      URL.revokeObjectURL(currentAudioUrlRef.current);
      currentAudioUrlRef.current = null;
    }
  };

  const speakMessage = async (message, messageIndex) => {
    if (currentlyPlayingMessage === messageIndex) return;

    stopCurrentAudio();
    const requestId = speechRequestRef.current + 1;
    speechRequestRef.current = requestId;
    setCurrentlyPlayingMessage(messageIndex);

    try {
      const response = await fetch("http://localhost:5000/api/speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: message.content,
          language_code:
            message.languageCode || voiceLanguageCode || detectLanguage(message.content),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.audio) {
        throw new Error(data.error || "Unable to generate speech");
      }

      if (speechRequestRef.current !== requestId) return;

      const audioBlob = base64ToBlob(data.audio, data.contentType || "audio/wav");
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      currentAudioRef.current = audio;
      currentAudioUrlRef.current = audioUrl;

      const finishPlayback = () => {
        if (speechRequestRef.current !== requestId) return;

        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
        currentAudioUrlRef.current = null;
        setCurrentlyPlayingMessage(null);
      };

      audio.onended = finishPlayback;
      audio.onerror = finishPlayback;
      await audio.play();
    } catch (error) {
      if (speechRequestRef.current === requestId) {
        console.error("Smriti speech error:", error);
        stopCurrentAudio();
        setCurrentlyPlayingMessage(null);
      }
    }
  };

  const sendMessage = async (messageText = input, languageCode = "") => {
    const text = messageText.trim();

    if (!text || loading || isRecording) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    // Show user's message immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Only send actual conversation messages to backend
      const conversation = updatedMessages.map((message) => ({
        role: message.role,
        content: message.content,
      }));

      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversation,
          patientContext: patientData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to contact Smriti");
      }

      const assistantMessage = {
        role: "assistant",
        content: data.reply,
        languageCode,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Smriti chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "माफ़ कीजिए जी, अभी मुझसे जुड़ने में थोड़ी परेशानी हो रही है।",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const transcribeRecording = async (audioBlob) => {
    try {
      setIsTranscribing(true);
      setVoiceError("");

      const formData = new FormData();
      formData.append("audio", audioBlob, "voice.webm");

      const response = await fetch("http://localhost:5000/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to transcribe your voice");
      }

      const transcript = data.transcript?.trim();
      const languageCode = data.language_code || "";
      setVoiceLanguageCode(languageCode);

      if (!transcript) {
        setVoiceError("I couldn't hear anything. Please try again.");
        return;
      }

      await sendMessage(transcript, languageCode);
    } catch (error) {
      console.error("Smriti transcription error:", error);

      if (isMountedRef.current) {
        setVoiceError("I couldn't understand that. Please try again.");
      }
    } finally {
      if (isMountedRef.current) {
        setIsTranscribing(false);
      }
    }
  };

  const startRecording = async () => {
    if (isRecording || isTranscribing || loading) return;

    let stream;

    try {
      setVoiceError("");

      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMimeType = "audio/webm;codecs=opus";
      const mimeType = MediaRecorder.isTypeSupported(preferredMimeType)
        ? preferredMimeType
        : ["audio/webm", "audio/mp4", "audio/ogg"].find((type) =>
            MediaRecorder.isTypeSupported(type),
          );
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        mediaRecorderRef.current = null;
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;

        if (!isMountedRef.current) return;

        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || mimeType || "audio/webm",
        });

        if (!audioBlob.size) {
          setVoiceError("No audio was recorded. Please try again.");
          setIsTranscribing(false);
          return;
        }

        await transcribeRecording(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Smriti microphone error:", error);
      stream?.getTracks().forEach((track) => track.stop());

      if (error.name === "NotAllowedError" || error.name === "SecurityError") {
        setVoiceError("Microphone access is needed for voice conversations.");
      } else {
        setVoiceError("Unable to start the microphone. Please try again.");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      setIsRecording(false);
      setIsTranscribing(true);
      mediaRecorderRef.current.stop();
    }
  };

  const clearChat = () => {
    stopCurrentAudio();
    setCurrentlyPlayingMessage(null);

    setMessages([
      {
        role: "assistant",
        content:
          "नमस्ते जी। मैं स्मृति हूँ। मैं आपकी मदद करने के लिए यहाँ हूँ। ❤️",
      },
    ]);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#f8faf9] flex justify-center px-4 py-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[650px]">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-[#0f3e3a]">
              <Bot size={25} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Talk to Smriti
              </h1>

              <p className="text-sm text-gray-500">
                Your gentle AI companion
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
            title="Clear conversation"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-9 h-9 shrink-0 rounded-full bg-teal-50 flex items-center justify-center text-[#0f3e3a]">
                    <Bot size={18} />
                  </div>
                )}

                <div className="flex items-end gap-2 max-w-[84%]">
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? "bg-[#0f3e3a] text-white rounded-br-md"
                        : "bg-stone-100 text-gray-800 rounded-bl-md"
                    }`}
                  >
                    {message.content}
                  </div>

                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => speakMessage(message, index)}
                      disabled={currentlyPlayingMessage === index}
                      className="w-10 h-10 shrink-0 rounded-xl bg-teal-50 text-[#0f3e3a] flex items-center justify-center hover:bg-teal-100 disabled:opacity-60 disabled:cursor-not-allowed transition"
                      title="Listen to Smriti's response"
                      aria-label="Listen to Smriti's response"
                    >
                      {currentlyPlayingMessage === index ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Volume2 size={19} />
                      )}
                    </button>
                  )}
                </div>

                {isUser && (
                  <div className="w-9 h-9 shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    <User size={18} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 shrink-0 rounded-full bg-teal-50 flex items-center justify-center text-[#0f3e3a]">
                <Bot size={18} />
              </div>

              <div className="bg-stone-100 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2 text-gray-500 text-sm">
                <Loader2 size={16} className="animate-spin" />
                <span>Smriti is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-end gap-3 bg-stone-50 border border-gray-200 rounded-2xl px-4 py-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Talk to Smriti..."
              rows={1}
              disabled={loading || isRecording || isTranscribing}
              className="flex-1 resize-none bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 disabled:opacity-60"
            />

            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading || isTranscribing}
              className={`w-11 h-11 shrink-0 rounded-xl text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition ${
                isRecording
                  ? "bg-red-600 hover:bg-red-700 animate-pulse"
                  : "bg-teal-700 hover:bg-teal-800"
              }`}
              title={isRecording ? "Stop recording" : "Start voice message"}
              aria-label={isRecording ? "Stop recording" : "Start voice message"}
            >
              <Mic size={20} />
            </button>

            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading || isRecording || isTranscribing}
              className="w-11 h-11 shrink-0 rounded-xl bg-[#0f3e3a] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
            >
              <Send size={18} />
            </button>
          </div>

          {isRecording && (
            <p className="text-xs text-red-600 text-center mt-2 font-semibold">
              Listening... Tap the microphone again when you are done.
            </p>
          )}

          {isTranscribing && (
            <p className="text-xs text-[#0f3e3a] text-center mt-2 font-semibold">
              Turning your voice into a message...
            </p>
          )}

          {voiceError && (
            <p className="text-xs text-red-600 text-center mt-2">{voiceError}</p>
          )}

          <p className="text-[11px] text-gray-400 text-center mt-2">
            Smriti provides assistance and is not a replacement for a doctor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmritiChat;
