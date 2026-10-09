import React, { useState, useEffect } from 'react';
import { ArrowLeft, Minus, Plus, Zap, Target } from 'lucide-react';

export default function BuyTicket({ lotteryData, onBack, onOpenNumberPicker }) {
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedNumbers, setSelectedNumbers] = useState([]);

  // Calculate dynamic total price from dynamic DB price
  const unitPrice = lotteryData?.ticketPrice || 6000;
  const totalPrice = unitPrice * ticketCount;

  const handleIncrement = () => setTicketCount((prev) => prev + 1);
  const handleDecrement = () => setTicketCount((prev) => (prev > 1 ? prev - 1 : 1));

  // Quick Pick handler: generates random numbers based on requested ticket count
  const handleQuickPick = () => {
    const totalSlots = lotteryData?.totalTickets || 4000;
    const randomPicks = new Set();
    while (randomPicks.size < ticketCount) {
      const num = Math.floor(Math.random() * totalSlots) + 1;
      randomPicks.add(num);
    }
    setSelectedNumbers(Array.from(randomPicks));
  };

  return (
    <div className="min-h-screen bg-[#0d130e] text-white pb-24 font-sans select-none">
      
      {/* Back Header */}
      <div className="px-4 py-3 flex items-center gap-2">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-300 text-sm hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <main className="px-4 space-y-4">
        
        {/* Dynamic Car Card */}
        <div className="bg-[#121c13] border border-emerald-900/40 rounded-3xl overflow-hidden p-4 shadow-xl">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-gray-800 to-black h-48 mb-3">
            <img 
              src={lotteryData?.imageUrl || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"} 
              alt={lotteryData?.title || "Car"}
              className="w-full h-full object-cover"
            />
            {lotteryData?.isFeatured && (
              <div className="absolute top-3 left-3 bg-amber-500/90 text-black font-bold text-xs px-2.5 py-1 rounded-full">
                🔥 Featured
              </div>
            )}
            <div className="absolute top-3 right-3 text-amber-400 text-xs tracking-widest font-bold">
              ★ 5.0
            </div>
          </div>

          <h2 className="text-xl font-bold text-white">{lotteryData?.title || "BYD Leo Pard 7"}</h2>
          <p className="text-emerald-400 font-semibold text-xs mb-3">{lotteryData?.color || "Black"}</p>

          {/* Dynamic Countdown */}
          <div className="bg-[#0b100c] p-3 rounded-2xl border border-gray-800">
            <p className="text-[11px] text-gray-400 mb-2">🔥 Time Remaining</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'Days', val: '02' },
                { label: 'Hrs', val: '09' },
                { label: 'Min', val: '51' },
                { label: 'Sec', val: '41' }
              ].map((t, i) => (
                <div key={i} className="bg-[#162017] py-1.5 rounded-xl border border-amber-500/20">
                  <span className="text-base font-bold text-amber-400">{t.val}</span>
                  <p className="text-[9px] text-gray-400">{t.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Price & Quantity Adjuster */}
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-xs text-gray-400">Ticket Price</p>
            <p className="text-2xl font-black text-amber-400">
              {totalPrice.toLocaleString()} <span className="text-sm font-semibold">Birr</span>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#162017] border border-gray-800 rounded-2xl p-1.5">
            <button 
              onClick={handleDecrement}
              className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-bold w-6 text-center">{ticketCount}</span>
            <button 
              onClick={handleIncrement}
              className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-black font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Select Numbers Trigger */}
        <button 
          onClick={() => onOpenNumberPicker(ticketCount, selectedNumbers, setSelectedNumbers)}
          className="w-full bg-[#162017] border border-amber-500/60 rounded-2xl p-4 flex items-center justify-between shadow-lg hover:border-amber-400 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center font-bold text-amber-400 text-sm">
              {selectedNumbers.length || 5}
            </div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Target className="w-4 h-4" />
              <span>Select your lucky numbers</span>
            </div>
          </div>
        </button>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button 
            onClick={handleQuickPick}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>Quick Pick</span>
          </button>

          <button 
            disabled={selectedNumbers.length === 0}
            className={`py-3.5 px-4 rounded-2xl font-bold transition shadow-md ${
              selectedNumbers.length > 0 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            Buy Ticket
          </button>
        </div>

      </main>
    </div>
  );
}