import React, { useState } from 'react';
import { X, User, Phone, ChevronRight } from 'lucide-react';

export default function CheckoutModalStep1({ 
  isOpen, 
  onClose, 
  lotteryData, 
  ticketCount = 1, 
  userPhoneNumber = "+251954341033", // Auto-fetched from Telegram Web App context
  onNext 
}) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(userPhoneNumber);

  if (!isOpen) return null;

  const unitPrice = lotteryData?.ticketPrice || 6000;
  const totalPrice = unitPrice * ticketCount;
  const title = lotteryData?.title || '6 Gech EV Makina Equb';

  const handleContinue = () => {
    if (!fullName.trim()) return;
    onNext({ fullName, phoneNumber, totalPrice, ticketCount });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
      <div className="w-full max-w-md bg-[#0d150f] border-t border-gray-800 rounded-t-3xl p-5 shadow-2xl flex flex-col space-y-4 animate-in slide-in-from-bottom">
        
        {/* Header & Step Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Confirm your order</h3>
              <p className="text-xs text-gray-400">Step 1 of 3</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 bg-[#162218] rounded-full text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 3 Step Progress Bar */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="h-1.5 bg-amber-500 rounded-full"></div>
            <div className="h-1.5 bg-gray-800 rounded-full"></div>
            <div className="h-1.5 bg-gray-800 rounded-full"></div>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="bg-[#121e14] border border-emerald-900/30 rounded-2xl p-4 space-y-2">
          <h4 className="text-lg font-bold text-white">{title}</h4>
          <p className="text-xs text-gray-400">
            {ticketCount} tickets × {unitPrice.toLocaleString()} Birr
          </p>
          <div className="text-2xl font-black text-amber-400">
            {totalPrice.toLocaleString()} Birr
          </div>
          <div className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-semibold px-3 py-1 rounded-full">
            Random numbers will be assigned
          </div>
        </div>

        {/* User Information Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#162218] border border-gray-800 rounded-2xl py-3.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number</label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-[#162218] border border-gray-800 rounded-2xl py-3.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="pt-2">
          <button
            onClick={handleContinue}
            disabled={!fullName.trim()}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-base transition ${
              fullName.trim()
                ? 'bg-amber-500 text-black hover:bg-amber-400 cursor-pointer shadow-lg'
                : 'bg-amber-500/50 text-black/50 cursor-not-allowed'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-xs">8</span>
            <span>Continue</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}