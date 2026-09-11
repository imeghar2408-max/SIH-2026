const patient = {
  id: "P001",
  name: "Asha",
  age: 78,
  room: "402",
  status: "Stable",

  memory: 82,
  attention: 76,
  engagement: 87,
  sessions: 18,
  completion: 92,

  trend: [68, 72, 75, 78, 80, 79, 82],

  activities: [
    {
      name: "Memory Recall",
      score: 84,
      sessions: 7,
    },
    {
      name: "Pattern Recognition",
      score: 78,
      sessions: 6,
    },
    {
      name: "Word Association",
      score: 81,
      sessions: 5,
    },
  ],
};

function getInsight(patient) {
  const first = patient.trend[0];
  const latest = patient.trend[patient.trend.length - 1];
  const change = latest - first;

  if (change <= -10) {
    return {
      title: "Significant decline detected",
      text: "Recent cognitive performance shows a noticeable downward trend. A caregiver review is recommended.",
      style: "bg-red-50 border-red-100 text-red-700",
    };
  }

  if (change < 0) {
    return {
      title: "Performance requires monitoring",
      text: "Recent sessions show some decline. Continue monitoring performance and engagement closely.",
      style: "bg-amber-50 border-amber-100 text-amber-700",
    };
  }

  return {
    title: "Performance appears stable",
    text: "Recent sessions show stable or improving cognitive performance with good engagement.",
    style: "bg-emerald-50 border-emerald-100 text-emerald-700",
  };
}

