import React, { useRef, useState } from "react";

export default function VoiceTest() {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState("");
  const [error, setError] = useState("");

  const startRecording = async () => {
    try {
      setError("");
      setTranscript("");
      setLanguage("");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mimeType = MediaRecorder.isTypeSupported(
        "audio/webm;codecs=opus"
      )
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunksRef.current, {
            type: mimeType,
          });

          if (!audioBlob.size) {
            throw new Error("No audio was recorded.");
          }

          const formData = new FormData();

          formData.append(
            "audio",
            audioBlob,
            "smriti-voice.webm"
          );

          const response = await fetch(
            "http://localhost:5000/api/transcribe",
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.error || "Transcription failed."
            );
          }

          setTranscript(data.transcript || "");
          setLanguage(data.language_code || "unknown");
        } catch (err) {
          setError(err.message);
        } finally {
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorderRef.current = recorder;

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setError(
        err.message ||
          "Microphone permission is required."
      );
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#0f3e3a]">
          SMRITI Voice Test
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Speak in Hindi, Assamese, Bengali or another
          supported language.
        </p>

        <button
          onClick={
            isRecording
              ? stopRecording
              : startRecording
          }
          className={`mt-6 w-full rounded-2xl py-4 text-white font-bold ${
            isRecording
              ? "bg-red-600"
              : "bg-[#0f3e3a]"
          }`}
        >
          {isRecording
            ? "Stop Recording"
            : "Start Recording"}
        </button>

        {transcript && (
          <div className="mt-6 rounded-2xl bg-stone-50 p-5">
            <p className="text-xs font-bold text-gray-400 uppercase">
              Transcript
            </p>

            <p className="mt-2 text-lg text-gray-800">
              {transcript}
            </p>

            <p className="mt-3 text-xs text-gray-400">
              Detected language: {language}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}