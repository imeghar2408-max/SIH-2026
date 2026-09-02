import React, { useState, useEffect } from 'react';
import { 
  Home, Brain, Calendar, Bell, ShieldAlert, Heart, Play, 
  CheckCircle2, Clock, Activity, ArrowRight, UserCheck, AlertTriangle, 
  Volume2, Mic, RotateCcw, Lightbulb, Search, Plus, Filter, ChevronRight, X
} from 'lucide-react';

export default function AuraApp() {
  // Navigation State
  // Views: 'landing', 'patient-dashboard', 'patient-activities', 'patient-game', 'patient-family',
  //        'caregiver-overview', 'caregiver-patient', 'caregiver-rhythm', 'caregiver-alerts'
  const [currentView, setCurrentView] = useState('landing');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginRole, setLoginRole] = useState('patient');

  // Interactive Memory Game State
  const initialCards = [
    { id: 1, symbol: '🐾', matched: true, flipped: true },
    { id: 2, symbol: '🌸', matched: false, flipped: true },
    { id: 3, symbol: '🧠', matched: false, flipped: false },
    { id: 4, symbol: '☀️', matched: false, flipped: false },
    { id: 5, symbol: '🐾', matched: true, flipped: true },
    { id: 6, symbol: '🌸', matched: false, flipped: false },
    { id: 7, symbol: '🧠', matched: false, flipped: false },
    { id: 8, symbol: '☀️', matched: false, flipped: false },
  ];
  const [cards, setCards] = useState(initialCards);
  const [gameComplete, setGameComplete] = useState(false);

  const handleCardClick = (index) => {
    if (cards[index].flipped || cards[index].matched) return;
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    // Simple complete check trigger
    const allFlipped = newCards.filter(c => !c.flipped).length <= 1;
    if (allFlipped) setTimeout(() => setGameComplete(true), 800);
  };

  const resetGame = () => {
    setCards(initialCards.map(c => ({ ...c, flipped: c.matched })));
    setGameComplete(false);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-gray-800 font-sans antialiased">
      {/* GLOBAL NAVBAR (Visible on Landing or accessible via quick-switch) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div 
          onClick={() => setCurrentView('landing')} 
          className="text-2xl font-black tracking-wider text-[#0f3e3a] cursor-pointer"
        >
          AURA
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium text-gray-600">
          <button onClick={() => setCurrentView('landing')} className="hover:text-[#0f3e3a]">About</button>
          <button onClick={() => setCurrentView('landing')} className="hover:text-[#0f3e3a]">How it Works</button>
          <button 
            onClick={() => setIsLoginOpen(true)}
            className="px-6 py-2 rounded-full border border-gray-300 font-semibold text-gray-800 hover:border-[#0f3e3a] transition"
          >
            Login
          </button>
        </nav>
      </header>

      {/* LOGIN MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-[#0f3e3a] mb-2">Welcome to AURA</h2>
            <p className="text-sm text-gray-500 mb-6">Select your portal to continue</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setLoginRole('patient')}
                className={`py-3 rounded-xl border text-sm font-semibold transition ${
                  loginRole === 'patient' 
                    ? 'border-[#0f3e3a] bg-[#0f3e3a]/10 text-[#0f3e3a]' 
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setLoginRole('caregiver')}
                className={`py-3 rounded-xl border text-sm font-semibold transition ${
                  loginRole === 'caregiver' 
                    ? 'border-[#0f3e3a] bg-[#0f3e3a]/10 text-[#0f3e3a]' 
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Caregiver
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {loginRole === 'patient' ? 'Patient ID or Family PIN' : 'Work Email'}
                </label>
                <input 
                  type="text" 
                  placeholder={loginRole === 'patient' ? "e.g., ASHA-8204" : "sarah.jenkins@hospital.org"} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0f3e3a]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0f3e3a]"
                />
              </div>
              <button 
                onClick={() => {
                  setIsLoginOpen(false);
                  setCurrentView(loginRole === 'patient' ? 'patient-dashboard' : 'caregiver-overview');
                }}
                className="w-full py-3.5 bg-[#0f3e3a] text-white font-semibold rounded-xl hover:bg-[#0c312e] transition shadow-md"
              >
                Log In as {loginRole === 'patient' ? 'Patient' : 'Caregiver'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER DYNAMIC SCREENS */}
      <main>
        {currentView === 'landing' && (
          <LandingView 
            onOpenPatient={() => setCurrentView('patient-dashboard')} 
            onOpenCaregiver={() => setCurrentView('caregiver-overview')} 
          />
        )}

        {/* PATIENT INTERFACES */}
        {currentView.startsWith('patient') && (
          <PatientLayout currentView={currentView} setCurrentView={setCurrentView}>
            {currentView === 'patient-dashboard' && (
              <PatientDashboardView setCurrentView={setCurrentView} />
            )}
            {currentView === 'patient-activities' && (
              <PatientActivitiesView setCurrentView={setCurrentView} />
            )}
            {currentView === 'patient-game' && (
              <PatientGameView 
                cards={cards} 
                handleCardClick={handleCardClick} 
                resetGame={resetGame} 
                gameComplete={gameComplete}
                setCurrentView={setCurrentView}
              />
            )}
            {currentView === 'patient-family' && (
              <PatientFamilyMemoriesView setCurrentView={setCurrentView} />
            )}
          </PatientLayout>
        )}

        {/* CAREGIVER INTERFACES */}
        {currentView.startsWith('caregiver') && (
          <CaregiverLayout currentView={currentView} setCurrentView={setCurrentView}>
            {currentView === 'caregiver-overview' && (
              <CaregiverOverviewView setCurrentView={setCurrentView} />
            )}
            {currentView === 'caregiver-patient' && (
              <CaregiverPatientDetailView setCurrentView={setCurrentView} />
            )}
            {currentView === 'caregiver-rhythm' && (
              <CaregiverRhythmView setCurrentView={setCurrentView} />
            )}
            {currentView === 'caregiver-alerts' && (
              <CaregiverAlertsView setCurrentView={setCurrentView} />
            )}
          </CaregiverLayout>
        )}
      </main>
    </div>
  );
}

