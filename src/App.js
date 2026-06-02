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

// ─── Responsive Hook ─────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

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
export default function GroceryOS() {
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
    <div style={{ minHeight: "100vh", background: "#f0f4f8", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 500, background: "#fff", borderRadius: 20, padding: "28px 20px", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#18181b", margin: "0 0 8px" }}>Welcome to GroceryOS 🛒</h1>
          <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>Let's personalize your experience</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#52525b" }}>Step {step + 1} of {ONBOARDING_QUESTIONS.length}</span>
            <span style={{ fontSize: 12, color: "#a1a1aa" }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: 6, background: "#e4e4e7", borderRadius: 99 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "#18181b", borderRadius: 99, transition: "width 0.3s" }} />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: "#18181b", display: "block", marginBottom: 12 }}>
            {question.label}
          </label>

          {question.type === "select" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
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
                    transition: "all 0.2s",
                    textAlign: "left"
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
              style={{ width: "100%", padding: "12px 14px", border: "1px solid #d4d4d8", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          )}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: "12px 16px", background: "#f4f4f5", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#18181b" }}>
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!answers[question.id]}
            style={{ flex: 1, padding: "12px 16px", background: answers[question.id] ? "#18181b" : "#d4d4d8", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: answers[question.id] ? "pointer" : "default" }}
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
  const isMobile = useIsMobile();

  return (
    <div style={{ background: colors.card, borderBottom: `1px solid ${colors.border}`, padding: isMobile ? "12px 16px" : "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ShoppingBag size={22} color={colors.accent} />
        <h1 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 700, color: colors.text, margin: 0 }}>GroceryOS</h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} style={{ background: colors.accent, color: colors.card, border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center" }}>
          {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        {/* Hide color scheme selector on mobile to save space */}
        {!isMobile && (
          <select value={colorScheme} onChange={(e) => setColorScheme(e.target.value)} style={{ padding: "7px 10px", border: `1px solid ${colors.border}`, borderRadius: 8, background: colors.card, color: colors.text, cursor: "pointer", fontSize: 12 }}>
            {Object.entries(COLORS).map(([key]) => (
              <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
            ))}
          </select>
        )}

        <button onClick={onSignOut} style={{ background: "transparent", border: `1px solid ${colors.border}`, borderRadius: 8, padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: colors.text, fontSize: 12 }}>
          <LogOut size={14} />
          {!isMobile && "Sign Out"}
        </button>
      </div>
    </div>
  );
}

// ─── Main App Navigation ────────────────────────────
function MainApp({ user, colors }) {
  const [view, setView] = useState("dashboard");
  const isMobile = useIsMobile();

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

  if (isMobile) {
    // ── Mobile: bottom tab bar (show 5 most-used tabs) ──
    const MOBILE_TABS = TABS.slice(0, 5); // Dashboard, Meals, Groceries, Pantry, Budget
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 57px)" }}>
        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", background: colors.bg }}>
          {VIEWS[view]}
        </div>

        {/* Bottom Tab Bar */}
        <div style={{ background: colors.card, borderTop: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-around", padding: "6px 0 8px", position: "sticky", bottom: 0, zIndex: 100 }}>
          {MOBILE_TABS.map(tab => {
            const Icon = tab.icon;
            const active = view === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 8px", minWidth: 52 }}
              >
                <Icon size={20} color={active ? colors.accent : "#a1a1aa"} />
                <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: active ? colors.accent : "#a1a1aa" }}>
                  {tab.label.split(" ")[0]}
                </span>
              </button>
            );
          })}
          {/* More button for Analytics & Settings */}
          <button
            onClick={() => setView(view === "analytics" || view === "settings" ? view : "analytics")}
            style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 8px", minWidth: 52 }}
          >
            <Settings size={20} color={view === "analytics" || view === "settings" ? colors.accent : "#a1a1aa"} />
            <span style={{ fontSize: 9, fontWeight: 500, color: view === "analytics" || view === "settings" ? colors.accent : "#a1a1aa" }}>More</span>
          </button>
        </div>
      </div>
    );
  }

  // ── Desktop: sidebar ──
  return (
    <div style={{ display: "flex", height: "calc(100vh - 65px)" }}>
      <div style={{ width: 240, background: colors.card, borderRight: `1px solid ${colors.border}`, overflowY: "auto", padding: "16px 0", flexShrink: 0 }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              style={{ width: "100%", padding: "12px 16px", border: "none", background: view === tab.id ? colors.accent : "transparent", color: view === tab.id ? colors.card : colors.text, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontSize: 13, fontWeight: view === tab.id ? 600 : 500, textAlign: "left" }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", background: colors.bg }}>
        {VIEWS[view]}
      </div>
    </div>
  );
}

// ─── Dashboard View ──────────────────────────────────
function DashboardView({ colors, user, onNavigate }) {
  const isMobile = useIsMobile();
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
      <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: colors.text, margin: "0 0 16px" }}>Dashboard</h1>

      {/* Calendar */}
      <div style={{ background: colors.card, borderRadius: 14, padding: isMobile ? 14 : 20, marginBottom: 16, border: `1px solid ${colors.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: colors.text }}>{today.toLocaleString("default", { month: "long", year: "numeric" })}</h3>
          <span style={{ fontSize: 12, color: colors.text, fontWeight: 600 }}>Today: {today.getDate()}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: isMobile ? 4 : 8, marginBottom: 8 }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: isMobile ? 9 : 11, fontWeight: 700, color: colors.accent, padding: "6px 0" }}>
              {isMobile ? d.slice(0, 1) : d}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: isMobile ? 4 : 8 }}>
          {cal.map((d, i) => (
            <div
              key={i}
              style={{ aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, fontSize: isMobile ? 10 : 12, fontWeight: d.isToday ? 700 : 500, background: d.isToday ? colors.accent : d.isThisMonth ? colors.bg : "transparent", color: d.isToday ? colors.card : d.isThisMonth ? colors.text : colors.accent, border: d.isToday ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`, cursor: "pointer" }}
            >
              {d.date.getDate()}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards — 2 columns on mobile, 4 on desktop */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 10 : 16, marginBottom: 16 }}>
        {cards.map(card => (
          <div
            key={card.label}
            onClick={card.onClick}
            style={{ background: colors.card, borderRadius: 12, padding: isMobile ? 14 : 20, border: `1px solid ${colors.border}`, cursor: "pointer" }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: card.color, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
              {card.label}
            </div>
            <div style={{ fontSize: isMobile ? 20 : 28, fontWeight: 700, color: colors.text }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Today's Overview */}
      <div style={{ background: colors.card, borderRadius: 14, padding: isMobile ? 14 : 20, border: `1px solid ${colors.border}` }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: colors.text }}>Today's Overview</h3>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: colors.accent, marginBottom: 6, textTransform: "uppercase" }}>Today's Meals</div>
            <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.7 }}>
              ☀️ Champorado<br />
              🌤 Chicken Adobo<br />
              🌙 Sinigang na Baboy
            </div>
          </div>
          <div style={{ marginTop: isMobile ? 10 : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: colors.accent, marginBottom: 6, textTransform: "uppercase" }}>Budget Status</div>
            <div style={{ fontSize: 13, color: colors.text }}>
              Remaining: <span style={{ fontWeight: 700, color: colors.accent }}>₱1,800</span><br />
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
  const isMobile = useIsMobile();
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

  // Mobile: show one day at a time
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div>
      <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: colors.text, margin: "0 0 16px" }}>Meal Planner</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {["weekly", "biweekly"].map(type => (
          <button
            key={type}
            onClick={() => setPlanType(type)}
            style={{ padding: "9px 16px", border: `1px solid ${colors.border}`, borderRadius: 8, background: planType === type ? colors.accent : colors.card, color: planType === type ? colors.card : colors.text, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
          >
            {type === "weekly" ? "7 Days" : "14 Days"}
          </button>
        ))}
      </div>

      {isMobile ? (
        // Mobile meal planner: day tabs + column layout
        <div>
          {/* Day Selector */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 4 }}>
            {Array.from({ length: days }, (_, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                style={{ flexShrink: 0, padding: "8px 12px", border: `1px solid ${colors.border}`, borderRadius: 8, background: activeDay === i ? colors.accent : colors.card, color: activeDay === i ? colors.card : colors.text, cursor: "pointer", fontWeight: 600, fontSize: 12 }}
              >
                {DAYS[i % 7]}
              </button>
            ))}
          </div>

          <div style={{ background: colors.card, borderRadius: 14, padding: 14, border: `1px solid ${colors.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 12 }}>Day {activeDay + 1} — {DAYS[activeDay % 7]}</div>
            {mealCategories.map(meal => (
              <div key={meal.id} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: colors.accent, display: "block", marginBottom: 6 }}>{meal.icon} {meal.label}</label>
                <select
                  value={meals[`day${activeDay}_${meal.id}`] || "None"}
                  onChange={(e) => setMeals({ ...meals, [`day${activeDay}_${meal.id}`]: e.target.value })}
                  style={{ width: "100%", padding: "10px", border: `2px solid ${colors.border}`, borderRadius: 8, background: colors.bg, color: colors.text, fontSize: 13, fontWeight: 600 }}
                >
                  {recipes.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Desktop meal planner: full grid
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}`, overflowX: "auto" }}>
          <div style={{ minWidth: 600 }}>
            <div style={{ display: "grid", gridTemplateColumns: `120px repeat(${days}, 1fr)`, gap: 8, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: colors.accent, fontSize: 12 }}>MEAL</div>
              {Array.from({ length: days }, (_, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: colors.accent, fontWeight: 700 }}>{DAYS[i % 7]}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>Day {i + 1}</div>
                </div>
              ))}
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
                        style={{ width: "100%", padding: "8px 6px", border: `2px solid ${colors.border}`, borderRadius: 8, background: colors.bg, color: colors.text, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                      >
                        {recipes.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Meal Times Editor */}
      <div style={{ marginTop: 16, background: colors.card, borderRadius: 14, padding: isMobile ? 14 : 20, border: `1px solid ${colors.border}` }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: colors.text }}>Meal Times</h3>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
          {mealCategories.map(meal => (
            <div key={meal.id}>
              <label style={{ fontSize: 12, fontWeight: 600, color: colors.accent, display: "block", marginBottom: 5 }}>{meal.label}</label>
              <input
                type="time"
                value={mealTimes[meal.id]}
                onChange={(e) => setMealTimes({ ...mealTimes, [meal.id]: e.target.value })}
                style={{ width: "100%", padding: "8px 10px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text, fontSize: 13, boxSizing: "border-box" }}
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
  const isMobile = useIsMobile();
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

  const inputStyle = { padding: "8px 10px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text, fontSize: 13, width: "100%", boxSizing: "border-box" };

  return (
    <div>
      <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: colors.text, margin: "0 0 16px" }}>Grocery Lists</h1>

      {/* Add Form */}
      {showAddForm && (
        <div style={{ background: colors.card, borderRadius: 14, padding: 16, marginBottom: 16, border: `1px solid ${colors.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 10, marginBottom: 10 }}>
            <select value={newItem.type} onChange={(e) => setNewItem({ ...newItem, type: e.target.value })} style={inputStyle}>
              {["Protein", "Vegetables", "Fruits", "Dairy", "Staples"].map(t => <option key={t}>{t}</option>)}
            </select>
            <input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="Product name" style={inputStyle} />
            <select value={newItem.location} onChange={(e) => setNewItem({ ...newItem, location: e.target.value })} style={{ ...inputStyle, gridColumn: isMobile ? "span 2" : "auto" }}>
              <option>Grocery</option>
              <option>Wet Market</option>
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 90px", gap: 10 }}>
            <input type="number" value={newItem.qty} onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })} placeholder="Qty" style={inputStyle} />
            <input value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} placeholder="Unit" style={inputStyle} />
            <input type="number" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} placeholder="Price" style={inputStyle} />
            <button onClick={handleAdd} style={{ padding: "8px", background: colors.accent, color: colors.card, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", gridColumn: isMobile ? "span 2" : "auto" }}>Add</button>
          </div>
        </div>
      )}

      {!showAddForm && (
        <button onClick={() => setShowAddForm(true)} style={{ marginBottom: 16, padding: "10px 18px", background: colors.accent, color: colors.card, border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <Plus size={15} /> Add Item
        </button>
      )}

      {isMobile ? (
        // Mobile: card list instead of table
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: colors.card, borderRadius: 12, padding: 14, border: `1px solid ${colors.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: "#a1a1aa", marginTop: 2 }}>{item.type} · {item.location}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: colors.accent }}>₱{item.total.toFixed(2)}</div>
              </div>
              <div style={{ fontSize: 12, color: colors.text, marginBottom: 10 }}>
                {item.qty} {item.unit} × ₱{item.price.toFixed(2)}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setEditId(item.id); setEditData(item); }} style={{ flex: 1, padding: "7px", background: colors.accent, color: colors.card, border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ flex: 1, padding: "7px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Desktop: table
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}`, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 540 }}>
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
                    <td style={{ padding: "8px" }}><input value={editData.type} onChange={(e) => setEditData({ ...editData, type: e.target.value })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                    <td style={{ padding: "8px" }}><input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                    <td style={{ padding: "8px" }}><input type="number" value={editData.qty} onChange={(e) => setEditData({ ...editData, qty: parseFloat(e.target.value) })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                    <td style={{ padding: "8px" }}><input value={editData.location} onChange={(e) => setEditData({ ...editData, location: e.target.value })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                    <td style={{ padding: "8px" }}><input type="number" value={editData.price} onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                    <td style={{ padding: "8px", fontSize: 13, fontWeight: 700, color: colors.text }}>₱{(editData.qty * editData.price).toFixed(2)}</td>
                    <td style={{ padding: "8px", display: "flex", gap: 6 }}>
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
      )}

      {/* Summary */}
      <div style={{ marginTop: 16, background: colors.accent, color: colors.card, borderRadius: 14, padding: isMobile ? 16 : 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>TOTAL GROCERY LIST</div>
          <div style={{ fontSize: isMobile ? 24 : 32, fontWeight: 700, marginTop: 4 }}>₱{total.toFixed(2)}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, opacity: 0.8 }}>{items.length} items</div>
          <div style={{ fontSize: isMobile ? 14 : 18, fontWeight: 700, marginTop: 4 }}>Ready to shop</div>
        </div>
      </div>
    </div>
  );
}

// ─── Pantry View ────────────────────────────────────
function PantryView({ colors, user }) {
  const isMobile = useIsMobile();
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

  const inputStyle = { padding: "8px 10px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text, fontSize: 13, width: "100%", boxSizing: "border-box" };

  const statusBadge = (status) => (
    <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: status === "ok" ? "#d1fae5" : status === "low" ? "#fef3c7" : "#fee2e2", color: status === "ok" ? "#065f46" : status === "low" ? "#92400e" : "#991b1b" }}>{status}</span>
  );

  return (
    <div>
      <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: colors.text, margin: "0 0 16px" }}>Pantry Inventory</h1>

      {showAdd && (
        <div style={{ background: colors.card, borderRadius: 14, padding: 16, marginBottom: 16, border: `1px solid ${colors.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
            <input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="Item name" style={{ ...inputStyle, gridColumn: isMobile ? "span 2" : "auto" }} />
            <input type="number" value={newItem.qty} onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })} placeholder="Qty" style={inputStyle} />
            <input value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} placeholder="Unit" style={inputStyle} />
            <input type="date" value={newItem.expiry} onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })} style={{ ...inputStyle, gridColumn: isMobile ? "span 2" : "auto" }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleAdd} style={{ padding: "8px 16px", background: colors.accent, color: colors.card, border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>Add</button>
            <button onClick={() => setShowAdd(false)} style={{ padding: "8px 16px", background: colors.border, color: colors.text, border: "none", borderRadius: 6, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {!showAdd && (
        <button onClick={() => setShowAdd(true)} style={{ marginBottom: 16, padding: "10px 18px", background: colors.accent, color: colors.card, border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <Plus size={15} /> Add Item
        </button>
      )}

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: colors.card, borderRadius: 12, padding: 14, border: `1px solid ${colors.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{item.name}</div>
                {statusBadge(item.status)}
              </div>
              <div style={{ fontSize: 12, color: colors.text, marginBottom: 10 }}>
                {item.qty} {item.unit} · Exp: {item.expiry || "—"}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setEditId(item.id); setEditData(item); }} style={{ flex: 1, padding: "7px", background: colors.accent, color: colors.card, border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Edit</button>
                <button onClick={() => setItems(items.filter(i => i.id !== item.id))} style={{ flex: 1, padding: "7px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}`, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
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
                    <td style={{ padding: "8px" }}><input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                    <td style={{ padding: "8px" }}><input type="number" value={editData.qty} onChange={(e) => setEditData({ ...editData, qty: parseFloat(e.target.value) })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                    <td style={{ padding: "8px" }}><input value={editData.unit} onChange={(e) => setEditData({ ...editData, unit: e.target.value })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                    <td style={{ padding: "8px" }}><input type="date" value={editData.expiry} onChange={(e) => setEditData({ ...editData, expiry: e.target.value })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }} /></td>
                    <td style={{ padding: "8px" }}><select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} style={{ width: "100%", padding: "6px", border: `1px solid ${colors.border}`, borderRadius: 4, background: colors.bg, color: colors.text }}><option>ok</option><option>low</option><option>expiring</option></select></td>
                    <td style={{ padding: "8px", display: "flex", gap: 6 }}>
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
                    <td style={{ padding: "10px 8px" }}>{statusBadge(item.status)}</td>
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
      )}
    </div>
  );
}

// ─── Budget View ────────────────────────────────────
function BudgetView({ colors, user }) {
  const isMobile = useIsMobile();
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
      <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: colors.text, margin: "0 0 16px" }}>Budget & Expenses</h1>

      {/* Budget cards — 1 column on mobile, 3 on desktop */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 10 : 16, marginBottom: 16 }}>
        {[
          { label: "Monthly Budget", value: "₱" + (user.monthlyBudget || 8000), color: colors.accent },
          { label: "Weekly Spent", value: "₱" + weeklyTotal, color: "#d97706" },
          { label: "Monthly Spent", value: "₱" + monthlyTotal, color: "#ef4444" }
        ].map(card => (
          <div key={card.label} style={{ background: colors.card, borderRadius: 12, padding: isMobile ? 14 : 20, border: `1px solid ${colors.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: card.color, textTransform: "uppercase", marginBottom: 6 }}>{card.label}</div>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: colors.text }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: colors.card, borderRadius: 14, padding: isMobile ? 14 : 20, border: `1px solid ${colors.border}`, overflowX: "auto" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: colors.text }}>All Expenses</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? 380 : "auto" }}>
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
  const isMobile = useIsMobile();
  const data = [{ m: "Dec", a: 7200 }, { m: "Jan", a: 7800 }, { m: "Feb", a: 6900 }, { m: "Mar", a: 7400 }, { m: "Apr", a: 7100 }, { m: "May", a: 6200 }];

  return (
    <div>
      <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: colors.text, margin: "0 0 16px" }}>Analytics</h1>

      <div style={{ background: colors.card, borderRadius: 14, padding: isMobile ? 14 : 20, border: `1px solid ${colors.border}` }}>
        <h3 style={{ margin: "0 0 14px", color: colors.text, fontWeight: 600, fontSize: 14 }}>Monthly Spending Trend</h3>
        <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
          <AreaChart data={data}>
            <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={colors.accent} stopOpacity={0.1} /></linearGradient></defs>
            <XAxis dataKey="m" stroke={colors.border} tick={{ fontSize: 11 }} />
            <YAxis stroke={colors.border} tick={{ fontSize: 11 }} width={50} />
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
  const isMobile = useIsMobile();
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
      <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: colors.text, margin: "0 0 16px" }}>Settings</h1>

      <div style={{ background: colors.card, borderRadius: 14, padding: isMobile ? 14 : 20, border: `1px solid ${colors.border}` }}>
        {settings.map(setting => (
          <div key={setting.key} style={{ padding: "14px 0", borderBottom: `1px solid ${colors.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile && isEditing[setting.key] ? "flex-start" : "center", flexWrap: isMobile ? "wrap" : "nowrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{setting.label}</div>
                <div style={{ fontSize: 12, color: "#a1a1aa" }}>{userSettings[setting.key] || "Not set"}</div>
              </div>

              {isEditing[setting.key] ? (
                <div style={{ display: "flex", gap: 8, width: isMobile ? "100%" : "auto" }}>
                  {setting.options ? (
                    <select value={userSettings[setting.key] || ""} onChange={(e) => handleSave(setting.key, e.target.value)} style={{ flex: 1, padding: "8px 12px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text }}>
                      {setting.options.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={userSettings[setting.key] || ""} onChange={(e) => handleSave(setting.key, e.target.value)} style={{ flex: 1, padding: "8px 12px", border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.bg, color: colors.text }} />
                  )}
                  <button onClick={() => setIsEditing({ ...isEditing, [setting.key]: false })} style={{ padding: "8px 12px", background: colors.border, border: "none", borderRadius: 6, cursor: "pointer", color: colors.text }}>Done</button>
                </div>
              ) : (
                <button onClick={() => setIsEditing({ ...isEditing, [setting.key]: true })} style={{ padding: "8px 14px", background: colors.accent, color: colors.card, border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 6, fontSize: 13, flexShrink: 0 }}>
                  <Edit2 size={13} /> Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}