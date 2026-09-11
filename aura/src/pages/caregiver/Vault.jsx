import React, { useState } from "react";
import {
  Search,
  Plus,
  Image as ImageIcon,
  Mic,
  MapPin,
  Users,
  Heart,
  X,
  Upload,
} from "lucide-react";

const initialMemories = [
  {
    id: 1,
    title: "Family Member",
    name: "Priya",
    relation: "Daughter",
    category: "Family",
    image: "",
    description: "Add a photo and memory details for Priya.",
  },
  {
    id: 2,
    title: "Family Member",
    name: "Rahul",
    relation: "Grandson",
    category: "Family",
    image: "",
    description: "Add a photo and memory details for Rahul.",
  },
  {
    id: 3,
    title: "Familiar Place",
    name: "Family Home",
    relation: "Place",
    category: "Places",
    image: "",
    description: "Add a familiar place connected to Asha.",
  },
  {
    id: 4,
    title: "Familiar Object",
    name: "Favorite Object",
    relation: "Object",
    category: "Objects",
    image: "",
    description: "Add an object that is familiar to Asha.",
  },
  {
    id: 5,
    title: "Personal Memory",
    name: "Special Memory",
    relation: "Memory",
    category: "Memories",
    image: "",
    description: "Add a meaningful memory for Asha.",
  },
];

function Vault({ setCurrentView }) {
  const [memories, setMemories] = useState(initialMemories);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);

  const [newMemory, setNewMemory] = useState({
    name: "",
    relation: "",
    category: "Family",
    description: "",
  });

  const filteredMemories = memories.filter((memory) => {
    const matchesSearch =
      memory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      memory.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAddMemory = (e) => {
    e.preventDefault();

    if (!newMemory.name) return;

    const newItem = {
      id: Date.now(),
      title:
        newMemory.category === "Family"
          ? "Family Member"
          : newMemory.category === "Places"
            ? "Familiar Place"
            : newMemory.category === "Objects"
              ? "Familiar Object"
              : "Personal Memory",

      name: newMemory.name,
      relation: newMemory.relation,
      category: newMemory.category,
      image: "",
      description:
        newMemory.description ||
        "Add more details about this memory.",
    };

    setMemories((prev) => [...prev, newItem]);

    setNewMemory({
      name: "",
      relation: "",
      category: "Family",
      description: "",
    });

    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0f3e3a]">
              <Heart size={23} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Memory Vault
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Personalized memories and familiar information for Asha.
              </p>
            </div>

          </div>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0f3e3a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0c312e]"
        >
          <Plus size={16} />
          Add Memory
        </button>

      </div>

      {/* PATIENT CONTEXT */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            👵
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Asha
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Personal Memory Vault
            </p>
          </div>

        </div>

      </div>

      {/* SEARCH + FILTER */}
      <div className="mb-6">

        <div className="relative mb-4">

          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search memories..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />

        </div>

        <div className="flex flex-wrap gap-2">

          {["All", "Family", "Places", "Objects", "Memories"].map(
            (category) => (

              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {category}
              </button>

            ),
          )}

        </div>

      </div>

      {/* MEMORY GRID */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

        {filteredMemories.map((memory) => (

          <MemoryCard
            key={memory.id}
            memory={memory}
          />

        ))}

      </div>

      {/* EMPTY SEARCH STATE */}
      {filteredMemories.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">

          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Search size={20} className="text-slate-400" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            No memories found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Try another search or category.
          </p>

        </div>
      )}

      {/* HOW IT WORKS */}
      <div className="mt-8 rounded-2xl border border-teal-100 bg-teal-50/60 p-6">

        <div className="flex items-start gap-4">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f3e3a] text-white">
            <Heart size={18} />
          </div>

          <div>

            <h2 className="font-semibold text-[#0f3e3a]">
              Personalized Cognitive Content
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Caregivers can add familiar people, places, objects and
              meaningful memories. SMRITI can later use this information
              in personalized recognition and recall activities for Asha.
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

      {/* ADD MEMORY MODAL */}
      {showAddForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">

            <button
              onClick={() => setShowAddForm(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-700"
            >
              <X size={20} />
            </button>

            <div className="mb-6">

              <h2 className="text-xl font-bold text-slate-900">
                Add Memory
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Add familiar information for Asha.
              </p>

            </div>

            <form
              onSubmit={handleAddMemory}
              className="space-y-4"
            >

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Name / Memory Title
                </label>

                <input
                  type="text"
                  value={newMemory.name}
                  onChange={(e) =>
                    setNewMemory({
                      ...newMemory,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Priya"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Relationship / Type
                </label>

                <input
                  type="text"
                  value={newMemory.relation}
                  onChange={(e) =>
                    setNewMemory({
                      ...newMemory,
                      relation: e.target.value,
                    })
                  }
                  placeholder="e.g. Daughter"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Category
                </label>

                <select
                  value={newMemory.category}
                  onChange={(e) =>
                    setNewMemory({
                      ...newMemory,
                      category: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="Family">Family</option>
                  <option value="Places">Places</option>
                  <option value="Objects">Objects</option>
                  <option value="Memories">Memories</option>
                </select>

              </div>

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Description
                </label>

                <textarea
                  value={newMemory.description}
                  onChange={(e) =>
                    setNewMemory({
                      ...newMemory,
                      description: e.target.value,
                    })
                  }
                  placeholder="Add a short description..."
                  rows="3"
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              {/* IMAGE PLACEHOLDER */}
              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Image
                </label>

                <div className="flex h-28 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">

                  <div className="text-center">

                    <Upload
                      size={20}
                      className="mx-auto text-slate-400"
                    />

                    <p className="mt-1 text-xs text-slate-400">
                      Image will be added from patient/profile data
                    </p>

                  </div>

                </div>

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
                  Add Memory
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
   MEMORY CARD
========================================================= */

function MemoryCard({ memory }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* IMAGE AREA */}
      <div className="relative flex h-48 items-center justify-center bg-slate-100">

        {memory.image ? (
          <img
            src={memory.image}
            alt={memory.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
              <ImageIcon size={24} />
            </div>

            <p className="mt-3 text-xs font-semibold text-slate-500">
              No image added
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Add from patient data later
            </p>

          </div>
        )}

      </div>

      {/* CONTENT */}
      <div className="p-5">

        <div className="flex items-start justify-between gap-3">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {memory.title}
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-900">
              {memory.name}
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              {memory.relation || "Personal memory"}
            </p>

          </div>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
            {memory.category}
          </span>

        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          {memory.description}
        </p>

        {/* ACTIONS */}
        <div className="mt-5 flex gap-2">

          <button
            onClick={() =>
              alert(`Voice memory for ${memory.name} will be added later.`)
            }
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200"
          >
            <Mic size={14} />
            Voice
          </button>

          <button
            onClick={() =>
              alert(`Memory details for ${memory.name}`)
            }
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0f3e3a] py-2.5 text-xs font-semibold text-white hover:bg-[#0c312e]"
          >
            View
          </button>

        </div>

      </div>

    </div>
  );
}

export default Vault;
