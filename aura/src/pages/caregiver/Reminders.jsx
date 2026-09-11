import React, { useState } from "react";
import {
  Bell,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pill,
  Droplets,
  Utensils,
  Brain,
  CalendarDays,
  X,
} from "lucide-react";

const initialReminders = [
  {
    id: 1,
    title: "Morning Medication",
    type: "Medication",
    time: "08:00 AM",
    frequency: "Daily",
    status: "Completed",
  },
  {
    id: 2,
    title: "Drink Water",
    type: "Hydration",
    time: "10:00 AM",
    frequency: "Every 2 hours",
    status: "Completed",
  },
  {
    id: 3,
    title: "Lunch",
    type: "Meal",
    time: "01:00 PM",
    frequency: "Daily",
    status: "Upcoming",
  },
  {
    id: 4,
    title: "Attention Match",
    type: "Activity",
    time: "03:00 PM",
    frequency: "Daily",
    status: "Upcoming",
  },
  {
    id: 5,
    title: "Doctor Appointment",
    type: "Appointment",
    time: "04:00 PM",
    frequency: "Today",
    status: "Upcoming",
  },
  {
    id: 6,
    title: "Evening Medication",
    type: "Medication",
    time: "08:00 PM",
    frequency: "Daily",
    status: "Missed",
  },
];

