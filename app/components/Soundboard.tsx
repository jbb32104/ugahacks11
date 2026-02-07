'use client';

import { useState } from 'react';

export interface SoundboardButton {
  id: number;
  label: string;
  onClick: () => void;
}

export function Soundboard() {
  const [buttons, setButtons] = useState<SoundboardButton[]>([
    {
      id: 1,
      label: 'Button 1',
      onClick: () => console.log('Button 1 pressed'),
    },
    {
      id: 2,
      label: 'Button 2',
      onClick: () => console.log('Button 2 pressed'),
    },
    {
      id: 3,
      label: 'Button 3',
      onClick: () => console.log('Button 3 pressed'),
    },
    {
      id: 4,
      label: 'Button 4',
      onClick: () => console.log('Button 4 pressed'),
    },
    {
      id: 5,
      label: 'Button 5',
      onClick: () => console.log('Button 5 pressed'),
    },
    {
      id: 6,
      label: 'Button 6',
      onClick: () => console.log('Button 6 pressed'),
    },
    {
      id: 7,
      label: 'Button 7',
      onClick: () => console.log('Button 7 pressed'),
    },
    {
      id: 8,
      label: 'Button 8',
      onClick: () => console.log('Button 8 pressed'),
    },
  ]);

  // Method to update a button's label
  const setButtonLabel = (id: number, label: string): void => {
    setButtons(buttons.map(btn => btn.id === id ? { ...btn, label } : btn));
  };

  // Method to update a button's function
  const setButtonFunction = (id: number, onClick: () => void): void => {
    setButtons(buttons.map(btn => btn.id === id ? { ...btn, onClick } : btn));
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={button.onClick}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded"
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}