/* ==========================================================================
   1. LANDING VIEW
   ========================================================================== */
function LandingView({ onOpenPatient, onOpenCaregiver }) {
  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-gradient-to-b from-stone-100/60 to-white">
        <div className="max-w-2xl mx-auto space-y-4 z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0f3e3a] tracking-tight">
            Care that remembers.
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-light">
            AI-powered cognitive assistance for elderly care.
          </p>
        </div>
        <div className="absolute bottom-10 flex flex-col items-center text-xs text-gray-400 tracking-widest uppercase gap-2">
          <span>Scroll to explore</span>
          <span className="animate-bounce">↓</span>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <div>
          <h2 className="text-xl font-bold text-[#0f3e3a] mb-2">About AURA</h2>
          <p className="text-sm text-gray-600 max-w-xl">
            A sanctuary of support, engineered with empathetic professionalism. We bridge the gap between clinical precision and accessible warmth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#0f3e3a]">
                <Brain size={20} />
              </div>
              <h3 className="font-bold text-lg text-gray-900">AI Personalization</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Adaptive algorithms learn daily routines and cognitive patterns, tailoring gentle interventions that feel natural, never intrusive. The system evolves with the patient.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#0f3e3a]">
              <UserCheck size={20} />
            </div>
            <h3 className="font-bold text-lg text-gray-900">NER Accessibility</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Built on a Fixed Grid model to reduce cognitive load: high-contrast interfaces, massive touch targets, and tonal layering ensure predictable navigation for visual and motor impairments.
            </p>
          </div>
        </div>

        {/* How It Works Card */}
        <div className="bg-[#0f3e3a] text-white p-8 md:p-12 rounded-3xl space-y-8">
          <div className="flex items-center space-x-2 text-teal-200 text-sm font-semibold">
            <Activity size={18} />
            <span>How it Works</span>
          </div>
          <p className="text-base md:text-lg text-teal-50 max-w-2xl font-light">
            AURA seamlessly connects an intuitive patient terminal with a powerful, data-rich caregiver dashboard. Continuous monitoring translates into actionable insights, ensuring safety without sacrificing dignity.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-teal-800/60 text-xs">
            <div>
              <p className="font-bold">Observe</p>
              <p className="text-teal-200/70">Ambient data collection</p>
            </div>
            <div>
              <p className="font-bold">Analyze</p>
              <p className="text-teal-200/70">Pattern recognition</p>
            </div>
            <div>
              <p className="font-bold">Support</p>
              <p className="text-teal-200/70">Timely, gentle cues</p>
            </div>
          </div>
        </div>

        {/* Entry Portals */}
        <div className="grid md:grid-cols-2 gap-6 pt-4">
          <button 
            onClick={onOpenPatient}
            className="group text-left p-8 rounded-3xl bg-[#0f3e3a] text-white hover:bg-[#124b46] transition flex flex-col justify-between h-48 shadow-lg"
          >
            <h4 className="text-xl font-semibold">Continue as Patient</h4>
            <div className="flex items-center space-x-2 text-xs text-teal-200 font-medium">
              <span>ENTER PORTAL</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </button>

          <button 
            onClick={onOpenCaregiver}
            className="group text-left p-8 rounded-3xl bg-gray-200/70 text-gray-900 hover:bg-gray-300/70 transition flex flex-col justify-between h-48"
          >
            <h4 className="text-xl font-semibold">Continue as Caregiver</h4>
            <div className="flex items-center space-x-2 text-xs text-gray-600 font-medium">
              <span>ACCESS DASHBOARD</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}

