import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import { 
  Bell, Sun, Globe, Ticket, Home as HomeIcon, User, 
  ArrowLeft, Minus, Plus, Zap, Target, X, Phone, ChevronRight,
  Copy, Upload, AlertTriangle, Check, Search, Clock, ShieldCheck, Lock
} from 'lucide-react';

const API_URL = 'https://amiable-determination-production-c638.up.railway.app';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [adminTickets, setAdminTickets] = useState([]);

  const [currentScreen, setCurrentScreen] = useState('home'); 
  const [isNumberPickerOpen, setIsNumberPickerOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [isQuickPick, setIsQuickPick] = useState(false);

  const [lotteries, setLotteries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerId, setCustomerId] = useState('_QIZ10PM');
  const [telegramId, setTelegramId] = useState('');
  const [isSavedToast, setIsSavedToast] = useState(false);

  const [ticketCount, setTicketCount] = useState(1);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [senderAccount, setSenderAccount] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptImage, setReceiptImage] = useState(null);
  const [copiedBank, setCopiedBank] = useState('');
  const [submittedOrderId, setSubmittedOrderId] = useState('');

  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const [userTickets, setUserTickets] = useState([]);

  const fallbackLottery = {
    _id: '65e48f12a1b2c3d4e5f67890',
    title: '6 Gech EV Makina Equb',
    color: 'Black',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    ticketPrice: 6000,
    totalTickets: 4000,
    soldTickets: 0,
    remainingTickets: 4000,
    takenNumbers: [],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isFeatured: true
  };

  const lotteryData = lotteries.length > 0 ? lotteries[0] : fallbackLottery;
  const takenNumbers = lotteryData.takenNumbers || [];

  const bankAccounts = [
    { name: 'Tele Birr', holder: 'Getachew Fikadu Jirata', account: '0999972486' },
    { name: 'Commercial Bank of Ethiopia', holder: 'Getachew Fikadu Jirata', account: '1000804500573' },
    { name: 'BOA', holder: 'Getachew Fikadu Jirata', account: '269980524' },
    { name: 'Awash Bank', holder: 'Getachew Fikadu Jirata', account: '013201821568800' }
  ];

  const totalPrice = lotteryData.ticketPrice * ticketCount;

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      const user = tg.initDataUnsafe?.user;
      if (user && user.id) {
        const tId = String(user.id);
        setTelegramId(tId);
        setCustomerId('_' + tId.slice(-7).toUpperCase());

        fetch(`${API_URL}/api/users/${tId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.user) {
              if (data.user.phoneNumber) setPhoneNumber(data.user.phoneNumber);
              if (data.user.firstName) setFullName(data.user.firstName);
            }
          })
          .catch(err => console.log('Error fetching user profile'));
      }
    }
  }, []);

  useEffect(() => {
    if (!telegramId && !phoneNumber) return;
    const queryParam = telegramId 
      ? `telegramId=${encodeURIComponent(telegramId)}` 
      : `phoneNumber=${encodeURIComponent(phoneNumber)}`;

    fetch(`${API_URL}/api/tickets/user-tickets?${queryParam}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.tickets) {
          const mappedTickets = data.tickets.map(t => ({
            id: `#${t.selectedNumbers?.[0] || '2'}`,
            title: lotteryData.title,
            date: new Date(t.createdAt).toLocaleDateString('en-US'),
            status: t.status,
            statusText: t.status === 'APPROVED' ? '✅ Approved by Admin' : t.status === 'REJECTED' ? '❌ Payment Rejected' : '⌛ Waiting for admin payment approval',
            imageUrl: lotteryData.imageUrl
          }));
          setUserTickets(mappedTickets);
        }
      })
      .catch(err => console.log('Error fetching user tickets'));
  }, [telegramId, phoneNumber, lotteryData.title, lotteryData.imageUrl]);

  useEffect(() => {
    const updateCountdown = () => {
      const targetDate = lotteryData.endDate ? new Date(lotteryData.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const now = new Date().getTime();
      const end = targetDate.getTime();
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: String(days).padStart(2, '0'),
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0')
        });
      } else {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lotteryData]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUsername === 'admin' && adminPassword === 'gech2026') {
      setIsAdminLoggedIn(true);
      setShowLoginModal(false);
      setIsAdminView(true);
      setLoginError('');
      setAdminUsername('');
      setAdminPassword('');
      fetchAdminTickets();
    } else {
      setLoginError('Invalid admin username or password!');
    }
  };

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setIsAdminView(true);
      fetchAdminTickets();
    } else {
      setShowLoginModal(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setIsAdminView(false);
  };

  const fetchLotteries = () => {
    fetch(`${API_URL}/api/lotteries`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.lotteries.length > 0) {
          setLotteries(data.lotteries);
        }
      })
      .catch(err => console.log('Using local fallback lottery data'));
  };

  useEffect(() => {
    fetchLotteries();
  }, []);

  const fetchAdminTickets = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/tickets`);
      const data = await res.json();
      if (data.success) setAdminTickets(data.tickets);
    } catch (err) {
      console.error('Error fetching admin tickets:', err);
    }
  };

  const handleAddLottery = async (newCarData) => {
    try {
      const res = await fetch(`${API_URL}/api/lotteries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCarData)
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ New Car Lottery published to database!');
        fetchLotteries();
      }
    } catch (err) {
      console.error('Failed to create lottery:', err);
    }
  };

  const handleApprove = async (orderId) => {
    try {
      await fetch(`${API_URL}/api/admin/tickets/${orderId}/approve`, { method: 'PATCH' });
      fetchAdminTickets();
      fetchLotteries(); 
    } catch (err) {
      console.error('Error approving ticket:', err);
    }
  };

  const handleReject = async (orderId) => {
    try {
      await fetch(`${API_URL}/api/admin/tickets/${orderId}/reject`, { method: 'PATCH' });
      fetchAdminTickets();
    } catch (err) {
      console.error('Error rejecting ticket:', err);
    }
  };

  const fetchUserTickets = () => {
    if (!phoneNumber) return;
    fetch(`${API_URL}/api/tickets/user-tickets?phoneNumber=${encodeURIComponent(phoneNumber)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.tickets.length > 0) {
          const mappedTickets = data.tickets.map(t => ({
            id: `#${t.selectedNumbers?.[0] || '2'}`,
            title: lotteryData.title,
            date: new Date(t.createdAt).toLocaleDateString('en-US'),
            status: t.status,
            statusText: t.status === 'APPROVED' ? '✅ Approved by Admin' : t.status === 'REJECTED' ? '❌ Payment Rejected' : '⌛ Waiting for admin payment approval',
            imageUrl: lotteryData.imageUrl
          }));
          setUserTickets(mappedTickets);
        } else {
          setUserTickets([]);
        }
      })
      .catch(err => console.log('Using local user tickets state'));
  };

  const toggleNumber = (num) => {
    const numericNum = Number(num);
    const formattedTaken = takenNumbers.map(n => Number(n));
    if (formattedTaken.includes(numericNum)) return;

    if (selectedNumbers.includes(numericNum)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== numericNum));
    } else {
      if (selectedNumbers.length < ticketCount) {
        setSelectedNumbers([...selectedNumbers, numericNum]);
      } else {
        alert(`You have selected maximum tickets (${ticketCount}) for this purchase. Change quantity above to pick more.`);
      }
    }
  };

  const padNumber = (num) => String(num).padStart(4, '0');

  const handleCopy = (acc) => {
    navigator.clipboard.writeText(acc);
    setCopiedBank(acc);
    setTimeout(() => setCopiedBank(''), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setReceiptImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleQuickPick = () => {
    fetchLotteries();
    setIsQuickPick(true);
    const formattedTaken = takenNumbers.map(n => Number(n));
    const availableNumbers = Array.from({ length: 4000 }, (_, i) => i + 1).filter(n => !formattedTaken.includes(n));
    
    const picks = [];
    for (let i = 0; i < ticketCount; i++) {
      if (availableNumbers.length === 0) break;
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      picks.push(availableNumbers.splice(randomIndex, 1)[0]);
    }
    
    setSelectedNumbers(picks);
    setCheckoutStep(1);
  };

  // 💾 Save profile to DB and proceed to payment
  const handleSaveProfileAndContinue = async () => {
    if (!fullName.trim() || !phoneNumber.trim()) return;
    
    if (telegramId) {
      try {
        await fetch(`${API_URL}/api/users/${telegramId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, phoneNumber })
        });
      } catch (e) {
        console.error('Failed to sync profile', e);
      }
    }
    setCheckoutStep(2);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('lotteryId', lotteryData._id || '65e48f12a1b2c3d4e5f67890');
    formData.append('telegramId', telegramId || customerId);
    formData.append('fullName', fullName);
    formData.append('phoneNumber', phoneNumber);
    formData.append('selectedNumbers', JSON.stringify(selectedNumbers));
    formData.append('isQuickPick', isQuickPick);
    formData.append('ticketCount', ticketCount);
    formData.append('totalPrice', totalPrice);
    formData.append('senderAccount', senderAccount);
    if (receiptFile) formData.append('receipt', receiptFile);

    try {
      const res = await fetch(`${API_URL}/api/tickets/order`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedOrderId(data.orderId);
      } else {
        setSubmittedOrderId('swCX' + Math.random().toString(36).substring(2, 8) + 'JT');
      }
    } catch (err) {
      console.error('API submission failed:', err);
      setSubmittedOrderId('swCX' + Math.random().toString(36).substring(2, 8) + 'JT');
    } finally {
      setIsSubmitting(false);
      const newTicket = {
        id: `#${selectedNumbers[0] || 2}`,
        title: lotteryData.title,
        date: new Date().toLocaleDateString('en-US'),
        status: 'PENDING REVIEW',
        statusText: '⌛ Waiting for admin payment approval',
        imageUrl: lotteryData.imageUrl
      };
      setUserTickets([newTicket, ...userTickets]);
      setCheckoutStep(4);
      fetchLotteries();
    }
  };

  const resetOrder = () => {
    setCheckoutStep(0);
    setIsQuickPick(false);
    setSelectedNumbers([]);
    setReceiptFile(null);
    setReceiptImage(null);
    setSenderAccount('');
  };

  const handleSavePhoneManual = async () => {
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);

    if (telegramId) {
      try {
        await fetch(`${API_URL}/api/users/${telegramId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber, fullName })
        });
      } catch (e) {
        console.error('Failed to update phone on backend', e);
      }
    }
  };

  if (isAdminView) {
    return (
      <div className="min-h-screen bg-[#080d09]">
        <div className="p-3 bg-[#0d130e] border-b border-gray-800 flex justify-between items-center max-w-4xl mx-auto px-4">
          <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Admin Console
          </span>
          <div className="flex gap-2">
            <button onClick={() => setIsAdminView(false)} className="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition">← User View</button>
            <button onClick={handleAdminLogout} className="px-3.5 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 rounded-xl text-xs font-bold transition">Logout</button>
          </div>
        </div>
        <AdminDashboard tickets={adminTickets} onApprove={handleApprove} onReject={handleReject} onAddLottery={handleAddLottery} apiUrl={API_URL} />
      </div>
    );
  }

  const activeCount = userTickets.filter(t => t.status === 'APPROVED' || t.status === 'ACTIVE').length;
  const pendingCount = userTickets.filter(t => t.status === 'PENDING REVIEW').length;
  const totalCount = userTickets.length;
  const soldCount = lotteryData.soldTickets || 0;
  const totalTickets = lotteryData.totalTickets || 4000;
  const fillPercentage = Math.round((soldCount / totalTickets) * 100);

  return (
    <div className="min-h-screen bg-[#0d130e] text-white font-sans select-none pb-24 max-w-md mx-auto relative border-x border-gray-900">
      
      <header className="flex items-center justify-between px-4 py-3 bg-[#0d130e] sticky top-0 z-10 border-b border-gray-900">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">🏆</div>
          <span className="font-semibold text-amber-400 text-sm">Getachew Fikadu</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleOpenAdmin} className="px-2.5 py-1 bg-amber-500 text-black text-xs font-bold rounded-xl hover:bg-amber-400 transition flex items-center gap-1">
            <Lock className="w-3 h-3" /> Admin
          </button>
        </div>
      </header>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101811] border border-amber-500/40 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><ShieldCheck className="text-amber-400 w-5 h-5" /> Admin Portal</h3>
              <button onClick={() => setShowLoginModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-3">
              {loginError && <p className="text-xs text-red-400 bg-red-950/50 p-2.5 rounded-xl border border-red-800/80 font-semibold text-center">{loginError}</p>}
              <div>
                <label className="text-xs font-semibold text-gray-300">Username</label>
                <input type="text" placeholder="Enter admin username" required value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} className="w-full mt-1 bg-[#162218] border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-300">Password</label>
                <input type="password" placeholder="••••••••" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full mt-1 bg-[#162218] border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-2xl text-sm transition mt-2">Authenticate</button>
            </form>
          </div>
        </div>
      )}

      {currentScreen === 'home' && (
        <main className="px-4 pt-3 space-y-4">
          <div className="bg-[#121c13] border border-emerald-900/40 rounded-3xl overflow-hidden p-4 shadow-xl">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-gray-800 to-black h-48 mb-4">
              <img src={lotteryData.imageUrl} alt={lotteryData.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-amber-500/90 text-black font-bold text-xs px-2.5 py-1 rounded-full">🔥 Featured</div>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">{lotteryData.title}</h2>
            <p className="text-emerald-400 font-semibold text-sm mb-3">{lotteryData.color}</p>

            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white">{soldCount} sold</span>
                <span className="text-emerald-400">{fillPercentage}% filled</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${fillPercentage}%` }}></div>
              </div>
            </div>

            <button onClick={() => setCurrentScreen('buy')} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-base py-3.5 px-5 rounded-2xl shadow-lg flex items-center justify-center gap-2">
              <span>Buy Ticket</span>
            </button>
          </div>
        </main>
      )}

      {currentScreen === 'buy' && (
        <main className="px-4 pt-3 space-y-4">
          <button onClick={() => setCurrentScreen('home')} className="flex items-center gap-1 text-gray-300 text-sm mb-2 hover:text-white"><ArrowLeft className="w-4 h-4" /> Back</button>

          <div className="bg-[#121c13] border border-emerald-900/40 rounded-3xl overflow-hidden p-4 shadow-xl">
            <h2 className="text-xl font-bold text-white">{lotteryData.title}</h2>
            <p className="text-emerald-400 font-semibold text-xs">{lotteryData.color}</p>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs text-gray-400">Ticket Price</p>
              <p className="text-2xl font-black text-amber-400">{totalPrice.toLocaleString()} <span className="text-sm font-semibold">Birr</span></p>
            </div>
            <div className="flex items-center gap-3 bg-[#162017] border border-gray-800 rounded-2xl p-1.5">
              <button onClick={() => {
                const newCount = Math.max(1, ticketCount - 1);
                setTicketCount(newCount);
                if (selectedNumbers.length > newCount) setSelectedNumbers(selectedNumbers.slice(0, newCount));
              }} className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center"><Minus className="w-4 h-4" /></button>
              <span className="text-lg font-bold w-6 text-center">{ticketCount}</span>
              <button onClick={() => setTicketCount(ticketCount + 1)} className="w-9 h-9 rounded-xl bg-amber-500 text-black font-bold flex items-center justify-center"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          <button onClick={() => { setIsQuickPick(false); fetchLotteries(); setIsNumberPickerOpen(true); }} className="w-full bg-[#162017] border border-amber-500/60 rounded-2xl p-4 flex items-center justify-between hover:border-amber-400 transition">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Target className="w-4 h-4" /> Select your lucky numbers ({selectedNumbers.length}/{ticketCount})
            </div>
          </button>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={handleQuickPick} className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-1.5">
              <Zap className="w-4 h-4 fill-black" /> Quick Pick
            </button>
            <button disabled={selectedNumbers.length !== ticketCount} onClick={() => { setIsQuickPick(false); setCheckoutStep(1); }} className={`py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition ${selectedNumbers.length === ticketCount ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
              <span>Buy Ticket</span>
            </button>
          </div>
        </main>
      )}

      {currentScreen === 'tickets' && (
        <main className="px-4 pt-3 space-y-4">
          <h2 className="text-xl font-bold text-white">My Tickets</h2>
          <div className="flex gap-2">
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter phone number" className="w-2/3 bg-[#162218] border border-gray-800 rounded-2xl px-3 py-2 text-xs text-white" />
            <button onClick={fetchUserTickets} className="bg-amber-500 text-black font-bold text-xs px-4 rounded-2xl"><Search className="w-4 h-4" /></button>
          </div>
          <div className="pt-2 space-y-3">
            {userTickets.map((ticket, idx) => (
              <div key={idx} className="bg-[#121e14] border border-gray-800/80 rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{ticket.title}</h4>
                    <p className="text-xs font-bold text-amber-400">{ticket.id}</p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400">{ticket.status}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {currentScreen === 'profile' && (
        <main className="px-4 pt-3 space-y-4">
          <div className="bg-[#121e14] border border-gray-800/80 rounded-2xl p-4 space-y-3">
            <div>
              <label className="text-xs text-gray-400">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your Name" className="w-full mt-1 bg-[#162218] border border-gray-800 rounded-xl p-3 text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-400">Phone Number</label>
              <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+251..." className="w-full mt-1 bg-[#162218] border border-gray-800 rounded-xl p-3 text-sm text-white" />
            </div>
            <button onClick={handleSavePhoneManual} className="w-full py-3 bg-amber-500 text-black font-bold rounded-xl text-sm">Save Profile</button>
            {isSavedToast && <p className="text-xs text-emerald-400 text-center font-semibold">✓ Saved successfully!</p>}
          </div>
        </main>
      )}

      {/* NUMBER PICKER MODAL */}
      {isNumberPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-md bg-[#0f1711] border-t border-gray-800 rounded-t-3xl max-h-[85vh] flex flex-col p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-white">Select your lucky numbers</h3>
                <p className="text-xs text-amber-400 font-semibold">{selectedNumbers.length} of {ticketCount} selected</p>
              </div>
              <button onClick={() => setIsNumberPickerOpen(false)} className="p-1.5 bg-[#1a261c] rounded-full text-gray-400"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-7 gap-1.5 my-2 max-h-[50vh]">
              {Array.from({ length: 4000 }, (_, i) => i + 1).map((num) => {
                const numericNum = Number(num);
                const formattedTaken = takenNumbers.map(n => Number(n));
                const isTaken = formattedTaken.includes(numericNum);
                const isSelected = selectedNumbers.includes(numericNum);

                let cls = "bg-black text-white border-gray-800";
                if (isTaken) cls = "bg-red-950/60 text-red-400/80 border-red-900/60 cursor-not-allowed opacity-60";
                if (isSelected) cls = "bg-amber-400 text-black border-amber-300 font-bold shadow-lg";

                return (
                  <button key={num} disabled={isTaken} onClick={() => toggleNumber(numericNum)} className={`h-9 border rounded-xl flex items-center justify-center text-[11px] font-mono transition ${cls}`}>
                    {padNumber(numericNum)}
                  </button>
                );
              })}
            </div>

            <button disabled={selectedNumbers.length !== ticketCount} onClick={() => setIsNumberPickerOpen(false)} className={`w-full py-3.5 rounded-2xl font-bold transition ${selectedNumbers.length === ticketCount ? 'bg-emerald-500 text-white' : 'bg-emerald-900/40 text-emerald-300/40 cursor-not-allowed'}`}>
              Done
            </button>
          </div>
        </div>
      )}

      {/* CHECKOUT FLOW WITH EDITABLE NAME & PHONE */}
      {checkoutStep > 0 && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-md bg-[#0d150f] border-t border-gray-800 rounded-t-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            
            {checkoutStep === 1 && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Enter Contact Info</h3>
                  <button onClick={resetOrder} className="p-1.5 bg-[#162218] rounded-full text-gray-400"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
                    <input type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[#162218] border border-gray-800 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number</label>
                    <input type="text" placeholder="+251..." value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-[#162218] border border-gray-800 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500" />
                  </div>
                </div>

                <button disabled={!fullName.trim() || !phoneNumber.trim()} onClick={handleSaveProfileAndContinue} className={`w-full py-4 rounded-2xl font-bold transition ${fullName.trim() && phoneNumber.trim() ? 'bg-amber-500 text-black' : 'bg-amber-500/50 text-black/50 cursor-not-allowed'}`}>
                  Continue to Payment
                </button>
              </>
            )}

            {checkoutStep === 2 && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Payment</h3>
                  <button onClick={resetOrder} className="p-1.5 bg-[#162218] rounded-full text-gray-400"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                  {bankAccounts.map((b, i) => (
                    <div key={i} className="bg-[#121e14] border border-gray-800/80 rounded-2xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">{b.name}</p>
                        <p className="text-[10px] text-gray-400">{b.account}</p>
                      </div>
                      <button onClick={() => handleCopy(b.account)} className="bg-[#1a261c] text-gray-200 px-2.5 py-1.5 rounded-xl text-xs">
                        {copiedBank === b.account ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="relative border-2 border-dashed border-amber-500/40 bg-[#121e14] rounded-2xl p-5 text-center cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  {receiptImage ? <p className="text-xs text-emerald-400 font-semibold">✓ Receipt Attached</p> : <p className="text-xs font-bold text-white">Tap to upload payment receipt</p>}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={() => setCheckoutStep(1)} className="py-3.5 bg-[#162218] text-white font-bold rounded-2xl text-sm">Back</button>
                  <button onClick={() => setCheckoutStep(3)} className="py-3.5 bg-amber-500 text-black font-bold rounded-2xl text-sm">Continue</button>
                </div>
              </>
            )}

            {checkoutStep === 3 && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Review Order</h3>
                  <button onClick={resetOrder} className="p-1.5 bg-[#162218] rounded-full text-gray-400"><X className="w-5 h-5" /></button>
                </div>

                <div className="bg-[#121e14] border border-gray-800/80 rounded-2xl p-4 space-y-2 text-xs">
                  <p><b>Name:</b> {fullName}</p>
                  <p><b>Phone:</b> {phoneNumber}</p>
                  <p><b>Total:</b> {totalPrice.toLocaleString()} Birr</p>
                </div>

                <button disabled={isSubmitting} onClick={handleFinalSubmit} className="w-full py-3.5 bg-amber-500 text-black font-bold rounded-2xl text-sm">
                  {isSubmitting ? 'Submitting...' : 'Submit Order'}
                </button>
              </>
            )}

            {checkoutStep === 4 && (
              <div className="py-4 text-center space-y-5">
                <h3 className="text-2xl font-bold text-white">Order Sent!</h3>
                <p className="text-xs text-gray-400">Order <span className="text-gray-200 font-mono font-bold">#{submittedOrderId}</span> submitted successfully.</p>
                <button onClick={() => { resetOrder(); setCurrentScreen('tickets'); }} className="w-full py-4 bg-[#b5e054] text-black font-bold rounded-2xl text-sm">View My Tickets</button>
              </div>
            )}

          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0d130e]/95 backdrop-blur-md border-t border-gray-800 py-2.5 px-6 flex justify-around items-center z-20">
        <button onClick={() => setCurrentScreen('home')} className={`flex flex-col items-center gap-1 ${currentScreen === 'home' ? 'text-amber-400 font-semibold' : 'text-gray-400'}`}>
          <HomeIcon className="w-5 h-5" /><span className="text-[11px]">Home</span>
        </button>
        <button onClick={() => setCurrentScreen('tickets')} className={`flex flex-col items-center gap-1 ${currentScreen === 'tickets' ? 'text-amber-400 font-semibold' : 'text-gray-400'}`}>
          <Ticket className="w-5 h-5" /><span className="text-[11px]">Tickets</span>
        </button>
        <button onClick={() => setCurrentScreen('profile')} className={`flex flex-col items-center gap-1 ${currentScreen === 'profile' ? 'text-amber-400 font-semibold' : 'text-gray-400'}`}>
          <User className="w-5 h-5" /><span className="text-[11px]">Profile</span>
        </button>
      </nav>
    </div>
  );
}