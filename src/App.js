import { useState, useEffect, createContext, useContext } from "react";
import { LayoutDashboard, ShoppingCart, Package, Wallet, BarChart2, TrendingUp, Settings, Search, Bell, Plus, Check, AlertTriangle, Utensils, Star, ShoppingBag, TrendingDown, Clock, X, Wand2, Loader, ChevronRight, LogOut, Edit2, Save, Trash2, Copy, Calendar, Moon, Sun } from "lucide-react";
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// ─── Theme Context ──────────────────────────────────
const ThemeContext = createContext();

const THEMES = {
  light: { bg: "#f9fafb", card: "#fff", text: "#18181b", border: "#e4e4e7", accent: "#18181b" },
  dark: { bg: "#0f0f0f", card: "#1a1a1a", text: "#f9fafb", border: "#27272a", accent: "#fff" }
};

const COLORS = {
  slate: "#18181b",
  emerald: "#10b981",
  blue: "#3b82f6",
  purple: "#a855f7",
  rose: "#f43f5e"
};

// ─── User Data Context ──────────────────────────────
const UserContext = createContext();

const ONBOARDING_QUESTIONS = [
  { id: "householdSize", label: "Household Size", type: "select", options: ["1-2 people", "3-4 people", "5-6 people", "7+ people"] },
  { id: "householdType", label: "Household Type", type: "select", options: ["Single", "Family with kids", "Family without kids", "Shared apartment"] },
  { id: "shoppingFrequency", label: "Shopping Frequency", type: "select", options: ["Weekly", "Bi-weekly", "Monthly", "As needed"] },
  { id: "inventoryPriority", label: "Inventory Priority", type: "select", options: ["Never run out of essentials", "Balance stock & freshness", "Minimize waste"] },
  { id: "frustrationType", label: "Running Out: What frustrates you most?", type: "select", options: ["Missing key ingredients", "Food spoiling", "Overspending", "Too much planning"] },
  { id: "budgetStyle", label: "Budget Style", type: "select", options: ["Strict budget (fixed limit)", "Flexible (adjust as needed)", "Spend what's needed", "Finding deals"] },
  { id: "monthlyBudget", label: "Monthly Grocery Budget (₱)", type: "number", placeholder: "8000" },
  { id: "mealInterest", label: "Meal Planning Interest", type: "select", options: ["Very interested", "Somewhat interested", "Not interested", "Depends on mood"] },
  { id: "mealGoal", label: "Meal Planning Goal", type: "select", options: ["Save time", "Eat healthier", "Reduce waste", "Save money", "Try new recipes"] },
  { id: "smartAlerts", label: "Smart Alerts", type: "select", options: ["Very important", "Nice to have", "Not needed"] },
  { id: "dashboardFocus", label: "Dashboard Focus", type: "select", options: ["Budget overview", "Meal planning", "Grocery list", "Balanced view"] }
];

// ─── Main App ────────────────────────────────────────
export default function GroceryOS(){
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("groceryOS_user");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [theme, setTheme] = useState(() => localStorage.getItem("groceryOS_theme") || "light");
  const [colorScheme, setColorScheme] = useState(() => localStorage.getItem("groceryOS_colorScheme") || "slate");
  
  useEffect(() => localStorage.setItem("groceryOS_theme", theme), [theme]);
  useEffect(() => localStorage.setItem("groceryOS_colorScheme", colorScheme), [colorScheme]);

  const handleSignOut = () => {
    localStorage.removeItem("groceryOS_user");
    setUser(null);
  };

  if (!user) {
    return <OnboardingFlow onComplete={(userData) => {
      setUser(userData);
      localStorage.setItem("groceryOS_user", JSON.stringify(userData));
    }} />;
  }

  const colors = { ...THEMES[theme], accent: COLORS[colorScheme] };

  return (
    <div style={{ background: colors.bg, color: colors.text, minHeight: "100vh" }}>
      <AppHeader user={user} onSignOut={handleSignOut} theme={theme} setTheme={setTheme} colorScheme={colorScheme} setColorScheme={setColorScheme} colors={colors} />
      <MainApp user={user} colors={colors} />
    </div>
  );
}

