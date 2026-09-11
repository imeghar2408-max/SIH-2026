import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  Clock3,
  Heart,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Home,
} from "lucide-react";

function GameResult({ setCurrentView }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const savedResult = localStorage.getItem(
      "aura-last-game-result"
    );

    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-full bg-stone-50 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-[2rem] p-10 text-center border border-gray-200">

          <Brain
            size={48}
            className="mx-auto text-[#0f3e3a] mb-4"
          />

          <h1 className="text-2xl font-bold text-gray-900">
            No game result yet
          </h1>

          <p className="text-gray-500 mt-2">
            Complete a memory game to see your results here.
          </p>

          <button
            onClick={() => setCurrentView("patient-game")}
            className="mt-6 px-6 py-3 rounded-2xl bg-[#0f3e3a] text-white font-bold"
          >
            Start Memory Game
          </button>

        </div>
      </div>
    );
  }

  const getMessage = () => {
    if (result.accuracy >= 80) {
      return "Excellent memory work!";
    }

    if (result.accuracy >= 60) {
      return "Good job! You remembered many of the memories.";
    }

    return "Well done for completing the activity!";
  };

  const getRecommendation = () => {
    if (result.accuracy >= 80) {
      return "A slightly more challenging memory activity could be a good next step.";
    }

    if (result.accuracy >= 60) {
      return "You can try the same difficulty again with a different set of memories.";
    }

    return "A simpler memory activity with familiar images may be a comfortable next step.";
  };

  return (
    <div className="min-h-full bg-stone-50 p-6 md:p-8">

      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <button
          onClick={() => setCurrentView("patient-dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {/* Main Result */}
        <div className="bg-white rounded-[2rem] border border-gray-200 p-8 md:p-12 text-center">

          <div className="mx-auto w-20 h-20 rounded-3xl bg-emerald-50 flex items-center justify-center text-[#0f3e3a]">
            <Sparkles size={38} />
          </div>

          <p className="text-sm font-bold text-[#0f3e3a] mt-6">
            MEMORY SESSION COMPLETE
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            {getMessage()}
          </h1>

          <p className="text-gray-500 mt-3">
            You remembered
          </p>

          <div className="text-6xl font-black text-[#0f3e3a] mt-2">
            {result.score}/{result.total}
          </div>

          <p className="text-gray-500 mt-2">
            memories
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">

            <div className="rounded-2xl bg-stone-50 p-5">
              <CheckCircle2
                size={24}
                className="mx-auto text-green-600"
              />

              <p className="text-2xl font-bold text-gray-900 mt-2">
                {result.accuracy}%
              </p>

              <p className="text-xs text-gray-500">
                Accuracy
              </p>
            </div>

            <div className="rounded-2xl bg-stone-50 p-5">
              <Clock3
                size={24}
                className="mx-auto text-gray-700"
              />

              <p className="text-2xl font-bold text-gray-900 mt-2">
                {result.elapsedTime}s
              </p>

              <p className="text-xs text-gray-500">
                Time
              </p>
            </div>

            <div className="rounded-2xl bg-stone-50 p-5">
              <Lightbulb
                size={24}
                className="mx-auto text-amber-500"
              />

              <p className="text-2xl font-bold text-gray-900 mt-2">
                {result.hintsUsed}
              </p>

              <p className="text-xs text-gray-500">
                Hints
              </p>
            </div>

            <div className="rounded-2xl bg-stone-50 p-5">
              <Heart
                size={24}
                className="mx-auto text-[#0f3e3a]"
              />

              <p className="text-lg font-bold text-gray-900 mt-3">
                {result.category}
              </p>

              <p className="text-xs text-gray-500">
                Memory type
              </p>
            </div>

          </div>

          {/* Personalised message */}
          <div className="mt-8 rounded-3xl bg-emerald-50 p-6 text-left">

            <div className="flex items-start gap-3">

              <Sparkles
                size={22}
                className="text-[#0f3e3a] mt-1"
              />

              <div>
                <h2 className="font-bold text-gray-900">
                  Your next memory activity
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  {getRecommendation()}
                </p>
              </div>

            </div>

          </div>

          {/* Session summary */}
          <div className="mt-8 text-left">

            <h2 className="font-bold text-gray-900 text-lg">
              Session summary
            </h2>

            <div className="mt-4 space-y-3">

              <div className="flex justify-between bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-gray-500">
                  Difficulty
                </span>

                <span className="font-semibold capitalize">
                  {result.difficulty}
                </span>
              </div>

              <div className="flex justify-between bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-gray-500">
                  Memory category
                </span>

                <span className="font-semibold">
                  {result.category}
                </span>
              </div>

              <div className="flex justify-between bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-gray-500">
                  Memories recalled
                </span>

                <span className="font-semibold">
                  {result.score} of {result.total}
                </span>
              </div>

            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-10">

            <button
              onClick={() => setCurrentView("patient-game")}
              className="px-7 py-4 rounded-2xl bg-[#0f3e3a] text-white font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw size={19} />
              Play Again
            </button>

            <button
              onClick={() => setCurrentView("patient-dashboard")}
              className="px-7 py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold flex items-center justify-center gap-2"
            >
              <Home size={19} />
              Home
            </button>

          </div>

        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center mt-6 max-w-2xl mx-auto">
          AURA game results describe activity performance for
          personalization and engagement. They are not a medical
          diagnosis or clinical assessment.
        </p>

      </div>
    </div>
  );
}

export default GameResult;