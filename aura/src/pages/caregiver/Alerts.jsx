import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ShieldAlert,
  X,
  ChevronRight,
} from "lucide-react";

function Alerts({ setCurrentView }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      patient: "Martha Washington",
      age: 82,
      room: "Rm 112",
      type: "Medication",
      message: "Morning medication is overdue by 30 minutes.",
      time: "15 mins ago",
      priority: "HIGH",
      icon: "💊",
      status: "Pending",
    },
    {
      id: 2,
      patient: "Eleanor Vance",
      age: 79,
      room: "At Home",
      type: "Emergency",
      message: "SOS button has been triggered.",
      time: "Just now",
      priority: "EMERGENCY",
      icon: "🚨",
      status: "Pending",
    },
    {
      id: 3,
      patient: "Arthur Pendelton",
      age: 78,
      room: "Rm 402",
      type: "Cognitive",
      message: "Reaction time has decreased across recent activities.",
      time: "42 mins ago",
      priority: "MEDIUM",
      icon: "🧠",
      status: "Pending",
    },
    {
      id: 4,
      patient: "Hector Rivera",
      age: 74,
      room: "Rm 305",
      type: "Activity",
      message: "No cognitive activity completed today.",
      time: "1 hour ago",
      priority: "MEDIUM",
      icon: "📊",
      status: "Pending",
    },
    {
      id: 5,
      patient: "Beatrice Clark",
      age: 81,
      room: "At Home",
      type: "Activity",
      message: "Patient has been inactive for 4 hours.",
      time: "2 hours ago",
      priority: "LOW",
      icon: "⏱️",
      status: "Pending",
    },
  ]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.patient.toLowerCase().includes(search.toLowerCase()) ||
        alert.message.toLowerCase().includes(search.toLowerCase()) ||
        alert.type.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || alert.priority === filter;

      return matchesSearch && matchesFilter;
    });
  }, [alerts, search, filter]);

  const resolveAlert = (id) => {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id
          ? { ...alert, status: "Resolved" }
          : alert
      )
    );
  };

  const dismissAlert = (id) => {
    setAlerts((current) =>
      current.filter((alert) => alert.id !== id)
    );
  };

  const pendingCount = alerts.filter(
    (alert) => alert.status === "Pending"
  ).length;

  const emergencyCount = alerts.filter(
    (alert) =>
      alert.priority === "EMERGENCY" &&
      alert.status === "Pending"
  ).length;

  const highCount = alerts.filter(
    (alert) =>
      alert.priority === "HIGH" &&
      alert.status === "Pending"
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in">

      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Bell size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Alert Center
              </h1>

              <p className="text-xs text-gray-400 mt-1">
                Monitor and respond to important patient events.
              </p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400">
            Pending alerts
          </p>
          <p className="text-2xl font-black text-[#0f3e3a]">
            {pendingCount}
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-4 gap-4">

        <SummaryCard
          label="Total Pending"
          value={pendingCount}
          subtitle="Needs review"
          icon={<Bell size={17} />}
        />

        <SummaryCard
          label="Emergency"
          value={emergencyCount}
          subtitle="Immediate action"
          icon={<ShieldAlert size={17} />}
          danger
        />

        <SummaryCard
          label="High Priority"
          value={highCount}
          subtitle="Requires attention"
          icon={<AlertTriangle size={17} />}
        />

        <SummaryCard
          label="Resolved Today"
          value={alerts.filter(
            (alert) => alert.status === "Resolved"
          ).length}
          subtitle="Completed actions"
          icon={<CheckCircle2 size={17} />}
          success
        />

      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">

          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient or alert..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0f3e3a]/20"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              <Filter size={15} />
              Filter
            </button>

            {showFilters && (
              <div className="absolute right-0 top-12 z-20 w-44 bg-white rounded-2xl border border-gray-200 shadow-xl p-2">
                {["All", "EMERGENCY", "HIGH", "MEDIUM", "LOW"].map(
                  (option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setFilter(option);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                        filter === option
                          ? "bg-teal-50 text-[#0f3e3a]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* ACTIVE FILTER */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
            Showing
          </span>

          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
            {filter}
          </span>

          {filter !== "All" && (
            <button
              onClick={() => setFilter("All")}
              className="text-gray-400 hover:text-gray-700"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ALERT TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">

        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-sm">
              Patient Alerts
            </h3>

            <p className="text-[10px] text-gray-400 mt-1">
              Review and respond to alerts generated by the platform.
            </p>
          </div>

          <span className="text-[10px] text-gray-400">
            {filteredAlerts.length} alerts
          </span>
        </div>

        <table className="w-full text-left text-xs">

          <thead className="bg-gray-50 text-gray-400 font-semibold border-b">
            <tr>
              <th className="p-4">PATIENT</th>
              <th>TYPE</th>
              <th>ALERT</th>
              <th>TIME</th>
              <th>PRIORITY</th>
              <th>STATUS</th>
              <th className="text-right p-4">ACTION</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">

            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <tr
                  key={alert.id}
                  className={`transition ${
                    alert.priority === "EMERGENCY"
                      ? "bg-red-50/50"
                      : "hover:bg-gray-50"
                  }`}
                >

                  {/* PATIENT */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-base">
                        {alert.icon}
                      </div>

                      <div>
                        <p className="font-bold text-gray-900">
                          {alert.patient}
                        </p>

                        <p className="text-[10px] text-gray-400">
                          {alert.age} yrs • {alert.room}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* TYPE */}
                  <td>
                    <span className="text-[10px] font-semibold text-gray-600">
                      {alert.type}
                    </span>
                  </td>

                  {/* MESSAGE */}
                  <td className="max-w-xs">
                    <p className="font-semibold text-gray-800">
                      {alert.message}
                    </p>
                  </td>

                  {/* TIME */}
                  <td>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Clock size={13} />
                      {alert.time}
                    </div>
                  </td>

                  {/* PRIORITY */}
                  <td>
                    <PriorityBadge priority={alert.priority} />
                  </td>

                  {/* STATUS */}
                  <td>
                    {alert.status === "Resolved" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold">
                        <CheckCircle2 size={11} />
                        Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                        <Clock size={11} />
                        Pending
                      </span>
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="p-4">

                    <div className="flex items-center justify-end gap-2">

                      {alert.status === "Pending" && (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#0f3e3a] text-white text-[10px] font-bold hover:bg-[#0c312e]"
                        >
                          Resolve
                        </button>
                      )}

                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-[10px] font-bold hover:bg-gray-50"
                      >
                        Dismiss
                      </button>

                      <button
                        onClick={() => setCurrentView?.("caregiver-patient")}
                        className="p-1.5 text-gray-400 hover:text-[#0f3e3a]"
                        title="View patient"
                      >
                        <ChevronRight size={16} />
                      </button>

                    </div>

                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-12 text-center"
                >
                  <div className="flex flex-col items-center gap-3">

                    <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                      <CheckCircle2 size={22} />
                    </div>

                    <div>
                      <p className="font-bold text-gray-800">
                        No matching alerts
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Try changing your search or filter.
                      </p>
                    </div>

                  </div>
                </td>
              </tr>
            )}

          </tbody>

        </table>
      </div>

      {/* FOOTNOTE */}
      <div className="flex items-center justify-between text-[10px] text-gray-400 px-1">
        <p>
          Alerts are generated from patient activity, reminders and safety events.
        </p>

        <p>
          SMRITI Caregiver Portal
        </p>
      </div>

    </div>
  );
}

/* ---------------------------------------------
   SUMMARY CARD
--------------------------------------------- */

function SummaryCard({
  label,
  value,
  subtitle,
  icon,
  danger,
  success,
}) {
  return (
    <div
      className={`bg-white p-5 rounded-2xl border ${
        danger
          ? "border-red-100"
          : "border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between mb-3">

        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            danger
              ? "bg-red-50 text-red-600"
              : success
              ? "bg-green-50 text-green-600"
              : "bg-teal-50 text-[#0f3e3a]"
          }`}
        >
          {icon}
        </div>

      </div>

      <p className="text-[10px] text-gray-400 font-semibold">
        {label}
      </p>

      <p
        className={`text-2xl font-black mt-1 ${
          danger
            ? "text-red-600"
            : "text-gray-900"
        }`}
      >
        {value}
      </p>

      <p className="text-[10px] text-gray-400 mt-1">
        {subtitle}
      </p>
    </div>
  );
}

/* ---------------------------------------------
   PRIORITY BADGE
--------------------------------------------- */

function PriorityBadge({ priority }) {
  const styles = {
    EMERGENCY: "bg-red-600 text-white",
    HIGH: "bg-orange-100 text-orange-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    LOW: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
        styles[priority] || styles.LOW
      }`}
    >
      {priority}
    </span>
  );
}

export default Alerts;
