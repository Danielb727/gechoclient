import React, { useState, useEffect } from 'react';
import { Bell, Sun, Globe, Ticket, Home as HomeIcon, User } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('all');
  const [activeNav, setActiveNav] = useState('home');

  // Static countdown timer state for demo
  const [timeLeft, setTimeLeft] = useState({
    days: '02',
    hours: '09',
    minutes: '59',
    seconds: '37'
  });

  return (
    <div className="min-h-screen bg-[#0d130e] text-white pb-24 font-sans select-none">
      
      {/* 1. Header Bar */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#0d130e] sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
            🏆
          </div>
          <span className="font-semibold text-amber-400 text-sm">Getachew Fikadu</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-[#162017] border border-gray-700/60 rounded-xl px-2.5 py-1 text-xs text-gray-200">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            <select className="bg-transparent text-xs text-white focus:outline-none cursor-pointer">
              <option value="en">English</option>
              <option value="am">አማርኛ</option>
              <option value="or">Afaan Oromo</option>
            </select>
          </div>

          {/* Notifications */}
          <button className="relative p-2 bg-[#162017] border border-gray-700/60 rounded-xl text-gray-300">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          <button className="p-2 bg-[#162017] border border-gray-700/60 rounded-xl text-gray-300">
            <Sun className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4 pt-2 space-y-4">
        
        {/* 2. Featured Lottery Hero Card */}
        <div className="bg-[#121c13] border border-emerald-900/40 rounded-3xl overflow-hidden p-4 shadow-xl">
          
          {/* Image & Top Badges Container */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-gray-800 to-black h-48 mb-4">
            <img 
              src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800" 
              alt="BYD Leo Pard 7"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-amber-500/90 text-black font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              🔥 Featured
            </div>
            <div className="absolute top-3 right-3 text-amber-400 text-xs tracking-widest">
              ★★★★★
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white tracking-wide">BYD Leo Pard 7</h2>
          <p className="text-emerald-400 font-semibold text-sm mb-3">Black</p>

          {/* Countdown Timer */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
              ⏱ Time Remaining
            </p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hrs', value: timeLeft.hours },
                { label: 'Min', value: timeLeft.minutes },
                { label: 'Sec', value: timeLeft.seconds }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#0b100c] border border-amber-500/30 rounded-xl py-2">
                  <div className="text-xl font-bold text-amber-400">{item.value}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar & Stats */}
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white">3,070 <span className="text-gray-400 font-normal">sold</span></span>
              <span className="text-emerald-400">77% filled</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '77%' }}></div>
            </div>
            <p className="text-xs text-gray-400">922 tickets remaining</p>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 bg-[#0b100c] px-3 py-2 rounded-2xl border border-gray-800">
              <div className="p-1.5 bg-gray-800 rounded-xl text-gray-400">👥</div>
              <div>
                <p className="text-[10px] text-gray-400">Participants</p>
                <p className="text-sm font-bold text-white">3,070</p>
              </div>
            </div>

            <button className="flex-1 bg-amber-500 hover:bg-amber-400 active:scale-95 transition text-black font-bold text-base py-3 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-xs">4</span>
              Buy Ticket
            </button>
          </div>
        </div>

        {/* 3. Category Filter Pills */}
        <div className="flex gap-2 pt-2">
          {[
            { id: 'all', label: '✨ All' },
            { id: 'featured', label: '🔥 Featured' },
            { id: 'new', label: '📈 New' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-[#162017] text-gray-300 border border-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4. Ongoing Raffles Section */}
        <div className="pt-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-white">Ongoing raffles</h3>
            <span className="text-xs text-gray-400">0 available</span>
          </div>

          <div className="flex flex-col items-center justify-center py-10 bg-[#121c13]/50 border border-dashed border-gray-800 rounded-2xl text-center px-4">
            <Ticket className="w-10 h-10 text-gray-600 mb-2 stroke-1" />
            <p className="text-sm font-semibold text-gray-300">No other active lotteries</p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Add another lottery from admin panel to show it here.
            </p>
          </div>
        </div>
      </main>

      {/* 5. Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0d130e]/95 backdrop-blur-md border-t border-gray-800/80 py-2 px-6 flex justify-around items-center z-20">
        <button 
          onClick={() => setActiveNav('home')}
          className={`flex flex-col items-center gap-1 ${
            activeNav === 'home' ? 'text-amber-400 font-semibold' : 'text-gray-400'
          }`}
        >
          <HomeIcon className="w-5 h-5" />
          <span className="text-[11px]">Home</span>
        </button>

        <button 
          onClick={() => setActiveNav('tickets')}
          className={`flex flex-col items-center gap-1 ${
            activeNav === 'tickets' ? 'text-amber-400 font-semibold' : 'text-gray-400'
          }`}
        >
          <Ticket className="w-5 h-5" />
          <span className="text-[11px]">Tickets</span>
        </button>

        <button 
          onClick={() => setActiveNav('profile')}
          className={`flex flex-col items-center gap-1 ${
            activeNav === 'profile' ? 'text-amber-400 font-semibold' : 'text-gray-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[11px]">Profile</span>
        </button>
      </nav>
    </div>
  );
}