// ─── Onboarding Flow ────────────────────────────────
function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const question = ONBOARDING_QUESTIONS[step];
  const progress = ((step + 1) / ONBOARDING_QUESTIONS.length) * 100;

  const handleNext = () => {
    if (step < ONBOARDING_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const userData = { id: Date.now(), ...answers, createdAt: new Date().toISOString() };
      onComplete(userData);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 500, background: "#fff", borderRadius: 20, padding: 40, boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}>
        <div style={{ marginBottom: 30 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#18181b", margin: "0 0 10px" }}>Welcome to GroceryOS 🛒</h1>
          <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>Let's personalize your experience</p>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#52525b" }}>Step {step + 1} of {ONBOARDING_QUESTIONS.length}</span>
            <span style={{ fontSize: 12, color: "#a1a1aa" }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: 6, background: "#e4e4e7", borderRadius: 99 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "#18181b", borderRadius: 99, transition: "width 0.3s" }} />
          </div>
        </div>

        {/* Question */}
        <div style={{ marginBottom: 30 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: "#18181b", display: "block", marginBottom: 14 }}>
            {question.label}
          </label>

          {question.type === "select" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {question.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => setAnswers({ ...answers, [question.id]: opt })}
                  style={{
                    padding: "12px 16px",
                    border: `2px solid ${answers[question.id] === opt ? "#18181b" : "#e4e4e7"}`,
                    background: answers[question.id] === opt ? "#f0f0f0" : "#fff",
                    borderRadius: 10,
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: answers[question.id] === opt ? 600 : 500,
                    color: "#18181b",
                    transition: "all 0.2s"
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <input
              type={question.type}
              value={answers[question.id] || ""}
              onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
              placeholder={question.placeholder}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #d4d4d8",
                borderRadius: 10,
                fontSize: 14,
                outline: "none"
              }}
            />
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10 }}>
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                flex: 1,
                padding: "12px 16px",
                background: "#f4f4f5",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                color: "#18181b"
              }}
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!answers[question.id]}
            style={{
              flex: 1,
              padding: "12px 16px",
              background: answers[question.id] ? "#18181b" : "#d4d4d8",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: answers[question.id] ? "pointer" : "default"
            }}
          >
            {step === ONBOARDING_QUESTIONS.length - 1 ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App Header ──────────────────────────────────────
function AppHeader({ user, onSignOut, theme, setTheme, colorScheme, setColorScheme, colors }) {
  return (
    <div style={{ background: colors.card, borderBottom: `1px solid ${colors.border}`, padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ShoppingBag size={24} color={colors.accent} />
        <h1 style={{ fontSize: 20, fontWeight: 700, color: colors.text, margin: 0 }}>GroceryOS</h1>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} style={{ background: colors.accent, color: colors.card, border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <select value={colorScheme} onChange={(e) => setColorScheme(e.target.value)} style={{ padding: "8px 12px", border: `1px solid ${colors.border}`, borderRadius: 8, background: colors.card, color: colors.text, cursor: "pointer", fontSize: 12 }}>
          {Object.entries(COLORS).map(([key, val]) => (
            <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
          ))}
        </select>

        <button onClick={onSignOut} style={{ background: "transparent", border: `1px solid ${colors.border}`, borderRadius: 8, padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: colors.text, fontSize: 12 }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── Main App Navigation ────────────────────────────
function MainApp({ user, colors }) {
  const [view, setView] = useState("dashboard");

  const TABS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "meals", label: "Meal Planner", icon: Utensils },
    { id: "groceries", label: "Grocery Lists", icon: ShoppingCart },
    { id: "pantry", label: "Pantry", icon: Package },
    { id: "budget", label: "Budget", icon: Wallet },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const VIEWS = {
    dashboard: <DashboardView colors={colors} user={user} onNavigate={setView} />,
    meals: <MealPlannerView colors={colors} user={user} />,
    groceries: <GroceryListsView colors={colors} user={user} />,
    pantry: <PantryView colors={colors} user={user} />,
    budget: <BudgetView colors={colors} user={user} />,
    analytics: <AnalyticsView colors={colors} user={user} />,
    settings: <SettingsView colors={colors} user={user} />
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 65px)" }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: colors.card, borderRight: `1px solid ${colors.border}`, overflowY: "auto", padding: "16px 0" }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "none",
                background: view === tab.id ? colors.accent : "transparent",
                color: view === tab.id ? colors.card : colors.text,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 13,
                fontWeight: view === tab.id ? 600 : 500,
                textAlign: "left"
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", background: colors.bg }}>
        {VIEWS[view]}
      </div>
    </div>
  );
}

// ─── Dashboard View ──────────────────────────────────
function DashboardView({ colors, user, onNavigate }) {
  const today = new Date();
  const cal = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), i - today.getDay() + 1);
    return { date: d, isThisMonth: d.getMonth() === today.getMonth(), isToday: d.toDateString() === today.toDateString() };
  });

  const cards = [
    { label: "Monthly Budget", value: "₱8,000", color: colors.accent, onClick: () => onNavigate("budget") },
    { label: "Total Spent", value: "₱6,200", color: "#d97706", onClick: () => onNavigate("budget") },
    { label: "Grocery Items", value: "24", color: "#3b82f6", onClick: () => onNavigate("groceries") },
    { label: "Pantry Stock", value: "8 items", color: "#10b981", onClick: () => onNavigate("pantry") }
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.text, margin: "0 0 20px" }}>Dashboard</h1>

      {/* Calendar */}
      <div style={{ background: colors.card, borderRadius: 14, padding: 20, marginBottom: 20, border: `1px solid ${colors.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: colors.text }}>{today.toLocaleString("default", { month: "long", year: "numeric" })}</h3>
          <span style={{ fontSize: 13, color: colors.text, fontWeight: 600 }}>Today: {today.getDate()}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 12 }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: colors.accent, padding: "8px 0" }}>
              {d}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
          {cal.map((d, i) => (
            <div
              key={i}
              style={{
                aspect: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: d.isToday ? 700 : 500,
                background: d.isToday ? colors.accent : d.isThisMonth ? colors.bg : "transparent",
                color: d.isToday ? colors.card : d.isThisMonth ? colors.text : colors.accent,
                border: d.isToday ? "2px solid" + colors.accent : "1px solid" + colors.border,
                cursor: "pointer"
              }}
            >
              {d.date.getDate()}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        {cards.map(card => (
          <div
            key={card.label}
            onClick={card.onClick}
            style={{
              background: colors.card,
              borderRadius: 14,
              padding: 20,
              border: `1px solid ${colors.border}`,
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 10px 20px rgba(0,0,0,0.1)`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: card.color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
              {card.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: colors.text }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 600, color: colors.text }}>Today's Overview</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: colors.accent, marginBottom: 8, textTransform: "uppercase" }}>Today's Meals</div>
            <div style={{ fontSize: 14, color: colors.text, lineHeight: 1.6 }}>
              ☀️ Champorado<br/>
              🌤 Chicken Adobo<br/>
              🌙 Sinigang na Baboy
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: colors.accent, marginBottom: 8, textTransform: "uppercase" }}>Budget Status</div>
            <div style={{ fontSize: 14, color: colors.text }}>
              Remaining: <span style={{ fontWeight: 700, color: colors.accent }}>₱1,800</span><br/>
              Progress: <span style={{ fontWeight: 700 }}>77.5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Meal Planner View ───────────────────────────────
