import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Edit2, Calculator, Sparkles, Clock, Crown, X } from 'lucide-react';

export default function App() {
  const [countdowns, setCountdowns] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentView, setCurrentView] = useState('countdowns');
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: 'personal'
  });

  const [calcDate1, setCalcDate1] = useState('');
  const [calcDate2, setCalcDate2] = useState('');
  const [calcResult, setCalcResult] = useState(null);
  const [pricing, setPricing] = useState({ currency: 'USD', symbol: '$', price: '3.99' });

  const FREE_LIMIT = 5;

  useEffect(() => {
    const saved = localStorage.getItem('countdowns');
    if (saved) {
      setCountdowns(JSON.parse(saved));
    }
    const premium = localStorage.getItem('isPremium');
    if (premium === 'true') {
      setIsPremium(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
  }, [countdowns]);

  useEffect(() => {
    if (!isPremium) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [isPremium, countdowns]);

  useEffect(() => {
    const detectCurrency = () => {
      const locale = navigator.language || navigator.userLanguage;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      if (locale.includes('en-GB') || timezone.includes('London') || timezone.includes('Europe/London')) {
        return { currency: 'GBP', symbol: '£', price: '2.99' };
      }
      
      const euTimezones = ['Europe/Paris', 'Europe/Berlin', 'Europe/Madrid', 'Europe/Rome', 'Europe/Amsterdam', 'Europe/Brussels', 'Europe/Vienna', 'Europe/Stockholm', 'Europe/Copenhagen', 'Europe/Helsinki', 'Europe/Athens', 'Europe/Lisbon', 'Europe/Dublin', 'Europe/Prague', 'Europe/Warsaw', 'Europe/Budapest'];
      const euLocales = ['fr', 'de', 'es', 'it', 'nl', 'pt', 'pl', 'ro', 'el', 'cs', 'sv', 'da', 'fi', 'bg', 'hr', 'sk', 'lt', 'lv', 'et', 'sl', 'mt'];
      
      if (euTimezones.some(tz => timezone.includes(tz)) || euLocales.some(loc => locale.includes(loc))) {
        return { currency: 'EUR', symbol: '€', price: '3.49' };
      }
      
      return { currency: 'USD', symbol: '$', price: '3.99' };
    };
    
    setPricing(detectCurrency());
  }, []);

  const calculateDaysBetween = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateDaysTo = (targetDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.date) return;

    if (!editingId && !isPremium && countdowns.length >= FREE_LIMIT) {
      setShowLimitModal(true);
      return;
    }

    if (editingId) {
      setCountdowns(countdowns.map(cd => 
        cd.id === editingId ? { ...formData, id: editingId } : cd
      ));
      setEditingId(null);
    } else {
      const newCountdown = {
        ...formData,
        id: Date.now()
      };
      setCountdowns([...countdowns, newCountdown]);
    }

    setFormData({ title: '', date: '', category: 'personal' });
    setShowAddForm(false);
  };

  const handleEdit = (countdown) => {
    setFormData({
      title: countdown.title,
      date: countdown.date,
      category: countdown.category
    });
    setEditingId(countdown.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    setCountdowns(countdowns.filter(cd => cd.id !== id));
  };

  const handleCalculate = () => {
    if (!calcDate1 || !calcDate2) return;
    const days = calculateDaysBetween(calcDate1, calcDate2);
    setCalcResult(days);
  };

  const handleUpgrade = () => {
    alert(`Opening payment gateway...\n\nIn production, this will connect to Stripe for secure payment processing.\n\nPrice: ${pricing.symbol}${pricing.price} one-time payment\n\n✓ Simulating successful purchase...`);
    
    setIsPremium(true);
    localStorage.setItem('isPremium', 'true');
    setShowUpgradeModal(false);
    setShowLimitModal(false);
    alert('🎉 Welcome to Premium! You now have unlimited countdowns and no ads!');
  };

  const getCategoryStyles = (category) => {
    const styles = {
      personal: {
        bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
        badge: 'bg-blue-100 text-blue-700',
        icon: '🎯'
      },
      work: {
        bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
        badge: 'bg-purple-100 text-purple-700',
        icon: '💼'
      },
      holiday: {
        bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        badge: 'bg-emerald-100 text-emerald-700',
        icon: '✈️'
      },
      birthday: {
        bg: 'bg-gradient-to-br from-pink-500 to-pink-600',
        badge: 'bg-pink-100 text-pink-700',
        icon: '🎂'
      },
      other: {
        bg: 'bg-gradient-to-br from-slate-500 to-slate-600',
        badge: 'bg-slate-100 text-slate-700',
        icon: '📌'
      }
    };
    return styles[category] || styles.other;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-white/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
                <Clock className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  TimeTracker
                </h1>
                <p className="text-gray-600 text-sm">Your moments, beautifully counted</p>
              </div>
            </div>
            {!isPremium && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
              >
                <Crown size={20} />
                Upgrade to Premium
              </button>
            )}
            {isPremium && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold">
                <Crown size={20} />
                Premium Member
              </div>
            )}
          </div>
        </div>

        {!isPremium && (
          <div className="mb-6 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200">
            <div className="text-center">
              <ins className="adsbygoogle"
                   style={{display: 'block'}}
                   data-ad-client="ca-pub-4187839765482800"
                   data-ad-slot="2945572625"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
            </div>
          </div>
        )}

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setCurrentView('countdowns')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              currentView === 'countdowns'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
            }`}
          >
            <Calendar size={22} />
            My Countdowns
          </button>
          <button
            onClick={() => setCurrentView('calculator')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              currentView === 'calculator'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
            }`}
          >
            <Calculator size={22} />
            Calculator
          </button>
        </div>

        {currentView === 'countdowns' && (
          <div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2 mb-8 group"
              >
                <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                Create New Countdown
              </button>
            )}

            {showAddForm && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-white/50">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="text-indigo-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingId ? 'Edit Countdown' : 'New Countdown'}
                  </h2>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      What are you counting down to?
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="e.g., Summer Vacation, Wedding Day, Project Launch"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      When is it?
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="personal">🎯 Personal</option>
                      <option value="work">💼 Work</option>
                      <option value="holiday">✈️ Holiday</option>
                      <option value="birthday">🎂 Birthday</option>
                      <option value="other">📌 Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                  >
                    {editingId ? 'Update' : 'Create'} Countdown
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingId(null);
                      setFormData({ title: '', date: '', category: 'personal' });
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-5">
              {countdowns.length === 0 ? (
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg p-12 text-center border border-white/50">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar size={40} className="text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No countdowns yet</h3>
                  <p className="text-gray-600">Create your first countdown to get started!</p>
                </div>
              ) : (
                countdowns
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((countdown) => {
                    const daysTo = calculateDaysTo(countdown.date);
                    const isPast = daysTo < 0;
                    const isToday = daysTo === 0;
                    const styles = getCategoryStyles(countdown.category);

                    return (
                      <div
                        key={countdown.id}
                        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/50 group"
                      >
                        <div className={`h-2 ${styles.bg}`}></div>
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{styles.icon}</span>
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-800">
                                    {countdown.title}
                                  </h3>
                                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${styles.badge}`}>
                                    {countdown.category}
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-600 mb-4 text-sm font-medium">
                                {new Date(countdown.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                              <div className="flex items-baseline gap-3">
                                {isToday ? (
                                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-2xl">
                                    <span className="text-3xl font-bold">Today! 🎉</span>
                                  </div>
                                ) : isPast ? (
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">
                                      {Math.abs(daysTo)}
                                    </span>
                                    <span className="text-gray-500 font-medium">
                                      days ago
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                      {daysTo}
                                    </span>
                                    <span className="text-gray-600 font-medium">
                                      {daysTo === 1 ? 'day' : 'days'} to go
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(countdown)}
                                className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                              >
                                <Edit2 size={20} />
                              </button>
                              <button
                                onClick={() => handleDelete(countdown.id)}
                                className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {!isPremium && countdowns.length > 0 && (
              <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200">
                <div className="text-center">
                  <ins className="adsbygoogle"
                       style={{display: 'block'}}
                       data-ad-client="ca-pub-4187839765482800"
                       data-ad-slot="3955401965"
                       data-ad-format="auto"
                       data-full-width-responsive="true"></ins>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'calculator' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/50">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="text-indigo-600" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">Calculate Days Between Dates</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Date
                </label>
                <input
                  type="date"
                  value={calcDate1}
                  onChange={(e) => setCalcDate1(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Second Date
                </label>
                <input
                  type="date"
                  value={calcDate2}
                  onChange={(e) => setCalcDate2(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={handleCalculate}
                disabled={!calcDate1 || !calcDate2}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                Calculate
              </button>
              {calcResult !== null && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-8 text-center">
                  <p className="text-gray-600 mb-3 font-medium">Days between dates</p>
                  <p className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    {calcResult}
                  </p>
                  <div className="flex justify-center gap-6 text-sm">
                    <div className="bg-white/80 px-4 py-2 rounded-xl">
                      <span className="font-semibold text-gray-700">{(calcResult / 7).toFixed(1)}</span>
                      <span className="text-gray-500 ml-1">weeks</span>
                    </div>
                    <div className="bg-white/80 px-4 py-2 rounded-xl">
                      <span className="font-semibold text-gray-700">{(calcResult / 30).toFixed(1)}</span>
                      <span className="text-gray-500 ml-1">months</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!isPremium && (
          <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="text-amber-600" size={20} />
              <p className="font-bold text-gray-800">Free Version</p>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              You have <span className="font-bold text-indigo-600">{countdowns.length} of {FREE_LIMIT}</span> countdowns. 
            </p>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              Upgrade to Premium for {pricing.symbol}{pricing.price}
            </button>
          </div>
        )}
      </div>

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="text-white" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Upgrade to Premium</h2>
              <p className="text-gray-600 mb-6">Unlock unlimited countdowns and remove all ads</p>
              
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
                <div className="text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                    <span className="text-gray-700">Unlimited countdowns</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                    <span className="text-gray-700">No advertisements</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                    <span className="text-gray-700">Priority support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                    <span className="text-gray-700">One-time payment, lifetime access</span>
                  </div>
                </div>
              </div>

              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                {pricing.symbol}{pricing.price}
                <span className="text-lg text-gray-600 font-normal ml-2">one-time</span>
              </div>

              <button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all mb-3"
              >
                Upgrade Now
              </button>
              <p className="text-xs text-gray-500">Secure payment powered by Stripe</p>
            </div>
          </div>
        </div>
      )}

      {showLimitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowLimitModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="text-white" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Limit Reached</h2>
              <p className="text-gray-600 mb-6">You've reached the {FREE_LIMIT} countdown limit on the free version</p>
              
              <p className="text-gray-700 mb-6">Upgrade to Premium for unlimited countdowns and no ads!</p>

              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                {pricing.symbol}{pricing.price}
                <span className="text-lg text-gray-600 font-normal ml-2">one-time</span>
              </div>

              <button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all mb-3"
              >
                Upgrade to Premium
              </button>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}