"use client";
import { useEffect, useState } from "react";

const CountdownTimer = () => {
  const initialTime = 3 * 24 * 60 * 60; // Countdown from 3 days (in seconds)
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(initialTime); // Reset timer
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Convert seconds to Days, Hours, Minutes, Seconds
  const days = Math.floor(timeLeft / (24 * 60 * 60));
  const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-row items-center justify-center p-6 gap-3">
    <h2 className="text-2xl font-bold">Offer ends </h2>
    <div className="flex gap-3 items-center mt-3 text-4xl font-semibold">
      {/* Days */}
      <div className="flex flex-col items-center justify-center bg-gray-900 h-14 w-14 rounded-full">
        <span className="text-white text-center !text-lg">{days}</span>
      </div>

      <span className="text-xl font-bold">:</span>

      {/* Hours */}
      <div className="flex flex-col items-center justify-center bg-gray-900 h-14 w-14 rounded-full">
        <span className="text-white text-center !text-lg">{hours}</span>
      </div>

      <span className="text-xl font-bold">:</span>

      {/* Minutes */}
      <div className="flex flex-col items-center justify-center bg-gray-900 h-14 w-14 rounded-full">
        <span className="text-white text-center !text-lg">{minutes}</span>
      </div>

      <span className="text-xl font-bold">:</span>

      {/* Seconds */}
      <div className="flex flex-col items-center justify-center bg-gray-900 h-14 w-14 rounded-full">
        <span className="text-white text-center !text-lg">{seconds}</span>
      </div>
    </div>
  </div>
  );
};

export default CountdownTimer;
