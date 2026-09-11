import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  Droplets,
  Calendar,
  Pill,
  Plus,
  X,
} from "lucide-react";

const initialReminders = [
  {
    id: 1,
    type: "Medicine",
    title: "Morning Medicine",
    time: "8:00 AM",
    description: "Take your morning medicine after breakfast.",
    icon: Pill,
    completed: false,
  },
  {
    id: 2,
    type: "Hydration",
    title: "Drink Water",
    time: "10:00 AM",
    description: "Have a glass of water.",
    icon: Droplets,
    completed: true,
  },
  {
    id: 3,
    type: "Medicine",
    title: "Afternoon Medicine",
    time: "2:00 PM",
    description: "Take your afternoon medicine.",
    icon: Pill,
    completed: false,
  },
  {
    id: 4,
    type: "Appointment",
    title: "Doctor Appointment",
    time: "4:00 PM",
    description: "Doctor consultation at 4 PM.",
    icon: Calendar,
    completed: false,
  },
];

export default function Reminders() {
  const [reminders, setReminders] = useState(initialReminders);
  const [showAdd, setShowAdd] = useState(false);

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Medicine");
  const [description, setDescription] = useState("");

  const toggleCompleted = (id) => {
    setReminders((current) =>
      current.map((reminder) =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const addReminder = (event) => {
    event.preventDefault();

    if (!title.trim() || !time) return;

    const iconMap = {
      Medicine: Pill,
      Hydration: Droplets,
      Appointment: Calendar,
      Activity: Bell,
    };

    const newReminder = {
      id: Date.now(),
      type,
      title: title.trim(),
      time,
      description:
        description.trim() || "A reminder for your daily routine.",
      icon: iconMap[type] || Bell,
      completed: false,
    };

    setReminders((current) => [...current, newReminder]);

    setTitle("");
    setTime("");
    setType("Medicine");
    setDescription("");
    setShowAdd(false);
  };

  const completedCount = reminders.filter(
    (reminder) => reminder.completed
  ).length;

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bell size={26} className="text-[#0f3e3a]" />

            <h1 className="text-3xl font-black text-[#0f3e3a]">
              My Reminders
            </h1>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Gentle reminders to help you stay on track.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0f3e3a] px-5 py-3 text-sm font-bold text-white hover:bg-[#0c312e]"
        >
          <Plus size={17} />
          Add Reminder
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
            Today's Reminders
          </p>

          <p className="mt-2 text-3xl font-black text-[#0f3e3a]">
            {reminders.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
            Completed
          </p>

          <p className="mt-2 text-3xl font-black text-emerald-600">
            {completedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
            Remaining
          </p>

          <p className="mt-2 text-3xl font-black text-amber-600">
            {reminders.length - completedCount}
          </p>
        </div>
      </div>

      {/* Reminder list */}
      <section className="space-y-4">
        {reminders.map((reminder) => {
          const Icon = reminder.icon;

          return (
            <div
              key={reminder.id}
              className={`rounded-3xl border bg-white p-5 shadow-sm transition ${
                reminder.completed
                  ? "border-emerald-100 bg-emerald-50/40"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                    reminder.completed
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-teal-50 text-[#0f3e3a]"
                  }`}
                >
                  <Icon size={25} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2
                      className={`text-lg font-black ${
                        reminder.completed
                          ? "text-gray-500 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {reminder.title}
                    </h2>

                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-500">
                      {reminder.type}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={15} />
                    {reminder.time}
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {reminder.description}
                  </p>
                </div>

                <button
                  onClick={() => toggleCompleted(reminder.id)}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
                    reminder.completed
                      ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                      : "border-gray-200 text-gray-400 hover:border-[#0f3e3a] hover:text-[#0f3e3a]"
                  }`}
                  aria-label="Mark reminder complete"
                >
                  <CheckCircle2 size={21} />
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Add Reminder Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <form
            onSubmit={addReminder}
            className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-black text-[#0f3e3a]">
              Add a Reminder
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Add an important reminder to your day.
            </p>

            <div className="mt-6 space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Reminder title"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0f3e3a]"
                required
              />

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0f3e3a]"
                required
              />

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
              >
                <option>Medicine</option>
                <option>Hydration</option>
                <option>Appointment</option>
                <option>Activity</option>
              </select>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description"
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0f3e3a]"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-[#0f3e3a] py-3.5 text-sm font-bold text-white hover:bg-[#0c312e]"
              >
                Save Reminder
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}