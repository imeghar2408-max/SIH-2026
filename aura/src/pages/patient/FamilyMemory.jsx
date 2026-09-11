import React, { useMemo, useState } from "react";
import {
  Heart,
  Volume2,
  Play,
  Mic,
  Star,
  Calendar,
  Users,
  X,
  CheckCircle2,
  RotateCcw,
  Plus,
  Sparkles,
  ImagePlus,
  Upload,
} from "lucide-react";

const initialMemories = [
  {
    id: 1,
    title: "Priya",
    subtitle: "Daughter",
    category: "People",
    image: "",
    description:
      "Priya is your daughter. She enjoys spending time with you and visiting on weekends.",
    year: "Family",
    favorite: true,
  },
  {
    id: 2,
    title: "Rahul",
    subtitle: "Grandson",
    category: "People",
    image: "",
    description:
      "Rahul is your grandson. You often enjoy talking and playing games together.",
    year: "Family",
    favorite: false,
  },
  {
    id: 3,
    title: "Family Celebration",
    subtitle: "A special family day",
    category: "Events",
    image: "",
    description:
      "A happy family gathering filled with conversations, food and shared memories.",
    year: "2024",
    favorite: true,
  },
  {
    id: 4,
    title: "Morning Garden",
    subtitle: "A familiar place",
    category: "Places",
    image: "",
    description:
      "A peaceful garden where you enjoyed spending quiet mornings.",
    year: "Childhood",
    favorite: false,
  },
  {
    id: 5,
    title: "Festival Memory",
    subtitle: "A familiar celebration",
    category: "Culture",
    image: "",
    description:
      "A familiar festival memory involving family, traditional food and celebration.",
    year: "Family Tradition",
    favorite: false,
  },
  {
    id: 6,
    title: "Favourite Meal",
    subtitle: "A familiar food memory",
    category: "Culture",
    image: "",
    description:
      "A favourite traditional meal often prepared during family gatherings.",
    year: "Family Tradition",
    favorite: false,
  },
];

const categories = ["All", "People", "Places", "Events", "Culture"];

const recallOptions = ["Priya", "Rahul", "Anil"];

