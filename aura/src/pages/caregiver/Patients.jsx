import { useState } from "react";

const initialPatients = [
  {
    id: "P001",
    name: "Asha",
    age: 78,
    room: "402",
    status: "Stable",
    memory: 82,
    attention: 76,
    lastActive: "2 hours ago",
    recentActivity: "Memory Recall",
    gameScore: 84,
    mood: "Calm",
    alert: "No immediate alerts",
    activityTime: "2 hours ago",

    language: "Assamese",
    location: "Assam, NER",
    caregiver: "Dr. Sarah Jenkins",

    medication: "Taken",
    hydration: "Good",
    sleep: "7h 20m",
    engagement: "87%",

    familyContact: "Priya Sharma",
    familyRelation: "Daughter",

    safetyStatus: "Safe",
    emergencyContact: "Priya Sharma",

    activityHistory: [
      {
        name: "Memory Recall",
        score: 84,
        time: "Today • 2:00 PM",
        icon: "🧠",
      },
      {
        name: "Pattern Recognition",
        score: 78,
        time: "Today • 11:30 AM",
        icon: "🎯",
      },
      {
        name: "Word Association",
        score: 81,
        time: "Yesterday • 4:15 PM",
        icon: "🔤",
      },
      {
        name: "Daily Mood Check",
        score: "Positive",
        time: "Yesterday • 9:00 AM",
        icon: "😊",
      },
    ],
  },

  {
    id: "P002",
    name: "Martha Washington",
    age: 82,
    room: "112",
    status: "Needs Attention",
    memory: 68,
    attention: 61,
    lastActive: "30 minutes ago",
    recentActivity: "Pattern Recognition",
    gameScore: 67,
    mood: "Neutral",
    alert: "Cognitive performance needs review",
    activityTime: "30 minutes ago",

    activityHistory: [
      {
        name: "Pattern Recognition",
        score: 67,
        time: "Today • 1:30 PM",
        icon: "🎯",
      },
      {
        name: "Memory Recall",
        score: 64,
        time: "Today • 10:15 AM",
        icon: "🧠",
      },
      {
        name: "Word Association",
        score: 71,
        time: "Yesterday • 3:40 PM",
        icon: "🔤",
      },
      {
        name: "Daily Mood Check",
        score: "Neutral",
        time: "Yesterday • 9:15 AM",
        icon: "😐",
      },
    ],
  },

  {
    id: "P003",
    name: "Hector Rivera",
    age: 74,
    room: "305",
    status: "Stable",
    memory: 79,
    attention: 74,
    lastActive: "1 hour ago",
    recentActivity: "Word Association",
    gameScore: 81,
    mood: "Positive",
    alert: "No immediate alerts",
    activityTime: "1 hour ago",

    activityHistory: [
      {
        name: "Word Association",
        score: 81,
        time: "Today • 1:00 PM",
        icon: "🔤",
      },
      {
        name: "Memory Recall",
        score: 77,
        time: "Today • 10:00 AM",
        icon: "🧠",
      },
      {
        name: "Pattern Recognition",
        score: 80,
        time: "Yesterday • 5:20 PM",
        icon: "🎯",
      },
      {
        name: "Daily Mood Check",
        score: "Positive",
        time: "Yesterday • 9:30 AM",
        icon: "😊",
      },
    ],
  },

  {
    id: "P004",
    name: "Eleanor Brooks",
    age: 80,
    room: "218",
    status: "Urgent",
    memory: 52,
    attention: 48,
    lastActive: "10 minutes ago",
    recentActivity: "Memory Recall",
    gameScore: 49,
    mood: "Distressed",
    alert: "Significant performance drop detected",
    activityTime: "10 minutes ago",

    activityHistory: [
      {
        name: "Memory Recall",
        score: 49,
        time: "Today • 2:20 PM",
        icon: "🧠",
      },
      {
        name: "Pattern Recognition",
        score: 54,
        time: "Today • 12:40 PM",
        icon: "🎯",
      },
      {
        name: "Word Association",
        score: 57,
        time: "Yesterday • 4:30 PM",
        icon: "🔤",
      },
      {
        name: "Daily Mood Check",
        score: "Distressed",
        time: "Yesterday • 8:45 AM",
        icon: "😟",
      },
    ],
  },
];

