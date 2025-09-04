"use client";

import { Plane, MapPin, Mountain } from "lucide-react";
import { useState, useEffect } from "react";

export function Loader({ text = "Loading..." }: { text?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev + 1) % 101);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center space-y-12 p-8">
        {/* Minimal spinning loader */}
        <div className="relative">
          <div className="w-16 h-16 border-2 border-gray-700 rounded-full">
            <div
              className="w-16 h-16 border-2 border-transparent border-t-white rounded-full animate-spin"
              style={{ animationDuration: "1s" }}
            ></div>
          </div>

          {/* Clean icon arrangement */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center space-x-1 opacity-80">
              <Plane className="h-4 w-4 text-white/90" />
              <Mountain className="h-4 w-4 text-white/70" />
              <MapPin className="h-4 w-4 text-white/90" />
            </div>
          </div>
        </div>

        {/* Clean typography */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-medium text-white/95 tracking-wide">
            {text}
          </h2>

          {/* Minimal progress indicator */}
          <div className="flex justify-center">
            <div className="w-48 h-px bg-white/20">
              <div
                className="h-px bg-white/80 transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <p className="text-sm text-white/60 font-light">{progress}%</p>
        </div>
      </div>
    </div>
  );
}