function MealPlannerView({ colors, user }) {
  const [planType, setPlanType] = useState("weekly");
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem("groceryOS_meals");
    return saved ? JSON.parse(saved) : {};
  });
  const [mealTimes, setMealTimes] = useState(() => {
    const saved = localStorage.getItem("groceryOS_mealTimes");
    return saved ? JSON.parse(saved) : { breakfast: "08:00", lunch: "12:00", dinner: "19:00" };
  });

  const days = planType === "weekly" ? 7 : 14;
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const recipes = ["Chicken Adobo", "Sinigang", "Tinola", "Beef Caldereta", "Kare-Kare", "None"];

  useEffect(() => localStorage.setItem("groceryOS_meals", JSON.stringify(meals)), [meals]);
  useEffect(() => localStorage.setItem("groceryOS_mealTimes", JSON.stringify(mealTimes)), [mealTimes]);

  const mealCategories = [
    { id: "breakfast", label: "Breakfast", icon: "☀️", time: mealTimes.breakfast },
    { id: "lunch", label: "Lunch", icon: "🌤", time: mealTimes.lunch },
    { id: "dinner", label: "Dinner", icon: "🌙", time: mealTimes.dinner }
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.text, margin: "0 0 20px" }}>Meal Planner</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {["weekly", "biweekly"].map(type => (
          <button
            key={type}
            onClick={() => setPlanType(type)}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: 8,
              background: planType === type ? colors.accent : colors.card,
              color: planType === type ? colors.card : colors.text,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              border: `1px solid ${colors.border}`
            }}
          >
            {type === "weekly" ? "7 Days" : "14 Days"}
          </button>
        ))}
      </div>

      {/* Meal Grid */}
      <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}`, overflowX: "auto" }}>
        <div style={{ minWidth: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${days + 1}, 1fr)`, gap: 8, marginBottom: 16 }}>
            {/* Header */}
            <div style={{ fontWeight: 700, color: colors.accent, fontSize: 12 }}>MEAL</div>
            {Array.from({ length: days }, (_, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: colors.accent, fontWeight: 700 }}>{DAYS[i % 7]}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>Day {i + 1}</div>
              </div>
            ))}

            {/* Meals */}
            {mealCategories.map(meal => (
              <>
                <div key={meal.id} style={{ fontSize: 12, fontWeight: 600, color: colors.text, display: "flex", alignItems: "center", gap: 6 }}>
                  {meal.icon} {meal.label}
                </div>
                {Array.from({ length: days }, (_, dayIdx) => (
                  <div key={`${meal.id}-${dayIdx}`}>
                    <select
                      value={meals[`day${dayIdx}_${meal.id}`] || "None"}
                      onChange={(e) => setMeals({ ...meals, [`day${dayIdx}_${meal.id}`]: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 8px",
                        border: `2px solid ${colors.border}`,
                        borderRadius: 8,
                        background: colors.bg,
                        color: colors.text,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        minHeight: "50px"
                      }}
                    >
                      {recipes.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Meal Times Editor */}
      <div style={{ marginTop: 20, background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: colors.text }}>Meal Times</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {mealCategories.map(meal => (
            <div key={meal.id}>
              <label style={{ fontSize: 12, fontWeight: 600, color: colors.accent, display: "block", marginBottom: 6 }}>{meal.label}</label>
              <input
                type="time"
                value={mealTimes[meal.id]}
                onChange={(e) => setMealTimes({ ...mealTimes, [meal.id]: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  background: colors.bg,
                  color: colors.text,
                  fontSize: 13
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Grocery Lists View ──────────────────────────────
function GroceryListsView({ colors, user }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("groceryOS_groceryList");
    return saved ? JSON.parse(saved) : [
      { id: 1, type: "Protein", name: "Chicken", qty: 2, unit: "kg", location: "Grocery", price: 280, total: 560 },
      { id: 2, type: "Vegetables", name: "Tomatoes", qty: 500, unit: "g", location: "Wet Market", price: 60, total: 60 }
    ];
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ type: "Protein", name: "", qty: "", unit: "kg", location: "Grocery", price: "" });

  useEffect(() => localStorage.setItem("groceryOS_groceryList", JSON.stringify(items)), [items]);

  const handleAdd = () => {
    if (newItem.name && newItem.qty && newItem.price) {
      setItems([...items, { ...newItem, id: Date.now(), qty: parseFloat(newItem.qty), price: parseFloat(newItem.price), total: parseFloat(newItem.qty) * parseFloat(newItem.price) }]);
      setNewItem({ type: "Protein", name: "", qty: "", unit: "kg", location: "Grocery", price: "" });
      setShowAddForm(false);
    }
  };

  const handleSaveEdit = () => {
    setItems(items.map(item => item.id === editId ? { ...editData, total: editData.qty * editData.price } : item));
    setEditId(null);
  };

  const handleDelete = (id) => setItems(items.filter(item => item.id !== id));

  const total = items.reduce((s, i) => s + i.total, 0);

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.text, margin: "0 0 20px" }}>Grocery Lists</h1>

      {/* Add Form */}
      {showAddForm && (
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, marginBottom: 20, border: `1px solid ${colors.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 12 }}>
            <select value={newItem.type} onChange={(e) => setNewItem({ ...newItem, type: e.target.value })} style={{ padding: "8px 10px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text }}>
              {["Protein", "Vegetables", "Fruits", "Dairy", "Staples"].map(t => <option key={t}>{t}</option>)}
            </select>
            <input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="Product name" style={{ padding: "8px 10px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text }} />
            <select value={newItem.location} onChange={(e) => setNewItem({ ...newItem, location: e.target.value })} style={{ padding: "8px 10px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text }}>
              <option>Grocery</option>
              <option>Wet Market</option>
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 100px", gap: 12 }}>
            <input type="number" value={newItem.qty} onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })} placeholder="Qty" style={{ padding: "8px 10px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text }} />
            <input value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} placeholder="Unit" style={{ padding: "8px 10px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text }} />
            <input type="number" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} placeholder="Price" style={{ padding: "8px 10px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text }} />
            <button onClick={handleAdd} style={{ background: colors.accent, color: colors.card, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>Add</button>
          </div>
        </div>
      )}

      {!showAddForm && <button onClick={() => setShowAddForm(true)} style={{ marginBottom: 20, padding: "10px 20px", background: colors.accent, color: colors.card, border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}><Plus size={16} /> Add Item</button>}

      {/* Items Table */}
      <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}`, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              {["Type", "Product", "Qty", "Location", "Price", "Total", "Actions"].map(h => (
                <th key={h} style={{ padding: "10px 8px", textAlign: "left", fontSize: 11, fontWeight: 700, color: colors.accent, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              editId === item.id ? (
                <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ padding: "10px 8px" }}><input value={editData.type} onChange={(e) => setEditData({ ...editData, type: e.target.value })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                  <td style={{ padding: "10px 8px" }}><input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                  <td style={{ padding: "10px 8px" }}><input type="number" value={editData.qty} onChange={(e) => setEditData({ ...editData, qty: parseFloat(e.target.value) })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                  <td style={{ padding: "10px 8px" }}><input value={editData.location} onChange={(e) => setEditData({ ...editData, location: e.target.value })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                  <td style={{ padding: "10px 8px" }}><input type="number" value={editData.price} onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                  <td style={{ padding: "10px 8px", fontSize: 13, fontWeight: 700, color: colors.text }}>₱{(editData.qty * editData.price).toFixed(2)}</td>
                  <td style={{ padding: "10px 8px", display: "flex", gap: 6 }}>
                    <button onClick={handleSaveEdit} style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 4, padding: "6px 10px", cursor: "pointer", fontSize: 12 }}>Save</button>
                    <button onClick={() => setEditId(null)} style={{ background: colors.border, color: colors.text, border: "none", borderRadius: 4, padding: "6px 10px", cursor: "pointer", fontSize: 12 }}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ padding: "10px 8px", fontSize: 12, color: colors.text }}>{item.type}</td>
                  <td style={{ padding: "10px 8px", fontSize: 12, fontWeight: 600, color: colors.text }}>{item.name}</td>
                  <td style={{ padding: "10px 8px", fontSize: 12, color: colors.text }}>{item.qty} {item.unit}</td>
                  <td style={{ padding: "10px 8px", fontSize: 12, color: colors.text }}>{item.location}</td>
                  <td style={{ padding: "10px 8px", fontSize: 12, color: colors.text }}>₱{item.price.toFixed(2)}</td>
                  <td style={{ padding: "10px 8px", fontSize: 12, fontWeight: 700, color: colors.text }}>₱{item.total.toFixed(2)}</td>
                  <td style={{ padding: "10px 8px", display: "flex", gap: 6 }}>
                    <button onClick={() => { setEditId(item.id); setEditData(item); }} style={{ background: colors.accent, color: colors.card, border: "none", borderRadius: 4, padding: "6px 10px", cursor: "pointer" }}><Edit2 size={12} /></button>
                    <button onClick={() => handleDelete(item.id)} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, padding: "6px 10px", cursor: "pointer" }}><Trash2 size={12} /></button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div style={{ marginTop: 20, background: colors.accent, color: colors.card, borderRadius: 14, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>TOTAL GROCERY LIST</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 4 }}>₱{total.toFixed(2)}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{items.length} items</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>Ready to shop</div>
        </div>
      </div>
    </div>
  );
}

// ─── Pantry View ────────────────────────────────────
function PantryView({ colors, user }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("groceryOS_pantry");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Rice", qty: 2, unit: "kg", expiry: "—", status: "low" },
      { id: 2, name: "Soy Sauce", qty: 0.5, unit: "bottle", expiry: "Aug 2025", status: "ok" }
    ];
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", qty: "", unit: "kg", expiry: "", status: "ok" });

  useEffect(() => localStorage.setItem("groceryOS_pantry", JSON.stringify(items)), [items]);

  const handleAdd = () => {
    if (newItem.name && newItem.qty) {
      setItems([...items, { ...newItem, id: Date.now(), qty: parseFloat(newItem.qty) }]);
      setNewItem({ name: "", qty: "", unit: "kg", expiry: "", status: "ok" });
      setShowAdd(false);
    }
  };

  const handleSaveEdit = () => {
    setItems(items.map(item => item.id === editId ? editData : item));
    setEditId(null);
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.text, margin: "0 0 20px" }}>Pantry Inventory</h1>

      {showAdd && (
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, marginBottom: 20, border: `1px solid ${colors.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            <input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="Item name" style={{ padding: "8px 10px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text }} />
            <input type="number" value={newItem.qty} onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })} placeholder="Qty" style={{ padding: "8px 10px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text }} />
            <input value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} placeholder="Unit" style={{ padding: "8px 10px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text }} />
            <input type="date" value={newItem.expiry} onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })} style={{ padding: "8px 10px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleAdd} style={{ padding: "8px 16px", background: colors.accent, color: colors.card, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>Add</button>
            <button onClick={() => setShowAdd(false)} style={{ padding: "8px 16px", background: colors.border, color: colors.text, border: "none", borderRadius: 6, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {!showAdd && <button onClick={() => setShowAdd(true)} style={{ marginBottom: 20, padding: "10px 20px", background: colors.accent, color: colors.card, border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}><Plus size={16} /> Add Item</button>}

      <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}`, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              {["Item", "Qty", "Unit", "Expiry", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "10px 8px", textAlign: "left", fontSize: 11, fontWeight: 700, color: colors.accent, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              editId === item.id ? (
                <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ padding: "10px 8px" }}><input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                  <td style={{ padding: "10px 8px" }}><input type="number" value={editData.qty} onChange={(e) => setEditData({ ...editData, qty: parseFloat(e.target.value) })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                  <td style={{ padding: "10px 8px" }}><input value={editData.unit} onChange={(e) => setEditData({ ...editData, unit: e.target.value })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                  <td style={{ padding: "10px 8px" }}><input type="date" value={editData.expiry} onChange={(e) => setEditData({ ...editData, expiry: e.target.value })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                  <td style={{ padding: "10px 8px" }}><select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }}><option>ok</option><option>low</option><option>expiring</option></select></td>
                  <td style={{ padding: "10px 8px", display: "flex", gap: 6 }}>
                    <button onClick={handleSaveEdit} style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 4, padding: "6px 10px", cursor: "pointer", fontSize: 12 }}>Save</button>
                    <button onClick={() => setEditId(null)} style={{ background: colors.border, color: colors.text, border: "none", borderRadius: 4, padding: "6px 10px", cursor: "pointer", fontSize: 12 }}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ padding: "10px 8px", fontSize: 12, fontWeight: 600, color: colors.text }}>{item.name}</td>
                  <td style={{ padding: "10px 8px", fontSize: 12, color: colors.text }}>{item.qty}</td>
                  <td style={{ padding: "10px 8px", fontSize: 12, color: colors.text }}>{item.unit}</td>
                  <td style={{ padding: "10px 8px", fontSize: 12, color: colors.text }}>{item.expiry}</td>
                  <td style={{ padding: "10px 8px" }}><span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: item.status === "ok" ? "#d1fae5" : item.status === "low" ? "#fef3c7" : "#fee2e2", color: item.status === "ok" ? "#065f46" : item.status === "low" ? "#92400e" : "#991b1b" }}>{item.status}</span></td>
                  <td style={{ padding: "10px 8px", display: "flex", gap: 6 }}>
                    <button onClick={() => { setEditId(item.id); setEditData(item); }} style={{ background: colors.accent, color: colors.card, border: "none", borderRadius: 4, padding: "6px 10px", cursor: "pointer" }}><Edit2 size={12} /></button>
                    <button onClick={() => setItems(items.filter(i => i.id !== item.id))} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, padding: "6px 10px", cursor: "pointer" }}><Trash2 size={12} /></button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Budget View ────────────────────────────────────
function BudgetView({ colors, user }) {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("groceryOS_expenses");
    return saved ? JSON.parse(saved) : [
      { id: 1, date: "2025-06-01", item: "Chicken", category: "Protein", amount: 280, type: "weekly" },
      { id: 2, date: "2025-06-01", item: "Rice", category: "Staples", amount: 275, type: "weekly" }
    ];
  });

  useEffect(() => localStorage.setItem("groceryOS_expenses", JSON.stringify(expenses)), [expenses]);

  const weeklyTotal = expenses.filter(e => e.type === "weekly").reduce((s, e) => s + e.amount, 0);
  const monthlyTotal = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.text, margin: "0 0 20px" }}>Budget & Expenses</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Monthly Budget", value: "₱" + (user.monthlyBudget || 8000), color: colors.accent },
          { label: "Weekly Spent", value: "₱" + weeklyTotal, color: "#d97706" },
          { label: "Monthly Spent", value: "₱" + monthlyTotal, color: "#ef4444" }
        ].map(card => (
          <div key={card.label} style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: card.color, textTransform: "uppercase", marginBottom: 8 }}>{card.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: colors.text }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: colors.text }}>All Expenses</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              {["Date", "Item", "Category", "Amount", "Type"].map(h => (
                <th key={h} style={{ padding: "10px 8px", textAlign: "left", fontSize: 11, fontWeight: 700, color: colors.accent, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td style={{ padding: "10px 8px", fontSize: 12, color: colors.text }}>{exp.date}</td>
                <td style={{ padding: "10px 8px", fontSize: 12, fontWeight: 600, color: colors.text }}>{exp.item}</td>
                <td style={{ padding: "10px 8px", fontSize: 12, color: colors.text }}>{exp.category}</td>
                <td style={{ padding: "10px 8px", fontSize: 12, fontWeight: 700, color: colors.text }}>₱{exp.amount}</td>
                <td style={{ padding: "10px 8px" }}><span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: exp.type === "weekly" ? "#dbeafe" : "#f3e8ff", color: exp.type === "weekly" ? "#0c4a6e" : "#6b21a8" }}>{exp.type}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Analytics View ──────────────────────────────────
function AnalyticsView({ colors, user }) {
  const data = [{ m: "Dec", a: 7200 }, { m: "Jan", a: 7800 }, { m: "Feb", a: 6900 }, { m: "Mar", a: 7400 }, { m: "Apr", a: 7100 }, { m: "May", a: 6200 }];
  
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.text, margin: "0 0 20px" }}>Analytics</h1>
      
      <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>
        <h3 style={{ margin: "0 0 14px", color: colors.text, fontWeight: 600 }}>Monthly Spending Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={colors.accent} stopOpacity={0.1}/></linearGradient></defs>
            <XAxis dataKey="m" stroke={colors.border} />
            <YAxis stroke={colors.border} />
            <Tooltip />
            <Area type="monotone" dataKey="a" stroke={colors.accent} fill="url(#g)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Settings View ──────────────────────────────────
function SettingsView({ colors, user }) {
  const [userSettings, setUserSettings] = useState(user);
  const [isEditing, setIsEditing] = useState({});

  const settings = [
    { key: "householdSize", label: "Household Size", editable: true, options: ["1-2 people", "3-4 people", "5-6 people", "7+ people"] },
    { key: "monthlyBudget", label: "Monthly Budget", editable: true },
    { key: "shoppingFrequency", label: "Shopping Frequency", editable: true, options: ["Weekly", "Bi-weekly", "Monthly"] },
    { key: "mealInterest", label: "Meal Planning Interest", editable: true, options: ["Very interested", "Somewhat interested", "Not interested"] }
  ];

  const handleSave = (key, value) => {
    setUserSettings({ ...userSettings, [key]: value });
    localStorage.setItem("groceryOS_user", JSON.stringify({ ...userSettings, [key]: value }));
    setIsEditing({ ...isEditing, [key]: false });
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.text, margin: "0 0 20px" }}>Settings</h1>

      <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>
        {settings.map(setting => (
          <div key={setting.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${colors.border}` }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{setting.label}</div>
              <div style={{ fontSize: 12, color: "#a1a1aa" }}>ID: {setting.key}</div>
            </div>

            {isEditing[setting.key] ? (
              <div style={{ display: "flex", gap: 8 }}>
                {setting.options ? (
                  <select
                    value={userSettings[setting.key] || ""}
                    onChange={(e) => handleSave(setting.key, e.target.value)}
                    style={{ padding: "8px 12px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text }}
                  >
                    {setting.options.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={userSettings[setting.key] || ""}
                    onChange={(e) => handleSave(setting.key, e.target.value)}
                    style={{ padding: "8px 12px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text }}
                  />
                )}
                <button onClick={() => setIsEditing({ ...isEditing, [setting.key]: false })} style={{ padding: "8px 12px", background: colors.border, border: "none", borderRadius: 6, cursor: "pointer", color: colors.text }}>Done</button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing({ ...isEditing, [setting.key]: true })}
                style={{ padding: "8px 14px", background: colors.accent, color: colors.card, border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}
              >
                <Edit2 size={14} /> Edit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}