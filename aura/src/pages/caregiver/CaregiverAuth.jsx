import React, { useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  LogIn,
  CheckCircle2,
} from "lucide-react";

const SARAH_ACCOUNT = {
  email: "sarah.jenkins@aura.org",
  password: "Sarah@123",
  name: "Sarah Jenkins",
};

export default function CaregiverAuth({ onSarahLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (
      normalizedEmail === SARAH_ACCOUNT.email &&
      password === SARAH_ACCOUNT.password
    ) {
      onSarahLogin({
        name: SARAH_ACCOUNT.name,
        email: SARAH_ACCOUNT.email,
        isDemo: true,
      });

      return;
    }

    setLoginError(
      "Invalid caregiver email or password. Please check your details."
    );
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#f8faf9] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-4xl">

        {/* BACK */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-[#0f3e3a]"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="grid lg:grid-cols-[0.8fr_1.2fr] bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">

          {/* LEFT SIDE */}
          <div className="bg-[#0f3e3a] text-white p-8 lg:p-10">

            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={24} />
            </div>

            <h1 className="text-3xl font-bold mb-4">
              AURA Caregiver Portal
            </h1>

            <p className="text-white/75 text-sm leading-6">
              Secure access for caregivers and healthcare professionals
              managing cognitive care and patient wellbeing.
            </p>

            <div className="mt-10 space-y-4 text-sm">

              <div className="flex gap-3">
                <CheckCircle2 size={18} className="mt-0.5" />
                <span>Patient care management</span>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 size={18} className="mt-0.5" />
                <span>Adaptive cognitive support</span>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 size={18} className="mt-0.5" />
                <span>Memory and reminder management</span>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 size={18} className="mt-0.5" />
                <span>Safety and caregiver alerts</span>
              </div>

            </div>

            {/* DEMO ACCOUNT */}
            <div className="mt-10 p-4 rounded-2xl bg-white/10 text-xs leading-5">
              <p className="font-bold mb-1">
                Demo caregiver
              </p>

              <p>Sarah Jenkins</p>
              <p>sarah.jenkins@aura.org</p>
              <p>Sarah@123</p>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="p-8 lg:p-10">

            <div className="mb-7">
              <h2 className="text-2xl font-bold text-[#0f3e3a]">
                Caregiver Login
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Sign in to access the caregiver dashboard.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Work Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.jenkins@aura.org"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0f3e3a]"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0f3e3a]"
                  required
                />
              </div>

              {/* ERROR */}
              {loginError && (
                <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-3 text-sm">
                  {loginError}
                </div>
              )}

              {/* LOGIN */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#0f3e3a] text-white rounded-xl font-semibold hover:bg-[#0c312e] transition flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                Login as Caregiver
              </button>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}