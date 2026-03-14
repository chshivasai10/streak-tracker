"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [dates, setDates] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [lastStudied, setLastStudied] = useState("None");

  useEffect(() => {
    const data = localStorage.getItem("studyDates");

    if (data) {
      const parsed = JSON.parse(data);
      setDates(parsed);
      setLastStudied(parsed[parsed.length - 1]);
      calculateStreak(parsed);
    }
  }, []);

  const calculateStreak = (list: string[]) => {
    if (list.length === 0) return;

    let count = 1;

    for (let i = list.length - 1; i > 0; i--) {
      const current = new Date(list[i]);
      const previous = new Date(list[i - 1]);

      const diff =
        (current.getTime() - previous.getTime()) /
        (1000 * 60 * 60 * 24);

      if (diff === 1) count++;
      else break;
    }

    setStreak(count);
  };

  const markStudy = () => {
    const today = new Date().toDateString();
    const data = localStorage.getItem("studyDates");

    let stored = data ? JSON.parse(data) : [];

    if (stored.includes(today)) {
      alert("You already marked today!");
      return;
    }

    stored.push(today);

    localStorage.setItem("studyDates", JSON.stringify(stored));

    setDates(stored);
    setLastStudied(today);
    calculateStreak(stored);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      
      <div className="bg-white w-[420px] rounded-2xl shadow-xl p-8">

        <h1 className="text-4xl font-extrabold text-black text-center mb-8">
          Daily Learning Streak
        </h1>

        {/* Stats */}
        <div className="space-y-5 text-xl text-black">

          <div className="flex justify-between font-bold bg-gray-100 p-4 rounded-lg">
            <span>🔥 Current Streak</span>
            <span>{streak} days</span>
          </div>

          <div className="flex justify-between font-bold bg-gray-100 p-4 rounded-lg">
            <span>📚 Total Study Days</span>
            <span>{dates.length}</span>
          </div>

          <div className="flex justify-between font-bold bg-gray-100 p-4 rounded-lg">
            <span>📅 Last Studied</span>
            <span>{lastStudied}</span>
          </div>

        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <p className="text-sm font-semibold mb-2 text-gray-700">
            Weekly Goal Progress
          </p>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${Math.min((streak / 7) * 100, 100)}%` }}
            ></div>
          </div>

          <p className="text-sm mt-1 text-gray-600">
            {streak}/7 day goal
          </p>
        </div>

        {/* Button */}
        <button
          onClick={markStudy}
          className="mt-8 w-full py-3 text-lg font-bold text-white rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition"
        >
          I Studied Today
        </button>

        {/* History */}
        <h2 className="text-2xl font-extrabold text-black text-center mt-10 mb-4">
          Study History
        </h2>

        <ul className="space-y-3 max-h-40 overflow-y-auto">
          {dates.length === 0 ? (
            <p className="text-center text-gray-500">No study history yet</p>
          ) : (
            dates
              .slice()
              .reverse()
              .map((date, index) => (
                <li
                  key={index}
                  className="bg-gray-200 p-3 rounded-lg text-center font-semibold"
                >
                  {date}
                </li>
              ))
          )}
        </ul>

      </div>

    </main>
  );
}