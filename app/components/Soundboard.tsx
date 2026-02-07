'use client';
import React from "react";

export interface SoundboardButton {
  id: number;
  label: string;
  command?: any;
}

export function Soundboard({ sendCommand }: { sendCommand?: (cmd: any) => void }) {
  const buttons: SoundboardButton[] = [
    { id: 1, label: "SND 1", command: { type: "sound", id: 1 } },
    { id: 2, label: "SND 2", command: { type: "sound", id: 2 } },
    { id: 3, label: "SND 3", command: { type: "sound", id: 3 } },
    { id: 4, label: "SND 4", command: { type: "sound", id: 4 } },
    { id: 5, label: "SND 5", command: { type: "sound", id: 5 } },
    { id: 6, label: "SND 6", command: { type: "sound", id: 6 } },
    { id: 7, label: "SND 7", command: { type: "sound", id: 7 } },
    { id: 8, label: "SND 8", command: { type: "sound", id: 8 } },
  ];

  const handleClick = (cmd?: any) => {
    if (sendCommand && cmd) sendCommand(cmd);
    else console.log("Soundboard click:", cmd);
  };

  return (
    <div className="fixed left-0 bottom-0 w-full bg-black/50 backdrop-blur-sm border-t border-gray-800 z-40">
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="grid grid-cols-8 gap-3">
          {buttons.map((b) => (
            <button
              key={b.id}
              onClick={() => handleClick(b.command)}
              className="w-full h-14 sm:h-16 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-md text-sm sm:text-base flex items-center justify-center"
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}