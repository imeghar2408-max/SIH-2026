import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  Clock3,
  Heart,
  Lightbulb,
  MapPin,
  Mic,
  Volume2,
  XCircle,
} from "lucide-react";

const MEMORY_ITEMS = [
  {
    id: 1,
    name: "Family",
    category: "People",
    icon: "👨‍👩‍👧",
  },
  {
    id: 2,
    name: "Home",
    category: "Places",
    icon: "🏠",
  },
  {
    id: 3,
    name: "Garden",
    category: "Places",
    icon: "🌸",
  },
  {
    id: 4,
    name: "Festival",
    category: "Culture",
    icon: "🎉",
  },
  {
    id: 5,
    name: "Traditional Food",
    category: "Culture",
    icon: "🍲",
  },
  {
    id: 6,
    name: "Music",
    category: "Culture",
    icon: "🎵",
  },
  {
    id: 7,
    name: "Friend",
    category: "People",
    icon: "🧑‍🤝‍🧑",
  },
  {
    id: 8,
    name: "Nature",
    category: "Places",
    icon: "🏞️",
  },
];

const DIFFICULTY = {
  easy: 4,
  medium: 6,
  hard: 8,
};

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function MemoryGame({ setCurrentView }) {
  const [difficulty, setDifficulty] = useState("easy");
  const [gamePhase, setGamePhase] = useState("remember");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [memories, setMemories] = useState([]);
  const [options, setOptions] = useState([]);

  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [showHint, setShowHint] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  const numberOfCards = DIFFICULTY[difficulty];

  const categories = useMemo(() => {
    return ["All", ...new Set(MEMORY_ITEMS.map((item) => item.category))];
  }, []);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") {
      return MEMORY_ITEMS;
    }

    return MEMORY_ITEMS.filter(
      (item) => item.category === selectedCategory
    );
  }, [selectedCategory]);

  const createGame = () => {
    const pool =
      filteredItems.length >= numberOfCards
        ? filteredItems
        : MEMORY_ITEMS;

    const selected = shuffleArray(pool).slice(0, numberOfCards);

    setMemories(selected);
    setOptions(shuffleArray([...selected, ...shuffleArray(MEMORY_ITEMS).slice(0, 3)]));
    setSelectedAnswers([]);
    setCorrectAnswers([]);
    setWrongAnswers([]);
    setHintsUsed(0);
    setShowHint(false);
    setElapsedTime(0);
    setGamePhase("remember");
    setStartTime(null);
  };

  useEffect(() => {
    createGame();
  }, [difficulty, selectedCategory]);

  useEffect(() => {
    if (gamePhase !== "answer" || !startTime) {
      return;
    }

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase, startTime]);

  useEffect(() => {
    const speechAvailable =
      typeof window !== "undefined" &&
      "speechSynthesis" in window;

    setVoiceSupported(speechAvailable);
  }, []);

  const startRecall = () => {
    setGamePhase("answer");
    setStartTime(Date.now());

    if (voiceSupported) {
      const message = new SpeechSynthesisUtterance(
        "Now remember the pictures you saw. Select the memories you remember."
      );

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(message);
    }
  };

  const handleAnswer = (item) => {
    if (selectedAnswers.includes(item.id)) {
      return;
    }

    setSelectedAnswers((previous) => [...previous, item.id]);

    if (memories.some((memory) => memory.id === item.id)) {
      setCorrectAnswers((previous) => [...previous, item.id]);
    } else {
      setWrongAnswers((previous) => [...previous, item.id]);
    }
  };

  const useHint = () => {
    if (showHint) {
      return;
    }

    setShowHint(true);
    setHintsUsed((previous) => previous + 1);
  };

  const finishGame = () => {
    const correctCount = correctAnswers.length;
    const accuracy =
      memories.length > 0
        ? Math.round((correctCount / memories.length) * 100)
        : 0;

    const result = {
      score: correctCount,
      total: memories.length,
      accuracy,
      hintsUsed,
      elapsedTime,
      difficulty,
      category: selectedCategory,
    };

    localStorage.setItem("aura-last-game-result", JSON.stringify(result));

    setCurrentView("patient-game-result");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-full bg-stone-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setCurrentView("patient-activities")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="flex items-center gap-2 text-[#0f3e3a]">
            <Brain size={24} />
            <span className="font-bold">AURA Memory Game</span>
          </div>
        </div>

        {/* Game Settings */}
        <div className="bg-white rounded-3xl border border-gray-200 p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <p className="text-sm text-gray-500">
                Choose a familiar memory category
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                      selectedCategory === category
                        ? "bg-[#0f3e3a] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">
                Difficulty
              </p>

              <div className="flex gap-2">
                {Object.keys(DIFFICULTY).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize ${
                      difficulty === level
                        ? "bg-[#0f3e3a] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Remember Phase */}
        {gamePhase === "remember" && (
          <div className="bg-white rounded-[2rem] border border-gray-200 p-6 md:p-10 text-center">

            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#0f3e3a] mb-5">
              <Brain size={32} />
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Remember these
            </h1>

            <p className="text-gray-500 mt-2">
              Take your time. There is no rush.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
              {memories.map((memory) => (
                <div
                  key={memory.id}
                  className="rounded-3xl bg-stone-100 p-6 min-h-[150px] flex flex-col items-center justify-center"
                >
                  <span className="text-6xl">
                    {memory.icon}
                  </span>

                  <p className="font-bold text-gray-800 mt-3">
                    {memory.name}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {memory.category}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">

              <button
                onClick={startRecall}
                className="px-7 py-4 rounded-2xl bg-[#0f3e3a] text-white font-bold hover:opacity-90"
              >
                I am ready
              </button>

              {voiceSupported && (
                <button
                  onClick={() => {
                    const message = new SpeechSynthesisUtterance(
                      "Take your time and remember the pictures."
                    );

                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(message);
                  }}
                  className="px-6 py-4 rounded-2xl bg-gray-100 text-gray-700 font-semibold flex items-center justify-center gap-2"
                >
                  <Volume2 size={19} />
                  Hear instructions
                </button>
              )}

            </div>
          </div>
        )}

        {/* Answer Phase */}
        {gamePhase === "answer" && (
          <div>

            {/* Status */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

              <div className="bg-white rounded-2xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500">
                  Remembered
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {correctAnswers.length}/{memories.length}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500">
                  Wrong
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {wrongAnswers.length}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500">
                  Time
                </p>
                <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock3 size={20} />
                  {formatTime(elapsedTime)}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500">
                  Hints
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {hintsUsed}
                </p>
              </div>

            </div>

            <div className="bg-white rounded-[2rem] border border-gray-200 p-6 md:p-10">

              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  Which memories do you remember?
                </h1>

                <p className="text-gray-500 mt-2">
                  Select the pictures you saw earlier.
                </p>
              </div>

              {/* Hint */}
              {showHint && memories.length > 0 && (
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                  <Lightbulb className="text-amber-600 mt-1" size={20} />

                  <div>
                    <p className="font-bold text-gray-800">
                      Gentle hint
                    </p>

                    <p className="text-sm text-gray-600">
                      One of the memories belongs to the{" "}
                      <strong>
                        {memories[0].category}
                      </strong>{" "}
                      category.
                    </p>
                  </div>
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
                {options.map((item) => {
                  const selected = selectedAnswers.includes(item.id);
                  const correct = correctAnswers.includes(item.id);
                  const wrong = wrongAnswers.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleAnswer(item)}
                      disabled={selected}
                      className={`rounded-3xl p-6 min-h-[170px] flex flex-col items-center justify-center border-2 transition ${
                        correct
                          ? "border-green-400 bg-green-50"
                          : wrong
                          ? "border-red-300 bg-red-50"
                          : selected
                          ? "border-gray-300 bg-gray-100"
                          : "border-transparent bg-stone-100 hover:border-[#0f3e3a]"
                      }`}
                    >
                      <span className="text-6xl">
                        {item.icon}
                      </span>

                      <span className="font-bold text-gray-800 mt-3">
                        {item.name}
                      </span>

                      {correct && (
                        <CheckCircle2
                          className="text-green-600 mt-2"
                          size={20}
                        />
                      )}

                      {wrong && (
                        <XCircle
                          className="text-red-500 mt-2"
                          size={20}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">

                <button
                  onClick={useHint}
                  disabled={showHint}
                  className="px-6 py-4 rounded-2xl bg-amber-50 text-amber-700 font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lightbulb size={19} />
                  {showHint ? "Hint used" : "Need a hint?"}
                </button>

                <button
                  onClick={() => {
                    const message = new SpeechSynthesisUtterance(
                      "Select the memories you remember."
                    );

                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(message);
                  }}
                  className="px-6 py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold flex items-center justify-center gap-2"
                >
                  <Mic size={19} />
                  Hear question
                </button>

                <button
                  onClick={finishGame}
                  className="px-7 py-4 rounded-2xl bg-[#0f3e3a] text-white font-bold"
                >
                  Finish
                </button>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default MemoryGame;