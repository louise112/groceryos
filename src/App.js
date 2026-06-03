import { useState, useEffect } from "react";
import { LayoutDashboard, ShoppingCart, Package, Wallet, BarChart2, Settings, ShoppingBag, Moon, Sun, LogOut, Edit2, Trash2, Plus, Check, AlertTriangle, Utensils, X, Search, RefreshCw, ChevronLeft, ChevronRight, Bell, User, TrendingUp, TrendingDown, CheckCircle2, Clock } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ── Design tokens ─────────────────────────────────────────────────
const LIGHT = {
  bg: "#f0f2f7", card: "#ffffff", text: "#0f172a", sub: "#64748b",
  border: "#e8ecf4", hover: "#f8faff", accent: "#6366f1",
  accentBg: "#eef2ff", accentText: "#ffffff",
  success: "#10b981", successBg: "#ecfdf5", successText: "#065f46",
  warning: "#f59e0b", warningBg: "#fffbeb", warningText: "#92400e",
  danger: "#ef4444",  dangerBg: "#fef2f2",  dangerText: "#991b1b",
  shadow: "0 1px 3px rgba(0,0,0,.07), 0 4px 12px rgba(0,0,0,.05)",
  shadowHover: "0 4px 6px rgba(0,0,0,.07), 0 8px 24px rgba(0,0,0,.08)",
};
const DARK = {
  bg: "#0f1117", card: "#1e2130", text: "#f1f5f9", sub: "#94a3b8",
  border: "#2d3348", hover: "#252a3a", accent: "#818cf8",
  accentBg: "#1e1f3b", accentText: "#ffffff",
  success: "#34d399", successBg: "#022c22", successText: "#6ee7b7",
  warning: "#fbbf24", warningBg: "#2c1f00", warningText: "#fde68a",
  danger: "#f87171",  dangerBg: "#2c0f0f",  dangerText: "#fca5a5",
  shadow: "0 1px 3px rgba(0,0,0,.3), 0 4px 12px rgba(0,0,0,.25)",
  shadowHover: "0 4px 6px rgba(0,0,0,.35), 0 8px 24px rgba(0,0,0,.3)",
};
const PALETTE = { indigo:"#6366f1", emerald:"#10b981", violet:"#8b5cf6", rose:"#f43f5e", amber:"#f59e0b", sky:"#0ea5e9" };
const MEAL_PRESETS = {
  omad:   { label:"OMAD (1 meal)",     slots:[{ id:"meal1", name:"Main Meal", time:"13:00" }] },
  two:    { label:"2 Meals",           slots:[{ id:"meal1", name:"Breakfast", time:"08:00" },{ id:"meal2", name:"Dinner", time:"18:00" }] },
  three:  { label:"3 Meals",           slots:[{ id:"meal1", name:"Breakfast", time:"08:00" },{ id:"meal2", name:"Lunch", time:"12:00" },{ id:"meal3", name:"Dinner", time:"18:00" }] },
  snacks: { label:"3 Meals + Snacks",  slots:[{ id:"meal1", name:"Breakfast", time:"08:00" },{ id:"meal2", name:"Lunch", time:"12:00" },{ id:"meal3", name:"Dinner", time:"18:00" },{ id:"snack1", name:"Snack", time:"15:00" }] },
  custom: { label:"Custom",            slots:[] }
};
const DEFAULT_RECIPES = [
  { id:1, name:"Chicken Adobo",     ingredients:["Chicken 1kg","Soy Sauce 3tbsp","Vinegar 3tbsp","Garlic 4 cloves","Bay leaves 2pcs"],    instructions:"Marinate chicken. Simmer 30 mins.", time:"40 min", servings:4 },
  { id:2, name:"Sinigang na Baboy", ingredients:["Pork 1kg","Sampalok mix","Kangkong 1 bundle","Tomato 2pcs","Onion 1pc"],                 instructions:"Boil pork. Add sampalok. Add veggies last 5 mins.", time:"50 min", servings:4 },
  { id:3, name:"Tinola",            ingredients:["Chicken 1kg","Ginger 50g","Sayote 1pc","Malunggay leaves","Fish sauce 2tbsp"],           instructions:"Sauté ginger & chicken. Add water. Simmer 30 mins.", time:"45 min", servings:4 },
  { id:4, name:"Champorado",        ingredients:["Malagkit rice 1 cup","Cocoa powder 3tbsp","Sugar 4tbsp","Milk to taste"],                instructions:"Cook rice porridge. Mix in cocoa & sugar.", time:"25 min", servings:3 },
];
const OB_QS = [
  { id:"householdSize", label:"How many people in your household?", type:"select", options:["Just me","2 people","3–4 people","5+ people"] },
  { id:"monthlyBudget", label:"Monthly grocery budget (₱)?",        type:"number", placeholder:"e.g. 8000" },
  { id:"shoppingFreq",  label:"How often do you shop?",             type:"select", options:["Weekly","Bi-weekly","Monthly","As needed"] },
  { id:"mealPreset",    label:"What's your meal structure?",         type:"select", options:Object.entries(MEAL_PRESETS).map(([,v])=>v.label) }
];

function ls(k,d){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch{ return d; } }
function lss(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} }
function toKey(d){ return d.toISOString().split("T")[0]; }
function addDays(d,n){ const r=new Date(d); r.setDate(r.getDate()+n); return r; }

// ── Shared UI Primitives ──────────────────────────────────────────
function Card({ t, children, style={}, onClick }){
  const base = { background:t.card, border:`1px solid ${t.border}`, borderRadius:16, padding:"20px 22px", boxShadow:t.shadow, ...style };
  if(onClick) return <div style={{ ...base, cursor:"pointer", transition:"box-shadow .2s, transform .2s" }} onClick={onClick} onMouseOver={e=>{ e.currentTarget.style.boxShadow=t.shadowHover; e.currentTarget.style.transform="translateY(-2px)"; }} onMouseOut={e=>{ e.currentTarget.style.boxShadow=t.shadow; e.currentTarget.style.transform=""; }}>{children}</div>;
  return <div style={base}>{children}</div>;
}
function StatCard({ t, label, value, sub, color, icon:Icon, onClick }){
  return (
    <Card t={t} onClick={onClick} style={{ padding:"18px 20px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <span style={{ fontSize:12, fontWeight:600, color:t.sub, textTransform:"uppercase", letterSpacing:".05em" }}>{label}</span>
        {Icon && <div style={{ width:32, height:32, borderRadius:9, background:color+"22", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon size={16} color={color}/></div>}
      </div>
      <div style={{ fontSize:26, fontWeight:700, color:t.text, lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:t.sub, marginTop:6 }}>{sub}</div>}
    </Card>
  );
}
function Pill({ label, color, bg }){ return <span style={{ fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:99, background:bg, color, display:"inline-flex", alignItems:"center" }}>{label}</span>; }
function Btn({ children, style={}, variant="primary", t, ...p }){
  const vars = { primary:{ bg:t?.accent||"#6366f1", color:"#fff" }, secondary:{ bg:t?.border||"#e8ecf4", color:t?.text||"#0f172a" }, ghost:{ bg:"transparent", color:t?.sub||"#64748b" }, danger:{ bg:"#fef2f2", color:"#ef4444" } };
  const v = vars[variant]||vars.primary;
  return <button {...p} style={{ padding:"9px 16px", border:"none", borderRadius:10, fontWeight:600, fontSize:13, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:6, background:v.bg, color:v.color, transition:"opacity .15s", ...style }}>{children}</button>;
}
function Input({ style={}, t, ...p }){ return <input {...p} style={{ padding:"9px 13px", border:`1px solid ${t.border}`, borderRadius:10, fontSize:13, background:t.card, color:t.text, outline:"none", boxSizing:"border-box", ...style }}/>; }
function Select({ style={}, t, children, ...p }){ return <select {...p} style={{ padding:"9px 13px", border:`1px solid ${t.border}`, borderRadius:10, fontSize:13, background:t.card, color:t.text, outline:"none", boxSizing:"border-box", cursor:"pointer", ...style }}>{children}</select>; }
function SectionHeader({ title, action }){ return <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}><h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>{title}</h1>{action}</div>; }
function Tag({ label, t, onRemove, onInfo }){
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:t.accentBg, color:t.accent, fontSize:11, fontWeight:600, padding:"3px 8px", borderRadius:7, border:`1px solid ${t.accent}22` }}>
      {label}
      {onInfo && <button onClick={onInfo} style={{ background:"none", border:"none", cursor:"pointer", color:t.accent, padding:0, fontSize:11, lineHeight:1 }}>ℹ</button>}
      {onRemove && <button onClick={onRemove} style={{ background:"none", border:"none", cursor:"pointer", color:t.accent, padding:0, lineHeight:1 }}><X size={10}/></button>}
    </span>
  );
}