function Analytics({ setCurrentView }) {
  const overallScore = Math.round(
    (patient.memory + patient.attention) / 2
  );

  const insight = getInsight(patient);

  const maxTrend = Math.max(...patient.trend);
  const minTrend = Math.min(...patient.trend);

  const trendChange =
    patient.trend[patient.trend.length - 1] -
    patient.trend[0];

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Analytics
          </h1>

          <p className="mt-1 text-slate-500">
            Understand Asha's cognitive performance, engagement, and emerging trends.
          </p>

        </div>

      </div>

      {/* Patient Identity */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
              👵
            </div>

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                {patient.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {patient.age} years • Room {patient.room} • {patient.id}
              </p>

            </div>

          </div>

          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
              patient.status === "Stable"
                ? "bg-emerald-50 text-emerald-700"
                : patient.status === "Needs Attention"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-red-50 text-red-700"
            }`}
          >
            {patient.status}
          </span>

        </div>

      </div>

      {/* AURA Patient Workspace */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <h2 className="mb-4 text-sm font-semibold text-slate-800">
          Asha's SMRITI Workspace
        </h2>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">

          <WorkspaceButton
            label="Rhythm"
            icon="🧠"
            onClick={() => setCurrentView("caregiver-rhythm")}
          />

          <WorkspaceButton
            label="Memory Vault"
            icon="🗂️"
            onClick={() => setCurrentView("caregiver-vault")}
          />

          <WorkspaceButton
            label="Reminders"
            icon="⏰"
            onClick={() => setCurrentView("caregiver-reminders")}
          />

          <WorkspaceButton
            label="Family"
            icon="❤️"
            onClick={() => setCurrentView("caregiver-family")}
          />

          <WorkspaceButton
            label="Safety"
            icon="🛡️"
            onClick={() => setCurrentView("caregiver-safety")}
          />

        </div>

      </div>

      {/* Main Stats */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Overall */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-sm text-slate-500">
            Overall Cognitive Score
          </p>

          <p className="mt-2 text-4xl font-bold text-slate-900">
            {overallScore}%
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Average of memory and attention
          </p>

        </div>

        {/* Engagement */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-sm text-slate-500">
            Engagement
          </p>

          <p className="mt-2 text-4xl font-bold text-slate-900">
            {patient.engagement}%
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Participation consistency
          </p>

        </div>

        {/* Sessions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-sm text-slate-500">
            Sessions
          </p>

          <p className="mt-2 text-4xl font-bold text-slate-900">
            {patient.sessions}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Recent cognitive sessions
          </p>

        </div>

        {/* Completion */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-sm text-slate-500">
            Completion Rate
          </p>

          <p className="mt-2 text-4xl font-bold text-slate-900">
            {patient.completion}%
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Activities completed
          </p>

        </div>

      </div>

      {/* Memory + Attention */}
      <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Memory */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Memory
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-900">
                {patient.memory}%
              </p>

            </div>

            <span className="text-2xl">
              🧠
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-slate-800"
              style={{ width: `${patient.memory}%` }}
            />

          </div>

          <p className="mt-2 text-xs text-slate-400">
            Strong visual recall performance
          </p>

        </div>

        {/* Attention */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Attention
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-900">
                {patient.attention}%
              </p>

            </div>

            <span className="text-2xl">
              🎯
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-slate-500"
              style={{ width: `${patient.attention}%` }}
            />

          </div>

          <p className="mt-2 text-xs text-slate-400">
            Attention should remain gently monitored
          </p>

        </div>

      </div>

      {/* Performance Trend */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Cognitive Performance Trend
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Recent performance across cognitive sessions
            </p>

          </div>

          <div className="text-left sm:text-right">

            <p className="text-xs text-slate-400">
              Change
            </p>

            <p
              className={`text-lg font-bold ${
                trendChange >= 0
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {trendChange >= 0 ? "+" : ""}
              {trendChange}%
            </p>

          </div>

        </div>

        {/* Simple Bar Trend */}
        <div className="flex h-56 items-end gap-3 rounded-xl bg-slate-50 p-5">

          {patient.trend.map((value, index) => {

            const height =
              maxTrend === minTrend
                ? 50
                : ((value - minTrend) /
                    (maxTrend - minTrend)) *
                    75 +
                  25;

            return (
              <div
                key={index}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >

                <span className="text-xs font-semibold text-slate-500">
                  {value}%
                </span>

                <div
                  className="w-full max-w-10 rounded-t-lg bg-slate-800 transition"
                  style={{ height: `${height}%` }}
                />

                <span className="text-[10px] text-slate-400">
                  S{index + 1}
                </span>

              </div>
            );

          })}

        </div>

      </div>

      {/* Activity Breakdown */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Activity Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Performance across different cognitive activities
          </p>

        </div>

        <div className="space-y-5">

          {patient.activities.map((activity) => (

            <div key={activity.name}>

              <div className="mb-2 flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-slate-700">
                    {activity.name}
                  </p>

                  <p className="text-xs text-slate-400">
                    {activity.sessions} sessions
                  </p>

                </div>

                <span className="text-sm font-bold text-slate-700">
                  {activity.score}%
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-slate-700"
                  style={{ width: `${activity.score}%` }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Care Insight */}
      <div
        className={`rounded-2xl border p-6 shadow-sm ${insight.style}`}
      >

        <div className="flex gap-4">

          <div className="text-2xl">
            {patient.status === "Stable"
              ? "✓"
              : patient.status === "Needs Attention"
                ? "⚠️"
                : "🚨"}
          </div>

          <div>

            <h2 className="font-semibold">
              {insight.title}
            </h2>

            <p className="mt-2 text-sm leading-6 opacity-90">
              {insight.text}
            </p>

          </div>

        </div>

      </div>

      {/* AURA Recommendation */}
      <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/60 p-6 shadow-sm">

        <div className="flex gap-4">

          <div className="text-2xl">
            🤖
          </div>

          <div>

            <h2 className="font-semibold text-[#0f3e3a]">
              SMRITI Recommendation
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Asha is showing stable cognitive performance with
              stronger memory than attention. SMRITI can maintain
              moderate memory activities while gently supporting
              attention-focused tasks.
            </p>

            <button
              onClick={() => setCurrentView("caregiver-rhythm")}
              className="mt-4 rounded-xl bg-[#0f3e3a] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#0c312e]"
            >
              View Adaptive Rhythm
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

function WorkspaceButton({ label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-slate-300 hover:bg-slate-100"
    >

      <div className="text-lg">
        {icon}
      </div>

      <p className="mt-2 text-xs font-semibold text-slate-700">
        {label}
      </p>

    </button>
  );
}

export default Analytics;
