import React, { useState, useEffect } from 'react';

// --- INITIAL DEFAULT STATES ---
const INITIAL_MEALS = {
  Monday: { Breakfast: ['Oatmeal'], Lunch: ['Chicken Salad'], Dinner: ['Salmon'] },
  Tuesday: { Breakfast: ['Eggs & Toast'], Lunch: ['Leftovers'], Dinner: ['Pasta'] },
  Wednesday: { Breakfast: ['Smoothie'], Lunch: ['Tuna Sandwich'], Dinner: ['Stir Fry'] },
  Thursday: { Breakfast: ['Oatmeal'], Lunch: ['Chicken Salad'], Dinner: ['Tacos'] },
  Friday: { Breakfast: ['Pancakes'], Lunch: ['Leftovers'], Dinner: ['Burger'] },
  Saturday: { Breakfast: ['Eggs & Toast'], Lunch: ['Burrito'], Dinner: ['Steak'] },
  Sunday: { Breakfast: ['Smoothie'], Lunch: ['Roast Chicken'], Dinner: ['Soup'] },
};

export default function GroceryOS() {
  // --- PERSISTENCE & USER STATE ---
  const [isSignedUp, setIsSignedUp] = useState(() => JSON.parse(localStorage.getItem('g_signedUp')) || false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => JSON.parse(localStorage.getItem('g_loggedIn')) || false);
  const [userProfile, setUserProfile] = useState(() => JSON.parse(localStorage.getItem('g_profile')) || {
    username: '', password: '', budget: 5000, groceryDay: 'Saturday', currency: '₱', includeRewards: 'No', rewardsAmount: 0, householdMembers: 1
  });

  // --- APP CORE STATES ---
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('g_darkMode')) || false);
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('g_themeColor') || '#111827'); // Slate/Dark default
  
  // Schedule view toggles: 'Weekly' or 'Bi-Weekly'
  const [scheduleType, setScheduleType] = useState('Weekly');
  const [mealPlan, setMealPlan] = useState(() => JSON.parse(localStorage.getItem('g_meals')) || INITIAL_MEALS);
  const [mealTypes, setMealTypes] = useState(['Breakfast', 'Lunch', 'Dinner']);

  // Table inventories
  const [groceryList, setGroceryList] = useState(() => JSON.parse(localStorage.getItem('g_groceryList')) || [
    { id: 1, name: 'Whole Milk', category: 'Dairy', qty: 2, price: 150, checked: false },
    { id: 2, name: 'Eggs (Dozen)', category: 'Dairy', qty: 1, price: 220, checked: false },
  ]);

  const [pantryInventory, setPantryInventory] = useState(() => JSON.parse(localStorage.getItem('g_pantry')) || [
    { id: 1, name: 'White Rice', category: 'Grains', stock: 'High', minQty: 2 },
    { id: 2, name: 'Olive Oil', category: 'Condiments', stock: 'Low', minQty: 1 },
  ]);

  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('g_expenses')) || [
    { id: 1, date: '2026-05-24', item: 'Weekly Run A', amount: 2450, period: 'Weekly' },
    { id: 2, date: '2026-05-15', item: 'Monthly Wholesale Bulk', amount: 8900, period: 'Monthly' },
  ]);

  // Temporary signup fields
  const [signupForm, setSignupForm] = useState({ ...userProfile });

  // --- LOCALSTORAGE SYNC SYNCING EFFECT ---
  useEffect(() => {
    localStorage.setItem('g_signedUp', JSON.stringify(isSignedUp));
    localStorage.setItem('g_loggedIn', JSON.stringify(isLoggedIn));
    localStorage.setItem('g_profile', JSON.stringify(userProfile));
    localStorage.setItem('g_meals', JSON.stringify(mealPlan));
    localStorage.setItem('g_groceryList', JSON.stringify(groceryList));
    localStorage.setItem('g_pantry', JSON.stringify(pantryInventory));
    localStorage.setItem('g_expenses', JSON.stringify(expenses));
    localStorage.setItem('g_darkMode', JSON.stringify(darkMode));
    localStorage.setItem('g_themeColor', themeColor);
  }, [isSignedUp, isLoggedIn, userProfile, mealPlan, groceryList, pantryInventory, expenses, darkMode, themeColor]);

  // --- COMPONENT HANDLERS ---
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!signupForm.username || !signupForm.password) return alert('Please input an anonymous nickname and password code.');
    setUserProfile(signupForm);
    setIsSignedUp(true);
    setIsLoggedIn(true);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (signupForm.username === userProfile.username && signupForm.password === userProfile.password) {
      setIsLoggedIn(true);
    } else {
      alert('Invalid alias profile credentials.');
    }
  };

  // Automated EOD Simulation (Syncing Pantry updates down to lists and dashboards)
  const simulateDayEnd = () => {
    // Check for Low inventory items and safely flag them into grocery list if missing
    const itemsToRestock = pantryInventory.filter(item => item.stock === 'Low' || item.stock === 'Out of Stock');
    let updatedGrocery = [...groceryList];
    
    itemsToRestock.forEach(pItem => {
      if (!updatedGrocery.some(gItem => gItem.name.toLowerCase() === pItem.name.toLowerCase())) {
        updatedGrocery.push({
          id: Date.now() + Math.random(),
          name: pItem.name,
          category: pItem.category,
          qty: pItem.minQty,
          price: 0,
          checked: false
        });
      }
    });
    setGroceryList(updatedGrocery);
    alert('Day Cycle Checked! Critical low items sync-exported down to your Grocery List tab module.');
  };

  // --- SUB-VIEWS / ROUTING LAYOUTS ---
  if (!isSignedUp) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 text-white">
        <div className="w-full max-w-xl bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-2">Welcome to GroceryOS</h2>
          <p className="text-slate-400 mb-6 text-sm">Your decentralized local storage configuration interface. Anonymous access enabled.</p>
          
          <form onSubmit={handleSignUpSubmit} className="space-y-4 text-slate-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Anonymous Username</label>
                <input type="text" className="w-full p-2.5 bg-slate-900 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-400" placeholder="e.g., Cryptobunny" value={signupForm.username} onChange={e => setSignupForm({...signupForm, username: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Access PIN / Password</label>
                <input type="password" className="w-full p-2.5 bg-slate-900 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-400" placeholder="••••" value={signupForm.password} onChange={e => setSignupForm({...signupForm, password: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Monthly Grocery Budget</label>
                <input type="number" className="w-full p-2.5 bg-slate-900 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-400" value={signupForm.budget} onChange={e => setSignupForm({...signupForm, budget: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Base Currency Symbol</label>
                <select className="w-full p-2.5 bg-slate-900 rounded-lg border border-slate-700" value={signupForm.currency} onChange={e => setSignupForm({...signupForm, currency: e.target.value})}>
                  <option value="₱">₱ (PHP)</option>
                  <option value="$">$ (USD)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="¥">¥ (JPY)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Include Rewards Allocation?</label>
                <select className="w-full p-2.5 bg-slate-900 rounded-lg border border-slate-700" value={signupForm.includeRewards} onChange={e => setSignupForm({...signupForm, includeRewards: e.target.value})}>
                  <option value="No">No Override</option>
                  <option value="Yes">Yes, Track Rewards</option>
                </select>
              </div>
              {signupForm.includeRewards === 'Yes' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Monthly Rewards Pool</label>
                  <input type="number" className="w-full p-2.5 bg-slate-900 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-400" value={signupForm.rewardsAmount} onChange={e => setSignupForm({...signupForm, rewardsAmount: Number(e.target.value)})} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Target Grocery Target Day</label>
                <select className="w-full p-2.5 bg-slate-900 rounded-lg border border-slate-700" value={signupForm.groceryDay} onChange={e => setSignupForm({...signupForm, groceryDay: e.target.value})}>
                  <option value="Monday">Monday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Household Unit Size (Members)</label>
                <input type="number" className="w-full p-2.5 bg-slate-900 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-400" value={signupForm.householdMembers} onChange={e => setSignupForm({...signupForm, householdMembers: Number(e.target.value)})} />
              </div>
            </div>

            <button type="submit" className="w-full mt-4 p-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:opacity-90 rounded-xl font-bold tracking-wide transition shadow-lg">INITIALIZE OS PORTAL</button>
          </form>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <form onSubmit={handleLoginSubmit} className="w-full max-w-sm bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-4">
          <h3 className="text-xl font-bold text-teal-400">Unlock Workspace</h3>
          <p className="text-xs text-slate-400">Enter validation keys matching alias profile "{userProfile.username}"</p>
          <input type="password" placeholder="PIN/Password entry" className="w-full p-2 bg-slate-900 rounded border border-slate-700 text-white" onChange={e => setSignupForm({...signupForm, password: e.target.value})} />
          <button type="submit" className="w-full py-2 bg-teal-500 rounded font-bold hover:bg-teal-600">UNRELICT ARCHIVE</button>
        </form>
      </div>
    );
  }

  // --- APP LAYOUT CONTROLS ---
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = userProfile.budget - totalSpent;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* GLOBAL APPTOP HEADER BAR */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-opacity-10 shadow-sm" style={{ backgroundColor: themeColor, color: '#fff' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white bg-opacity-20 flex items-center justify-center font-black">G</div>
          <span className="font-bold text-lg tracking-tight">GroceryOS v2.0</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="bg-white bg-opacity-10 px-3 py-1 rounded-full text-xs">👤 Account ID: {userProfile.username}</span>
          <button onClick={() => simulateDayEnd()} className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-xs font-bold transition">☀️ Trigger Day End</button>
          <button onClick={() => setIsLoggedIn(false)} className="opacity-80 hover:opacity-100 text-xs underline">Lock Dashboard</button>
        </div>
      </header>

      {/* CORE NAVIGATION CONTAINER */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* NAV PANEL TAB SYSTEM */}
        <nav className="space-y-1 md:col-span-1">
          {['Dashboard', 'Meal Plan', 'Grocery List', 'Pantry Inventory', 'Budget & Expenses', 'Settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-teal-500 text-white shadow-md' 
                  : 'hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* CONTAINER ROUTE CONTROLLER PLUGINS */}
        <main className="md:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[70vh]">
          
          {/* =================== TAB 1: BENTO DASHBOARD =================== */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
                <div>
                  <h1 className="text-2xl font-black">Operations Dashboard</h1>
                  <p className="text-xs text-slate-400">Integrated multi-box navigation system.</p>
                </div>
                {/* CALENDAR EMBED BOX */}
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-center bg-teal-500 text-white px-3 py-1 rounded-lg">
                    <span className="block text-xs uppercase font-bold">{new Date().toLocaleString('en-US', { month: 'short' })}</span>
                    <span className="block text-lg font-black leading-none">{new Date().getDate()}</span>
                  </div>
                  <div className="text-xs">
                    <span className="block font-bold opacity-90">Current Realtime Horizon</span>
                    <span className="text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* BENTO GRID INTERCONNECTED LINKS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                <div onClick={() => setActiveTab('Budget & Expenses')} className="group cursor-pointer p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 border border-blue-200 dark:border-slate-700 hover:scale-[1.02] transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Wallet Thresholds</span>
                    <span className="text-xs text-blue-500 group-hover:underline">Manage &rarr;</span>
                  </div>
                  <div className="mt-4">
                    <span className="block text-2xl font-black">{userProfile.currency}{remainingBudget.toLocaleString()}</span>
                    <span className="text-xs text-slate-400">Available from {userProfile.currency}{userProfile.budget} target limit</span>
                  </div>
                </div>

                <div onClick={() => setActiveTab('Meal Plan')} className="group cursor-pointer p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-slate-800 dark:to-slate-900 border border-purple-200 dark:border-slate-700 hover:scale-[1.02] transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">Current Target Track</span>
                    <span className="text-xs text-purple-500 group-hover:underline">View Matrix &rarr;</span>
                  </div>
                  <div className="mt-4">
                    <span className="block text-2xl font-black">{scheduleType} Plan</span>
                    <span className="text-xs text-slate-400">{mealTypes.length} Active tracking periods configured per day iteration</span>
                  </div>
                </div>

                <div onClick={() => setActiveTab('Grocery List')} className="group cursor-pointer p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-slate-800 dark:to-slate-900 border border-emerald-200 dark:border-slate-700 hover:scale-[1.02] transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Pipeline Items</span>
                    <span className="text-xs text-emerald-500 group-hover:underline">Open Checklist &rarr;</span>
                  </div>
                  <div className="mt-4">
                    <span className="block text-2xl font-black">{groceryList.filter(i => !i.checked).length} Remainder</span>
                    <span className="text-xs text-slate-400">{groceryList.length} global total objects stored index</span>
                  </div>
                </div>

                <div onClick={() => setActiveTab('Pantry Inventory')} className="group cursor-pointer p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-800 dark:to-slate-900 border border-amber-200 dark:border-slate-700 hover:scale-[1.02] transition-all sm:col-span-2 lg:col-span-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Pantry Status & Stock Safety</span>
                    <span className="text-xs text-amber-500 group-hover:underline">Edit Storefront &rarr;</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded border text-center">
                      <span className="block font-black text-amber-600">{pantryInventory.filter(i => i.stock === 'High').length}</span>
                      <span className="text-[10px] text-slate-400">High Stock Items</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-2 rounded border text-center">
                      <span className="block font-black text-red-500">{pantryInventory.filter(i => i.stock === 'Low').length}</span>
                      <span className="text-[10px] text-slate-400">Critical (Low)</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-2 rounded border text-center">
                      <span className="block font-black text-slate-600">{userProfile.householdMembers}</span>
                      <span className="text-[10px] text-slate-400">Household Consumers</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-2 rounded border text-center">
                      <span className="block font-black text-blue-500">{userProfile.groceryDay}</span>
                      <span className="text-[10px] text-slate-400">Target Pipeline Day</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =================== TAB 2: MEAL PLAN =================== */}
          {activeTab === 'Meal Plan' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4 border-slate-200 dark:border-slate-800">
                <div>
                  <h1 className="text-2xl font-black">Dietary Dispatcher</h1>
                  <p className="text-xs text-slate-400">Bi-weekly scheduling engine with dynamic cell mapping allocations.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setScheduleType(scheduleType === 'Weekly' ? 'Bi-Weekly' : 'Weekly')} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-lg border">
                    📅 Schedule Type: {scheduleType}
                  </button>
                  <button onClick={() => {
                    const newMeal = prompt('Enter validation handle name for new time category slot (e.g., Afternoon Snack):');
                    if (newMeal) setMealTypes([...mealTypes, newMeal]);
                  }} className="px-3 py-1.5 bg-teal-500 text-white text-xs font-bold rounded-lg transition hover:bg-teal-600">
                    + Add New Meal Slot Time
                  </button>
                </div>
              </div>

              {/* GRID INTERACTIVE ENGINE LAYOUT */}
              <div className="space-y-4">
                {Object.keys(mealPlan).map((day) => (
                  <div key={day} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border space-y-3">
                    <h3 className="font-bold text-sm border-b pb-1 text-teal-600 uppercase tracking-wider">{day} Allocation Grid</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {mealTypes.map((mealType) => (
                        <div key={mealType} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">{mealType}</label>
                          
                          {/* FLAT SQUARE DISPLAY CONTAINER SELECTOR TAGS */}
                          <div className="space-y-1 mb-2">
                            {(mealPlan[day]?.[mealType] || []).map((recipe, index) => (
                              <div key={index} className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">
                                <span className="font-medium truncate">{recipe}</span>
                                <button className="text-red-500 hover:text-red-700 ml-1" onClick={() => {
                                  const updated = { ...mealPlan };
                                  updated[day][mealType].splice(index, 1);
                                  setMealPlan(updated);
                                }}>×</button>
                              </div>
                            ))}
                            {(!mealPlan[day]?.[mealType] || mealPlan[day]?.[mealType].length === 0) && (
                              <span className="text-[11px] text-slate-400 italic block">No tracking selection active</span>
                            )}
                          </div>

                          <button className="w-full py-1 text-center border border-dashed rounded text-[11px] font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => {
                            const addRecipe = prompt(`Add item description recipe text for ${day} - ${mealType}:`);
                            if (addRecipe) {
                              const updated = { ...mealPlan };
                              if (!updated[day]) updated[day] = {};
                              if (!updated[day][mealType]) updated[day][mealType] = [];
                              updated[day][mealType].push(addRecipe);
                              setMealPlan(updated);
                            }
                          }}>
                            + Select Menu Item
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================== TAB 3: GROCERY LIST =================== */}
          {activeTab === 'Grocery List' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4 border-slate-200 dark:border-slate-800">
                <div>
                  <h1 className="text-2xl font-black">Supply Checklist & Pipeline</h1>
                  <p className="text-xs text-slate-400">Add, complete, or edit items directly within the relational grid database.</p>
                </div>
                <button onClick={() => {
                  setGroceryList([...groceryList, { id: Date.now(), name: 'New Item Allocation', category: 'Misc', qty: 1, price: 0, checked: false }]);
                }} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition">
                  + Add Live Row Item
                </button>
              </div>

              {/* CORE DATA TABLE MODULE */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <th className="p-3 w-10 text-center">Status</th>
                      <th className="p-3">Object Name Label</th>
                      <th className="p-3">Category Tag</th>
                      <th className="p-3 w-20">Quantity</th>
                      <th className="p-3 w-24">Est Price ({userProfile.currency})</th>
                      <th className="p-3 w-16 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {groceryList.map((item) => (
                      <tr key={item.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800 ${item.checked ? 'opacity-40 line-through' : ''}`}>
                        <td className="p-3 text-center">
                          <input type="checkbox" checked={item.checked} onChange={(e) => {
                            setGroceryList(groceryList.map(i => i.id === item.id ? { ...i, checked: e.target.checked } : i));
                          }} className="rounded text-teal-500 w-4 h-4 focus:ring-0" />
                        </td>
                        <td className="p-3">
                          <input type="text" value={item.name} onChange={(e) => {
                            setGroceryList(groceryList.map(i => i.id === item.id ? { ...i, name: e.target.value } : i));
                          }} className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-teal-500 focus:ring-0 p-0 text-sm font-medium text-slate-800 dark:text-slate-100" />
                        </td>
                        <td className="p-3">
                          <input type="text" value={item.category} onChange={(e) => {
                            setGroceryList(groceryList.map(i => i.id === item.id ? { ...i, category: e.target.value } : i));
                          }} className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-teal-500 focus:ring-0 p-0 text-xs text-slate-400" />
                        </td>
                        <td className="p-3">
                          <input type="number" value={item.qty} onChange={(e) => {
                            setGroceryList(groceryList.map(i => i.id === item.id ? { ...i, qty: Number(e.target.value) } : i));
                          }} className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-teal-500 focus:ring-0 p-0 text-sm" />
                        </td>
                        <td className="p-3">
                          <input type="number" value={item.price} onChange={(e) => {
                            setGroceryList(groceryList.map(i => i.id === item.id ? { ...i, price: Number(e.target.value) } : i));
                          }} className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-teal-500 focus:ring-0 p-0 text-sm" />
                        </td>
                        <td className="p-3 text-center">
                          <button onClick={() => setGroceryList(groceryList.filter(i => i.id !== item.id))} className="text-red-500 hover:text-red-700 text-xs font-bold">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {groceryList.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center p-6 text-xs text-slate-400 italic">Zero item records found inside tracking storage pipeline array index.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================== TAB 4: PANTRY INVENTORY =================== */}
          {activeTab === 'Pantry Inventory' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4 border-slate-200 dark:border-slate-800">
                <div>
                  <h1 className="text-2xl font-black">Stockpile Ledger & Vault</h1>
                  <p className="text-xs text-slate-400">Main stock ledger index synced to end-of-day automation checks.</p>
                </div>
                <button onClick={() => {
                  setPantryInventory([...pantryInventory, { id: Date.now(), name: 'New Vault Object', category: 'General', stock: 'High', minQty: 1 }]);
                }} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-bold shadow transition hover:opacity-90">
                  + Provision Stock Item
                </button>
              </div>

              {/* INLINE EDITABLE PANTRY INVENTORY SCHEMA */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <th className="p-3">Stored Inventory Title Name</th>
                      <th className="p-3">Category Segment</th>
                      <th className="p-3 w-40">Stock Status Level</th>
                      <th className="p-3 w-32">Min Stock Limit</th>
                      <th className="p-3 w-20 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {pantryInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="p-3">
                          <input type="text" value={item.name} onChange={(e) => {
                            setPantryInventory(pantryInventory.map(i => i.id === item.id ? { ...i, name: e.target.value } : i));
                          }} className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-teal-500 focus:ring-0 p-0 text-sm font-medium" />
                        </td>
                        <td className="p-3">
                          <input type="text" value={item.category} onChange={(e) => {
                            setPantryInventory(pantryInventory.map(i => i.id === item.id ? { ...i, category: e.target.value } : i));
                          }} className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-teal-500 focus:ring-0 p-0 text-xs text-slate-400" />
                        </td>
                        <td className="p-3">
                          <select value={item.stock} onChange={(e) => {
                            setPantryInventory(pantryInventory.map(i => i.id === item.id ? { ...i, stock: e.target.value } : i));
                          }} className="bg-transparent border-none p-0 text-xs font-bold focus:ring-0 text-slate-800 dark:text-slate-200">
                            <option value="High">🟩 High Stock Capacity</option>
                            <option value="Medium">🟨 Balanced / Medium</option>
                            <option value="Low">🟥 Low Warning Alert</option>
                            <option value="Out of Stock">⬛ Out of Stock</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <input type="number" value={item.minQty} onChange={(e) => {
                            setPantryInventory(pantryInventory.map(i => i.id === item.id ? { ...i, minQty: Number(e.target.value) } : i));
                          }} className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-teal-500 focus:ring-0 p-0 text-sm text-center" />
                        </td>
                        <td className="p-3 text-center">
                          <button onClick={() => setPantryInventory(pantryInventory.filter(i => i.id !== item.id))} className="text-red-500 hover:text-red-700 text-xs font-bold">×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================== TAB 5: BUDGET & EXPENSES =================== */}
          {activeTab === 'Budget & Expenses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4 border-slate-200 dark:border-slate-800">
                <div>
                  <h1 className="text-2xl font-black">Financial Balance Tracking</h1>
                  <p className="text-xs text-slate-400">Separated relational structures splitting weekly runway metrics from monthly allocations.</p>
                </div>
                <button onClick={() => {
                  const amt = prompt('Input Expense Value Transaction Amount:');
                  if (amt) setExpenses([...expenses, { id: Date.now(), date: new Date().toISOString().split('T')[0], item: 'Manual Expense Transaction Entry', amount: Number(amt), period: 'Weekly' }]);
                }} className="px-4 py-2 bg-blue-500 text-white font-bold text-xs rounded-xl hover:bg-blue-600 transition">
                  + Append Transaction Row
                </button>
              </div>

              {/* SPLIT TABLE STRUCTURE DATA CONTAINER ENGINE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* GRID SECTION 1: WEEKLY EXPENDITURES */}
                <div className="space-y-3">
                  <h3 className="font-extrabold text-sm uppercase text-blue-500 tracking-wider">Weekly Run Ledgers</h3>
                  <div className="overflow-hidden border rounded-xl">
                    <table className="w-full text-left text-xs">
                      <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-500">
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Label Designation</th>
                        <th className="p-2.5 text-right">Cost ({userProfile.currency})</th>
                      </tr>
                      {expenses.filter(e => e.period === 'Weekly').map(e => (
                        <tr key={e.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800">
                          <td className="p-2.5 text-slate-400">{e.date}</td>
                          <td className="p-2.5 font-medium">{e.item}</td>
                          <td className="p-2.5 text-right font-bold">{e.amount}</td>
                        </tr>
                      ))}
                    </table>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-right text-xs font-bold">
                    Weekly Running Total: {userProfile.currency}{expenses.filter(e => e.period === 'Weekly').reduce((s, i) => s + i.amount, 0).toLocaleString()}
                  </div>
                </div>

                {/* GRID SECTION 2: MONTHLY EXPENDITURES */}
                <div className="space-y-3">
                  <h3 className="font-extrabold text-sm uppercase text-purple-500 tracking-wider">Monthly Bulk & Fixed Operations</h3>
                  <div className="overflow-hidden border rounded-xl">
                    <table className="w-full text-left text-xs">
                      <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-500">
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Label Designation</th>
                        <th className="p-2.5 text-right">Cost ({userProfile.currency})</th>
                      </tr>
                      {expenses.filter(e => e.period === 'Monthly').map(e => (
                        <tr key={e.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800">
                          <td className="p-2.5 text-slate-400">{e.date}</td>
                          <td className="p-2.5 font-medium">{e.item}</td>
                          <td className="p-2.5 text-right font-bold">{e.amount}</td>
                        </tr>
                      ))}
                    </table>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-right text-xs font-bold">
                    Monthly Running Total: {userProfile.currency}{expenses.filter(e => e.period === 'Monthly').reduce((s, i) => s + i.amount, 0).toLocaleString()}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =================== TAB 6: SETTINGS & CUSTOM CORES =================== */}
          {activeTab === 'Settings' && (
            <div className="space-y-6">
              <div className="border-b pb-4 border-slate-200 dark:border-slate-800">
                <h1 className="text-2xl font-black">System Profile Configuration</h1>
                <p className="text-xs text-slate-400">Direct parameter mutation configuration board overrides.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                
                {/* PROFILE CONFIG PARAMETERS BOX */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border">
                  <h3 className="font-bold text-xs text-teal-500 uppercase tracking-wider">Account Global Parameters</h3>
                  
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Target Monthly Capital Budget Allocation</label>
                    <input type="number" className="w-full p-2 bg-white dark:bg-slate-900 border rounded" value={userProfile.budget} onChange={e => setUserProfile({...userProfile, budget: Number(e.target.value)})} />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Weekly Run Pipeline Day</label>
                    <select className="w-full p-2 bg-white dark:bg-slate-900 border rounded" value={userProfile.groceryDay} onChange={e => setUserProfile({...userProfile, groceryDay: e.target.value})}>
                      <option value="Monday">Monday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Household Tracking Limit (Size)</label>
                    <input type="number" className="w-full p-2 bg-white dark:bg-slate-900 border rounded" value={userProfile.householdMembers} onChange={e => setUserProfile({...userProfile, householdMembers: Number(e.target.value)})} />
                  </div>
                </div>

                {/* VISUAL THEMING PALETTE AND CONFIG OVERRIDES */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border">
                  <h3 className="font-bold text-xs text-blue-500 uppercase tracking-wider">Visual Interface Styling Engine</h3>
                  
                  {/* DARK MODE ACCELERATOR INTERFACE OVERRIDE */}
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded border">
                    <div>
                      <span className="block font-bold text-xs">High Contrast Dark Mode</span>
                      <span className="text-[10px] text-slate-400">Toggle dark visual parameters profiles</span>
                    </div>
                    <button onClick={() => setDarkMode(!darkMode)} className={`px-3 py-1 rounded text-xs font-black text-white ${darkMode ? 'bg-teal-500' : 'bg-slate-400'}`}>
                      {darkMode ? 'ACTIVE' : 'DEACTIVATED'}
                    </button>
                  </div>

                  {/* CUSTOM SCHEME COLOR MIXERS */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">Master Accent Base Configuration Header Palette</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { name: 'Midnight', hex: '#111827' },
                        { name: 'Oceanic', hex: '#0f766e' },
                        { name: 'Crimson', hex: '#9f1239' },
                        { name: 'Indigo', hex: '#4338ca' }
                      ].map(theme => (
                        <button
                          key={theme.hex}
                          onClick={() => setThemeColor(theme.hex)}
                          className="p-2 text-center rounded border text-[11px] font-bold text-white transition-transform transform active:scale-95"
                          style={{ backgroundColor: theme.hex }}
                        >
                          {theme.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400">
        GroceryOS Architecture Matrix Sandbox Session Profile. Signed as local instance storage profile client.
      </footer>
    </div>
  );
}