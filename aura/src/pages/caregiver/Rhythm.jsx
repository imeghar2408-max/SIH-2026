import React, { useMemo, useState } from "react";
import {
  Brain,
  Activity,
  Target,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { generateAdaptivePlan } from "../../ai/adaptiveEngine";

// ============================================================
// DEMO PATIENT
// ============================================================

const asha = {
  id: "P001",
  name: "Asha",
  age: 78,

  memory: 82,
  attention: 68,
  engagement: 87,

  bestTime: "9:00 AM - 11:00 AM",

  recentActivities: [
    {
      name: "Memory Recall",
      score: 84,
      difficulty: "Medium",
    },
    {
      name: "Pattern Recognition",
      score: 78,
      difficulty: "Easy",
    },
    {
      name: "Word Association",
      score: 81,
      difficulty: "Medium",
    },
  ],
};

// ============================================================
// MAIN COMPONENT
// ============================================================

function Rhythm({ setCurrentView }) {
  const [refreshCount, setRefreshCount] = useState(0);

  const adaptivePlan = useMemo(() => {
    return generateAdaptivePlan(asha);
  }, [refreshCount]);

  const refreshPlan = () => {
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0f3e3a]">
            <Brain size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Adaptive Cognitive Rhythm
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              AI-driven activity planning for Asha.
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
          <CheckCircle2 size={15} />
          Adaptive Engine Active
        </div>

      </div>

      {/* =====================================================
          PATIENT IDENTITY
      ===================================================== */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
            👵
          </div>

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              {asha.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Age {asha.age} • Patient ID {asha.id}
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          ENGINE WORKFLOW
      ===================================================== */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6">

          <h2 className="text-lg font-semibold text-slate-900">
            SMRITI Adaptive Engine
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Patient signals are processed to determine the next
            appropriate cognitive activity.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          <WorkflowCard
            number="01"
            icon={<Target size={20} />}
            title="Patient Baseline"
            text="Asha's cognitive profile"
          />

          <WorkflowCard
            number="02"
            icon={<Activity size={20} />}
            title="Performance"
            text="Scores, engagement & history"
          />

          <WorkflowCard
            number="03"
            icon={<Sparkles size={20} />}
            title="Adaptive Engine"
            text="Processes patient signals"
            active
          />

          <WorkflowCard
            number="04"
            icon={<Brain size={20} />}
            title="Next Activity"
            text="Personalized recommendation"
          />

        </div>

      </div>

      {/* =====================================================
          INPUT SIGNALS
      ===================================================== */}

      <div className="mb-6">

        <div className="mb-4">

          <h2 className="text-lg font-semibold text-slate-900">
            Asha's Current Signals
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            These are the inputs currently used by the adaptive engine.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          <MetricCard
            title="Memory"
            value={`${asha.memory}%`}
            description="Current performance"
            icon="🧠"
          />

          <MetricCard
            title="Attention"
            value={`${asha.attention}%`}
            description="Current performance"
            icon="🎯"
          />

          <MetricCard
            title="Engagement"
            value={`${asha.engagement}%`}
            description="Participation consistency"
            icon="💚"
          />

        </div>

      </div>

      {/* =====================================================
          AI RECOMMENDATION
      ===================================================== */}

      <div className="mb-6 rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f3e3a] text-white">
              <Sparkles size={19} />
            </div>

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                SMRITI Recommendation
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Generated from Asha's current cognitive signals
              </p>

            </div>

          </div>

          <button
            onClick={refreshPlan}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw size={14} />
            Recalculate
          </button>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          <RecommendationCard
            title="Activity"
            value={adaptivePlan.activityType}
            icon="🧩"
          />

          <RecommendationCard
            title="Difficulty"
            value={adaptivePlan.difficulty}
            icon="📈"
          />

          <RecommendationCard
            title="Best Time"
            value={adaptivePlan.suggestedTime}
            icon="⏰"
          />

          <RecommendationCard
            title="Assistance"
            value={adaptivePlan.assistanceLevel}
            icon="🤝"
          />

        </div>

        {/* AI reasoning */}
        <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50/60 p-4">

          <p className="text-xs font-bold text-[#0f3e3a]">
            Why SMRITI chose this
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {adaptivePlan.reason}
          </p>

        </div>

        {/* Confidence */}
        <div className="mt-5">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-xs font-semibold text-slate-500">
              Recommendation Confidence
            </span>

            <span className="text-xs font-bold text-[#0f3e3a]">
              {adaptivePlan.confidence}%
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-[#0f3e3a]"
              style={{
                width: `${adaptivePlan.confidence}%`,
              }}
            />

          </div>

        </div>

      </div>

      {/* =====================================================
          COGNITIVE BALANCE
      ===================================================== */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Cognitive Balance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current comparison between Asha's main cognitive areas.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <BalanceCard
            title="Strongest Area"
            value={adaptivePlan.strongestArea}
            description="Area currently performing best"
            icon="💪"
          />

          <BalanceCard
            title="Needs Attention"
            value={adaptivePlan.weakestArea}
            description="Area receiving additional support"
            icon="🎯"
          />

        </div>

      </div>

      {/* =====================================================
          DAILY PLAN
      ===================================================== */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Personalized Daily Plan
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            SMRITI's current schedule for Asha.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <PlanCard
            time="09:00 AM"
            activity="Memory Match"
            difficulty="Medium"
            focus="Memory"
            current
          />

          <PlanCard
            time="01:00 PM"
            activity="Attention Match"
            difficulty={adaptivePlan.difficulty}
            focus="Attention"
          />

          <PlanCard
            time="06:00 PM"
            activity="Family Recognition"
            difficulty="Easy"
            focus="Emotional engagement"
          />

        </div>

      </div>

      {/* =====================================================
          RECENT PERFORMANCE
      ===================================================== */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Recent Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Recent activities supplied to the adaptive engine.
          </p>

        </div>

        <div className="space-y-3">

          {asha.recentActivities.map((activity, index) => (

            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4"
            >

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg">
                  {index === 0
                    ? "🧠"
                    : index === 1
                      ? "🎯"
                      : "🔤"}
                </div>

                <div>

                  <p className="text-sm font-semibold text-slate-800">
                    {activity.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {activity.difficulty} difficulty
                  </p>

                </div>

              </div>

              <div className="text-right">

                <p className="text-xs text-slate-400">
                  Score
                </p>

                <p className="text-lg font-bold text-slate-800">
                  {activity.score}%
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <div className="flex flex-wrap gap-3">

        <button
          onClick={() => setCurrentView("caregiver-patients")}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          ← Back to Patients
        </button>

        <button
          onClick={() => setCurrentView("caregiver-analytics")}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          View Analytics
          <ArrowRight size={15} />
        </button>

        <button
          onClick={() => setCurrentView("caregiver-vault")}
          className="flex items-center gap-2 rounded-xl bg-[#0f3e3a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0c312e]"
        >
          Open Memory Vault
          <ArrowRight size={15} />
        </button>

      </div>

    </div>
  );
}

/* =========================================================
   HELPER COMPONENTS
========================================================= */

function WorkflowCard({
  number,
  icon,
  title,
  text,
  active = false,
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        active
          ? "border-teal-200 bg-teal-50/60"
          : "border-slate-200 bg-slate-50"
      }`}
    >

      <div className="flex items-center justify-between">

        <span className="text-[10px] font-bold text-slate-400">
          {number}
        </span>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            active
              ? "bg-[#0f3e3a] text-white"
              : "bg-white text-slate-600"
          }`}
        >
          {icon}
        </div>

      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>

    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-500">
          {title}
        </p>

        <span className="text-xl">
          {icon}
        </span>

      </div>

      <p className="mt-3 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}

function RecommendationCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <div className="flex items-center justify-between">

        <p className="text-xs font-semibold text-slate-400">
          {title}
        </p>

        <span className="text-lg">
          {icon}
        </span>

      </div>

      <p className="mt-3 text-sm font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

function BalanceCard({
  title,
  value,
  description,
  icon,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

      <div className="flex items-center gap-3">

        <span className="text-xl">
          {icon}
        </span>

        <div>

          <p className="text-xs text-slate-400">
            {title}
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {value}
          </p>

        </div>

      </div>

      <p className="mt-3 text-xs text-slate-500">
        {description}
      </p>

    </div>
  );
}

function PlanCard({
  time,
  activity,
  difficulty,
  focus,
  current = false,
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        current
          ? "border-teal-200 bg-teal-50/40"
          : "border-slate-200 bg-slate-50"
      }`}
    >

      {current && (
        <span className="rounded-full bg-[#0f3e3a] px-2.5 py-1 text-[10px] font-bold text-white">
          CURRENT
        </span>
      )}

      <p className="mt-3 text-xs font-bold text-[#0f3e3a]">
        {time}
      </p>

      <h3 className="mt-2 text-sm font-bold text-slate-900">
        {activity}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {focus}
      </p>

      <span className="mt-4 inline-block rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-slate-600">
        {difficulty} difficulty
      </span>

    </div>
  );
}

export default Rhythm;
