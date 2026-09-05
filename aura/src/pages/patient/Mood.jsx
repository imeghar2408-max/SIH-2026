import React, { useEffect, useMemo, useState } from "react";
import {
  Heart,
  Smile,
  Meh,
  Frown,
  Mic,
  Volume2,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
  X,
} from "lucide-react";

const moods = [
  {
    id: "happy",
    label: "Happy",
    emoji: "😊",
    description: "Feeling cheerful",
  },
  {
    id: "calm",
    label: "Calm",
    emoji: "😌",
    description: "Feeling peaceful",
  },
  {
    id: "okay",
    label: "Okay",
    emoji: "🙂",
    description: "Feeling alright",
  },
  {
    id: "sad",
    label: "Sad",
    emoji: "😔",
    description: "Feeling a little low",
  },
  {
    id: "worried",
    label: "Worried",
    emoji: "😟",
    description: "Feeling concerned",
  },
];

const reasons = [
  "Family",
  "Friends",
  "Memory activity",
  "Music",
  "Food",
  "Rest",
  "Something else",
];

function getToday() {
  return new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function speak(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;

    window.speechSynthesis.speak(utterance);
  }
}

function getMoodScore(moodId) {
  const scores = {
    happy: 5,
    calm: 4,
    okay: 3,
    sad: 2,
    worried: 2,
  };

  return scores[moodId] || 3;
}