function Reminders({ setCurrentView }) {
  const [reminders, setReminders] = useState(initialReminders);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const [newReminder, setNewReminder] = useState({
    title: "",
    type: "Medication",
    time: "",
    frequency: "Daily",
  });

  const filteredReminders =
    activeFilter === "All"
      ? reminders
      : reminders.filter(
          (reminder) => reminder.type === activeFilter,
        );

  const completedCount = reminders.filter(
    (reminder) => reminder.status === "Completed",
  ).length;

  const upcomingCount = reminders.filter(
    (reminder) => reminder.status === "Upcoming",
  ).length;

  const missedCount = reminders.filter(
    (reminder) => reminder.status === "Missed",
  ).length;

  const handleAddReminder = (e) => {
    e.preventDefault();

    if (
      !newReminder.title ||
      !newReminder.time
    ) {
      return;
    }

    const reminder = {
      id: Date.now(),
      title: newReminder.title,
      type: newReminder.type,
      time: newReminder.time,
      frequency: newReminder.frequency,
      status: "Upcoming",
    };

    setReminders((prev) => [...prev, reminder]);

    setNewReminder({
      title: "",
      type: "Medication",
      time: "",
      frequency: "Daily",
    });

    setShowAddForm(false);
  };

  const markCompleted = (id) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              status: "Completed",
            }
          : reminder,
      ),
    );
  };

  const dismissReminder = (id) => {
    setReminders((prev) =>
      prev.filter((reminder) => reminder.id !== id),
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0f3e3a]">
            <Bell size={23} />
          </div>

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              Reminders & Care Plan
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage Asha's daily medication, activities, hydration,
              meals, and appointments.
            </p>

          </div>

        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0f3e3a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0c312e]"
        >
          <Plus size={16} />
          Add Reminder
        </button>

      </div>

      {/* PATIENT CONTEXT */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
            👵
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Asha
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Daily care schedule
            </p>
          </div>

        </div>

      </div>

      {/* SUMMARY */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        <SummaryCard
          title="Completed"
          value={completedCount}
          subtitle="Completed today"
          icon={<CheckCircle2 size={18} />}
          color="green"
        />

        <SummaryCard
          title="Upcoming"
          value={upcomingCount}
          subtitle="Still scheduled"
          icon={<Clock size={18} />}
          color="teal"
        />

        <SummaryCard
          title="Missed"
          value={missedCount}
          subtitle="Needs attention"
          icon={<AlertCircle size={18} />}
          color="red"
        />

      </div>

      {/* FILTERS */}
      <div className="mb-5 flex flex-wrap gap-2">

        {[
          "All",
          "Medication",
          "Hydration",
          "Meal",
          "Activity",
          "Appointment",
        ].map((filter) => (

          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
              activeFilter === filter
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {filter}
          </button>

        ))}

      </div>

      {/* REMINDER LIST */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 p-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Today's Care Schedule
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Asha's reminders and scheduled care activities.
          </p>

        </div>

        <div className="divide-y divide-slate-100">

          {filteredReminders.map((reminder) => (

            <ReminderRow
              key={reminder.id}
              reminder={reminder}
              onComplete={() => markCompleted(reminder.id)}
              onDismiss={() => dismissReminder(reminder.id)}
            />

          ))}

        </div>

        {filteredReminders.length === 0 && (
          <div className="p-10 text-center">

            <p className="text-sm font-semibold text-slate-700">
              No reminders found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try another category.
            </p>

          </div>
        )}

      </div>

      {/* AURA NOTE */}
      <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/60 p-5">

        <div className="flex items-start gap-3">

          <Bell
            size={18}
            className="mt-0.5 text-[#0f3e3a]"
          />

          <div>

            <h3 className="text-sm font-semibold text-[#0f3e3a]">
              SMRITI Reminder Support
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              Reminders can later be delivered through voice, visual
              prompts, and caregiver notifications based on Asha's
              preferred language and routine.
            </p>

          </div>

        </div>

      </div>

      {/* NAVIGATION */}
      <div className="mt-6 flex flex-wrap gap-3">

        <button
          onClick={() => setCurrentView("caregiver-patients")}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          ← Back to Patients
        </button>

        <button
          onClick={() => setCurrentView("caregiver-rhythm")}
          className="rounded-xl bg-[#0f3e3a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0c312e]"
        >
          View Adaptive Rhythm
        </button>

      </div>

      {/* ADD REMINDER MODAL */}
      {showAddForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">

            <button
              onClick={() => setShowAddForm(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-slate-900">
              Add Reminder
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Create a new reminder for Asha.
            </p>

            <form
              onSubmit={handleAddReminder}
              className="mt-6 space-y-4"
            >

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Reminder Title
                </label>

                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) =>
                    setNewReminder({
                      ...newReminder,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Evening Walk"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Type
                </label>

                <select
                  value={newReminder.type}
                  onChange={(e) =>
                    setNewReminder({
                      ...newReminder,
                      type: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
                  <option>Medication</option>
                  <option>Hydration</option>
                  <option>Meal</option>
                  <option>Activity</option>
                  <option>Appointment</option>
                </select>

              </div>

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Time
                </label>

                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) =>
                    setNewReminder({
                      ...newReminder,
                      time: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Frequency
                </label>

                <select
                  value={newReminder.frequency}
                  onChange={(e) =>
                    setNewReminder({
                      ...newReminder,
                      frequency: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
                  <option>Daily</option>
                  <option>Every 2 hours</option>
                  <option>Weekly</option>
                  <option>Today Only</option>
                </select>

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
                  className="flex-1 rounded-xl bg-[#0f3e3a] py-3 text-sm font-semibold text-white hover:bg-[#0c312e]"
                >
                  Add Reminder
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
   REMINDER ROW
========================================================= */

function ReminderRow({
  reminder,
  onComplete,
  onDismiss,
}) {
  const icon = getReminderIcon(reminder.type);

  const statusStyles = {
    Completed: "bg-emerald-50 text-emerald-700",
    Upcoming: "bg-sky-50 text-sky-700",
    Missed: "bg-red-50 text-red-700",
  };

  return (
    <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          {icon}
        </div>

        <div>

          <h3 className="text-sm font-semibold text-slate-900">
            {reminder.title}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-2">

            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock size={12} />
              {reminder.time}
            </span>

            <span className="text-xs text-slate-400">
              •
            </span>

            <span className="text-xs text-slate-400">
              {reminder.frequency}
            </span>

          </div>

        </div>

      </div>

      <div className="flex items-center gap-3">

        <span
          className={`rounded-full px-3 py-1 text-[10px] font-bold ${
            statusStyles[reminder.status]
          }`}
        >
          {reminder.status}
        </span>

        {reminder.status === "Upcoming" && (
          <button
            onClick={onComplete}
            className="rounded-xl bg-[#0f3e3a] px-3 py-2 text-[10px] font-bold text-white hover:bg-[#0c312e]"
          >
            Mark Done
          </button>
        )}

        {reminder.status === "Missed" && (
          <button
            onClick={onComplete}
            className="rounded-xl bg-red-600 px-3 py-2 text-[10px] font-bold text-white hover:bg-red-700"
          >
            Mark Done
          </button>
        )}

        <button
          onClick={onDismiss}
          className="rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-500 hover:bg-slate-50"
        >
          Dismiss
        </button>

      </div>

    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getReminderIcon(type) {
  switch (type) {
    case "Medication":
      return <Pill size={19} />;

    case "Hydration":
      return <Droplets size={19} />;

    case "Meal":
      return <Utensils size={19} />;

    case "Activity":
      return <Brain size={19} />;

    case "Appointment":
      return <CalendarDays size={19} />;

    default:
      return <Bell size={19} />;
  }
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  color,
}) {
  const styles = {
    green: "text-emerald-600 bg-emerald-50",
    teal: "text-[#0f3e3a] bg-teal-50",
    red: "text-red-600 bg-red-50",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-500">
          {title}
        </p>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${styles[color]}`}
        >
          {icon}
        </div>

      </div>

      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {subtitle}
      </p>

    </div>
  );
}

export default Reminders;