// ── Root ──────────────────────────────────────────────────────────
export default function App(){
  const [screen, setScreen]       = useState(()=> ls("gos_user",null) ? "app" : "welcome");
  const [user, setUser]           = useState(()=> ls("gos_user",null));
  const [theme, setTheme]         = useState(()=> ls("gos_theme","light"));
  const [colorKey, setColorKey]   = useState(()=> ls("gos_color","indigo"));
  useEffect(()=>lss("gos_theme",theme),[theme]);
  useEffect(()=>lss("gos_color",colorKey),[colorKey]);

  const accent = PALETTE[colorKey];
  const base   = theme==="light" ? LIGHT : DARK;
  const t      = { ...base, accent, accentBg: accent+"18" };

  const saveUser = u => { lss("gos_user",u); setUser(u); setScreen("app"); };
  const signOut  = () => { lss("gos_user",null); setUser(null); setScreen("welcome"); };

  return (
    <div style={{ background:t.bg, color:t.text, minHeight:"100vh", fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',sans-serif" }}>
      {screen==="welcome"  && <WelcomePage t={t} onStart={()=>setScreen("onboarding")}/>}
      {screen==="onboarding" && <Onboarding t={t} onComplete={saveUser}/>}
      {screen==="app" && user && <Shell t={t} user={user} setUser={u=>{lss("gos_user",u);setUser(u);}} theme={theme} setTheme={setTheme} colorKey={colorKey} setColorKey={setColorKey} onSignOut={signOut}/>}
    </div>
  );
}

// ── Welcome Page ──────────────────────────────────────────────────
function WelcomePage({ t, onStart }){
  const features = [
    { icon:LayoutDashboard, label:"Smart Dashboard",  desc:"Live budget tracking, calendar, and meal overview at a glance." },
    { icon:Utensils,        label:"Meal Planner",      desc:"Plan OMAD to multi-slot meals with a custom recipe library." },
    { icon:ShoppingCart,    label:"Grocery Workflow",  desc:"Complete grocery runs with pantry auto-sync and smart rollover." },
    { icon:Package,         label:"Pantry Inventory",  desc:"Track expiry dates, stock levels, and get timely alerts." },
  ];
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      {/* Nav */}
      <div style={{ padding:"18px 40px", display:"flex", justifyContent:"space-between", alignItems:"center", background:t.card, borderBottom:`1px solid ${t.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:t.accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <ShoppingBag size={18} color="#fff"/>
          </div>
          <span style={{ fontSize:18, fontWeight:700, color:t.text }}>GroceryOS</span>
        </div>
        <button onClick={onStart} style={{ background:t.accent, color:"#fff", border:"none", borderRadius:10, padding:"9px 20px", fontWeight:600, fontSize:14, cursor:"pointer" }}>Get Started →</button>
      </div>

      {/* Hero */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"60px 32px 40px" }}>
        <div style={{ width:72, height:72, borderRadius:20, background:t.accent, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24, boxShadow:`0 12px 32px ${t.accent}44` }}>
          <ShoppingBag size={34} color="#fff"/>
        </div>
        <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:t.accentBg, color:t.accent, border:`1px solid ${t.accent}33`, borderRadius:99, padding:"5px 14px", fontSize:12, fontWeight:600, marginBottom:18 }}>
          ✨ Your smart grocery companion
        </div>
        <h1 style={{ fontSize:48, fontWeight:800, color:t.text, margin:"0 0 16px", lineHeight:1.1, maxWidth:580 }}>
          Grocery planning,<br/><span style={{ color:t.accent }}>finally organized.</span>
        </h1>
        <p style={{ fontSize:16, color:t.sub, maxWidth:460, lineHeight:1.7, margin:"0 0 36px" }}>
          Plan meals, track your pantry, manage your grocery budget — all in one beautifully simple app designed for Filipino households.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={onStart} style={{ background:t.accent, color:"#fff", border:"none", borderRadius:12, padding:"13px 32px", fontWeight:700, fontSize:15, cursor:"pointer", boxShadow:`0 8px 24px ${t.accent}44` }}>
            Start for free →
          </button>
          <button style={{ background:t.card, color:t.text, border:`1px solid ${t.border}`, borderRadius:12, padding:"13px 28px", fontWeight:600, fontSize:15, cursor:"pointer" }}>
            See how it works
          </button>
        </div>

        {/* Stats bar */}
        <div style={{ display:"flex", gap:40, marginTop:52, paddingTop:32, borderTop:`1px solid ${t.border}`, flexWrap:"wrap", justifyContent:"center" }}>
          {[["4 min","Quick setup"],["₱0","Always free"],["100%","Private & local"]].map(([v,l])=>(
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:26, fontWeight:800, color:t.accent }}>{v}</div>
              <div style={{ fontSize:13, color:t.sub, marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding:"40px 40px 60px", background:t.card, borderTop:`1px solid ${t.border}` }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:13, fontWeight:600, color:t.accent, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>Everything you need</div>
          <h2 style={{ fontSize:26, fontWeight:700, color:t.text, margin:0 }}>Built around your kitchen workflow</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, maxWidth:900, margin:"0 auto" }}>
          {features.map(f=>{
            const Icon=f.icon;
            return (
              <div key={f.label} style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:14, padding:"20px 18px" }}>
                <div style={{ width:40, height:40, borderRadius:11, background:t.accentBg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                  <Icon size={18} color={t.accent}/>
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:t.text, marginBottom:6 }}>{f.label}</div>
                <div style={{ fontSize:12, color:t.sub, lineHeight:1.6 }}>{f.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Onboarding ────────────────────────────────────────────────────
function Onboarding({ t, onComplete }){
  const [step, setStep] = useState(0);
  const [ans, setAns]   = useState({});
  const q   = OB_QS[step];
  const pct = ((step+1)/OB_QS.length)*100;
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:460 }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"center", marginBottom:36 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:t.accent, display:"flex", alignItems:"center", justifyContent:"center" }}><ShoppingBag size={20} color="#fff"/></div>
          <span style={{ fontSize:20, fontWeight:700, color:t.text }}>GroceryOS</span>
        </div>

        <Card t={t} style={{ padding:"32px 36px" }}>
          {/* Step indicator */}
          <div style={{ display:"flex", gap:8, marginBottom:28 }}>
            {OB_QS.map((_,i)=>(
              <div key={i} style={{ flex:1, height:4, borderRadius:99, background: i<=step ? t.accent : t.border, transition:"background .3s" }}/>
            ))}
          </div>

          <div style={{ fontSize:12, fontWeight:600, color:t.sub, textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>Step {step+1} of {OB_QS.length}</div>
          <h2 style={{ fontSize:20, fontWeight:700, color:t.text, margin:"0 0 22px", lineHeight:1.3 }}>{q.label}</h2>

          {q.type==="select" ? (
            <div style={{ display:"grid", gap:9, marginBottom:28 }}>
              {q.options.map(o=>(
                <button key={o} onClick={()=>setAns({...ans,[q.id]:o})} style={{ padding:"12px 16px", border:`1.5px solid ${ans[q.id]===o ? t.accent : t.border}`, background: ans[q.id]===o ? t.accentBg : t.card, borderRadius:11, fontSize:14, cursor:"pointer", fontWeight: ans[q.id]===o ? 600 : 400, color: ans[q.id]===o ? t.accent : t.text, textAlign:"left", display:"flex", alignItems:"center", justifyContent:"space-between", transition:"all .15s" }}>
                  {o}
                  {ans[q.id]===o && <CheckCircle2 size={17} color={t.accent}/>}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ marginBottom:28 }}>
              <Input t={t} type="number" value={ans[q.id]||""} onChange={e=>setAns({...ans,[q.id]:e.target.value})} placeholder={q.placeholder} style={{ width:"100%", fontSize:15, padding:"12px 15px" }}/>
            </div>
          )}

          <div style={{ display:"flex", gap:10 }}>
            {step>0 && <Btn t={t} variant="secondary" onClick={()=>setStep(step-1)} style={{ flex:1 }}>← Back</Btn>}
            <Btn t={t} onClick={()=>{ if(!ans[q.id]) return; if(step<OB_QS.length-1) setStep(step+1); else{ const pk=Object.keys(MEAL_PRESETS).find(k=>MEAL_PRESETS[k].label===ans.mealPreset)||"three"; onComplete({id:Date.now(),...ans,mealPresetKey:pk,createdAt:new Date().toISOString()}); }}} style={{ flex:1, opacity:ans[q.id]?1:.45, justifyContent:"center", padding:"11px" }}>
              {step===OB_QS.length-1 ? "Get Started 🎉" : "Continue →"}
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Shell ─────────────────────────────────────────────────────────
function Shell({ t, user, setUser, theme, setTheme, colorKey, setColorKey, onSignOut }){
  const [view, setView]           = useState("dashboard");
  const [runModal, setRunModal]   = useState(false);
  const [groceries, setGroceries] = useState(()=>ls("gos_g",[
    { id:1, type:"Protein",    name:"Chicken",  qty:2,   unit:"kg",  location:"Wet Market", price:280, total:560,  purchased:false, status:"pending" },
    { id:2, type:"Vegetables", name:"Tomatoes", qty:500, unit:"g",   location:"Wet Market", price:60,  total:60,   purchased:false, status:"pending" },
    { id:3, type:"Staples",    name:"Rice",     qty:5,   unit:"kg",  location:"Grocery",    price:55,  total:275,  purchased:false, status:"pending" },
    { id:4, type:"Dairy",      name:"Eggs",     qty:12,  unit:"pcs", location:"Grocery",    price:12,  total:144,  purchased:false, status:"pending" },
  ]));
  const [pantry, setPantry]         = useState(()=>ls("gos_p",[
    { id:1, name:"Rice",        qty:.5,  unit:"kg",     expiry:"2025-07-05", status:"low" },
    { id:2, name:"Soy Sauce",   qty:.3,  unit:"bottle", expiry:"2025-07-08", status:"expiring" },
    { id:3, name:"Cooking Oil", qty:1,   unit:"bottle", expiry:"2026-01-01", status:"ok" },
    { id:4, name:"Garlic",      qty:5,   unit:"pcs",    expiry:"2025-07-10", status:"expiring" },
  ]));
  const [expenses, setExpenses]     = useState(()=>ls("gos_e",[
    { id:1, date:"2025-06-01", item:"Chicken",  category:"Protein",    amount:560 },
    { id:2, date:"2025-06-01", item:"Rice",     category:"Staples",    amount:275 },
    { id:3, date:"2025-05-15", item:"Tomatoes", category:"Vegetables", amount:60  },
  ]));
  const [mealSlots, setMealSlots] = useState(()=>ls("gos_slots", MEAL_PRESETS[ls("gos_user",{}).mealPresetKey||"three"].slots));
  const [mealPlan,  setMealPlan]  = useState(()=>ls("gos_mp",{}));
  const [recipes,   setRecipes]   = useState(()=>ls("gos_rec",DEFAULT_RECIPES));
  const [notifs,    setNotifs]    = useState(()=>ls("gos_notif",{ expiry:true, budget:true, meals:true }));
  const [rollover,  setRollover]  = useState(()=>ls("gos_roll",[]));

  useEffect(()=>lss("gos_g",groceries),[groceries]);
  useEffect(()=>lss("gos_p",pantry),[pantry]);
  useEffect(()=>lss("gos_e",expenses),[expenses]);
  useEffect(()=>lss("gos_slots",mealSlots),[mealSlots]);
  useEffect(()=>lss("gos_mp",mealPlan),[mealPlan]);
  useEffect(()=>lss("gos_rec",recipes),[recipes]);
  useEffect(()=>lss("gos_notif",notifs),[notifs]);
  useEffect(()=>lss("gos_roll",rollover),[rollover]);

  const TABS = [
    { id:"dashboard", label:"Dashboard",    icon:LayoutDashboard },
    { id:"meals",     label:"Meal Planner", icon:Utensils },
    { id:"groceries", label:"Grocery List", icon:ShoppingCart },
    { id:"pantry",    label:"Pantry",       icon:Package },
    { id:"budget",    label:"Budget",       icon:Wallet },
    { id:"analytics", label:"Analytics",   icon:BarChart2 },
    { id:"settings",  label:"Settings",    icon:Settings },
  ];

  const sp = { t, user, setUser, groceries, setGroceries, pantry, setPantry, expenses, setExpenses, mealSlots, setMealSlots, mealPlan, setMealPlan, recipes, setRecipes, notifs, setNotifs, rollover, setRollover, onNavigate:setView, openRun:()=>setRunModal(true) };

  const initials = (user.householdSize||"U").charAt(0).toUpperCase();
  const expiringCount = pantry.filter(p=>{ if(!p.expiry||p.expiry==="—") return false; const d=new Date(p.expiry); return (d-new Date())/(86400000)<=7&&d>new Date(); }).length;

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
      {/* Sidebar */}
      <div style={{ width:220, background:t.card, borderRight:`1px solid ${t.border}`, display:"flex", flexDirection:"column", flexShrink:0, boxShadow:"2px 0 8px rgba(0,0,0,.04)" }}>
        {/* Logo */}
        <div style={{ padding:"20px 18px 16px", borderBottom:`1px solid ${t.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:11, background:t.accent, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <ShoppingBag size={17} color="#fff"/>
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:t.text, lineHeight:1 }}>GroceryOS</div>
              <div style={{ fontSize:11, color:t.sub, marginTop:2 }}>v2.0</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, overflowY:"auto", padding:"10px 10px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:t.sub, textTransform:"uppercase", letterSpacing:".08em", padding:"8px 8px 6px", marginTop:4 }}>Menu</div>
          {TABS.map(tab=>{
            const Icon=tab.icon;
            const active=view===tab.id;
            return (
              <button key={tab.id} onClick={()=>setView(tab.id)} style={{ width:"100%", padding:"9px 12px", border:"none", background: active ? t.accent : "transparent", color: active ? "#fff" : t.sub, cursor:"pointer", display:"flex", alignItems:"center", gap:10, fontSize:13, fontWeight: active ? 600 : 500, borderRadius:10, marginBottom:2, textAlign:"left", transition:"all .15s" }}
                onMouseOver={e=>{ if(!active){ e.currentTarget.style.background=t.hover; e.currentTarget.style.color=t.text; } }}
                onMouseOut={e=>{ if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=t.sub; } }}>
                <Icon size={16}/>{tab.label}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding:"12px 14px", borderTop:`1px solid ${t.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:99, background:t.accentBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:t.accent, flexShrink:0 }}>{initials}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:600, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.householdSize||"My Household"}</div>
              <div style={{ fontSize:11, color:t.sub }}>{user.shoppingFreq||"Shopper"}</div>
            </div>
            <button onClick={onSignOut} title="Sign out" style={{ background:"none", border:"none", cursor:"pointer", color:t.sub, padding:4, borderRadius:7 }} onMouseOver={e=>e.currentTarget.style.color=t.danger} onMouseOut={e=>e.currentTarget.style.color=t.sub}><LogOut size={14}/></button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Top bar */}
        <div style={{ background:t.card, borderBottom:`1px solid ${t.border}`, padding:"0 24px", height:58, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:t.text }}>{TABS.find(x=>x.id===view)?.label}</div>
            <div style={{ fontSize:12, color:t.sub }}>{new Date().toLocaleDateString("en-PH",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {/* Theme toggle */}
            <button onClick={()=>setTheme(theme==="light"?"dark":"light")} style={{ width:36, height:36, borderRadius:10, background:t.bg, border:`1px solid ${t.border}`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:t.sub }}>
              {theme==="light"?<Moon size={15}/>:<Sun size={15}/>}
            </button>
            {/* Color picker */}
            <div style={{ display:"flex", gap:5, background:t.bg, border:`1px solid ${t.border}`, borderRadius:10, padding:"5px 8px" }}>
              {Object.entries(PALETTE).map(([k,v])=>(
                <button key={k} onClick={()=>{ lss("gos_color",k); window.location.reload(); }} title={k} style={{ width:16, height:16, borderRadius:"50%", background:v, border: colorKey===k ? `2px solid ${t.text}` : "2px solid transparent", cursor:"pointer", padding:0 }}/>
              ))}
            </div>
            {/* Notification bell */}
            <div style={{ position:"relative" }}>
              <button style={{ width:36, height:36, borderRadius:10, background:t.bg, border:`1px solid ${t.border}`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:t.sub }}>
                <Bell size={15}/>
              </button>
              {expiringCount>0 && <span style={{ position:"absolute", top:-3, right:-3, width:16, height:16, borderRadius:"50%", background:t.danger, color:"#fff", fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{expiringCount}</span>}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px 28px" }}>
          {view==="dashboard"  && <DashboardView  {...sp}/>}
          {view==="meals"      && <MealPlannerView {...sp}/>}
          {view==="groceries"  && <GroceryListView {...sp}/>}
          {view==="pantry"     && <PantryView      {...sp}/>}
          {view==="budget"     && <BudgetView      {...sp}/>}
          {view==="analytics"  && <AnalyticsView   {...sp}/>}
          {view==="settings"   && <SettingsView    {...sp}/>}
        </div>
      </div>

      {runModal && <GroceryRunModal t={t} groceries={groceries} setGroceries={setGroceries} pantry={pantry} setPantry={setPantry} setRollover={setRollover} setExpenses={setExpenses} onClose={()=>setRunModal(false)}/>}
    </div>
  );
}

// ── Modal wrapper ─────────────────────────────────────────────────
function Modal({ t, onClose, children, wide=false }){
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, padding:20 }}>
      <div style={{ background:t.card, borderRadius:20, padding:28, width:"100%", maxWidth:wide?580:440, maxHeight:"90vh", overflowY:"auto", position:"relative", boxShadow:"0 24px 64px rgba(0,0,0,.2)" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:t.bg, border:`1px solid ${t.border}`, borderRadius:8, cursor:"pointer", color:t.sub, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center" }}><X size={15}/></button>
        {children}
      </div>
    </div>
  );
}

// ── Grocery Run Modal ─────────────────────────────────────────────
function GroceryRunModal({ t, groceries, setGroceries, pantry, setPantry, setRollover, setExpenses, onClose }){
  const [items, setItems] = useState(groceries.map(g=>({ ...g, runStatus:"purchased", subName:"", partialQty:g.qty })));
  const [done,  setDone]  = useState(false);

  const STATUS_OPTS=[
    { val:"purchased", label:"✅ Purchased" },
    { val:"partial",   label:"⚠️ Partial" },
    { val:"not",       label:"❌ Not Purchased" },
    { val:"sub",       label:"🔄 Substituted" },
  ];

  const completeRun = ()=>{
    const today=new Date().toISOString().split("T")[0];
    const newPantry=[...pantry], newExpenses=[], toRollover=[];
    items.forEach(item=>{
      if(item.runStatus==="purchased"){
        const idx=newPantry.findIndex(p=>p.name.toLowerCase()===item.name.toLowerCase());
        if(idx>-1) newPantry[idx]={...newPantry[idx],qty:newPantry[idx].qty+parseFloat(item.qty),status:"ok"};
        else newPantry.push({ id:Date.now()+Math.random(), name:item.name, qty:parseFloat(item.qty), unit:item.unit, expiry:"", status:"ok" });
        newExpenses.push({ id:Date.now()+Math.random(), date:today, item:item.name, category:item.type, amount:item.total });
      } else if(item.runStatus==="partial"){
        const qty=parseFloat(item.partialQty)||0;
        if(qty>0){ const idx=newPantry.findIndex(p=>p.name.toLowerCase()===item.name.toLowerCase()); if(idx>-1) newPantry[idx]={...newPantry[idx],qty:newPantry[idx].qty+qty}; else newPantry.push({ id:Date.now()+Math.random(), name:item.name, qty, unit:item.unit, expiry:"", status:"low" }); newExpenses.push({ id:Date.now()+Math.random(), date:today, item:item.name, category:item.type, amount:Math.round(item.price*(qty/item.qty)) }); toRollover.push({ ...item, qty:item.qty-qty, total:(item.qty-qty)*item.price }); }
      } else if(item.runStatus==="not"){
        toRollover.push(item);
      } else if(item.runStatus==="sub"){
        const sub={ ...item, name:item.subName||item.name };
        const idx=newPantry.findIndex(p=>p.name.toLowerCase()===sub.name.toLowerCase());
        if(idx>-1) newPantry[idx]={...newPantry[idx],qty:newPantry[idx].qty+parseFloat(item.qty)}; else newPantry.push({ id:Date.now()+Math.random(), name:sub.name, qty:parseFloat(item.qty), unit:item.unit, expiry:"", status:"ok" });
        newExpenses.push({ id:Date.now()+Math.random(), date:today, item:sub.name, category:item.type, amount:item.total });
      }
    });
    setPantry(newPantry); setExpenses(prev=>[...prev,...newExpenses]); setRollover(toRollover); setGroceries(groceries.filter(g=>!toRollover.find(r=>r.id===g.id))); setDone(true);
  };

  if(done) return (
    <Modal t={t} onClose={onClose}>
      <div style={{ textAlign:"center", padding:"16px 0" }}>
        <div style={{ width:64, height:64, borderRadius:99, background:t.successBg, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}><CheckCircle2 size={30} color={t.success}/></div>
        <h2 style={{ fontWeight:700, margin:"0 0 8px", fontSize:20 }}>Grocery Run Complete!</h2>
        <p style={{ fontSize:13, color:t.sub, margin:"0 0 20px" }}>Pantry synced automatically. Expenses logged.</p>
        {ls("gos_roll",[]).length>0 && <div style={{ background:t.warningBg, border:`1px solid ${t.warning}44`, borderRadius:10, padding:"10px 14px", fontSize:13, color:t.warningText, marginBottom:16 }}>⚠️ {ls("gos_roll",[]).length} item(s) rolled over to next run.</div>}
        <Btn t={t} onClick={onClose} style={{ width:"100%", justifyContent:"center", padding:12 }}>Done</Btn>
      </div>
    </Modal>
  );

  return (
    <Modal t={t} onClose={onClose} wide>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontWeight:700, margin:"0 0 4px", fontSize:20 }}>Complete Grocery Run</h2>
        <p style={{ fontSize:13, color:t.sub, margin:0 }}>Mark each item — pantry will sync automatically.</p>
      </div>
      <div style={{ overflowY:"auto", maxHeight:360, marginBottom:16, display:"flex", flexDirection:"column", gap:8 }}>
        {items.map((item,i)=>(
          <div key={item.id} style={{ border:`1px solid ${t.border}`, borderRadius:12, padding:"12px 14px", background:t.bg }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, marginBottom: item.runStatus==="partial"||item.runStatus==="sub" ? 10 : 0 }}>
              <div>
                <div style={{ fontWeight:600, fontSize:14, color:t.text }}>{item.name}</div>
                <div style={{ fontSize:11, color:t.sub, marginTop:2 }}>{item.qty} {item.unit} · ₱{item.total.toLocaleString()}</div>
              </div>
              <Select t={t} value={item.runStatus} onChange={e=>setItems(items.map((it,j)=>j===i?{...it,runStatus:e.target.value}:it))} style={{ fontSize:12 }}>
                {STATUS_OPTS.map(o=><option key={o.val} value={o.val}>{o.label}</option>)}
              </Select>
            </div>
            {item.runStatus==="partial" && <div style={{ display:"flex", alignItems:"center", gap:10 }}><span style={{ fontSize:12, color:t.sub }}>Qty bought:</span><Input t={t} type="number" value={item.partialQty} onChange={e=>setItems(items.map((it,j)=>j===i?{...it,partialQty:e.target.value}:it))} style={{ width:90 }}/></div>}
            {item.runStatus==="sub"     && <div style={{ display:"flex", alignItems:"center", gap:10 }}><span style={{ fontSize:12, color:t.sub }}>Replaced with:</span><Input t={t} value={item.subName} onChange={e=>setItems(items.map((it,j)=>j===i?{...it,subName:e.target.value}:it))} placeholder="Item name" style={{ flex:1 }}/></div>}
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <Btn t={t} onClick={completeRun} style={{ flex:1, justifyContent:"center", padding:12, background:t.success }}>✅ Complete & Sync Pantry</Btn>
        <Btn t={t} variant="secondary" onClick={onClose}>Cancel</Btn>
      </div>
    </Modal>
  );
}

// ── Integrated Calendar ────────────────────────────────────────────
function IntegratedCalendar({ t, mealPlan, mealSlots, pantry }){
  const today=new Date();
  const [cursor,setCursor]=useState({ y:today.getFullYear(), m:today.getMonth() });
  const [selected,setSelected]=useState(toKey(today));
  const firstDay=new Date(cursor.y,cursor.m,1).getDay();
  const dim=new Date(cursor.y,cursor.m+1,0).getDate();
  const cells=Array.from({length:firstDay+dim},(_,i)=> i<firstDay?null:new Date(cursor.y,cursor.m,i-firstDay+1));
  while(cells.length%7!==0) cells.push(null);

  const expiryMap={};
  pantry.forEach(p=>{ if(p.expiry&&p.expiry!=="—"){ const k=p.expiry.slice(0,10); if(!expiryMap[k]) expiryMap[k]=[]; expiryMap[k].push(p.name); } });

  const mealsForDay=dateKey=>mealSlots.map(s=>{ const v=mealPlan[`${dateKey}_${s.id}`]; return v&&v.length?{ slot:s, dishes:Array.isArray(v)?v:[v] }:null; }).filter(Boolean);
  const selMeals=mealsForDay(selected);
  const selExpiry=expiryMap[selected]||[];

  return (
    <Card t={t}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <button onClick={()=>setCursor(p=>{ const d=new Date(p.y,p.m-1,1); return{y:d.getFullYear(),m:d.getMonth()}; })} style={{ width:30, height:30, borderRadius:8, border:`1px solid ${t.border}`, background:t.bg, cursor:"pointer", color:t.sub, display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronLeft size={14}/></button>
        <span style={{ fontWeight:700, fontSize:14, color:t.text }}>{new Date(cursor.y,cursor.m,1).toLocaleString("default",{month:"long",year:"numeric"})}</span>
        <button onClick={()=>setCursor(p=>{ const d=new Date(p.y,p.m+1,1); return{y:d.getFullYear(),m:d.getMonth()}; })} style={{ width:30, height:30, borderRadius:8, border:`1px solid ${t.border}`, background:t.bg, cursor:"pointer", color:t.sub, display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronRight size={14}/></button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:4 }}>
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:700, color:t.accent, padding:"4px 0" }}>{d}</div>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
        {cells.map((d,i)=>{
          if(!d) return <div key={i}/>;
          const key=toKey(d);
          const isToday=key===toKey(today), isSel=key===selected;
          const dayMeals=mealsForDay(key), expItems=expiryMap[key]||[];
          const tc=isSel?"#fff":t.text, sc=isSel?"rgba(255,255,255,.7)":t.sub;
          return (
            <div key={i} onClick={()=>setSelected(key)} style={{ minHeight:60, display:"flex", flexDirection:"column", alignItems:"flex-start", borderRadius:10, fontSize:11, background:isSel?t.accent:isToday?t.accentBg:t.bg, color:tc, border:`1px solid ${isSel?t.accent:isToday?t.accent+"44":t.border}`, cursor:"pointer", padding:"5px 6px", gap:2, overflow:"hidden" }}>
              <span style={{ fontWeight:700, fontSize:12, alignSelf:"flex-end", color:tc }}>{d.getDate()}</span>
              {expItems.length>0 && <div style={{ display:"flex", alignItems:"center", gap:2, background:isSel?"rgba(255,200,0,.25)":"#fef3c7", borderRadius:4, padding:"1px 5px", width:"100%", boxSizing:"border-box" }}><AlertTriangle size={8} color={isSel?"#ffd700":"#d97706"}/><span style={{ fontSize:9, fontWeight:700, color:isSel?"#ffd700":"#92400e", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{expItems[0]}{expItems.length>1?` +${expItems.length-1}`:""}</span></div>}
              {dayMeals.slice(0,2).map(({slot,dishes},mi)=><div key={mi} style={{ display:"flex", gap:2, width:"100%", boxSizing:"border-box" }}><span style={{ fontSize:9, color:sc, flexShrink:0, maxWidth:30, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{slot.name.slice(0,4)}</span><span style={{ fontSize:9, fontWeight:600, color:tc, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{dishes[0]}{dishes.length>1?` +${dishes.length-1}`:""}</span></div>)}
              {dayMeals.length>2 && <span style={{ fontSize:9, color:sc }}>+{dayMeals.length-2} more</span>}
            </div>
          );
        })}
      </div>
      {/* Detail panel */}
      <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${t.border}` }}>
        <div style={{ fontSize:11, fontWeight:700, color:t.accent, marginBottom:10, textTransform:"uppercase", letterSpacing:".05em" }}>
          {new Date(selected+"T12:00:00").toLocaleDateString("en-PH",{weekday:"long",month:"short",day:"numeric"})}
        </div>
        {selExpiry.length>0 && <div style={{ background:t.warningBg, border:`1px solid ${t.warning}44`, borderRadius:9, padding:"8px 12px", marginBottom:10, display:"flex", alignItems:"center", gap:8 }}><AlertTriangle size={13} color={t.warning}/><span style={{ fontSize:12, color:t.warningText, fontWeight:600 }}>Expiring: {selExpiry.join(", ")}</span></div>}
        {selMeals.length>0
          ? selMeals.map(({slot,dishes},i)=>(
              <div key={i} style={{ padding:"7px 0", borderBottom:`1px solid ${t.border}` }}>
                <span style={{ fontSize:11, color:t.sub }}>{slot.name} · {slot.time}</span>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:5 }}>
                  {dishes.map((dish,j)=><span key={j} style={{ fontSize:12, fontWeight:600, background:t.accentBg, color:t.accent, border:`1px solid ${t.accent}22`, borderRadius:6, padding:"2px 9px" }}>{dish}</span>)}
                </div>
              </div>
            ))
          : <span style={{ fontSize:12, color:t.sub }}>No meals planned for this day.</span>
        }
      </div>
    </Card>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────
function DashboardView({ t, user, groceries, pantry, expenses, mealPlan, mealSlots, onNavigate, openRun, rollover }){
  const budget=parseFloat(user.monthlyBudget||8000);
  const spent=expenses.reduce((s,e)=>s+e.amount,0);
  const pct=Math.min(100,Math.round((spent/budget)*100));
  const rem=budget-spent;
  const expiringCount=pantry.filter(p=>{ if(!p.expiry||p.expiry==="—") return false; const d=new Date(p.expiry); return (d-new Date())/(86400000)<=7&&d>new Date(); }).length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      {rollover.length>0 && <div style={{ background:t.warningBg, border:`1px solid ${t.warning}44`, borderRadius:12, padding:"11px 16px", display:"flex", alignItems:"center", gap:10 }}><AlertTriangle size={15} color={t.warning}/><span style={{ fontSize:13, color:t.warningText, fontWeight:600 }}>{rollover.length} item(s) rolled over from last grocery run — check Grocery List.</span></div>}

      {/* Hero card + stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:14 }}>
        {/* Budget hero */}
        <Card t={t} style={{ background:`linear-gradient(135deg, ${t.accent}, ${t.accent}cc)`, border:"none", gridColumn:"span 1" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.7)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:6 }}>Budget Left</div>
          <div style={{ fontSize:28, fontWeight:800, color:"#fff", marginBottom:10 }}>₱{rem.toLocaleString()}</div>
          <div style={{ height:6, background:"rgba(255,255,255,.25)", borderRadius:99, marginBottom:6, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:"rgba(255,255,255,.85)", borderRadius:99 }}/>
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.75)" }}>{pct}% of ₱{budget.toLocaleString()} used</div>
        </Card>

        <StatCard t={t} label="Total Spent"   value={`₱${spent.toLocaleString()}`}  sub={`${expenses.length} transactions`} color={t.warning}   icon={TrendingUp}   onClick={()=>onNavigate("budget")}/>
        <StatCard t={t} label="Grocery Items" value={groceries.length}               sub="items in list"                     color={t.accent}    icon={ShoppingCart} onClick={()=>onNavigate("groceries")}/>
        <StatCard t={t} label="Pantry"         value={pantry.length}                 sub={expiringCount>0?`${expiringCount} expiring soon`:"All good"} color={expiringCount>0?t.warning:t.success} icon={Package} onClick={()=>onNavigate("pantry")}/>
      </div>

      {/* Quick action */}
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={openRun} style={{ display:"flex", alignItems:"center", gap:8, background:t.success, color:"#fff", border:"none", borderRadius:11, padding:"11px 20px", fontWeight:700, fontSize:14, cursor:"pointer", boxShadow:`0 4px 12px ${t.success}44` }}>
          <ShoppingCart size={16}/>Complete Grocery Run
        </button>
      </div>

      {/* Calendar */}
      <IntegratedCalendar t={t} mealPlan={mealPlan} mealSlots={mealSlots} pantry={pantry}/>
    </div>
  );
}