export default function Mood() {
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [note, setNote] = useState("");

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("aura-mood-history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedMessage, setSavedMessage] = useState("");

  const [isListening, setIsListening] = useState(false);

  const [memoryMood, setMemoryMood] = useState("");
  const [showMemoryPrompt, setShowMemoryPrompt] = useState(true);

  useEffect(() => {
    localStorage.setItem(
      "aura-mood-history",
      JSON.stringify(history),
    );
  }, [history]);

  const averageMood = useMemo(() => {
    if (!history.length) return null;

    const total = history.reduce(
      (sum, item) => sum + getMoodScore(item.mood),
      0,
    );

    return (total / history.length).toFixed(1);
  }, [history]);

  const moodCounts = useMemo(() => {
    return moods.map((mood) => ({
      ...mood,
      count: history.filter(
        (item) => item.mood === mood.id,
      ).length,
    }));
  }, [history]);

  const saveMood = () => {
    if (!selectedMood) return;

    const newEntry = {
      id: Date.now(),
      mood: selectedMood,
      reason: selectedReason || "Not specified",
      note: note.trim(),
      date: getToday(),
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setHistory((current) => [newEntry, ...current]);

    setSelectedMood("");
    setSelectedReason("");
    setNote("");

    setSavedMessage("Your mood has been saved.");

    setTimeout(() => {
      setSavedMessage("");
    }, 3000);
  };

  const startVoiceJournal = () => {
    if (
      !("SpeechRecognition" in window) &&
      !("webkitSpeechRecognition" in window)
    ) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setNote((current) =>
        current ? `${current} ${transcript}` : transcript,
      );
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const clearHistory = () => {
    if (
      window.confirm(
        "Are you sure you want to clear your mood history?",
      )
    ) {
      setHistory([]);
    }
  };

  const getSuggestion = () => {
    if (!selectedMood) {
      return "Choose your mood to receive a gentle activity suggestion.";
    }

    if (selectedMood === "happy") {
      return "You seem to be having a positive moment. You could revisit a favorite family memory.";
    }

    if (selectedMood === "calm") {
      return "A calm moment can be a good time for a familiar memory activity or some relaxing music.";
    }

    if (selectedMood === "okay") {
      return "You could try a short memory activity or talk with someone familiar.";
    }

    if (selectedMood === "sad") {
      return "You might enjoy looking at a favorite family memory or talking with someone you trust.";
    }

    return "A familiar activity, a quiet moment, or talking with someone you trust may help you feel supported.";
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-300">

      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2">
          <Heart
            size={26}
            className="text-[#0f3e3a]"
            fill="currentColor"
          />

          <h1 className="text-3xl font-black text-[#0f3e3a]">
            Daily Mood
          </h1>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          Take a moment to tell us how you are feeling today.
        </p>
      </div>

      {/* MAIN CHECK-IN */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="text-xl font-black text-gray-900">
            How are you feeling?
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            There is no right or wrong answer.
          </p>
        </div>

        {/* MOODS */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">

          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`rounded-2xl border p-4 text-center transition ${
                selectedMood === mood.id
                  ? "border-[#0f3e3a] bg-teal-50 shadow-sm"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="text-4xl">
                {mood.emoji}
              </div>

              <p className="mt-2 text-sm font-bold text-gray-800">
                {mood.label}
              </p>

              <p className="mt-1 text-[10px] text-gray-400">
                {mood.description}
              </p>
            </button>
          ))}

        </div>

        {/* REASON */}
        <div className="mt-7">
          <h3 className="mb-3 text-sm font-bold text-gray-800">
            What made you feel this way?
          </h3>

          <div className="flex flex-wrap gap-2">

            {reasons.map((reason) => (
              <button
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  selectedReason === reason
                    ? "border-[#0f3e3a] bg-[#0f3e3a] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {reason}
              </button>
            ))}

          </div>
        </div>

        {/* JOURNAL */}
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">
              Want to say more?
            </h3>

            <button
              onClick={startVoiceJournal}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-[#0f3e3a]"
            >
              <Mic size={15} />

              {isListening
                ? "Listening..."
                : "Speak"}
            </button>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="You can write something about your day..."
            rows={4}
            className="w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm outline-none transition focus:border-[#0f3e3a]"
          />
        </div>

        {/* SAVE */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">

          <button
            onClick={saveMood}
            disabled={!selectedMood}
            className={`flex-1 rounded-xl py-3.5 text-sm font-bold text-white transition ${
              selectedMood
                ? "bg-[#0f3e3a] hover:bg-[#0c312e]"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            Save Today's Mood
          </button>

          {savedMessage && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <CheckCircle2 size={16} />
              {savedMessage}
            </div>
          )}

        </div>

      </section>

      {/* PERSONALIZED SUGGESTION */}
      <section className="rounded-3xl border border-teal-100 bg-teal-50/60 p-6">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0f3e3a] shadow-sm">
            <Sparkles size={22} />
          </div>

          <div className="flex-1">
            <h2 className="font-black text-[#0f3e3a]">
              A gentle suggestion
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {getSuggestion()}
            </p>

            <button
              onClick={() =>
                speak(getSuggestion())
              }
              className="mt-4 flex items-center gap-2 text-xs font-bold text-[#0f3e3a]"
            >
              <Volume2 size={15} />
              Listen
            </button>
          </div>

        </div>

      </section>

      {/* MEMORY → MOOD */}
      {showMemoryPrompt && (
        <section className="rounded-3xl border border-gray-200 bg-white p-6">

          <div className="flex items-start justify-between">

            <div>
              <div className="flex items-center gap-2">
                <Heart
                  size={18}
                  className="text-rose-500"
                />

                <h2 className="font-black text-gray-900">
                  How did this memory make you feel?
                </h2>
              </div>

              <p className="mt-1 text-xs text-gray-400">
                A quick reflection after a familiar memory.
              </p>
            </div>

            <button
              onClick={() => setShowMemoryPrompt(false)}
              className="text-gray-400"
            >
              <X size={18} />
            </button>

          </div>

          <div className="mt-5 rounded-2xl bg-stone-100 p-5">

            <div className="text-5xl">
              👨‍👩‍👧‍👦
            </div>

            <h3 className="mt-3 font-black text-gray-900">
              A Family Gathering
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Think about a happy moment with your family.
            </p>

          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">

            {[
              ["happy", "😊 Happy"],
              ["calm", "😌 Calm"],
              ["okay", "🙂 Okay"],
              ["sad", "😔 Sad"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setMemoryMood(id)}
                className={`rounded-xl border p-3 text-xs font-bold ${
                  memoryMood === id
                    ? "border-[#0f3e3a] bg-teal-50 text-[#0f3e3a]"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}

          </div>

          {memoryMood && (
            <p className="mt-4 text-xs font-semibold text-[#0f3e3a]">
              Thank you for sharing how that memory made you feel.
            </p>
          )}

        </section>
      )}

      {/* MOOD SUMMARY */}
      <section>

        <div className="mb-4">
          <h2 className="text-lg font-black text-gray-900">
            Your Mood Patterns
          </h2>

          <p className="text-xs text-gray-400">
            A simple view of your recorded check-ins.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-semibold text-gray-400">
              Check-ins
            </p>

            <p className="mt-2 text-3xl font-black text-gray-900">
              {history.length}
            </p>

            <p className="mt-1 text-[10px] text-gray-400">
              Total mood entries
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-semibold text-gray-400">
              Average Mood
            </p>

            <p className="mt-2 text-3xl font-black text-[#0f3e3a]">
              {averageMood || "--"}
            </p>

            <p className="mt-1 text-[10px] text-gray-400">
              Based on your check-ins
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-semibold text-gray-400">
              Recent Mood
            </p>

            <p className="mt-2 text-3xl">
              {history.length
                ? moods.find(
                    (mood) =>
                      mood.id === history[0].mood,
                  )?.emoji
                : "—"}
            </p>

            <p className="mt-1 text-[10px] text-gray-400">
              Latest check-in
            </p>
          </div>

        </div>

      </section>

      {/* MOOD DISTRIBUTION */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6">

        <div className="mb-5 flex items-center gap-2">
          <Calendar
            size={18}
            className="text-[#0f3e3a]"
          />

          <h2 className="font-black text-gray-900">
            Mood Distribution
          </h2>
        </div>

        <div className="space-y-4">

          {moodCounts.map((mood) => {

            const percentage =
              history.length === 0
                ? 0
                : Math.round(
                    (mood.count / history.length) * 100,
                  );

            return (
              <div key={mood.id}>

                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{mood.emoji}</span>

                    <span className="text-xs font-bold text-gray-700">
                      {mood.label}
                    </span>
                  </div>

                  <span className="text-xs text-gray-400">
                    {mood.count}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#0f3e3a] transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* HISTORY */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6">

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="font-black text-gray-900">
              Recent Check-ins
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Your latest mood entries.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50"
            >
              <Trash2 size={14} />
              Clear
            </button>
          )}

        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 p-8 text-center">
            <Smile
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm font-semibold text-gray-500">
              No mood check-ins yet.
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Your saved mood entries will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">

            {history.slice(0, 7).map((entry) => {

              const mood = moods.find(
                (item) => item.id === entry.mood,
              );

              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl">
                    {mood?.emoji}
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-gray-800">
                        {mood?.label}
                      </p>

                      <span className="text-[10px] text-gray-400">
                        {entry.date} • {entry.time}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      Reason: {entry.reason}
                    </p>

                    {entry.note && (
                      <p className="mt-1 truncate text-xs text-gray-400">
                        "{entry.note}"
                      </p>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>

      {/* DISCLAIMER */}
      <div className="rounded-2xl bg-gray-50 p-4 text-center text-[11px] leading-5 text-gray-400">
        Mood check-ins are for personal reflection and caregiver
        awareness. They are not a medical diagnosis.
      </div>

    </div>
  );
}