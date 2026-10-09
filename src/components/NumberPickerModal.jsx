import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function NumberPickerModal({ 
  isOpen, 
  onClose, 
  maxSelectable = 20, 
  takenNumbers = [1, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 27, 28, 31, 33, 34, 35, 36, 37, 39, 40, 41, 42, 43, 44, 45, 46, 49], // fetched from DB
  totalSlots = 4000,
  onConfirmSelection
}) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const toggleNumber = (num) => {
    if (takenNumbers.includes(num)) return; // disabled if taken

    if (selected.includes(num)) {
      setSelected(selected.filter(n => n !== num));
    } else {
      if (selected.length < maxSelectable) {
        setSelected([...selected, num]);
      }
    }
  };

  const padNumber = (num) => String(num).padStart(4, '0');

  // Generate numbers grid
  const allNumbers = Array.from({ length: totalSlots }, (_, i) => i + 1);

  // Optional search filter to jump to specific number fast
  const filteredNumbers = search 
    ? allNumbers.filter(n => padNumber(n).includes(search))
    : allNumbers;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
      <div className="w-full max-w-md bg-[#0f1711] border-t border-gray-800 rounded-t-3xl max-h-[85vh] flex flex-col p-4 shadow-2xl animate-in slide-in-from-bottom">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-white">Select your lucky numbers</h3>
            <p className="text-xs text-gray-400">{selected.length}/{maxSelectable} selected</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 bg-[#1a261c] rounded-full text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs mb-3 font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-400 inline-block"></span>
            <span className="text-gray-300">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-900/60 border border-red-600 inline-block"></span>
            <span className="text-gray-300">Taken</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-black border border-gray-700 inline-block"></span>
            <span className="text-gray-300">Free</span>
          </div>
        </div>

        {/* Quick Search Input */}
        <div className="mb-3">
          <input 
            type="text" 
            placeholder="Search number (e.g. 0047)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#162017] border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Grid Scrollable Area */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-7 gap-1.5 my-2 max-h-[50vh]">
          {filteredNumbers.map((num) => {
            const isTaken = takenNumbers.includes(num);
            const isSelected = selected.includes(num);

            let styleClass = "bg-black text-white border-gray-800"; // Free
            if (isTaken) styleClass = "bg-red-950/40 text-red-400 border-red-800/80 cursor-not-allowed";
            if (isSelected) styleClass = "bg-amber-400 text-black border-amber-300 font-bold shadow-lg scale-105";

            return (
              <button
                key={num}
                disabled={isTaken}
                onClick={() => toggleNumber(num)}
                className={`h-9 border rounded-xl flex items-center justify-center text-[11px] transition font-mono ${styleClass}`}
              >
                {padNumber(num)}
              </button>
            );
          })}
        </div>

        {/* Confirm CTA */}
        <div className="pt-3 border-t border-gray-800">
          <button
            disabled={selected.length === 0}
            onClick={() => {
              onConfirmSelection(selected);
              onClose();
            }}
            className={`w-full py-3.5 rounded-2xl font-bold transition text-sm ${
              selected.length > 0
                ? 'bg-amber-500 text-black hover:bg-amber-400 cursor-pointer shadow-lg'
                : 'bg-[#1d271f] text-gray-500 cursor-not-allowed'
            }`}
          >
            Select Number ({selected.length})
          </button>
        </div>

      </div>
    </div>
  );
}