/* ==========================================================================
   2. PATIENT PORTAL LAYOUT & VIEWS
   ========================================================================== */
function PatientLayout({ children, currentView, setCurrentView }) {
  const navItems = [
    { label: 'Home', view: 'patient-dashboard', icon: Home },
    { label: 'Activities', view: 'patient-activities', icon: Brain },
    { label: 'Memory', view: 'patient-family', icon: Heart },
    { label: 'Reminders', view: 'patient-dashboard', icon: Calendar },
  ];

  return (
    <div className="flex min-h-[calc(100vh-73px)]">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-100/70 border-r border-gray-200/70 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Patient Portal</h2>
            <p className="text-xs text-gray-500">Safe Mode Active</p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.label}
                  onClick={() => setCurrentView(item.view)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                    isActive 
                      ? 'bg-[#0f3e3a] text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-200/50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dedicated High-Visibility SOS */}
        <button 
          onClick={() => alert("SOS Alert dispatched to caregiver!")}
          className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition"
        >
          <AlertTriangle size={18} />
          <span>SOS</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 p-8 max-w-5xl mx-auto overflow-y-auto">
        {children}
      </section>
    </div>
  );
}

function PatientDashboardView({ setCurrentView }) {
  return (
    <div className="space-y-8 animate-in fade-in">
      <h1 className="text-3xl font-black text-[#0f3e3a] flex items-center gap-2">
        Good Morning, Asha <span className="text-red-500">❤️</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Exercise Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-200/70 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Today's Personalized Plan</span>
            <div className="flex items-center space-x-3 mt-4">
              <div className="p-3 bg-[#0f3e3a] text-white rounded-2xl">
                <Brain size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Memory Match</h2>
            </div>
            <div className="flex items-center space-x-4 mt-6 text-xs text-gray-600">
              <span className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                <Clock size={14} /> 5 minutes
              </span>
              <span className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                Medium difficulty
              </span>
            </div>
          </div>
          <button 
            onClick={() => setCurrentView('patient-game')}
            className="mt-8 flex items-center justify-center space-x-2 bg-[#0f3e3a] text-white font-bold py-4 rounded-full hover:bg-[#0c312e] transition"
          >
            <span>START ACTIVITY</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Right Status Cards */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-200/70 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-sm font-bold">
              <span>Today's Progress</span>
              <span className="text-[#0f3e3a]">2/4</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#0f3e3a] h-full w-1/2"></div>
            </div>
            <p className="text-xs text-gray-500">Halfway there! Keep going.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/70 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold">
              💊
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Next Medicine</p>
              <p className="text-xs text-gray-500">12:30 PM</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/70 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              💧
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Hydration</p>
              <p className="text-xs text-gray-500">Drink water</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/70 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
              📅
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Next Appointment</p>
              <p className="text-xs text-gray-500">Doctor — 4 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Patient Action Bar */}
      <div className="flex items-center space-x-4 pt-4">
        <button className="flex-1 flex items-center justify-center space-x-3 bg-[#0f3e3a] text-white py-4 rounded-2xl font-bold hover:bg-[#0c312e] transition">
          <Mic size={20} />
          <span>Talk to AURA</span>
        </button>
        <button 
          onClick={() => alert("EMERGENCY SOS SIGNAL SENT")}
          className="flex-1 flex items-center justify-center space-x-3 bg-red-700 text-white py-4 rounded-2xl font-black tracking-wide hover:bg-red-800 transition"
        >
          <span>* EMERGENCY SOS</span>
        </button>
      </div>
    </div>
  );
}

