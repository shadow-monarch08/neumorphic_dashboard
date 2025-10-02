// src/pages/Home.tsx
import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const features = [
  {
    title: "Smart Calendar",
    desc: "See your tasks on the calendar, click a date to view or edit tasks, and never miss a deadline.",
    emoji: "📅",
  },
  {
    title: "Automated Reminders",
    desc: "Email reminders are scheduled for upcoming tasks so you always stay ahead.",
    emoji: "🔔",
  },
  {
    title: "Neumorphic UI",
    desc: "Soft shadows, subtle depth and tactile controls — a modern and pleasing interface.",
    emoji: "🎨",
  },
  {
    title: "Secure Auth",
    desc: "Sign up / Sign in with JWT-based auth and protected routes for your dashboard.",
    emoji: "🔒",
  },
  {
    title: "Tasks & Subscriptions",
    desc: "Track tasks and subscriptions, with automatic renewal handling and status updates.",
    emoji: "💳",
  },
  {
    title: "Fast & Scalable",
    desc: "Lightweight backend, organized code structure and rate-limiting to keep things safe.",
    emoji: "⚡",
  },
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-primary text-black-100 font-pregular">
      {/* Nav */}
      <header className="w-full py-6 px-8 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl neumorphic-flat-xs flex items-center justify-center">
            {/* simple logo placeholder */}
            <span className="text-tertiary-100 font-psemibold text-lg">TH</span>
          </div>
          <div>
            <h1 className="text-lg font-psemibold text-tertiary-100">
              TaskHub
            </h1>
            <p className="text-xs font-plight text-tertiary-100/80">
              Neumorphic task & subscription manager
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            to="/sign-in"
            className="px-4 py-2 neumorphic-cur-in-sm rounded-xl text-sm font-pmedium"
          >
            Sign In
          </Link>
          <Link
            to="/sign-up"
            className="px-4 py-2 neumorphic-cur-out-sm rounded-xl text-sm font-pmedium"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-hbold text-black-100 leading-tight">
            Beautifully simple{" "}
            <span className="text-tertiary-100">task management</span> with a{" "}
            <br />
            delightful neumorphic UI.
          </h2>

          <p className="text-lg font-plight text-black-100/85 max-w-xl">
            SubDub helps you manage tasks and subscriptions with smart
            reminders, a powerful calendar view, and a soft, tactile interface.
            Focus on what matters — we'll take care of the rest.
          </p>

          <div className="flex gap-4 items-center">
            <Link
              to="/sign-up"
              className="px-6 py-3 rounded-2xl neumorphic-cur-out-sm font-pmedium text-black-100 hover:scale-105 transition"
            >
              Create account
            </Link>

            <Link
              to="/sign-in"
              className="px-6 py-3 rounded-2xl neumorphic-flat-sm font-pmedium text-black-100 hover:scale-105 transition"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-6 flex gap-4 flex-wrap">
            <div className="neumorphic-in-xs rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="text-secondary-100 text-xl">✅</span>
              <div>
                <p className="text-sm font-pmedium text-tertiary-100">
                  Secure by design
                </p>
                <p className="text-xs font-plight text-black-100/70">
                  JWT + rate limiting (Arcjet)
                </p>
              </div>
            </div>

            <div className="neumorphic-in-xs rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="text-secondary-100 text-xl">⚡</span>
              <div>
                <p className="text-sm font-pmedium text-tertiary-100">
                  Fast backend
                </p>
                <p className="text-xs font-plight text-black-100/70">
                  Lightweight Express + MongoDB
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Right visual card */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="neumorphic-flat-sm rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl neumorphic-in flex items-center justify-center">
                <span className="text-secondary-200 font-psemibold text-lg">
                  TH
                </span>
              </div>
              <div>
                <p className="text-sm font-pmedium text-tertiary-100">
                  Welcome to TaskHub
                </p>
                <p className="text-xs font-plight text-black-100/70">
                  Track tasks · Get reminders · Stay organized
                </p>
              </div>
            </div>

            <div className="neumorphic-flat-xs rounded-lg px-3 py-2 text-sm font-pmedium text-secondary-200">
              Live Demo
            </div>
          </div>

          {/* mock calendar / tasks preview */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="text-center py-2 font-pmedium text-sm text-primary"
              >
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }).map((_, i) => {
              const day = i + 1;
              return (
                <div
                  key={i}
                  className={`h-20 rounded-xl p-2 flex flex-col justify-between ${
                    day === 8 ? "neumorphic-cur-out" : "neumorphic-in-xs"
                  }`}
                >
                  <div className="text-xs font-plight text-black-100/70">
                    {day}
                  </div>
                  {day % 6 === 0 ? (
                    <div className="text-[0.65rem] font-plight text-tertiary-100 truncate">
                      • Pay rent
                    </div>
                  ) : day % 9 === 0 ? (
                    <div className="text-[0.65rem] font-plight text-secondary-100 truncate">
                      • Demo call
                    </div>
                  ) : (
                    <div className="text-[0.65rem] font-plight text-black-100/50 opacity-0">
                      .
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.aside>
      </main>

      {/* Features grid */}
      <section className="max-w-7xl mx-auto px-8 py-12">
        <h3 className="text-2xl font-pmedium text-tertiary-100 mb-6">
          Why Taskhub
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * idx }}
              className="neumorphic-in-sm rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl neumorphic-flat-xs flex items-center justify-center text-2xl">
                  {f.emoji}
                </div>
                <div>
                  <h4 className="font-psemibold text-tertiary-100">
                    {f.title}
                  </h4>
                  <p className="mt-2 text-sm font-plight text-black-100/75">
                    {f.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-tertiary-100/20 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 neumorphic-flat-xs rounded-xl flex items-center justify-center">
              <span className="font-psemibold text-tertiary-100">TH</span>
            </div>
            <div>
              <p className="font-pmedium text-tertiary-100">TaskHub</p>
              <p className="text-xs font-plight text-black-100/70">
                Built with ❤️ · Neumorphic UI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/sign-in"
              className="text-sm font-pmedium text-tertiary-100"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="text-sm font-pmedium text-tertiary-100"
            >
              Sign Up
            </Link>
            <a href="#" className="text-sm font-plight text-black-100/70">
              Privacy
            </a>
            <a href="#" className="text-sm font-plight text-black-100/70">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