// ── Meal Planner ──────────────────────────────────────────────────
function MealPlannerView({ t, mealSlots, setMealSlots, mealPlan, setMealPlan, recipes, setRecipes }){
  const [planDays,setPlanDays]   = useState(7);
  const [showAddSlot,setShowAddSlot]=useState(false);
  const [newSlot,setNewSlot]     = useState({ name:"", time:"12:00" });
  const [showAddRecipe,setShowAddRecipe]=useState(false);
  const [newRecipe,setNewRecipe] = useState({ name:"", ingredients:"", instructions:"", time:"", servings:2 });
  const [recipeModal,setRecipeModal]=useState(null);
  const [recurring,setRecurring] = useState({ slotId:"", recipe:"" });
  const [showRecurring,setShowRecurring]=useState(false);
  const DAYS=["Su","Mo","Tu","We","Th","Fr","Sa"];
  const dates=Array.from({length:planDays},(_,i)=>addDays(new Date(),i));
  const recipeNames=recipes.map(r=>r.name);

  const applyPreset=k=>{ if(k!=="custom") setMealSlots(MEAL_PRESETS[k].slots); };
  const addSlot=()=>{ if(!newSlot.name) return; setMealSlots([...mealSlots,{ id:"custom_"+Date.now(), name:newSlot.name, time:newSlot.time }]); setNewSlot({ name:"", time:"12:00" }); setShowAddSlot(false); };
  const removeSlot=id=>setMealSlots(mealSlots.filter(s=>s.id!==id));
  const updateSlot=(id,f,v)=>setMealSlots(mealSlots.map(s=>s.id===id?{...s,[f]:v}:s));
  const applyRecurring=()=>{ if(!recurring.slotId||!recurring.recipe) return; const upd={...mealPlan}; for(let i=0;i<planDays;i++){ const d=addDays(new Date(),i); const cur=Array.isArray(upd[`${toKey(d)}_${recurring.slotId}`])?upd[`${toKey(d)}_${recurring.slotId}`]:[]; if(!cur.includes(recurring.recipe)) upd[`${toKey(d)}_${recurring.slotId}`]=[...cur,recurring.recipe]; } setMealPlan(upd); setShowRecurring(false); setRecurring({ slotId:"", recipe:"" }); };
  const getDishes=key=>{ const v=mealPlan[key]; if(!v) return []; return Array.isArray(v)?v:[v]; };
  const addDish=(key,dish)=>{ if(!dish) return; const cur=getDishes(key); if(cur.includes(dish)) return; setMealPlan({...mealPlan,[key]:[...cur,dish]}); };
  const removeDish=(key,dish)=>{ setMealPlan({...mealPlan,[key]:getDishes(key).filter(d=>d!==dish)}); };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <SectionHeader title="Meal Planner" action={
        <div style={{ display:"flex", gap:8 }}>
          {[7,14].map(n=><Btn key={n} t={t} variant={planDays===n?"primary":"secondary"} onClick={()=>setPlanDays(n)} style={{ padding:"7px 14px" }}>{n} Days</Btn>)}
        </div>
      }/>

      {/* Structure card */}
      <Card t={t}>
        <div style={{ fontSize:13, fontWeight:700, color:t.text, marginBottom:12 }}>Meal Structure</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
          {Object.entries(MEAL_PRESETS).map(([k,v])=>(
            <Btn key={k} t={t} variant="secondary" onClick={()=>applyPreset(k)} style={{ fontSize:12, padding:"6px 12px" }}>{v.label}</Btn>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {mealSlots.map(s=>(
            <div key={s.id} style={{ display:"flex", alignItems:"center", gap:10, background:t.bg, borderRadius:10, padding:"9px 12px", border:`1px solid ${t.border}` }}>
              <Input t={t} value={s.name} onChange={e=>updateSlot(s.id,"name",e.target.value)} style={{ flex:1, background:t.card }}/>
              <input type="time" value={s.time} onChange={e=>updateSlot(s.id,"time",e.target.value)} style={{ padding:"8px 10px", border:`1px solid ${t.border}`, borderRadius:9, background:t.card, color:t.text, fontSize:13, outline:"none" }}/>
              <button onClick={()=>removeSlot(s.id)} style={{ background:"none", border:"none", cursor:"pointer", color:t.danger, padding:4 }}><X size={14}/></button>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
          <Btn t={t} onClick={()=>setShowAddSlot(!showAddSlot)} style={{ fontSize:12, padding:"7px 13px" }}><Plus size={13}/>Add Slot</Btn>
          <Btn t={t} variant="secondary" onClick={()=>setShowRecurring(!showRecurring)} style={{ fontSize:12, padding:"7px 13px" }}><RefreshCw size={13}/>Recurring</Btn>
          <Btn t={t} variant="secondary" onClick={()=>setShowAddRecipe(true)} style={{ fontSize:12, padding:"7px 13px" }}><Plus size={13}/>Add Recipe</Btn>
        </div>
        {showAddSlot && (
          <div style={{ display:"flex", gap:8, marginTop:12, alignItems:"center", background:t.bg, borderRadius:10, padding:"10px 12px", border:`1px solid ${t.border}` }}>
            <Input t={t} value={newSlot.name} onChange={e=>setNewSlot({...newSlot,name:e.target.value})} placeholder="Slot name" style={{ flex:1 }}/>
            <input type="time" value={newSlot.time} onChange={e=>setNewSlot({...newSlot,time:e.target.value})} style={{ padding:"8px 10px", border:`1px solid ${t.border}`, borderRadius:9, background:t.card, color:t.text, fontSize:13, outline:"none" }}/>
            <Btn t={t} onClick={addSlot} style={{ fontSize:12, padding:"8px 14px" }}>Add</Btn>
            <Btn t={t} variant="secondary" onClick={()=>setShowAddSlot(false)} style={{ fontSize:12, padding:"8px 14px" }}>Cancel</Btn>
          </div>
        )}
        {showRecurring && (
          <div style={{ display:"flex", gap:8, marginTop:12, alignItems:"center", flexWrap:"wrap", background:t.bg, borderRadius:10, padding:"10px 12px", border:`1px solid ${t.border}` }}>
            <Select t={t} value={recurring.slotId} onChange={e=>setRecurring({...recurring,slotId:e.target.value})}><option value="">Select slot</option>{mealSlots.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</Select>
            <Select t={t} value={recurring.recipe} onChange={e=>setRecurring({...recurring,recipe:e.target.value})}><option value="">Select recipe</option>{recipeNames.map(r=><option key={r}>{r}</option>)}</Select>
            <Btn t={t} onClick={applyRecurring} style={{ fontSize:12, padding:"8px 14px" }}>Apply to All {planDays} Days</Btn>
          </div>
        )}
      </Card>

      {/* Plan grid */}
      <Card t={t} style={{ overflowX:"auto", padding:0 }}>
        <div style={{ minWidth:planDays*130+150, padding:18 }}>
          <div style={{ display:"grid", gridTemplateColumns:`150px repeat(${planDays},1fr)`, gap:6, marginBottom:10 }}>
            <div style={{ fontSize:10, fontWeight:700, color:t.sub, textTransform:"uppercase" }}>SLOT</div>
            {dates.map((d,i)=>(
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{ fontSize:10, color:t.accent, fontWeight:700 }}>{DAYS[d.getDay()]}</div>
                <div style={{ fontSize:13, fontWeight:700, color:t.text }}>{d.getDate()}/{d.getMonth()+1}</div>
              </div>
            ))}
          </div>
          {mealSlots.map(slot=>(
            <div key={slot.id} style={{ display:"grid", gridTemplateColumns:`150px repeat(${planDays},1fr)`, gap:6, marginBottom:8 }}>
              <div style={{ display:"flex", flexDirection:"column", justifyContent:"flex-start", paddingTop:6 }}>
                <span style={{ fontSize:12, fontWeight:700, color:t.text }}>{slot.name}</span>
                <span style={{ fontSize:10, color:t.sub }}>{slot.time}</span>
              </div>
              {dates.map((d,di)=>{
                const key=`${toKey(d)}_${slot.id}`;
                const dishes=getDishes(key);
                return (
                  <div key={di} style={{ border:`1px solid ${t.border}`, borderRadius:10, padding:"7px 8px", background:t.bg, minHeight:58, display:"flex", flexDirection:"column", gap:4 }}>
                    {dishes.map((dish,j)=>{
                      const rec=recipes.find(r=>r.name===dish);
                      return <Tag key={j} label={dish} t={t} onInfo={rec?()=>setRecipeModal(rec):undefined} onRemove={()=>removeDish(key,dish)}/>;
                    })}
                    <Select t={t} onChange={e=>{ addDish(key,e.target.value); e.target.value=""; }} style={{ fontSize:11, padding:"4px 6px", color:t.sub, border:`1px dashed ${t.border}`, background:t.card }}>
                      <option value="">+ add dish</option>
                      {recipeNames.filter(r=>!dishes.includes(r)).map(r=><option key={r} value={r}>{r}</option>)}
                    </Select>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* Recipe library */}
      <Card t={t}>
        <div style={{ fontSize:13, fontWeight:700, color:t.text, marginBottom:14 }}>Recipe Library ({recipes.length})</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {recipes.map(r=>(
            <div key={r.id} onClick={()=>setRecipeModal(r)} style={{ border:`1px solid ${t.border}`, borderRadius:12, padding:"13px 14px", cursor:"pointer", background:t.bg, transition:"border-color .15s, box-shadow .15s" }}
              onMouseOver={e=>{ e.currentTarget.style.borderColor=t.accent; e.currentTarget.style.boxShadow=`0 2px 8px ${t.accent}22`; }}
              onMouseOut={e=>{ e.currentTarget.style.borderColor=t.border; e.currentTarget.style.boxShadow="none"; }}>
              <div style={{ fontWeight:700, fontSize:13, color:t.text, marginBottom:4 }}>{r.name}</div>
              <div style={{ fontSize:11, color:t.sub }}>⏱ {r.time} · {r.servings} servings · {r.ingredients.length} ingredients</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Add recipe modal */}
      {showAddRecipe && (
        <Modal t={t} onClose={()=>setShowAddRecipe(false)}>
          <h3 style={{ margin:"0 0 16px", fontWeight:700, fontSize:17 }}>Add Custom Recipe</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <Input t={t} value={newRecipe.name} onChange={e=>setNewRecipe({...newRecipe,name:e.target.value})} placeholder="Recipe name" style={{ width:"100%" }}/>
            <Input t={t} value={newRecipe.time} onChange={e=>setNewRecipe({...newRecipe,time:e.target.value})} placeholder="Cook time (e.g. 30 min)" style={{ width:"100%" }}/>
            <textarea value={newRecipe.ingredients} onChange={e=>setNewRecipe({...newRecipe,ingredients:e.target.value})} placeholder="Ingredients (one per line)" rows={4} style={{ padding:"9px 13px", border:`1px solid ${t.border}`, borderRadius:10, background:t.bg, color:t.text, fontSize:13, resize:"vertical", boxSizing:"border-box", width:"100%", outline:"none", fontFamily:"inherit" }}/>
            <textarea value={newRecipe.instructions} onChange={e=>setNewRecipe({...newRecipe,instructions:e.target.value})} placeholder="Instructions" rows={3} style={{ padding:"9px 13px", border:`1px solid ${t.border}`, borderRadius:10, background:t.bg, color:t.text, fontSize:13, resize:"vertical", boxSizing:"border-box", width:"100%", outline:"none", fontFamily:"inherit" }}/>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:16 }}>
            <Btn t={t} onClick={()=>{ if(!newRecipe.name) return; setRecipes([...recipes,{ id:Date.now(),...newRecipe,ingredients:newRecipe.ingredients.split("\n").filter(Boolean) }]); setNewRecipe({name:"",ingredients:"",instructions:"",time:"",servings:2}); setShowAddRecipe(false); }} style={{ flex:1, justifyContent:"center" }}>Save Recipe</Btn>
            <Btn t={t} variant="secondary" onClick={()=>setShowAddRecipe(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Recipe detail modal */}
      {recipeModal && (
        <Modal t={t} onClose={()=>setRecipeModal(null)}>
          <h2 style={{ margin:"0 0 4px", fontWeight:700, fontSize:20 }}>{recipeModal.name}</h2>
          <div style={{ fontSize:12, color:t.sub, marginBottom:16 }}>⏱ {recipeModal.time} · Serves {recipeModal.servings}</div>
          <div style={{ fontSize:11, fontWeight:700, color:t.accent, textTransform:"uppercase", letterSpacing:".06em", marginBottom:10 }}>Ingredients</div>
          {recipeModal.ingredients.map((ing,i)=><div key={i} style={{ fontSize:13, padding:"6px 0", borderBottom:`1px solid ${t.border}`, display:"flex", gap:10, alignItems:"center" }}><span style={{ width:7, height:7, borderRadius:"50%", background:t.accent, display:"inline-block", flexShrink:0 }}/>{ing}</div>)}
          <div style={{ fontSize:11, fontWeight:700, color:t.accent, textTransform:"uppercase", letterSpacing:".06em", margin:"16px 0 10px" }}>Instructions</div>
          <p style={{ fontSize:13, lineHeight:1.7, color:t.text, margin:0 }}>{recipeModal.instructions}</p>
        </Modal>
      )}
    </div>
  );
}

// ── Grocery List ──────────────────────────────────────────────────
function GroceryListView({ t, groceries, setGroceries, pantry, openRun, rollover, setRollover }){
  const [editId,setEditId]   = useState(null);
  const [editData,setEditData]=useState({});
  const [showAdd,setShowAdd] = useState(false);
  const [newItem,setNewItem] = useState({ type:"Protein", name:"", qty:"", unit:"kg", location:"Grocery", price:"" });
  const [search,setSearch]   = useState("");
  const [fType,setFType]     = useState("All");
  const [fLoc,setFLoc]       = useState("All");
  const [sortBy,setSortBy]   = useState("none");
  const [checklist,setChecklist]=useState(false);

  const TYPES=["All","Protein","Vegetables","Fruits","Dairy","Staples","Pantry Restock"];
  const LOCS=["All","Grocery","Wet Market"];

  let filtered=groceries.filter(i=> i.name.toLowerCase().includes(search.toLowerCase())&&(fType==="All"||i.type===fType)&&(fLoc==="All"||i.location===fLoc));
  if(sortBy==="category") filtered=[...filtered].sort((a,b)=>a.type.localeCompare(b.type));
  if(sortBy==="location") filtered=[...filtered].sort((a,b)=>a.location.localeCompare(b.location));
  if(sortBy==="price")    filtered=[...filtered].sort((a,b)=>b.total-a.total);

  const total=groceries.reduce((s,i)=>s+i.total,0);
  const purchased=groceries.filter(i=>i.purchased).length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <SectionHeader title="Grocery List" action={<Btn t={t} onClick={openRun} style={{ background:t.success, padding:"10px 18px" }}><ShoppingCart size={14}/>Complete Grocery Run</Btn>}/>

      {rollover.length>0 && (
        <div style={{ background:t.warningBg, border:`1px solid ${t.warning}44`, borderRadius:12, padding:"11px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:13, color:t.warningText, fontWeight:600 }}><AlertTriangle size={13} style={{ verticalAlign:"middle", marginRight:6 }}/>{rollover.length} rolled-over items from last run</span>
          <Btn t={t} onClick={()=>{ setGroceries(prev=>[...prev,...rollover.map(r=>({...r,id:Date.now()+Math.random(),purchased:false,status:"pending"}))]); setRollover([]); }} style={{ background:t.warning, color:"#fff", fontSize:12, padding:"6px 12px" }}>Add to List</Btn>
        </div>
      )}

      {/* Controls */}
      <Card t={t} style={{ padding:"14px 16px" }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ position:"relative", flex:1, minWidth:160 }}>
            <Search size={13} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:t.sub }}/>
            <Input t={t} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search items…" style={{ paddingLeft:32, width:"100%", background:t.bg }}/>
          </div>
          <Select t={t} value={fType} onChange={e=>setFType(e.target.value)} style={{ background:t.bg }}>{TYPES.map(x=><option key={x}>{x}</option>)}</Select>
          <Select t={t} value={fLoc}  onChange={e=>setFLoc(e.target.value)}  style={{ background:t.bg }}>{LOCS.map(x=><option key={x}>{x}</option>)}</Select>
          <Select t={t} value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ background:t.bg }}>
            <option value="none">Sort</option><option value="category">Category</option><option value="location">Location</option><option value="price">Price ↓</option>
          </Select>
          <Btn t={t} variant={checklist?"primary":"secondary"} onClick={()=>setChecklist(!checklist)} style={{ fontSize:12, padding:"8px 13px" }}><Check size={13}/>Checklist</Btn>
          <Btn t={t} onClick={()=>setShowAdd(true)} style={{ fontSize:12, padding:"8px 13px" }}><Plus size={13}/>Add Item</Btn>
        </div>
      </Card>

      {checklist && (
        <Card t={t} style={{ padding:"13px 16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:8 }}><span style={{ fontWeight:600 }}>Shopping Progress</span><span style={{ color:t.sub }}>{purchased}/{groceries.length} items</span></div>
          <div style={{ height:8, background:t.bg, borderRadius:99, overflow:"hidden" }}><div style={{ height:"100%", width:`${groceries.length?Math.round((purchased/groceries.length)*100):0}%`, background:t.success, borderRadius:99, transition:"width .3s" }}/></div>
        </Card>
      )}

      {showAdd && (
        <Card t={t}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}><span style={{ fontWeight:700, fontSize:14 }}>New Item</span><button onClick={()=>setShowAdd(false)} style={{ background:"none", border:"none", cursor:"pointer", color:t.sub }}><X size={16}/></button></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:10 }}>
            <Select t={t} value={newItem.type} onChange={e=>setNewItem({...newItem,type:e.target.value})}>{["Protein","Vegetables","Fruits","Dairy","Staples"].map(x=><option key={x}>{x}</option>)}</Select>
            <Input t={t} value={newItem.name} onChange={e=>setNewItem({...newItem,name:e.target.value})} placeholder="Product name"/>
            <Select t={t} value={newItem.location} onChange={e=>setNewItem({...newItem,location:e.target.value})}><option>Grocery</option><option>Wet Market</option></Select>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 90px", gap:10 }}>
            <Input t={t} type="number" value={newItem.qty} onChange={e=>setNewItem({...newItem,qty:e.target.value})} placeholder="Qty"/>
            <Input t={t} value={newItem.unit} onChange={e=>setNewItem({...newItem,unit:e.target.value})} placeholder="Unit"/>
            <Input t={t} type="number" value={newItem.price} onChange={e=>setNewItem({...newItem,price:e.target.value})} placeholder="Price ₱"/>
            <Btn t={t} onClick={()=>{ if(!newItem.name||!newItem.qty) return; const q=parseFloat(newItem.qty),p=parseFloat(newItem.price)||0; setGroceries([...groceries,{...newItem,id:Date.now(),qty:q,price:p,total:q*p,purchased:false,status:"pending"}]); setNewItem({type:"Protein",name:"",qty:"",unit:"kg",location:"Grocery",price:""}); setShowAdd(false); }} style={{ justifyContent:"center" }}>Add</Btn>
          </div>
        </Card>
      )}

      <Card t={t} style={{ padding:0, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:t.bg, borderBottom:`1px solid ${t.border}` }}>
              {[checklist&&"","Type","Product","Qty","Location","Price","Total",""].filter(h=>h!==false).map((h,i)=>(
                <th key={i} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:t.sub, textTransform:"uppercase", letterSpacing:".06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item,rowI)=>(
              editId===item.id ? (
                <tr key={item.id} style={{ borderBottom:`1px solid ${t.border}`, background:t.bg }}>
                  {checklist&&<td style={{ padding:"10px 14px" }}/>}
                  <td style={{ padding:"10px 14px" }}><Input t={t} value={editData.type} onChange={e=>setEditData({...editData,type:e.target.value})} style={{ width:"100%", fontSize:12 }}/></td>
                  <td style={{ padding:"10px 14px" }}><Input t={t} value={editData.name} onChange={e=>setEditData({...editData,name:e.target.value})} style={{ width:"100%", fontSize:12 }}/></td>
                  <td style={{ padding:"10px 14px" }}><Input t={t} type="number" value={editData.qty} onChange={e=>setEditData({...editData,qty:parseFloat(e.target.value)})} style={{ width:60, fontSize:12 }}/></td>
                  <td style={{ padding:"10px 14px" }}><Input t={t} value={editData.location} onChange={e=>setEditData({...editData,location:e.target.value})} style={{ width:"100%", fontSize:12 }}/></td>
                  <td style={{ padding:"10px 14px" }}><Input t={t} type="number" value={editData.price} onChange={e=>setEditData({...editData,price:parseFloat(e.target.value)})} style={{ width:70, fontSize:12 }}/></td>
                  <td style={{ padding:"10px 14px", fontWeight:700, fontSize:13 }}>₱{(editData.qty*editData.price).toFixed(0)}</td>
                  <td style={{ padding:"10px 14px" }}><div style={{ display:"flex", gap:6 }}><Btn t={t} onClick={()=>{ setGroceries(groceries.map(i=>i.id===editId?{...editData,total:editData.qty*editData.price}:i)); setEditId(null); }} style={{ padding:"5px 10px", fontSize:11, background:t.success }}>Save</Btn><Btn t={t} variant="secondary" onClick={()=>setEditId(null)} style={{ padding:"5px 10px", fontSize:11 }}>✕</Btn></div></td>
                </tr>
              ) : (
                <tr key={item.id} style={{ borderBottom:`1px solid ${t.border}`, background: rowI%2===0 ? "transparent" : t.bg+"44", opacity:item.purchased?.55:1 }}
                  onMouseOver={e=>e.currentTarget.style.background=t.hover}
                  onMouseOut={e=>e.currentTarget.style.background=rowI%2===0?"transparent":t.bg+"44"}>
                  {checklist && <td style={{ padding:"10px 14px" }}><button onClick={()=>setGroceries(groceries.map(i=>i.id===item.id?{...i,purchased:!i.purchased}:i))} style={{ width:20, height:20, borderRadius:6, border:`2px solid ${item.purchased?t.success:t.border}`, background:item.purchased?t.success:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{item.purchased&&<Check size={11} color="#fff"/>}</button></td>}
                  <td style={{ padding:"10px 14px" }}><Pill label={item.type} color={t.accent} bg={t.accentBg}/></td>
                  <td style={{ padding:"10px 14px", fontSize:13, fontWeight:600, color:t.text, textDecoration:item.purchased?"line-through":"none" }}>{item.name}</td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:t.sub }}>{item.qty} {item.unit}</td>
                  <td style={{ padding:"10px 14px" }}><Pill label={item.location} color={item.location==="Grocery"?t.success:t.accent} bg={item.location==="Grocery"?t.successBg:t.accentBg}/></td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:t.sub }}>₱{item.price}</td>
                  <td style={{ padding:"10px 14px", fontSize:13, fontWeight:700, color:t.text }}>₱{item.total.toLocaleString()}</td>
                  <td style={{ padding:"10px 14px" }}><div style={{ display:"flex", gap:5 }}><button onClick={()=>{ setEditId(item.id); setEditData(item); }} style={{ width:28, height:28, borderRadius:8, border:`1px solid ${t.border}`, background:t.bg, cursor:"pointer", color:t.sub, display:"flex", alignItems:"center", justifyContent:"center" }}><Edit2 size={12}/></button><button onClick={()=>setGroceries(groceries.filter(i=>i.id!==item.id))} style={{ width:28, height:28, borderRadius:8, border:`1px solid ${t.dangerBg}`, background:t.dangerBg, cursor:"pointer", color:t.danger, display:"flex", alignItems:"center", justifyContent:"center" }}><Trash2 size={12}/></button></div></td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </Card>

      <div style={{ background:`linear-gradient(135deg,${t.accent},${t.accent}bb)`, borderRadius:14, padding:"16px 22px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div><div style={{ fontSize:11, color:"rgba(255,255,255,.7)", textTransform:"uppercase", letterSpacing:".06em" }}>Total</div><div style={{ fontSize:28, fontWeight:800, color:"#fff" }}>₱{total.toLocaleString()}</div></div>
        <div style={{ textAlign:"right", color:"rgba(255,255,255,.8)", fontSize:13 }}>{groceries.length} items{checklist&&<><br/><b style={{ color:"#fff" }}>{purchased} purchased</b></>}</div>
      </div>
    </div>
  );
}

// ── Pantry ─────────────────────────────────────────────────────────
function PantryView({ t, pantry, setPantry, groceries, setGroceries }){
  const [editId,setEditId]=useState(null);
  const [editData,setEditData]=useState({});
  const [showAdd,setShowAdd]=useState(false);
  const [newItem,setNewItem]=useState({ name:"", qty:"", unit:"kg", expiry:"", status:"ok" });
  const [search,setSearch]=useState("");
  const [fStatus,setFStatus]=useState("All");

  const today=new Date();
  const expiring=pantry.filter(p=>{ if(!p.expiry||p.expiry==="—") return false; const d=new Date(p.expiry); return (d-today)/86400000<=7&&d>today; });
  const filtered=pantry.filter(i=> i.name.toLowerCase().includes(search.toLowerCase())&&(fStatus==="All"||i.status===fStatus));
  const addToGrocery=item=>{ if(groceries.find(g=>g.name.toLowerCase()===item.name.toLowerCase())) return; setGroceries([...groceries,{ id:Date.now(), type:"Pantry Restock", name:item.name, qty:1, unit:item.unit, location:"Grocery", price:0, total:0, purchased:false, status:"pending" }]); };

  const SC={ ok:{ label:"Good", color:t.success, bg:t.successBg }, low:{ label:"Low", color:t.warning, bg:t.warningBg }, expiring:{ label:"Expiring", color:t.danger, bg:t.dangerBg } };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <SectionHeader title="Pantry Inventory"/>

      {expiring.length>0 && (
        <div style={{ background:t.warningBg, border:`1px solid ${t.warning}55`, borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:t.warning+"33", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><AlertTriangle size={16} color={t.warning}/></div>
          <div><div style={{ fontSize:13, fontWeight:700, color:t.warningText }}>Expiring within 7 days</div><div style={{ fontSize:12, color:t.warningText, opacity:.8 }}>{expiring.map(i=>i.name).join(", ")}</div></div>
        </div>
      )}

      {/* Summary pills */}
      <div style={{ display:"flex", gap:10 }}>
        {Object.entries(SC).map(([k,v])=>(
          <div key={k} style={{ background:v.bg, border:`1px solid ${v.color}33`, borderRadius:10, padding:"10px 16px", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:20, fontWeight:800, color:v.color }}>{pantry.filter(p=>p.status===k).length}</span>
            <span style={{ fontSize:12, fontWeight:600, color:v.color }}>{v.label}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <Card t={t} style={{ padding:"13px 16px" }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ position:"relative", flex:1, minWidth:160 }}><Search size={13} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:t.sub }}/><Input t={t} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search pantry…" style={{ paddingLeft:32, width:"100%", background:t.bg }}/></div>
          {["All","ok","low","expiring"].map(s=><Btn key={s} t={t} variant={fStatus===s?"primary":"secondary"} onClick={()=>setFStatus(s)} style={{ fontSize:12, padding:"8px 13px" }}>{s==="All"?"All":SC[s]?.label||s}</Btn>)}
          <Btn t={t} onClick={()=>setShowAdd(true)} style={{ fontSize:12, padding:"8px 13px" }}><Plus size={13}/>Add Item</Btn>
        </div>
      </Card>

      {showAdd && (
        <Card t={t}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}><span style={{ fontWeight:700, fontSize:14 }}>Add Item</span><button onClick={()=>setShowAdd(false)} style={{ background:"none", border:"none", cursor:"pointer", color:t.sub }}><X size={16}/></button></div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:10 }}>
            <Input t={t} value={newItem.name} onChange={e=>setNewItem({...newItem,name:e.target.value})} placeholder="Name"/>
            <Input t={t} type="number" value={newItem.qty} onChange={e=>setNewItem({...newItem,qty:e.target.value})} placeholder="Qty"/>
            <Input t={t} value={newItem.unit} onChange={e=>setNewItem({...newItem,unit:e.target.value})} placeholder="Unit"/>
            <input type="date" value={newItem.expiry} onChange={e=>setNewItem({...newItem,expiry:e.target.value})} style={{ padding:"9px 13px", border:`1px solid ${t.border}`, borderRadius:10, background:t.card, color:t.text, fontSize:13, outline:"none" }}/>
            <Select t={t} value={newItem.status} onChange={e=>setNewItem({...newItem,status:e.target.value})}><option value="ok">Good</option><option value="low">Low</option><option value="expiring">Expiring</option></Select>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn t={t} onClick={()=>{ if(!newItem.name||!newItem.qty) return; setPantry([...pantry,{...newItem,id:Date.now(),qty:parseFloat(newItem.qty)}]); setNewItem({name:"",qty:"",unit:"kg",expiry:"",status:"ok"}); setShowAdd(false); }}>Add</Btn>
            <Btn t={t} variant="secondary" onClick={()=>setShowAdd(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      <Card t={t} style={{ padding:0, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:t.bg, borderBottom:`1px solid ${t.border}` }}>{["Item","Qty","Unit","Expiry","Status",""].map(h=><th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:t.sub, textTransform:"uppercase", letterSpacing:".06em" }}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((item,ri)=>(
              editId===item.id ? (
                <tr key={item.id} style={{ borderBottom:`1px solid ${t.border}`, background:t.bg }}>
                  <td style={{ padding:"10px 14px" }}><Input t={t} value={editData.name} onChange={e=>setEditData({...editData,name:e.target.value})} style={{ width:"100%", fontSize:12 }}/></td>
                  <td style={{ padding:"10px 14px" }}><Input t={t} type="number" value={editData.qty} onChange={e=>setEditData({...editData,qty:parseFloat(e.target.value)})} style={{ width:60, fontSize:12 }}/></td>
                  <td style={{ padding:"10px 14px" }}><Input t={t} value={editData.unit} onChange={e=>setEditData({...editData,unit:e.target.value})} style={{ width:60, fontSize:12 }}/></td>
                  <td style={{ padding:"10px 14px" }}><input type="date" value={editData.expiry||""} onChange={e=>setEditData({...editData,expiry:e.target.value})} style={{ padding:"8px 10px", border:`1px solid ${t.border}`, borderRadius:9, background:t.card, color:t.text, fontSize:12, outline:"none" }}/></td>
                  <td style={{ padding:"10px 14px" }}><Select t={t} value={editData.status} onChange={e=>setEditData({...editData,status:e.target.value})} style={{ fontSize:12 }}><option value="ok">Good</option><option value="low">Low</option><option value="expiring">Expiring</option></Select></td>
                  <td style={{ padding:"10px 14px" }}><div style={{ display:"flex", gap:6 }}><Btn t={t} onClick={()=>{ setPantry(pantry.map(i=>i.id===editId?editData:i)); setEditId(null); }} style={{ padding:"5px 10px", fontSize:11, background:t.success }}>Save</Btn><Btn t={t} variant="secondary" onClick={()=>setEditId(null)} style={{ padding:"5px 10px", fontSize:11 }}>✕</Btn></div></td>
                </tr>
              ) : (
                <tr key={item.id} style={{ borderBottom:`1px solid ${t.border}`, background:ri%2===0?"transparent":t.bg+"44" }}
                  onMouseOver={e=>e.currentTarget.style.background=t.hover}
                  onMouseOut={e=>e.currentTarget.style.background=ri%2===0?"transparent":t.bg+"44"}>
                  <td style={{ padding:"10px 14px", fontSize:13, fontWeight:600, color:t.text }}>{item.name}</td>
                  <td style={{ padding:"10px 14px", fontSize:13, color:t.text }}>{item.qty}</td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:t.sub }}>{item.unit}</td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:item.status==="expiring"?t.danger:t.sub }}>{item.expiry||"—"}</td>
                  <td style={{ padding:"10px 14px" }}><Pill label={SC[item.status]?.label||item.status} color={SC[item.status]?.color||t.sub} bg={SC[item.status]?.bg||t.bg}/></td>
                  <td style={{ padding:"10px 14px" }}><div style={{ display:"flex", gap:5 }}>
                    <button onClick={()=>{ setEditId(item.id); setEditData(item); }} style={{ width:28, height:28, borderRadius:8, border:`1px solid ${t.border}`, background:t.bg, cursor:"pointer", color:t.sub, display:"flex", alignItems:"center", justifyContent:"center" }}><Edit2 size={12}/></button>
                    <button onClick={()=>setPantry(pantry.filter(i=>i.id!==item.id))} style={{ width:28, height:28, borderRadius:8, border:`1px solid ${t.dangerBg}`, background:t.dangerBg, cursor:"pointer", color:t.danger, display:"flex", alignItems:"center", justifyContent:"center" }}><Trash2 size={12}/></button>
                    {(item.status==="low"||item.status==="expiring")&&<button onClick={()=>addToGrocery(item)} style={{ height:28, borderRadius:8, border:`1px solid ${t.warning}44`, background:t.warningBg, cursor:"pointer", color:t.warningText, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 8px", fontSize:11, fontWeight:700 }}>+List</button>}
                  </div></td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Budget ─────────────────────────────────────────────────────────
function BudgetView({ t, user, expenses, setExpenses }){
  const [showAdd,setShowAdd]=useState(false);
  const [ne,setNe]=useState({ date:new Date().toISOString().slice(0,10), item:"", category:"Protein", amount:"" });
  const budget=parseFloat(user.monthlyBudget||8000);
  const total=expenses.reduce((s,e)=>s+e.amount,0);
  const pct=Math.min(100,Math.round((total/budget)*100));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <SectionHeader title="Budget & Expenses" action={<Btn t={t} onClick={()=>setShowAdd(true)}><Plus size={14}/>Add Expense</Btn>}/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        <StatCard t={t} label="Monthly Budget" value={`₱${budget.toLocaleString()}`} color={t.accent} icon={Wallet}/>
        <StatCard t={t} label="Total Spent" value={`₱${total.toLocaleString()}`} sub={`${Math.round((total/budget)*100)}% of budget`} color={t.warning} icon={TrendingUp}/>
        <StatCard t={t} label="Remaining" value={`₱${(budget-total).toLocaleString()}`} color={budget-total<0?t.danger:t.success} icon={budget-total<0?TrendingDown:TrendingUp}/>
      </div>
      <Card t={t}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:10 }}><span style={{ fontWeight:600 }}>Budget Usage</span><span style={{ color:t.sub, fontWeight:600 }}>{pct}%</span></div>
        <div style={{ height:10, background:t.bg, borderRadius:99, overflow:"hidden" }}><div style={{ height:"100%", width:`${pct}%`, background:pct>85?t.danger:pct>60?t.warning:t.accent, borderRadius:99, transition:"width .5s" }}/></div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:8, fontSize:12, color:t.sub }}><span>₱0</span><span>₱{budget.toLocaleString()}</span></div>
      </Card>
      {showAdd && (
        <Card t={t}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}><span style={{ fontWeight:700, fontSize:14 }}>New Expense</span><button onClick={()=>setShowAdd(false)} style={{ background:"none", border:"none", cursor:"pointer", color:t.sub }}><X size={16}/></button></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 80px", gap:10 }}>
            <input type="date" value={ne.date} onChange={e=>setNe({...ne,date:e.target.value})} style={{ padding:"9px 13px", border:`1px solid ${t.border}`, borderRadius:10, background:t.card, color:t.text, fontSize:13, outline:"none" }}/>
            <Input t={t} value={ne.item} onChange={e=>setNe({...ne,item:e.target.value})} placeholder="Item name"/>
            <Select t={t} value={ne.category} onChange={e=>setNe({...ne,category:e.target.value})}>{["Protein","Vegetables","Fruits","Dairy","Staples","Other"].map(x=><option key={x}>{x}</option>)}</Select>
            <Input t={t} type="number" value={ne.amount} onChange={e=>setNe({...ne,amount:e.target.value})} placeholder="Amount ₱"/>
            <Btn t={t} onClick={()=>{ if(!ne.item||!ne.amount) return; setExpenses([...expenses,{...ne,id:Date.now(),amount:parseFloat(ne.amount)}]); setNe({date:new Date().toISOString().slice(0,10),item:"",category:"Protein",amount:""}); setShowAdd(false); }} style={{ justifyContent:"center" }}>Add</Btn>
          </div>
        </Card>
      )}
      <Card t={t} style={{ padding:0, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:t.bg, borderBottom:`1px solid ${t.border}` }}>{["Date","Item","Category","Amount",""].map(h=><th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:t.sub, textTransform:"uppercase", letterSpacing:".06em" }}>{h}</th>)}</tr></thead>
          <tbody>{expenses.map((e,ri)=><tr key={e.id} style={{ borderBottom:`1px solid ${t.border}`, background:ri%2===0?"transparent":t.bg+"44" }} onMouseOver={x=>x.currentTarget.style.background=t.hover} onMouseOut={x=>x.currentTarget.style.background=ri%2===0?"transparent":t.bg+"44"}><td style={{ padding:"10px 14px", fontSize:12, color:t.sub }}>{e.date}</td><td style={{ padding:"10px 14px", fontSize:13, fontWeight:600, color:t.text }}>{e.item}</td><td style={{ padding:"10px 14px" }}><Pill label={e.category} color={t.accent} bg={t.accentBg}/></td><td style={{ padding:"10px 14px", fontSize:14, fontWeight:700, color:t.text }}>₱{e.amount.toLocaleString()}</td><td style={{ padding:"10px 14px" }}><button onClick={()=>setExpenses(expenses.filter(ex=>ex.id!==e.id))} style={{ width:28, height:28, borderRadius:8, border:`1px solid ${t.dangerBg}`, background:t.dangerBg, cursor:"pointer", color:t.danger, display:"flex", alignItems:"center", justifyContent:"center" }}><Trash2 size={12}/></button></td></tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Analytics ─────────────────────────────────────────────────────
function AnalyticsView({ t, expenses, pantry }){
  const [trendType,setTrendType]=useState("area");
  const [catType,setCatType]=useState("bar");
  const trendData=[{m:"Jan",a:7800},{m:"Feb",a:6900},{m:"Mar",a:7400},{m:"Apr",a:7100},{m:"May",a:6200},{m:"Jun",a:expenses.reduce((s,e)=>s+e.amount,0)}];
  const byCat={}; expenses.forEach(e=>{ byCat[e.category]=(byCat[e.category]||0)+e.amount; });
  const catData=Object.entries(byCat).map(([name,value])=>({name,value}));
  const PIE_COLORS=[t.accent,"#10b981","#f59e0b","#a855f7","#ef4444","#06b6d4"];
  const SC={ ok:t.success, low:t.warning, expiring:t.danger };
  const ttStyle={ contentStyle:{ background:t.card, border:`1px solid ${t.border}`, borderRadius:10, color:t.text, fontSize:12, boxShadow:t.shadow } };
  const axTick={ fill:t.sub, fontSize:11 };
  const TypeToggle=({ opts, cur, onChange })=>(
    <div style={{ display:"flex", gap:4, background:t.bg, borderRadius:8, padding:3, border:`1px solid ${t.border}` }}>
      {opts.map(o=><button key={o.val} onClick={()=>onChange(o.val)} style={{ padding:"4px 11px", border:"none", borderRadius:6, background:cur===o.val?t.card:"transparent", color:cur===o.val?t.text:t.sub, fontSize:11, fontWeight:cur===o.val?600:400, cursor:"pointer", boxShadow:cur===o.val?t.shadow:"none", transition:"all .15s" }}>{o.label}</button>)}
    </div>
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <SectionHeader title="Analytics"/>
      <Card t={t}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontWeight:700, fontSize:14, color:t.text }}>Monthly Spending</span>
          <TypeToggle opts={[{val:"area",label:"Area"},{val:"line",label:"Line"},{val:"bar",label:"Bar"}]} cur={trendType} onChange={setTrendType}/>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          {trendType==="area" ? (
            <AreaChart data={trendData}><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.accent} stopOpacity={.15}/><stop offset="100%" stopColor={t.accent} stopOpacity={0}/></linearGradient></defs><XAxis dataKey="m" stroke={t.border} tick={axTick}/><YAxis stroke={t.border} tick={axTick}/><Tooltip {...ttStyle}/><Area type="monotone" dataKey="a" stroke={t.accent} fill="url(#ag)" strokeWidth={2} name="₱ Spent"/></AreaChart>
          ) : trendType==="line" ? (
            <LineChart data={trendData}><XAxis dataKey="m" stroke={t.border} tick={axTick}/><YAxis stroke={t.border} tick={axTick}/><Tooltip {...ttStyle}/><Line type="monotone" dataKey="a" stroke={t.accent} strokeWidth={2} dot={{ fill:t.accent, r:4 }} name="₱ Spent"/></LineChart>
          ) : (
            <BarChart data={trendData}><XAxis dataKey="m" stroke={t.border} tick={axTick}/><YAxis stroke={t.border} tick={axTick}/><Tooltip {...ttStyle}/><Bar dataKey="a" fill={t.accent} radius={[6,6,0,0]} name="₱ Spent"/></BarChart>
          )}
        </ResponsiveContainer>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Card t={t}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <span style={{ fontWeight:700, fontSize:14, color:t.text }}>By Category</span>
            <TypeToggle opts={[{val:"bar",label:"Bar"},{val:"pie",label:"Pie"},{val:"line",label:"Line"}]} cur={catType} onChange={setCatType}/>
          </div>
          {catData.length===0 ? <div style={{ fontSize:12, color:t.sub, padding:"20px 0", textAlign:"center" }}>No expense data yet.</div> :
            catType==="pie" ? (
              <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={catData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({name,percent})=>`${name} ${Math.round(percent*100)}%`} labelLine={false}>{catData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}</Pie><Tooltip {...ttStyle} formatter={v=>`₱${v.toLocaleString()}`}/></PieChart></ResponsiveContainer>
            ) : catType==="line" ? (
              <ResponsiveContainer width="100%" height={200}><LineChart data={catData}><XAxis dataKey="name" stroke={t.border} tick={{ ...axTick, fontSize:9 }}/><YAxis stroke={t.border} tick={axTick}/><Tooltip {...ttStyle} formatter={v=>`₱${v.toLocaleString()}`}/><Line dataKey="value" stroke={t.accent} strokeWidth={2} dot={{ fill:t.accent, r:4 }}/></LineChart></ResponsiveContainer>
            ) : (
              catData.map(({name,value})=>(
                <div key={name} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}><span style={{ fontWeight:600, color:t.text }}>{name}</span><span style={{ color:t.sub }}>₱{value.toLocaleString()}</span></div>
                  <div style={{ height:6, background:t.bg, borderRadius:99, overflow:"hidden" }}><div style={{ height:"100%", width:`${Math.min(100,(value/8000)*100)}%`, background:t.accent, borderRadius:99 }}/></div>
                </div>
              ))
            )
          }
        </Card>
        <Card t={t}>
          <div style={{ fontWeight:700, fontSize:14, color:t.text, marginBottom:14 }}>Pantry Status</div>
          {["ok","low","expiring"].map(s=>(
            <div key={s} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${t.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}><div style={{ width:10, height:10, borderRadius:"50%", background:SC[s] }}/><span style={{ fontSize:13, fontWeight:600, color:t.text }}>{s.charAt(0).toUpperCase()+s.slice(1)}</span></div>
              <span style={{ fontSize:16, fontWeight:800, color:SC[s] }}>{pantry.filter(p=>p.status===s).length}</span>
            </div>
          ))}
          <div style={{ marginTop:12 }}>
            <ResponsiveContainer width="100%" height={90}><PieChart><Pie data={["ok","low","expiring"].map(s=>({ name:s, value:pantry.filter(p=>p.status===s).length||0 }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={38}>{["ok","low","expiring"].map((s,i)=><Cell key={i} fill={SC[s]}/>)}</Pie><Tooltip {...ttStyle}/></PieChart></ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Settings ───────────────────────────────────────────────────────
function SettingsView({ t, user, setUser, notifs, setNotifs }){
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState(user);
  const LABELS={ householdSize:"Household Size", monthlyBudget:"Monthly Budget (₱)", shoppingFreq:"Shopping Frequency", mealPreset:"Meal Structure" };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <SectionHeader title="Settings"/>
      <Card t={t}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <div><div style={{ fontSize:15, fontWeight:700, color:t.text }}>Your Preferences</div><div style={{ fontSize:12, color:t.sub, marginTop:2 }}>Manage your household settings</div></div>
          {!editing
            ? <Btn t={t} onClick={()=>{ setDraft({...user}); setEditing(true); }} style={{ fontSize:13 }}><Edit2 size={13}/>Edit All</Btn>
            : <div style={{ display:"flex", gap:8 }}><Btn t={t} onClick={()=>{ setUser({...user,...draft}); setEditing(false); }} style={{ background:t.success }}>Save All</Btn><Btn t={t} variant="secondary" onClick={()=>setEditing(false)}>Cancel</Btn></div>
          }
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {OB_QS.map(q=>(
            <div key={q.id} style={{ background:t.bg, borderRadius:12, padding:"13px 15px", border:`1px solid ${t.border}` }}>
              <div style={{ fontSize:10, fontWeight:700, color:t.accent, textTransform:"uppercase", letterSpacing:".06em", marginBottom:6 }}>{LABELS[q.id]||q.id}</div>
              {editing
                ? q.type==="select"
                  ? <Select t={t} value={draft[q.id]||""} onChange={e=>setDraft({...draft,[q.id]:e.target.value})} style={{ width:"100%", background:t.card }}>{q.options.map(o=><option key={o}>{o}</option>)}</Select>
                  : <Input t={t} type={q.type} value={draft[q.id]||""} onChange={e=>setDraft({...draft,[q.id]:e.target.value})} placeholder={q.placeholder} style={{ width:"100%" }}/>
                : <div style={{ fontSize:14, fontWeight:600, color:t.text }}>{user[q.id]||<span style={{ color:t.sub }}>Not set</span>}</div>
              }
            </div>
          ))}
        </div>
      </Card>
      <Card t={t}>
        <div style={{ fontSize:15, fontWeight:700, color:t.text, marginBottom:16 }}>Notifications</div>
        {[
          { key:"expiry", label:"Expiry Alerts",  desc:"Warn when pantry items expire within 7 days" },
          { key:"budget", label:"Budget Alerts",  desc:"Alert when spending exceeds 80% of budget" },
          { key:"meals",  label:"Meal Reminders", desc:"Daily reminders for planned meals" }
        ].map(n=>(
          <div key={n.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 0", borderBottom:`1px solid ${t.border}` }}>
            <div><div style={{ fontSize:14, fontWeight:600, color:t.text }}>{n.label}</div><div style={{ fontSize:12, color:t.sub, marginTop:2 }}>{n.desc}</div></div>
            <button onClick={()=>setNotifs({...notifs,[n.key]:!notifs[n.key]})} style={{ width:46, height:26, borderRadius:99, border:"none", cursor:"pointer", position:"relative", background:notifs[n.key]?t.accent:t.border, transition:"background .2s", flexShrink:0 }}>
              <div style={{ position:"absolute", top:3, left:notifs[n.key]?22:3, width:20, height:20, borderRadius:"50%", background:"#fff", transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,.2)" }}/>
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
}