function PatientActivitiesView({ setCurrentView }) {
  const activities = [
    { title: 'Memory Game', level: 'EASY', time: '5 MIN', desc: 'Match pairs of cards to exercise your short-term memory.', view: 'patient-game' },
    { title: 'Spot the Difference', level: 'MEDIUM', time: '10 MIN', desc: 'Find the small changes between two similar pictures.', view: 'patient-activities' },
    { title: 'Pattern Match', level: 'EASY', time: '5 MIN', desc: 'Complete simple sequences of shapes and colors.', view: 'patient-activities' },
    { title: 'Daily Routine', level: 'EASY', time: '8 MIN', desc: 'Organize daily tasks into the correct order.', view: 'patient-activities' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#0f3e3a]">Choose an Activity</h1>
        <p className="text-sm text-gray-500 mt-1">Take your time to select an activity. These exercises help keep your mind active and healthy.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {activities.map((act, i) => (
          <div key={i} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="h-32 bg-teal-50/50 flex items-center justify-center text-4xl">
              {i === 0 ? '📖' : i === 1 ? '🔍' : i === 2 ? '🧩' : '☕'}
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{act.title}</h3>
                  <div className="flex space-x-2 text-[10px] font-bold">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">{act.level}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{act.time}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{act.desc}</p>
              </div>
              <button 
                onClick={() => setCurrentView(act.view)}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-[#0f3e3a] text-white text-sm font-semibold hover:bg-[#0c312e] transition"
              >
                <span>START</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PatientGameView({ cards, handleCardClick, resetGame, gameComplete, setCurrentView }) {
  if (gameComplete) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-8 py-10 animate-in zoom-in-95">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-[#0f3e3a] flex items-center justify-center text-3xl font-bold">
          ★
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-[#0f3e3a]">Great job, Asha!</h2>
          <p className="text-xs text-gray-500 mt-1">Memory Match Game Complete</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-bold">Score</p>
            <p className="text-xl font-bold text-gray-800 mt-1">8/10</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-bold">Accuracy</p>
            <p className="text-xl font-bold text-[#0f3e3a] mt-1">80%</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-bold">Reaction Time</p>
            <p className="text-xl font-bold text-gray-800 mt-1">2.4s</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-teal-100 text-left space-y-4 shadow-sm">
          <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-1 rounded font-bold uppercase">
            AI Adaptive Path
          </span>
          <p className="text-sm font-semibold text-gray-800">
            Based on your recent performance, your next activity has been adjusted.
          </p>
          <div className="bg-stone-50 p-3 rounded-xl border border-gray-100 text-xs">
            <p className="font-bold text-gray-700">Recommended: Pattern Recognition</p>
            <p className="text-gray-400">Medium Difficulty</p>
          </div>
          <button 
            onClick={() => setCurrentView('patient-activities')}
            className="w-full py-3 bg-[#0f3e3a] text-white font-bold rounded-xl flex items-center justify-center space-x-2"
          >
            <span>START NEXT ACTIVITY</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0f3e3a]">Daily Memory Exercise</h2>
          <p className="text-xs text-gray-400">Focus: Short-term recall & pattern recognition</p>
        </div>
        <div className="flex space-x-6 text-right">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Score</p>
            <p className="text-lg font-bold">1250</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Accuracy</p>
            <p className="text-lg font-bold text-[#0f3e3a]">85%</p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto py-4">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className={`h-28 rounded-2xl flex items-center justify-center text-3xl cursor-pointer border-2 transition-all ${
              card.flipped 
                ? 'bg-white border-[#0f3e3a] shadow-md' 
                : 'bg-stone-200/60 border-transparent hover:bg-stone-300/60'
            }`}
          >
            {card.flipped ? card.symbol : '⚙️'}
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-500">Find the matching pair for the card.</p>

      <div className="flex items-center justify-center space-x-4">
        <button className="flex items-center space-x-2 px-6 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold hover:bg-gray-100">
          <Lightbulb size={16} />
          <span>Hint</span>
        </button>
        <button 
          onClick={resetGame}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#0f3e3a] text-white text-xs font-semibold hover:bg-[#0c312e]"
        >
          <RotateCcw size={16} />
          <span>Reset Board</span>
        </button>
      </div>
    </div>
  );
}

function PatientFamilyMemoriesView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#0f3e3a]">Family Memories</h1>
        <p className="text-sm text-gray-500 mt-1">Let's look at some familiar faces today.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Family Cards */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-3xl border border-gray-200 space-y-3">
            <div className="h-44 bg-amber-100 rounded-2xl flex items-center justify-center text-4xl">
              👩‍🦰
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900">Priya</h4>
                <p className="text-xs text-gray-400">Daughter</p>
              </div>
              <button className="w-8 h-8 rounded-full bg-[#0f3e3a] text-white flex items-center justify-center">
                <Volume2 size={14} />
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-gray-200 space-y-3">
            <div className="h-44 bg-sky-100 rounded-2xl flex items-center justify-center text-4xl">
              👦
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900">Rahul</h4>
                <p className="text-xs text-gray-400">Grandson</p>
              </div>
              <button className="w-8 h-8 rounded-full bg-[#0f3e3a] text-white flex items-center justify-center">
                <Volume2 size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Prompt Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Who is this?</h3>
            <button className="flex items-center space-x-1 text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">
              <Play size={10} /> <span>Play Audio</span>
            </button>
          </div>

          <div className="h-28 bg-stone-100 rounded-2xl flex items-center justify-center text-3xl">
            👴
          </div>

          <div className="space-y-2">
            {['Priya (Daughter)', 'Rahul (Grandson)', 'Anil (Husband)'].map((name, i) => (
              <label key={i} className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 text-xs font-semibold">
                <input type="radio" name="family" className="text-[#0f3e3a] focus:ring-0" />
                <span>{name}</span>
              </label>
            ))}
          </div>

          <button className="w-full py-3 bg-[#0f3e3a] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2">
            <Mic size={14} />
            <span>Answer by Voice</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. CAREGIVER DASHBOARD LAYOUT & VIEWS
   ========================================================================== */
function CaregiverLayout({ children, currentView, setCurrentView }) {
  const menuItems = [
    { label: 'Overview', view: 'caregiver-overview', icon: Home },
    { label: 'Patients', view: 'caregiver-patient', icon: UserCheck },
    { label: 'Analytics', view: 'caregiver-patient', icon: Activity },
    { label: 'Rhythm', view: 'caregiver-rhythm', icon: Brain },
    { label: 'Vault', view: 'caregiver-patient', icon: Calendar },
    { label: 'Alerts', view: 'caregiver-alerts', icon: Bell },
  ];

  return (
    <div className="flex min-h-[calc(100vh-73px)]">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-50 border-r border-gray-200 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Caregiver Dashboard</h2>
            <p className="text-xs text-gray-400">Active Monitoring</p>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.label}
                  onClick={() => setCurrentView(item.view)}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive 
                      ? 'bg-teal-50 text-[#0f3e3a] font-bold border-r-4 border-[#0f3e3a]' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 text-xs">
          <div className="w-9 h-9 rounded-full bg-teal-900 text-white flex items-center justify-center font-bold">
            SJ
          </div>
          <div>
            <p className="font-bold text-gray-800">Dr. Sarah Jenkins</p>
            <p className="text-gray-400">Settings</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 p-8 max-w-6xl mx-auto overflow-y-auto">
        {children}
      </section>
    </div>
  );
}

function CaregiverOverviewView({ setCurrentView }) {
  const patients = [
    { name: 'Arthur Pendelton', age: 78, room: '402', status: 'Stable', medication: 'Taken', alert: '-' },
    { name: 'Martha Washington', age: 82, room: '112', status: 'Elevated Risk', medication: 'Overdue 30m', alert: 'High' },
    { name: 'Hector Rivera', age: 74, room: '305', status: 'Stable', medication: 'Taken', alert: '-' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Overview</h1>
          <p className="text-xs text-gray-400">Tuesday, October 24</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="pl-9 pr-4 py-2 border rounded-xl text-xs w-56 focus:outline-none"
            />
          </div>
          <button className="bg-[#0f3e3a] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1">
            <Plus size={14} />
            <span>New Patient</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center text-gray-500 text-xs mb-2">
            <span>Active Patients</span>
            <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold">↑ 2%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">124</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center text-gray-500 text-xs mb-2">
            <span>Today's Activities</span>
            <span className="text-gray-400">Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">342</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center text-gray-500 text-xs mb-2">
            <span>Medication Adherence</span>
            <span className="text-teal-700">avg</span>
          </div>
          <p className="text-2xl font-bold text-[#0f3e3a]">94%</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-red-100 bg-red-50/20">
          <div className="flex justify-between items-center text-red-600 text-xs mb-2">
            <span>Pending Alerts</span>
            <span className="bg-red-100 px-1.5 py-0.5 rounded font-bold">Action Req.</span>
          </div>
          <p className="text-2xl font-bold text-red-600">7</p>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-sm">Patient Status & Monitoring</h3>
          <Filter size={16} className="text-gray-400" />
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-400 font-semibold border-b">
            <tr>
              <th className="p-4">PATIENT</th>
              <th>STATUS</th>
              <th>MEMORY</th>
              <th>ATTENTION</th>
              <th>MEDICATION</th>
              <th>ALERTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {patients.map((p, i) => (
              <tr 
                key={i} 
                onClick={() => setCurrentView('caregiver-patient')}
                className="hover:bg-gray-50/80 cursor-pointer transition"
              >
                <td className="p-4 font-bold text-gray-900">{p.name} <span className="text-gray-400 font-normal">({p.age} yrs)</span></td>
                <td>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    p.status === 'Stable' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td>🟩🟩🟩🟩</td>
                <td>🟨🟨🟨🟩</td>
                <td>{p.medication}</td>
                <td className="text-red-600 font-bold">{p.alert}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CaregiverPatientDetailView({ setCurrentView }) {
  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-stone-200 rounded-full flex items-center justify-center text-2xl font-bold">
            👵
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Asha</h1>
            <p className="text-xs text-gray-400">Age: 78</p>
          </div>
        </div>
        <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold">
          ● Overall status: Stable
        </span>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 text-xs font-semibold text-gray-500 border-b">
        <button className="pb-2 text-gray-400">Overview</button>
        <button className="pb-2 border-b-2 border-[#0f3e3a] text-[#0f3e3a]">Cognitive Progress</button>
        <button className="pb-2 text-gray-400" onClick={() => setCurrentView('caregiver-rhythm')}>Rhythm Plan</button>
        <button className="pb-2 text-gray-400">Memory Vault</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trend Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200">
            <h4 className="font-bold text-gray-800 text-sm">Memory Score Trend</h4>
            <p className="text-[10px] text-gray-400 mb-4">Last 30 Days</p>
            {/* Mock Chart Graphic */}
            <div className="h-40 flex items-end space-x-2 pt-8">
              {[40, 45, 48, 55, 60, 62, 70, 75, 72, 85, 80, 88].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div 
                    style={{ height: `${val}%` }} 
                    className="w-full bg-[#0f3e3a]/70 hover:bg-[#0f3e3a] rounded-t transition"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100">
              <p className="text-xs text-gray-400 font-bold">Attention</p>
              <p className="text-xl font-bold text-gray-900 mt-1">82%</p>
              <p className="text-[10px] text-green-600">↑ 3% vs last week</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100">
              <p className="text-xs text-gray-400 font-bold">Accuracy</p>
              <p className="text-xl font-bold text-gray-900 mt-1">91%</p>
              <p className="text-[10px] text-green-600">↑ 1% vs last week</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100">
              <p className="text-xs text-gray-400 font-bold">Reaction Time</p>
              <p className="text-xl font-bold text-gray-900 mt-1">1.2s</p>
              <p className="text-[10px] text-gray-400">Stable</p>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-teal-50/50 p-6 rounded-3xl border border-teal-100 space-y-4">
          <div className="flex items-center space-x-2 text-[#0f3e3a] font-bold text-sm">
            <Brain size={16} />
            <span>AI Insights</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-teal-50 text-xs text-gray-700 leading-relaxed">
            Memory performance has improved over the last 2 weeks during visual recall games.
          </div>
          <div className="bg-white p-4 rounded-2xl border border-teal-50 text-xs text-gray-700 leading-relaxed">
            Patient performs best during morning sessions (9 AM - 11 AM).
          </div>
        </div>
      </div>
    </div>
  );
}

function CaregiverRhythmView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0f3e3a]">Adaptive Cognitive Rhythm</h1>
        <p className="text-xs text-gray-500 mt-1">
          Continuous AI monitoring adjusts daily activity difficulty and timing based on real-time metrics.
        </p>
      </div>

      {/* Engine Flow */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-6">
        <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Engine Workflow</h4>
        <div className="flex items-center justify-between text-center max-w-xl mx-auto text-xs font-semibold">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gray-100 mx-auto flex items-center justify-center text-gray-700 mb-1">
              📊
            </div>
            <span>Baseline</span>
          </div>
          <span>→</span>
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gray-100 mx-auto flex items-center justify-center text-gray-700 mb-1">
              🔄
            </div>
            <span>Performance</span>
          </div>
          <span>→</span>
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#0f3e3a] text-white mx-auto flex items-center justify-center text-lg mb-1 shadow-md">
              ⚙️
            </div>
            <span className="text-[#0f3e3a] font-bold">AI Engine</span>
          </div>
          <span>→</span>
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gray-100 mx-auto flex items-center justify-center text-gray-700 mb-1">
              🎯
            </div>
            <span>Adaptive Task</span>
          </div>
        </div>
      </div>

      {/* Rhythm Schedule Cards */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-gray-800 text-sm">Personalized Daily Plan</h4>
          <button className="text-xs border px-3 py-1.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">
            Override Plan
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl border border-teal-100 bg-teal-50/20 space-y-2">
            <span className="font-bold text-[#0f3e3a]">09:00 AM • Medium</span>
            <p className="font-semibold text-gray-800">Memory Match</p>
            <p className="text-[10px] text-gray-500">Visual Recall</p>
          </div>
          <div className="p-4 rounded-2xl border border-gray-100 bg-stone-50 space-y-2">
            <span className="font-bold text-gray-600">01:00 PM • Easy</span>
            <p className="font-semibold text-gray-800">Pattern Recog.</p>
            <p className="text-[10px] text-gray-500">Logic sequence</p>
          </div>
          <div className="p-4 rounded-2xl border border-gray-100 bg-stone-50 space-y-2">
            <span className="font-bold text-gray-600">06:00 PM • Easy</span>
            <p className="font-semibold text-gray-800">Family Recog.</p>
            <p className="text-[10px] text-gray-500">Emotional connection</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CaregiverAlertsView() {
  const alerts = [
    { name: 'Eleanor Vance', room: 'Rm 402 - East Wing', time: 'Just Now', desc: 'SOS Button Triggered', priority: 'EMERGENCY' },
    { name: 'Arthur Pendelton', room: 'Rm 215 - West Wing', time: '15 mins ago', desc: 'Missed Medication (Lisinopril)', priority: 'HIGH' },
    { name: 'Martha Thompson', room: 'At Home Care', time: '1 hour ago', desc: 'Slower completion time on cognitive puzzle', priority: 'MEDIUM' },
    { name: 'Beatrice Clark', room: 'Rm 112 - North Wing', time: '2 hours ago', desc: 'Wearable sensor battery at 15%', priority: 'LOW' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Alert Center</h1>
        <p className="text-xs text-gray-400 mt-1">Monitor and respond to patient alerts across all active facilities.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-400 font-semibold border-b">
            <tr>
              <th className="p-4">PATIENT</th>
              <th>TIME</th>
              <th>ALERT DESCRIPTION</th>
              <th>PRIORITY</th>
              <th className="text-right p-4">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {alerts.map((alt, i) => (
              <tr key={i} className={alt.priority === 'EMERGENCY' ? 'bg-red-50/50' : ''}>
                <td className="p-4">
                  <p className="font-bold text-gray-900">{alt.name}</p>
                  <p className="text-[10px] text-gray-400">{alt.room}</p>
                </td>
                <td className="text-gray-500">{alt.time}</td>
                <td className="font-semibold text-gray-800">{alt.desc}</td>
                <td>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    alt.priority === 'EMERGENCY' ? 'bg-red-600 text-white' :
                    alt.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                    alt.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {alt.priority}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {alt.priority === 'EMERGENCY' ? (
                    <button className="bg-red-700 hover:bg-red-800 text-white font-bold px-4 py-1.5 rounded-xl">
                      Respond
                    </button>
                  ) : (
                    <button className="text-gray-400 hover:text-gray-700 font-bold px-2 py-1">
                      •••
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}