import React, { useState } from "react";
import {
  Users,
  Plus,
  Phone,
  MessageCircle,
  Video,
  Heart,
  UserPlus,
  Clock,
  CheckCircle2,
  X,
} from "lucide-react";

const initialContacts = [
  {
    id: 1,
    name: "Priya Sharma",
    relation: "Daughter",
    phone: "+91 98765 43210",
    preferred: "Video Call",
    lastContact: "Today, 10:30 AM",
    status: "Available",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    relation: "Grandson",
    phone: "+91 98765 22110",
    preferred: "Call",
    lastContact: "Yesterday, 6:15 PM",
    status: "Available",
  },
  {
    id: 3,
    name: "Anil Sharma",
    relation: "Husband",
    phone: "+91 98765 11882",
    preferred: "Call",
    lastContact: "Yesterday, 8:00 PM",
    status: "Offline",
  },
];

function FamilySocial({ setCurrentView }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newContact, setNewContact] = useState({
    name: "",
    relation: "",
    phone: "",
    preferred: "Call",
  });

  const availableCount = contacts.filter(
    (contact) => contact.status === "Available",
  ).length;

  const handleAddContact = (e) => {
    e.preventDefault();

    if (
      !newContact.name ||
      !newContact.relation ||
      !newContact.phone
    ) {
      return;
    }

    const contact = {
      id: Date.now(),
      name: newContact.name,
      relation: newContact.relation,
      phone: newContact.phone,
      preferred: newContact.preferred,
      lastContact: "Never",
      status: "Available",
    };

    setContacts((prev) => [...prev, contact]);

    setNewContact({
      name: "",
      relation: "",
      phone: "",
      preferred: "Call",
    });

    setShowAddForm(false);
  };

  const handleAction = (action, contact) => {
    alert(`${action} with ${contact.name} started.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-700">
            <Heart size={23} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Family & Social
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Help Asha stay connected with familiar people.
            </p>
          </div>

        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0f3e3a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0c312e]"
        >
          <Plus size={16} />
          Add Family Member
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
              Family and social support
            </p>
          </div>

        </div>

      </div>

      {/* SUMMARY */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">

        <SummaryCard
          title="Family Members"
          value={contacts.length}
          text="Trusted contacts"
          icon={<Users size={18} />}
        />

        <SummaryCard
          title="Available Now"
          value={availableCount}
          text="Ready to connect"
          icon={<CheckCircle2 size={18} />}
        />

        <SummaryCard
          title="Today's Interactions"
          value="3"
          text="Calls and messages"
          icon={<MessageCircle size={18} />}
        />

        <SummaryCard
          title="Social Engagement"
          value="87%"
          text="This week"
          icon={<Heart size={18} />}
        />

      </div>

      {/* WELL-BEING */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Asha's Social Well-being
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Recent social interaction indicators.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <WellBeingCard
            title="Family Interaction"
            value="4"
            text="interactions today"
          />

          <WellBeingCard
            title="Most Frequent Contact"
            value="Priya"
            text="daughter"
          />

          <WellBeingCard
            title="Engagement Time"
            value="28 min"
            text="today"
          />

        </div>

      </div>

      {/* CONTACTS */}
      <div className="mb-6">

        <div className="mb-4">

          <h2 className="text-lg font-semibold text-slate-900">
            Family & Trusted Contacts
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            People connected to Asha's care network.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          {contacts.map((contact) => (

            <div
              key={contact.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >

              {/* CONTACT HEADER */}
              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl">
                    👤
                  </div>

                  <div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {contact.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      {contact.relation}
                    </p>

                  </div>

                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    contact.status === "Available"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {contact.status}
                </span>

              </div>

              {/* DETAILS */}
              <div className="mt-5 space-y-3">

                <InfoRow
                  label="Phone"
                  value={contact.phone}
                />

                <InfoRow
                  label="Preferred"
                  value={contact.preferred}
                />

                <InfoRow
                  label="Last interaction"
                  value={contact.lastContact}
                />

              </div>

              {/* ACTIONS */}
              <div className="mt-5 grid grid-cols-3 gap-2">

                <button
                  onClick={() => handleAction("Call", contact)}
                  className="flex items-center justify-center gap-1 rounded-xl bg-[#0f3e3a] py-2.5 text-[10px] font-bold text-white hover:bg-[#0c312e]"
                >
                  <Phone size={13} />
                  Call
                </button>

                <button
                  onClick={() => handleAction("Message", contact)}
                  className="flex items-center justify-center gap-1 rounded-xl bg-slate-100 py-2.5 text-[10px] font-bold text-slate-700 hover:bg-slate-200"
                >
                  <MessageCircle size={13} />
                  Message
                </button>

                <button
                  onClick={() => handleAction("Video Call", contact)}
                  className="flex items-center justify-center gap-1 rounded-xl bg-teal-50 py-2.5 text-[10px] font-bold text-[#0f3e3a] hover:bg-teal-100"
                >
                  <Video size={13} />
                  Video
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* RECENT ACTIVITY */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center gap-2">
          <Clock size={17} className="text-[#0f3e3a]" />

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Social Activity
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Latest family interactions involving Asha.
            </p>
          </div>
        </div>

        <div className="space-y-3">

          <ActivityRow
            icon="📹"
            title="Video call with Priya"
            time="Today, 10:30 AM"
            duration="12 minutes"
          />

          <ActivityRow
            icon="📞"
            title="Call with Rahul"
            time="Today, 9:15 AM"
            duration="8 minutes"
          />

          <ActivityRow
            icon="💬"
            title="Message received from Anil"
            time="Yesterday, 8:00 PM"
            duration="2 minutes"
          />

        </div>

      </div>

      {/* AURA SOCIAL SUGGESTION */}
      <div className="mb-6 rounded-2xl border border-pink-100 bg-pink-50/50 p-6">

        <div className="flex items-start gap-4">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-700">
            <Heart size={18} />
          </div>

          <div>

            <h2 className="text-sm font-semibold text-pink-800">
              SMRITI Social Suggestion
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Asha has responded positively to recent family
              interactions. A short morning conversation with Priya
              may support continued social engagement.
            </p>

          </div>

        </div>

      </div>

      {/* NAVIGATION */}
      <div className="flex flex-wrap gap-3">

        <button
          onClick={() => setCurrentView("caregiver-patients")}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          ← Back to Patients
        </button>

        <button
          onClick={() => setCurrentView("caregiver-vault")}
          className="rounded-xl bg-[#0f3e3a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0c312e]"
        >
          Open Memory Vault
        </button>

      </div>

      {/* ADD CONTACT MODAL */}
      {showAddForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">

            <button
              onClick={() => setShowAddForm(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-700"
            >
              <X size={20} />
            </button>

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-700">
                <UserPlus size={18} />
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Add Family Member
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Add someone to Asha's trusted family network.
                </p>

              </div>

            </div>

            <form
              onSubmit={handleAddContact}
              className="space-y-4"
            >

              <InputField
                label="Full Name"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({
                    ...newContact,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Priya Sharma"
              />

              <InputField
                label="Relationship"
                value={newContact.relation}
                onChange={(e) =>
                  setNewContact({
                    ...newContact,
                    relation: e.target.value,
                  })
                }
                placeholder="e.g. Daughter"
              />

              <InputField
                label="Phone Number"
                value={newContact.phone}
                onChange={(e) =>
                  setNewContact({
                    ...newContact,
                    phone: e.target.value,
                  })
                }
                placeholder="+91 XXXXX XXXXX"
              />

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Preferred Contact Method
                </label>

                <select
                  value={newContact.preferred}
                  onChange={(e) =>
                    setNewContact({
                      ...newContact,
                      preferred: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
                  <option>Call</option>
                  <option>Video Call</option>
                  <option>Message</option>
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
                  Add Member
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
   HELPERS
========================================================= */

function SummaryCard({
  title,
  value,
  text,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-500">
          {title}
        </p>

        <div className="text-[#0f3e3a]">
          {icon}
        </div>

      </div>

      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {text}
      </p>

    </div>
  );
}

function WellBeingCard({
  title,
  value,
  text,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

      <p className="text-xs text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {text}
      </p>

    </div>
  );
}

function InfoRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-3">

      <span className="text-xs text-slate-400">
        {label}
      </span>

      <span className="text-xs font-semibold text-slate-700">
        {value}
      </span>

    </div>
  );
}

function ActivityRow({
  icon,
  title,
  time,
  duration,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg">
          {icon}
        </div>

        <div>

          <p className="text-sm font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {time}
          </p>

        </div>

      </div>

      <span className="text-xs text-slate-400">
        {duration}
      </span>

    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      />

    </div>
  );
}

export default FamilySocial;
