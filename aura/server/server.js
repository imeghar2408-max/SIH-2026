const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { SarvamAIClient } = require("sarvamai");
const multer = require("multer");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const client = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY,
});

const upload = multer({
  storage: multer.memoryStorage(),
});

// ==================================================
// HEALTH CHECK
// ==================================================

app.get("/", (req, res) => {
  res.json({
    message: "SMRITI voice server is running",
  });
});

// ==================================================
// SPEECH TO TEXT
// ==================================================

app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Audio file is required",
      });
    }

    const response = await client.speechToText.transcribe({
      file: new Blob([req.file.buffer], {
        type: req.file.mimetype || "audio/webm",
      }),
      model: "saaras:v4",
      mode: "transcribe",
      language_code: "unknown",
    });

    res.json({
      transcript: response.transcript,
      language_code: response.language_code,
    });
  } catch (error) {
    console.error("Speech-to-text error:", error);

    res.status(500).json({
      error: "Unable to transcribe audio",
    });
  }
});

// ==================================================
// TEXT TO SPEECH
// ==================================================

app.post("/api/speak", async (req, res) => {
  try {
    const { text, language_code } = req.body;
    const speechText = typeof text === "string" ? text.trim() : "";

    if (!speechText) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    if (speechText.length > 2500) {
      return res.status(400).json({
        error: "Text must be 2500 characters or fewer",
      });
    }

    const response = await client.textToSpeech.convert({
      text: speechText,
      language_code:
        typeof language_code === "string" && language_code.trim()
          ? language_code
          : "hi-IN",
      model: "bulbul:v3",
      speaker: "priya",
      output_audio_codec: "wav",
    });

    const audio = response?.audios?.[0];

    if (!audio) {
      return res.status(500).json({
        error: "Sarvam returned no audio",
      });
    }

    res.json({
      audio,
      contentType: "audio/wav",
    });
  } catch (error) {
    console.error("Text-to-speech error:", error);

    res.status(500).json({
      error: error.message || "Unable to generate speech",
    });
  }
});

// ==================================================
// SMRITI CHAT - MINIMAL TEST
// ==================================================

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, patientContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Messages are required",
      });
    }

    const systemInstructions = `You are Smriti, a personalized AI companion for this patient.

The following information is the patient's current available context. Use it only to answer relevant patient-specific questions.

PATIENT CONTEXT:
${JSON.stringify(patientContext || {}, null, 2)}

Rules:
- Treat the patient context as factual application data.
- Never invent patient-specific information.
- Never infer missing medications, timings, appointments, relationships, or medical information.
- If the requested information is not present in the patient context, say that you do not have that information.
- Do not expose unnecessary patient information when it is unrelated to the user's question.
- Do not reveal the entire patient context unless the user asks for it and it is appropriate.
- Continue following these language rules: reply in Hindi to Hindi, Assamese to Assamese, Bengali to Bengali, English to English, and naturally follow the patient's style for mixed-language messages.
- Keep responses short, warm, simple, and suitable for an elderly user.
- Patient context is application data, not medical advice. Do not diagnose or change treatment.`;

    const response = await client.chat.completions({
      model: "sarvam-105b-conversations",
      messages: [
        { role: "system", content: systemInstructions },
        ...messages,
      ],
      reasoning_effort: null,
      max_tokens: 100,
    });

    console.log("Full Sarvam response:");
    console.dir(response, { depth: null });

    const reply = response?.choices?.[0]?.message?.content;

    console.log("Extracted reply:", reply);

    if (!reply) {
      return res.status(500).json({
        error: "Sarvam returned no text",
        response: response,
      });
    }

    res.json({
      reply: reply,
    });
  } catch (error) {
    console.error("CHAT ERROR:");
    console.error(error);

    res.status(500).json({
      error: error.message || "Unable to generate AI response",
    });
  }
});

// ==================================================
// OLD TEST CHAT
// ==================================================

app.post("/api/test-chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const response = await client.chat.completions({
      model: "sarvam-105b-conversations",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    console.log("TEST CHAT RESPONSE:");
    console.dir(response, { depth: null });

    res.json({
      reply: response?.choices?.[0]?.message?.content,
    });
  } catch (error) {
    console.error("Sarvam error:", error);

    res.status(500).json({
      error: error.message || "Unable to get response from Smriti",
    });
  }
});

// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, () => {
  console.log(`SMRITI server running on http://localhost:${PORT}`);
});