function Patients({ setCurrentView }) {
  const [patients, setPatients] = useState(initialPatients);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Patients");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    room: "",
  });

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      activeFilter === "All Patients" ||
      patient.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const totalPatients = patients.length;

  const stablePatients = patients.filter(
    (patient) => patient.status === "Stable",
  ).length;

  const attentionPatients = patients.filter(
    (patient) => patient.status === "Needs Attention",
  ).length;

  const urgentPatients = patients.filter(
    (patient) => patient.status === "Urgent",
  ).length;

  const handleAddPatient = (e) => {
    e.preventDefault();

    if (!newPatient.name || !newPatient.age || !newPatient.room) {
      return;
    }

    const patient = {
      id: `P${String(patients.length + 1).padStart(3, "0")}`,
      name: newPatient.name,
      age: Number(newPatient.age),
      room: newPatient.room,
      status: "Stable",
      memory: 0,
      attention: 0,
      lastActive: "Not active yet",
      recentActivity: "No activity yet",
      gameScore: 0,
      mood: "Not recorded",
      alert: "New patient — baseline assessment pending",
      activityTime: "Not available",

      language: "Not set",
      location: "North Eastern Region",
      caregiver: "Dr. Sarah Jenkins",

      medication: "Not recorded",
      hydration: "Not recorded",
      sleep: "Not recorded",
      engagement: "0%",

      familyContact: "Not added",
      familyRelation: "Not added",

      safetyStatus: "Monitoring",
      emergencyContact: "Not added",

      activityHistory: [],
    };

    setPatients((prev) => [...prev, patient]);

    setNewPatient({
      name: "",
      age: "",
      room: "",
    });

    setShowAddForm(false);
  };

  /* =========================================================
     PATIENT PROFILE VIEW
  ========================================================= */

  if (selectedPatient) {
    const patient = selectedPatient;

    return (
      <div className="min-h-screen bg-slate-50 p-6">

        {/* Back */}
        <button
          onClick={() => setSelectedPatient(null)}
          className="mb-6 text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          ← Back to Patients
        </button>

        {/* Profile Header */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
                👵
              </div>

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-2xl font-bold text-slate-900">
                    {patient.name}
                  </h1>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
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

                <p className="mt-1 text-sm text-slate-500">
                  {patient.age} years old • Room {patient.room} • ID{" "}
                  {patient.id}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {patient.location} • {patient.language}
                </p>

              </div>

            </div>

            <div className="text-left md:text-right">

              <p className="text-xs uppercase tracking-wider text-slate-400">
                Last Active
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {patient.lastActive}
              </p>

            </div>

          </div>

        </div>

        {/* AURA Patient Workspace */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <h2 className="mb-4 text-sm font-bold text-slate-800">
            SMRITI Patient Workspace
          </h2>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">

            <QuickAction
              label="Overview"
              icon="🏠"
              onClick={() => setCurrentView("caregiver-overview")}
            />

            <QuickAction
              label="Analytics"
              icon="📊"
              onClick={() => setCurrentView("caregiver-analytics")}
            />

            <QuickAction
              label="Rhythm"
              icon="🧠"
              onClick={() => setCurrentView("caregiver-rhythm")}
            />

            <QuickAction
              label="Memory Vault"
              icon="🗂️"
              onClick={() => setCurrentView("caregiver-vault")}
            />

            <QuickAction
              label="Reminders"
              icon="⏰"
              onClick={() => setCurrentView("caregiver-reminders")}
            />

            <QuickAction
              label="Family"
              icon="❤️"
              onClick={() => setCurrentView("caregiver-family")}
            />

            <QuickAction
              label="Safety"
              icon="🛡️"
              onClick={() => setCurrentView("caregiver-safety")}
            />

          </div>

        </div>

        {/* Patient Snapshot */}
        <div className="mb-6">

          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Patient Snapshot
          </h2>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

            <InfoCard
              title="Language"
              value={patient.language}
              icon="🌐"
            />

            <InfoCard
              title="Mood"
              value={patient.mood}
              icon="😊"
            />

            <InfoCard
              title="Medication"
              value={patient.medication}
              icon="💊"
            />

            <InfoCard
              title="Safety"
              value={patient.safetyStatus}
              icon="🛡️"
            />

          </div>

        </div>

        {/* Cognitive Overview */}
        <div className="mb-6">

          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Cognitive Overview
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Memory */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-3 flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Memory
                  </p>

                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {patient.memory}%
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl">
                  🧠
                </div>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-slate-800"
                  style={{ width: `${patient.memory}%` }}
                />

              </div>

              <p className="mt-3 text-xs text-slate-400">
                Current memory performance
              </p>

            </div>

            {/* Attention */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-3 flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Attention
                  </p>

                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {patient.attention}%
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl">
                  🎯
                </div>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-slate-500"
                  style={{ width: `${patient.attention}%` }}
                />

              </div>

              <p className="mt-3 text-xs text-slate-400">
                Current attention performance
              </p>

            </div>

          </div>

        </div>

        {/* Care & Daily Status */}
        <div className="mb-6">

          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Care & Daily Status
          </h2>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

            <InfoCard
              title="Hydration"
              value={patient.hydration}
              icon="💧"
            />

            <InfoCard
              title="Sleep"
              value={patient.sleep}
              icon="😴"
            />

            <InfoCard
              title="Engagement"
              value={patient.engagement}
              icon="📈"
            />

            <InfoCard
              title="Family Contact"
              value={patient.familyContact}
              icon="👨‍👩‍👧"
            />

          </div>

        </div>

        {/* Activity History */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-lg font-semibold text-slate-900">
              Activity History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Recent cognitive activities and engagement
            </p>

          </div>

          {patient.activityHistory.length > 0 ? (

            <div className="space-y-4">

              {patient.activityHistory.map((activity, index) => (

                <div
                  key={index}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                    {activity.icon}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-semibold text-slate-800">
                      {activity.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {activity.time}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-xs text-slate-400">
                      Result
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {typeof activity.score === "number"
                        ? `${activity.score}%`
                        : activity.score}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="rounded-xl bg-slate-50 p-6 text-center">

              <p className="text-sm font-semibold text-slate-700">
                No activity recorded yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Activity history will appear after the patient starts using SMRITI.
              </p>

            </div>

          )}

        </div>

        {/* Latest Activity + Alerts */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  Latest Activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Most recent cognitive session
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                🎮
              </div>

            </div>

            <div className="rounded-xl bg-slate-50 p-4">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-slate-800">
                    {patient.recentActivity}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Completed {patient.activityTime}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-xs text-slate-400">
                    Score
                  </p>

                  <p className="text-xl font-bold text-slate-900">
                    {patient.gameScore}%
                  </p>

                </div>

              </div>

            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

              <span className="text-sm text-slate-500">
                Current mood
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {patient.mood}
              </span>

            </div>

          </div>

          {/* Alerts */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                🔔
              </div>

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  Current Status
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Care recommendations
                </p>

              </div>

            </div>

            <div
              className={`rounded-xl p-4 ${
                patient.status === "Stable"
                  ? "bg-emerald-50"
                  : patient.status === "Needs Attention"
                    ? "bg-amber-50"
                    : "bg-red-50"
              }`}
            >

              <p
                className={`text-sm font-semibold ${
                  patient.status === "Stable"
                    ? "text-emerald-700"
                    : patient.status === "Needs Attention"
                      ? "text-amber-700"
                      : "text-red-700"
                }`}
              >
                {patient.alert}
              </p>

            </div>

            <div className="mt-5 border-t border-slate-100 pt-5">

              <p className="text-xs uppercase tracking-wider text-slate-400">
                Caregiver note
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Continue monitoring cognitive activity, engagement,
                medication, safety and emotional well-being.
              </p>

            </div>

          </div>

        </div>

        {/* Main Actions */}
        <div className="mt-6 flex flex-wrap gap-3">

          <button
            onClick={() => setCurrentView("caregiver-analytics")}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View Analytics
          </button>

          <button
            onClick={() => setCurrentView("caregiver-rhythm")}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            View Rhythm Plan
          </button>

          <button
            onClick={() => setCurrentView("caregiver-vault")}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Open Memory Vault
          </button>

        </div>

      </div>
    );
  }

  /* =========================================================
     PATIENT DIRECTORY VIEW
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Patients
          </h1>

          <p className="mt-1 text-slate-500">
            Manage and monitor your connected patients.
          </p>

        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          + Add Patient
        </button>

      </div>

      {/* Search */}
      <div className="mb-6">

        <div className="relative mb-4">

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patients by name..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />

        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">

          {["All Patients", "Stable", "Needs Attention", "Urgent"].map(
            (filter) => (

              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeFilter === filter
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {filter}
              </button>

            ),
          )}

        </div>

      </div>

      {/* Summary */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">

        <SummaryCard
          title="Total Patients"
          value={totalPatients}
          text="Connected to your care"
        />

        <SummaryCard
          title="Stable"
          value={stablePatients}
          text="No immediate attention needed"
          color="green"
        />

        <SummaryCard
          title="Needs Attention"
          value={attentionPatients}
          text="Review recommended"
          color="yellow"
        />

        <SummaryCard
          title="Urgent"
          value={urgentPatients}
          text="Immediate review recommended"
          color="red"
        />

      </div>

      {/* Patient Directory */}
      {filteredPatients.length > 0 && (

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          {filteredPatients.map((patient) => (

            <div
              key={patient.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <div className="flex items-start justify-between">

                <div>

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                      {patient.name === "Asha" ? "👵" : "👤"}
                    </div>

                    <div>

                      <h2 className="text-lg font-semibold text-slate-900">
                        {patient.name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {patient.age} years • Room {patient.room}
                      </p>

                    </div>

                  </div>

                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
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

              {/* Cognitive Performance */}
              <div className="mt-6">

                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Cognitive Performance
                </p>

                <div className="mb-4">

                  <div className="mb-1 flex justify-between text-sm">

                    <span className="text-slate-500">
                      Memory
                    </span>

                    <span className="font-semibold text-slate-700">
                      {patient.memory}%
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-slate-800"
                      style={{ width: `${patient.memory}%` }}
                    />

                  </div>

                </div>

                <div>

                  <div className="mb-1 flex justify-between text-sm">

                    <span className="text-slate-500">
                      Attention
                    </span>

                    <span className="font-semibold text-slate-700">
                      {patient.attention}%
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-slate-500"
                      style={{ width: `${patient.attention}%` }}
                    />

                  </div>

                </div>

              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

                <span className="text-xs text-slate-400">
                  Last active: {patient.lastActive}
                </span>

                <button
                  onClick={() => setSelectedPatient(patient)}
                  className="text-sm font-semibold text-slate-700 transition hover:text-slate-950"
                >
                  View Profile →
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* Empty State */}
      {filteredPatients.length === 0 && (

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">

          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
            🔍
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            No patients found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or status filter.
          </p>

        </div>

      )}

      {/* Add Patient Modal */}
      {showAddForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-slate-900">
                Add Patient
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Add a new patient to the caregiver dashboard.
              </p>

            </div>

            <form
              onSubmit={handleAddPatient}
              className="space-y-4"
            >

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Patient Name
                </label>

                <input
                  type="text"
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Rina Sharma"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Age
                </label>

                <input
                  type="number"
                  value={newPatient.age}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      age: e.target.value,
                    })
                  }
                  placeholder="e.g. 76"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Room
                </label>

                <input
                  type="text"
                  value={newPatient.room}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      room: e.target.value,
                    })
                  }
                  placeholder="e.g. 204"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Add Patient
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function QuickAction({ label, icon, onClick }) {
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

function InfoCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <p className="text-xs text-slate-500">
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

function SummaryCard({
  title,
  value,
  text,
  color = "slate",
}) {
  const valueColor = {
    slate: "text-slate-900",
    green: "text-emerald-600",
    yellow: "text-amber-600",
    red: "text-red-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p
        className={`mt-2 text-3xl font-bold ${valueColor[color]}`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {text}
      </p>

    </div>
  );
}

export default Patients;