function speak(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

function ImageSlot({ image, onUpload, large = false }) {
  return (
    <label
      className={`relative flex cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 bg-stone-100 transition hover:border-[#0f3e3a] ${
        large
          ? "h-48 rounded-2xl"
          : "h-44 rounded-3xl"
      }`}
    >
      {image ? (
        <img
          src={image}
          alt="Memory"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-gray-400">
          <ImagePlus size={36} className="mb-2 text-[#0f3e3a]" />
          <p className="text-sm font-bold text-gray-600">
            Add Memory Photo
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Click to upload an image
          </p>
        </div>
      )}

      <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md">
        <Upload size={16} className="text-[#0f3e3a]" />
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
      />
    </label>
  );
}

export default function FamilyMemory() {
  const [memories, setMemories] = useState(initialMemories);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedMemory, setSelectedMemory] = useState(null);

  const [showAddMemory, setShowAddMemory] = useState(false);
  const [newMemoryTitle, setNewMemoryTitle] = useState("");
  const [newMemorySubtitle, setNewMemorySubtitle] = useState("");
  const [newMemoryCategory, setNewMemoryCategory] = useState("People");
  const [newMemoryImage, setNewMemoryImage] = useState("");

  const [recallMemory, setRecallMemory] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [recallResult, setRecallResult] = useState(null);

  const [isListening, setIsListening] = useState(false);

  const filteredMemories = useMemo(() => {
    if (activeCategory === "All") return memories;

    return memories.filter(
      (memory) => memory.category === activeCategory
    );
  }, [memories, activeCategory]);

  const favoriteMemories = memories.filter(
    (memory) => memory.favorite
  );

  const memoryOfTheDay = memories[0];

  const toggleFavorite = (id) => {
    setMemories((current) =>
      current.map((memory) =>
        memory.id === id
          ? { ...memory, favorite: !memory.favorite }
          : memory
      )
    );
  };

  const updateMemoryImage = async (id, file) => {
    try {
      const imageData = await readFileAsDataUrl(file);

      setMemories((current) =>
        current.map((memory) =>
          memory.id === id
            ? { ...memory, image: imageData }
            : memory
        )
      );

      setSelectedMemory((current) =>
        current && current.id === id
          ? { ...current, image: imageData }
          : current
      );
    } catch (error) {
      console.error("Unable to upload image:", error);
      alert("Unable to upload this image.");
    }
  };

  const handleNewMemoryImage = async (file) => {
    try {
      const imageData = await readFileAsDataUrl(file);
      setNewMemoryImage(imageData);
    } catch (error) {
      console.error("Unable to upload image:", error);
      alert("Unable to upload this image.");
    }
  };

  const addMemory = (event) => {
    event.preventDefault();

    if (!newMemoryTitle.trim()) return;

    const newMemory = {
      id: Date.now(),
      title: newMemoryTitle,
      subtitle: newMemorySubtitle || "Personal memory",
      category: newMemoryCategory,
      image: newMemoryImage,
      description: `A personal memory about ${newMemoryTitle}.`,
      year: "Personal",
      favorite: false,
    };

    setMemories((current) => [newMemory, ...current]);

    setNewMemoryTitle("");
    setNewMemorySubtitle("");
    setNewMemoryCategory("People");
    setNewMemoryImage("");
    setShowAddMemory(false);
  };

  const startRecallGame = () => {
    const personMemories = memories.filter(
      (memory) => memory.category === "People"
    );

    if (!personMemories.length) return;

    const randomMemory =
      personMemories[
        Math.floor(Math.random() * personMemories.length)
      ];

    setRecallMemory(randomMemory);
    setSelectedAnswer("");
    setRecallResult(null);
  };

  const checkRecallAnswer = () => {
    if (!selectedAnswer || !recallMemory) return;

    if (selectedAnswer === recallMemory.title) {
      setRecallResult("correct");
    } else {
      setRecallResult("wrong");
    }
  };

  const handleVoiceAnswer = () => {
    setIsListening(true);

    if (
      "SpeechRecognition" in window ||
      "webkitSpeechRecognition" in window
    ) {
      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      const recognition = new SpeechRecognition();

      recognition.lang = "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.start();

      recognition.onresult = (event) => {
        const spokenText =
          event.results[0][0].transcript.toLowerCase();

        const matchedOption = recallOptions.find((option) =>
          spokenText.includes(option.toLowerCase())
        );

        if (matchedOption) {
          setSelectedAnswer(matchedOption);
        }

        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsListening(false);
      alert("Voice recognition is not supported in this browser.");
    }
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Heart
              size={26}
              className="text-[#0f3e3a]"
              fill="currentColor"
            />

            <h1 className="text-3xl font-black text-[#0f3e3a]">
              Family Memories
            </h1>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Familiar faces, places and moments that matter to you.
          </p>
        </div>

        <button
          onClick={() => setShowAddMemory(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0f3e3a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0c312e]"
        >
          <Plus size={17} />
          Add Memory
        </button>
      </div>

      {/* MEMORY OF THE DAY */}
      <section className="overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-r from-teal-50 to-white p-6">
        <div className="grid gap-6 md:grid-cols-[1fr_220px] md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0f3e3a]">
              <Sparkles size={15} />
              Memory of the Day
            </div>

            <h2 className="text-2xl font-black text-gray-900">
              {memoryOfTheDay.title}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {memoryOfTheDay.subtitle}
            </p>

            <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600">
              {memoryOfTheDay.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  speak(
                    `${memoryOfTheDay.title}. ${memoryOfTheDay.description}`
                  )
                }
                className="flex items-center gap-2 rounded-xl bg-[#0f3e3a] px-4 py-2.5 text-xs font-bold text-white"
              >
                <Volume2 size={15} />
                Listen
              </button>

              <button
                onClick={() => setSelectedMemory(memoryOfTheDay)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                View Memory
              </button>
            </div>
          </div>

          <ImageSlot
            image={memoryOfTheDay.image}
            large
            onUpload={(file) =>
              updateMemoryImage(memoryOfTheDay.id, file)
            }
          />
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
              activeCategory === category
                ? "bg-[#0f3e3a] text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* MEMORY CARDS */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">
              Your Memories
            </h2>

            <p className="text-xs text-gray-400">
              Add real photos to make memories more meaningful.
            </p>
          </div>

          <div className="text-xs font-semibold text-gray-400">
            {filteredMemories.length} memories
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMemories.map((memory) => (
            <div
              key={memory.id}
              className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <ImageSlot
                image={memory.image}
                onUpload={(file) =>
                  updateMemoryImage(memory.id, file)
                }
              />

              <div className="space-y-3 p-5">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-black text-gray-900">
                      {memory.title}
                    </h3>

                    <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-[#0f3e3a]">
                      {memory.category}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-400">
                    {memory.subtitle}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMemory(memory)}
                    className="flex-1 rounded-xl bg-[#0f3e3a] py-2.5 text-xs font-bold text-white"
                  >
                    Open Memory
                  </button>

                  <button
                    onClick={() => toggleFavorite(memory.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50"
                    aria-label="Favorite memory"
                  >
                    <Star
                      size={16}
                      className={
                        memory.favorite
                          ? "text-amber-500"
                          : "text-gray-400"
                      }
                      fill={
                        memory.favorite
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                  <button
                    onClick={() =>
                      speak(
                        `${memory.title}. ${memory.description}`
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-[#0f3e3a] hover:bg-gray-50"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAVORITES + TIMELINE */}
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-2">
            <Star size={18} className="text-amber-500" />

            <h2 className="font-black text-gray-900">
              Favorite Memories
            </h2>
          </div>

          <div className="space-y-3">
            {favoriteMemories.length > 0 ? (
              favoriteMemories.map((memory) => (
                <button
                  key={memory.id}
                  onClick={() => setSelectedMemory(memory)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-gray-50 p-3 text-left hover:bg-gray-100"
                >
                  <div className="h-12 w-12 overflow-hidden rounded-xl bg-white">
                    {memory.image ? (
                      <img
                        src={memory.image}
                        alt={memory.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImagePlus
                          size={19}
                          className="text-[#0f3e3a]"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {memory.title}
                    </p>

                    <p className="text-xs text-gray-400">
                      {memory.subtitle}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-400">
                Mark memories as favorites to see them here.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-2">
            <Calendar size={18} className="text-[#0f3e3a]" />

            <h2 className="font-black text-gray-900">
              Memory Timeline
            </h2>
          </div>

          <div className="space-y-4">
            {memories.slice(0, 4).map((memory) => (
              <div
                key={memory.id}
                className="flex gap-3"
              >
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-[#0f3e3a]" />
                  <div className="h-full w-px bg-gray-200" />
                </div>

                <button
                  onClick={() => setSelectedMemory(memory)}
                  className="pb-3 text-left"
                >
                  <p className="text-xs font-bold text-[#0f3e3a]">
                    {memory.year}
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-800">
                    {memory.title}
                  </p>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* RECALL GAME */}
      <section className="rounded-3xl border border-teal-100 bg-teal-50/60 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users size={19} className="text-[#0f3e3a]" />

              <h2 className="font-black text-[#0f3e3a]">
                Who is this?
              </h2>
            </div>

            <p className="mt-1 text-xs text-gray-500">
              A gentle memory recall activity using familiar people.
            </p>
          </div>

          <button
            onClick={startRecallGame}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0f3e3a] px-5 py-3 text-xs font-bold text-white"
          >
            <Play size={15} />
            Start Activity
          </button>
        </div>

        {recallMemory && (
          <div className="mt-6 rounded-2xl bg-white p-5">
            <div className="mb-5">
              <ImageSlot
                image={recallMemory.image}
                large
                onUpload={(file) =>
                  updateMemoryImage(recallMemory.id, file)
                }
              />
            </div>

            <p className="mb-3 text-center text-sm font-bold text-gray-800">
              Who is this person?
            </p>

            <div className="grid gap-2 sm:grid-cols-3">
              {recallOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedAnswer(option)}
                  className={`rounded-xl border p-3 text-sm font-semibold ${
                    selectedAnswer === option
                      ? "border-[#0f3e3a] bg-teal-50 text-[#0f3e3a]"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                onClick={handleVoiceAnswer}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold"
              >
                <Mic size={15} />

                {isListening
                  ? "Listening..."
                  : "Answer by Voice"}
              </button>

              <button
                onClick={checkRecallAnswer}
                className="rounded-xl bg-[#0f3e3a] px-5 py-2.5 text-xs font-bold text-white"
              >
                Check Answer
              </button>

              <button
                onClick={startRecallGame}
                className="flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold"
              >
                <RotateCcw size={14} />
                New
              </button>
            </div>

            {recallResult === "correct" && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
                <CheckCircle2 size={17} />
                Great job! That's correct.
              </div>
            )}

            {recallResult === "wrong" && (
              <div className="mt-4 rounded-xl bg-amber-50 p-3 text-center text-sm font-semibold text-amber-700">
                That's okay. The correct answer is{" "}
                <strong>{recallMemory.title}</strong>.
              </div>
            )}
          </div>
        )}
      </section>

      {/* MEMORY MODAL */}
      {selectedMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow hover:bg-gray-100"
            >
              <X size={18} />
            </button>

            <ImageSlot
              image={selectedMemory.image}
              large
              onUpload={(file) =>
                updateMemoryImage(selectedMemory.id, file)
              }
            />

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-gray-900">
                  {selectedMemory.title}
                </h2>

                <button
                  onClick={() =>
                    toggleFavorite(selectedMemory.id)
                  }
                >
                  <Star
                    size={21}
                    className={
                      selectedMemory.favorite
                        ? "text-amber-500"
                        : "text-gray-400"
                    }
                    fill={
                      selectedMemory.favorite
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>

              <p className="mt-1 text-sm text-gray-400">
                {selectedMemory.subtitle}
              </p>

              <p className="mt-5 text-sm leading-7 text-gray-600">
                {selectedMemory.description}
              </p>

              <button
                onClick={() =>
                  speak(
                    `${selectedMemory.title}. ${selectedMemory.description}`
                  )
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f3e3a] py-3 text-sm font-bold text-white"
              >
                <Volume2 size={17} />
                Listen to Memory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMORY MODAL */}
      {showAddMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <form
            onSubmit={addMemory}
            className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setShowAddMemory(false)}
              className="absolute right-5 top-5"
            >
              <X size={19} />
            </button>

            <h2 className="text-xl font-black text-[#0f3e3a]">
              Add a Memory
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Add a photo and details for a familiar memory.
            </p>

            <div className="mt-6 space-y-4">
              <ImageSlot
                image={newMemoryImage}
                large
                onUpload={handleNewMemoryImage}
              />

              <input
                value={newMemoryTitle}
                onChange={(e) =>
                  setNewMemoryTitle(e.target.value)
                }
                placeholder="Memory title"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0f3e3a]"
              />

              <input
                value={newMemorySubtitle}
                onChange={(e) =>
                  setNewMemorySubtitle(e.target.value)
                }
                placeholder="Relationship or short description"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0f3e3a]"
              />

              <select
                value={newMemoryCategory}
                onChange={(e) =>
                  setNewMemoryCategory(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
              >
                {categories
                  .filter((category) => category !== "All")
                  .map((category) => (
                    <option key={category}>
                      {category}
                    </option>
                  ))}
              </select>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#0f3e3a] py-3.5 text-sm font-bold text-white"
              >
                Save Memory
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}