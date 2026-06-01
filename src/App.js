import { useState, useEffect } from "react";
import {
  LayoutDashboard, ShoppingCart, Package, Wallet, BarChart2,
  TrendingUp, Settings, Search, Bell, Plus, Check, AlertTriangle,
  Utensils, Star, ShoppingBag, TrendingDown, Clock, X, Wand2, Loader
} from "lucide-react";
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

const PRODUCT_TYPES=["Protein","Vegetables","Fruits","Dairy","Staples","Personal Care","Laundry","Cleaning","Condiments","Spices","Rewards"];
const PURCHASE_LOCATIONS=["Grocery Store","Wet Market"];
const UNITS=["kg","g","L","ml","pcs","bottles","bundles","boxes","packs","dozen"];
const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const TREND=[{m:"Dec",a:7200},{m:"Jan",a:7800},{m:"Feb",a:6900},{m:"Mar",a:7400},{m:"Apr",a:7100},{m:"May",a:6200}];
const CATS=[{name:"Protein",value:2100,color:"#18181b"},{name:"Vegetables",value:800,color:"#52525b"},{name:"Fruits",value:400,color:"#71717a"},{name:"Dairy",value:350,color:"#a1a1aa"},{name:"Household",value:1200,color:"#d4d4d8"},{name:"Rewards",value:350,color:"#e4e4e7"}];
const PANTRY=[{n:"Rice",q:2,u:"kg",exp:"—",s:"low"},{n:"Soy Sauce",q:0.5,u:"bottle",exp:"Aug 2025",s:"ok"},{n:"Cooking Oil",q:1,u:"L",exp:"Oct 2025",s:"ok"},{n:"Garlic",q:3,u:"heads",exp:"Jun 2025",s:"expiring"},{n:"Onion",q:0.2,u:"kg",exp:"—",s:"low"},{n:"Eggs",q:6,u:"pcs",exp:"Jun 2025",s:"ok"},{n:"Vinegar",q:0.3,u:"bottle",exp:"Dec 2025",s:"ok"},{n:"Salt",q:200,u:"g",exp:"—",s:"ok"}];
const EXPENSES=[{date:"Jun 1",item:"Chicken (2kg)",cat:"Protein",unit:"₱280",total:280},{date:"Jun 1",item:"Rice (5kg)",cat:"Staples",unit:"₱275",total:275},{date:"Jun 1",item:"Eggs (2 doz)",cat:"Protein",unit:"₱220",total:220},{date:"Jun 1",item:"Tomatoes 500g",cat:"Vegetables",unit:"₱60",total:60},{date:"May 15",item:"Shampoo",cat:"Personal Care",unit:"₱185",total:185},{date:"May 15",item:"Detergent",cat:"Laundry",unit:"₱95",total:95},{date:"May 15",item:"Soy Sauce",cat:"Condiments",unit:"₱35",total:35},{date:"May 15",item:"Fresh Milk 1L",cat:"Dairy",unit:"₱90",total:90}];
const FORECAST=[{m:"Jun",v:7250},{m:"Jul",v:7100},{m:"Aug",v:7400},{m:"Sep",v:6950}];

const card={background:"#fff",borderRadius:14,padding:"18px 20px",boxShadow:"0 1px 2px rgba(0,0,0,0.05),0 0 0 1px rgba(0,0,0,0.06)"};
const lbl={fontSize:10,fontWeight:700,color:"#a1a1aa",letterSpacing:"0.08em",textTransform:"uppercase"};
const muted={fontSize:11,color:"#a1a1aa"};

async function generateAIMealSuggestions(groceryItems){
  const itemList=groceryItems.map(g=>`${g.qty} ${g.unit} ${g.name}`).join(", ");
  try{
    const resp=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514",
        max_tokens:800,
        messages:[{role:"user",content:`You are a Filipino home cook. Based on these grocery items: ${itemList}. Suggest 5 authentic Filipino meals that can be made with these ingredients. For each meal, list the name, main ingredients from the provided list, and cooking time. Format as JSON array with {name, ingredients, cookingTime} objects. Return ONLY the JSON, no other text.`}]
      })
    });
    const data=await resp.json();
    const content=data.content[0].text;
    const cleaned=content.replace(/```json|```/g,"").trim();
    return JSON.parse(cleaned);
  }catch(e){
    console.error("API Error:",e);
    return[{name:"Chicken Adobo",ingredients:["Chicken","Soy Sauce","Vinegar"],cookingTime:"45 min"},{name:"Sinigang",ingredients:["Pork","Radish","Spinach"],cookingTime:"50 min"}];
  }
}

function Header({title}){
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
      <h1 style={{fontSize:22,fontWeight:700,color:"#18181b",letterSpacing:"-0.02em",margin:0}}>{title}
</h1>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:7,background:"#fff",border:"1px solid #e4e4e7",borderRadius:8,padding:"7px 12px"}}>
          <Search size={13} color="#a1a1aa"/>
          <input placeholder="Search..." style={{border:"none",outline:"none",fontSize:12,color:"#18181b",width:110,background:"transparent"}}/>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:5,background:"#fff",border:"1px solid #e4e4e7",borderRadius:8,padding:"7px 12px"}}>
          <Clock size={13} color="#f59e0b"/>
          <span style={{fontSize:11,fontWeight:600,color:"#18181b",whiteSpace:"nowrap"}}>Next run: 6 days</span>
        </div>
        <div style={{position:"relative"}}>
          <button style={{width:34,height:34,borderRadius:8,background:"#fff",border:"1px solid #e4e4e7",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <Bell size={14} color="#52525b"/>
          </button>
          <div style={{position:"absolute",top:7,right:7,width:7,height:7,borderRadius:"50%",background:"#ef4444",border:"2px solid #f9fafb"}}/>
        </div>
        <div style={{width:34,height:34,borderRadius:8,background:"#18181b",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <span style={{fontSize:11,fontWeight:700,color:"#fff"}}>JD</span>
        </div>
      </div>
    </div>
  );
}

function DashboardView(){
  const pct=Math.round(6200/8000*100);
  return(
    <div>
      <Header title="Dashboard"/>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1.4fr",gap:12,marginBottom:12}}>
        <div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
            <div><div style={lbl}>Monthly Budget</div><div style={{fontSize:28,fontWeight:700,color:"#18181b",letterSpacing:"-0.03em",marginTop:4}}>₱8,000</div></div>
            <div style={{textAlign:"right"}}><div style={lbl}>Remaining</div><div style={{fontSize:20,fontWeight:700,color:"#16a34a",marginTop:4}}>₱1,800</div></div>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={muted}>Spent: ₱6,200</span><span style={muted}>{pct}%</span></div>
            <div style={{height:5,background:"#f4f4f5",borderRadius:99}}><div style={{height:"100%",width:`${pct}%`,background:"#18181b",borderRadius:99}}/></div>
          </div>
          <ResponsiveContainer width="100%" height={44}><AreaChart data={TREND}><defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#18181b" stopOpacity={0.1}/><stop offset="100%" stopColor="#18181b" stopOpacity={0}/></linearGradient></defs><Area type="monotone" dataKey="a" stroke="#18181b" strokeWidth={1.5} fill="url(#g1)" dot={false}/></AreaChart></ResponsiveContainer>
        </div>
        <div style={{...card,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={lbl}>Bi-Weekly Cycle</div>
          <div style={{position:"relative",width:80,height:80,margin:"12px 0"}}>
            <svg viewBox="0 0 80 80" style={{transform:"rotate(-90deg)"}}><circle cx="40" cy="40" r="33" fill="none" stroke="#f4f4f5" strokeWidth="5"/><circle cx="40" cy="40" r="33" fill="none" stroke="#18181b" strokeWidth="5" strokeDasharray={`${(8/14)*207.3} 207.3`} strokeLinecap="round"/></svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,fontWeight:700,color:"#18181b"}}>8</span><span style={{fontSize:9,color:"#a1a1aa"}}>of 14</span></div>
          </div>
          <div style={{textAlign:"center"}}><div style={{fontSize:13,fontWeight:600,color:"#18181b"}}>6 Days Left</div><div style={muted}>Next run: Jun 7</div></div>
        </div>
        <div style={card}>
          <div style={{...lbl,marginBottom:12}}>Today's Meals</div>
          {[{label:"Breakfast",meal:"Champorado",emoji:"☀️"},{label:"Lunch",meal:"Chicken Adobo",emoji:"🌤"},{label:"Dinner",meal:"Sinigang na Baboy",emoji:"🌙"}].map(({label,meal,emoji})=>(
            <div key={label} style={{display:"flex",alignItems:"center",gap:8,marginBottom:9}}>
              <span style={{fontSize:14}}>{emoji}</span>
              <div><div style={muted}>{label}</div><div style={{fontSize:12,fontWeight:600,color:"#18181b"}}>{meal}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
        <div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={lbl}>Tomorrow</div>
            <span style={muted}>Mon, Jun 2</span>
          </div>
          {[{l:"Breakfast",v:"Pandesal & Eggs"},{l:"Lunch",v:"Tinola"},{l:"Dinner",v:"Beef Caldereta"}].map(({l,v})=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:7,paddingBottom:7,borderBottom:"1px solid #f4f4f5"}}>
              <span style={muted}>{l}</span>
              <span style={{fontSize:12,fontWeight:500,color:"#18181b"}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={card}>
          <div style={{...lbl,marginBottom:12}}>Pantry Alerts</div>
          {[{i:"Rice",n:"Only 2 kg remaining",t:"low"},{i:"Garlic",n:"Expiring soon",t:"exp"},{i:"Onion",n:"Only 200g left",t:"low"}].map(({i,n,t})=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 9px",background:t==="low"?"#fef9ee":"#fff1f2",borderRadius:8,marginBottom:6,border:`1px solid ${t==="low"?"#fde68a":"#fecdd3"}`}}>
              <AlertTriangle size={13} color={t==="low"?"#d97706":"#f43f5e"}/>
              <div><div style={{fontSize:11,fontWeight:600,color:"#18181b"}}>{i}</div><div style={muted}>{n}</div></div>
            </div>
          ))}
        </div>
        <div style={card}>
          <div style={{...lbl,marginBottom:12}}>Suggested Purchases</div>
          {["Milk","Eggs","Chicken","Rice","Onion","Garlic"].map(i=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:6,marginBottom:6,borderBottom:"1px solid #f9fafb"}}>
              <span style={{fontSize:12,color:"#18181b"}}>{i}</span>
              <button style={{width:20,height:20,borderRadius:5,background:"#f4f4f5",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Plus size={11} color="#52525b"/></button>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12}}>
        <div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div><div style={lbl}>Reward Budget</div><div style={{fontSize:11,color:"#71717a",marginTop:2}}>Treat yourself, intentionally.</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:700,color:"#18181b"}}>₱500</div><div style={muted}>₱205 remaining</div></div>
          </div>
          <div style={{height:4,background:"#f4f4f5",borderRadius:99,marginBottom:14}}><div style={{height:"100%",width:"59%",background:"#d97706",borderRadius:99}}/></div>
          <div style={{display:"flex",gap:8}}>
            {[{n:"Ice Cream (Selecta)",p:180},{n:"Dark Chocolate",p:120},{n:"Premium 3-in-1 Coffee",p:85},{n:"Butter Cookies",p:75}].map(({n,p})=>(
              <div key={n} style={{flex:1,padding:"9px",background:"#fffbeb",borderRadius:9,border:"1px solid #fde68a"}}>
                <div style={{fontSize:10,fontWeight:600,color:"#92400e",marginBottom:2}}>{n}</div>
                <div style={{fontSize:12,color:"#d97706"}}>₱{p}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{...card,background:"#18181b",border:"none"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#52525b",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>Forecast</div>
          <div style={{fontSize:12,color:"#71717a",marginBottom:3}}>Expected next month</div>
          <div style={{fontSize:28,fontWeight:700,color:"#fff",letterSpacing:"-0.03em"}}>₱7,250</div>
          <div style={{marginTop:8}}><div style={{fontSize:10,color:"#6b7280"}}>vs ₱8,000 budget</div><div style={{height:4,background:"#374151",borderRadius:99,marginTop:5}}><div style={{height:"100%",width:"91%",background:"#22c55e",borderRadius:99}}/></div></div>
          <div style={{display:"flex",alignItems:"center",gap:4,marginTop:10}}><TrendingDown size={11} color="#22c55e"/><span style={{fontSize:11,color:"#22c55e",fontWeight:600}}>₱750 under budget</span></div>
        </div>
      </div>
    </div>
  );
}

function MealPlannerView({templates,addTemplate,meals,setMeals}){
  const [showRecipe,setShowRecipe]=useState(false);
  const [newRecipe,setNewRecipe]=useState({name:"",ingredients:[{item:"",qty:"",unit:""}],instructions:""});
  
  const handleSaveRecipe=()=>{
    if(newRecipe.name&&newRecipe.ingredients.some(i=>i.item)){
      addTemplate({id:Date.now(),name:newRecipe.name,ingredients:newRecipe.ingredients.filter(i=>i.item),instructions:newRecipe.instructions});
      setNewRecipe({name:"",ingredients:[{item:"",qty:"",unit:""}],instructions:""});
      setShowRecipe(false);
    }
  };

  return(
    <div>
      <Header title="Meal Planner"/>
      {showRecipe&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
          <div style={{...card,width:500,maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h2 style={{fontSize:18,fontWeight:700,color:"#18181b",margin:0}}>Create Recipe Template</h2>
              <button onClick={()=>setShowRecipe(false)} style={{background:"none",border:"none",cursor:"pointer"}}><X size={20}/></button>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{...lbl,display:"block",marginBottom:6}}>Recipe Name</label>
              <input value={newRecipe.name} onChange={(e)=>setNewRecipe({...newRecipe,name:e.target.value})} placeholder="e.g., Chicken Adobo" style={{width:"100%",padding:"8px 12px",border:"1px solid #e4e4e7",borderRadius:8,fontSize:13}}/>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{...lbl,display:"block",marginBottom:8}}>Ingredients</label>
              {newRecipe.ingredients.map((ing,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,marginBottom:8,alignItems:"center"}}>
                  <input value={ing.item} onChange={(e)=>{const u=[...newRecipe.ingredients];u[i].item=e.target.value;setNewRecipe({...newRecipe,ingredients:u});}} placeholder="Item" style={{padding:"6px 10px",border:"1px solid #e4e4e7",borderRadius:6,fontSize:12}}/>
                  <input value={ing.qty} onChange={(e)=>{const u=[...newRecipe.ingredients];u[i].qty=e.target.value;setNewRecipe({...newRecipe,ingredients:u});}} placeholder="Qty" type="number" style={{padding:"6px 10px",border:"1px solid #e4e4e7",borderRadius:6,fontSize:12}}/>
                  <select value={ing.unit} onChange={(e)=>{const u=[...newRecipe.ingredients];u[i].unit=e.target.value;setNewRecipe({...newRecipe,ingredients:u});}} style={{padding:"6px 10px",border:"1px solid #e4e4e7",borderRadius:6,fontSize:12}}>
                    <option>Unit</option>
                    {UNITS.map(u=><option key={u}>{u}</option>)}
                  </select>
                  <button onClick={()=>{setNewRecipe({...newRecipe,ingredients:newRecipe.ingredients.filter((_,idx)=>idx!==i)});}} style={{width:28,height:28,borderRadius:6,background:"#fee2e2",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={14} color="#ef4444"/></button>
                </div>
              ))}
              <button onClick={()=>setNewRecipe({...newRecipe,ingredients:[...newRecipe.ingredients,{item:"",qty:"",unit:""}]})} style={{fontSize:12,padding:"6px 12px",background:"#f4f4f5",border:"1px solid #d4d4d8",borderRadius:6,cursor:"pointer",marginTop:6}}>+ Add Ingredient</button>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{...lbl,display:"block",marginBottom:6}}>Instructions</label>
              <textarea value={newRecipe.instructions} onChange={(e)=>setNewRecipe({...newRecipe,instructions:e.target.value})} placeholder="Cooking steps..." style={{width:"100%",padding:"10px 12px",border:"1px solid #e4e4e7",borderRadius:8,fontSize:12,minHeight:80,fontFamily:"inherit"}}/>
            </div>
            <button onClick={handleSaveRecipe} style={{width:"100%",padding:"9px",background:"#18181b",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Save Recipe Template</button>
          </div>
        </div>
      )}
      <div style={{...card,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div><div style={lbl}>2-Week Meal Plan</div><div style={{fontSize:13,fontWeight:600,color:"#18181b",marginTop:3}}>Jun 1 – Jun 14, 2025</div></div>
          <button onClick={()=>setShowRecipe(true)} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 14px",background:"#18181b",color:"#fff",border:"none",borderRadius:7,fontSize:12,cursor:"pointer",fontWeight:600}}><Wand2 size={13}/>Create Recipe</button>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{borderCollapse:"collapse",width:"100%",minWidth:900}}>
            <thead>
              <tr>
                <th style={{width:70,textAlign:"left",padding:"6px 10px",fontSize:10,fontWeight:700,color:"#a1a1aa",letterSpacing:"0.05em"}}>MEAL</th>
                {Array.from({length:14},(_,i)=>(
                  <th key={i} style={{textAlign:"center",padding:"4px 4px",minWidth:78}}>
                    <div style={{fontSize:9,color:"#a1a1aa"}}>{DAYS[i%7]}</div>
                    <div style={{fontSize:12,fontWeight:i===0?700:500,color:i===0?"#18181b":"#71717a",background:i===0?"#f4f4f5":"transparent",borderRadius:5,padding:"1px 5px",display:"inline-block"}}>Jun {i+1}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[{key:"b",label:"☀️ Breakfast"},{key:"l",label:"🌤 Lunch"},{key:"d",label:"🌙 Dinner"}].map(({key,label})=>(
                <tr key={key} style={{borderTop:"1px solid #f4f4f5"}}>
                  <td style={{padding:"10px",fontSize:11,fontWeight:600,color:"#71717a"}}>{label}</td>
                  {Array.from({length:14},(_,i)=>(
                    <td key={i} style={{padding:"4px"}}>
                      <select value={meals[i]?.[key]||""} onChange={(e)=>{const m=[...meals];m[i]={...m[i]||{},[key]:e.target.value};setMeals(m);}} style={{fontSize:10,padding:"5px 4px",background:i===0?"#f0fdf4":"#f9fafb",border:`1px solid ${i===0?"#bbf7d0":"#e4e4e7"}`,borderRadius:6,width:"100%",cursor:"pointer"}}>
                        <option value="">—</option>
                        {templates.map(t=><option key={t.id} value={t.name}>{t.name}</option>)}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={card}>
        <div style={{...lbl,marginBottom:14}}>Recipe Templates ({templates.length})</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {templates.map(t=>(
            <div key={t.id} style={{padding:"12px",background:"#f9fafb",border:"1px solid #e4e4e7",borderRadius:9}}>
              <div style={{fontSize:13,fontWeight:600,color:"#18181b",marginBottom:6}}>{t.name}</div>
              <div style={{fontSize:11,color:"#a1a1aa",marginBottom:4}}>{t.ingredients.length} ingredients</div>
              {t.instructions&&<div style={{fontSize:10,color:"#71717a",lineHeight:1.4}}>{t.instructions.substring(0,50)}...</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GroceryListsView({templates,meals,suggestions,setSuggestions}){
  const [tab,setTab]=useState("biweekly");
  const [items,setItems]=useState([]);
  const [showForm,setShowForm]=useState(false);
  const [loading,setLoading]=useState(false);
  const [formData,setFormData]=useState({type:"Protein",name:"",qty:"",unit:"kg",location:"Grocery Store",price:""});
  const [showSuggestions,setShowSuggestions]=useState(false);

  const handleAddItem=()=>{
    if(formData.name&&formData.qty&&formData.price){
      setItems([...items,{...formData,id:Date.now(),total:Number(formData.qty)*Number(formData.price)}]);
      setFormData({type:"Protein",name:"",qty:"",unit:"kg",location:"Grocery Store",price:""});
    }
  };

  const handleGenerateSuggestions=async()=>{
    if(items.length===0)return;
    setLoading(true);
    const sugg=await generateAIMealSuggestions(items);
    setSuggestions(sugg);
    setLoading(false);
    setShowSuggestions(true);
  };

  const total=items.reduce((s,i)=>s+i.total,0);

  return(
    <div>
      <Header title="Grocery Lists"/>
      {showSuggestions&&(
        <div style={{...card,marginBottom:16,background:"#f0fdf4",border:"1px solid #bbf7d0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div><div style={{...lbl,color:"#166534"}}>AI Meal Suggestions</div><div style={{fontSize:13,color:"#166534",fontWeight:500}}>Based on your grocery list</div></div>
            <button onClick={()=>setShowSuggestions(false)} style={{background:"none",border:"none",cursor:"pointer"}}><X size={18}/></button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
            {suggestions.map((meal,i)=>(
              <div key={i} style={{padding:"12px",background:"#fff",border:"1px solid #bbf7d0",borderRadius:9}}>
                <div style={{fontSize:13,fontWeight:600,color:"#18181b",marginBottom:6}}>{meal.name}</div>
                <div style={{fontSize:11,color:"#71717a",marginBottom:4}}>⏱ {meal.cookingTime||"30 min"}</div>
                <div style={{fontSize:11,color:"#52525b",marginBottom:8,lineHeight:1.3}}>Ingredients: {Array.isArray(meal.ingredients)?meal.ingredients.join(", "):meal.ingredients}</div>
                <button style={{fontSize:11,padding:"5px 12px",background:"#16a34a",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontWeight:500}}>Add to Meals</button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div style={{display:"flex",gap:4,marginBottom:16,background:"#f4f4f5",padding:4,borderRadius:9,width:"fit-content"}}>
        {["biweekly","monthly"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 16px",borderRadius:6,border:"none",cursor:"pointer",background:tab===t?"#fff":"transparent",color:tab===t?"#18181b":"#71717a",fontSize:12,fontWeight:500,boxShadow:tab===t?"0 1px 2px rgba(0,0,0,0.08)":"none"}}>
            {t==="biweekly"?"Bi-Weekly":"Monthly"}
          </button>
        ))}
      </div>

      {showForm&&(
        <div style={{...card,marginBottom:16,background:"#f9fafb"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{fontSize:14,fontWeight:600,color:"#18181b",margin:0}}>Add Grocery Item</h3>
            <button onClick={()=>setShowForm(false)} style={{background:"none",border:"none",cursor:"pointer"}}><X size={18}/></button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
            <div>
              <label style={{...lbl,display:"block",marginBottom:5}}>Product Type</label>
              <select value={formData.type} onChange={(e)=>setFormData({...formData,type:e.target.value})} style={{width:"100%",padding:"8px",border:"1px solid #d4d4d8",borderRadius:6,fontSize:12}}>
                {PRODUCT_TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{...lbl,display:"block",marginBottom:5}}>Product Name</label>
              <input value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} placeholder="e.g., Chicken" style={{width:"100%",padding:"8px 10px",border:"1px solid #d4d4d8",borderRadius:6,fontSize:12}}/>
            </div>
            <div>
              <label style={{...lbl,display:"block",marginBottom:5}}>Quantity</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                <input type="number" value={formData.qty} onChange={(e)=>setFormData({...formData,qty:e.target.value})} placeholder="1" style={{padding:"8px",border:"1px solid #d4d4d8",borderRadius:6,fontSize:12}}/>
                <select value={formData.unit} onChange={(e)=>setFormData({...formData,unit:e.target.value})} style={{padding:"8px",border:"1px solid #d4d4d8",borderRadius:6,fontSize:12}}>
                  {UNITS.map(u=><option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
            <div>
              <label style={{...lbl,display:"block",marginBottom:5}}>Est. Unit Price (₱)</label>
              <input type="number" value={formData.price} onChange={(e)=>setFormData({...formData,price:e.target.value})} placeholder="0" style={{width:"100%",padding:"8px 10px",border:"1px solid #d4d4d8",borderRadius:6,fontSize:12}}/>
            </div>
            <div>
              <label style={{...lbl,display:"block",marginBottom:5}}>Total</label>
              <div style={{padding:"9px 10px",background:"#f4f4f5",borderRadius:6,fontSize:12,fontWeight:600,color:"#18181b"}}>₱{(Number(formData.qty)*Number(formData.price)||0).toFixed(2)}</div>
            </div>
            <div>
              <label style={{...lbl,display:"block",marginBottom:5}}>Purchase Location</label>
              <select value={formData.location} onChange={(e)=>setFormData({...formData,location:e.target.value})} style={{width:"100%",padding:"8px",border:"1px solid #d4d4d8",borderRadius:6,fontSize:12}}>
                {PURCHASE_LOCATIONS.map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleAddItem} style={{width:"100%",padding:"8px",background:"#18181b",color:"#fff",border:"none",borderRadius:6,fontWeight:600,cursor:"pointer",fontSize:12}}>Add Item</button>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 160px",gap:14,alignItems:"start"}}>
        <div>
          {!showForm&&(
            <button onClick={()=>setShowForm(true)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",background:"#18181b",color:"#fff",border:"none",borderRadius:7,fontSize:12,cursor:"pointer",marginBottom:12,fontWeight:600}}><Plus size={14}/>Add Item</button>
          )}
          {items.length>0&&(
            <div style={card}>
              <div style={{...lbl,marginBottom:12}}>Grocery List ({items.length})</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead>
                  <tr style={{borderBottom:"1px solid #e4e4e7"}}>
                    {["Type","Product","Qty","Location","Unit Price","Total",""].map(h=>(
                      <th key={h} style={{textAlign:"left",padding:"6px 8px",fontSize:9,fontWeight:700,color:"#a1a1aa"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item,i)=>(
                    <tr key={item.id} style={{borderBottom:"1px solid #f4f4f5"}}>
                      <td style={{padding:"8px"}}><span style={{fontSize:9,background:"#f4f4f5",padding:"2px 6px",borderRadius:4}}>{item.type}</span></td>
                      <td style={{padding:"8px",fontWeight:500,color:"#18181b"}}>{item.name}</td>
                      <td style={{padding:"8px",color:"#52525b"}}>{item.qty} {item.unit}</td>
                      <td style={{padding:"8px",color:"#71717a"}}><span style={{fontSize:9,padding:"2px 8px",background:item.location==="Wet Market"?"#ffe4e6":"#e0f2fe",borderRadius:4}}>{item.location}</span></td>
                      <td style={{padding:"8px",color:"#52525b"}}>₱{item.price}</td>
                      <td style={{padding:"8px",fontWeight:600,color:"#18181b"}}>₱{item.total.toFixed(2)}</td>
                      <td style={{padding:"8px"}}><button onClick={()=>setItems(items.filter((_,idx)=>idx!==i))} style={{background:"#fee2e2",border:"none",borderRadius:4,cursor:"pointer",padding:"4px 6px"}}><X size={12} color="#ef4444"/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{position:"sticky",top:0}}>
          {items.length>0&&(
            <>
              <div style={card}>
                <div style={{...lbl,marginBottom:12}}>Summary</div>
                <div style={{marginBottom:12,display:"flex",flexDirection:"column",gap:8}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#52525b"}}>Total Items</span><span style={{fontSize:12,fontWeight:600,color:"#18181b"}}>{items.length}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#52525b"}}>Est. Total</span><span style={{fontSize:13,fontWeight:700,color:"#18181b"}}>₱{total.toFixed(2)}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#52525b"}}>Grocery</span><span style={{fontSize:12,color:"#18181b"}}>{items.filter(i=>i.location==="Grocery Store").length}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#52525b"}}>Wet Market</span><span style={{fontSize:12,color:"#18181b"}}>{items.filter(i=>i.location==="Wet Market").length}</span></div>
                </div>
                <button onClick={handleGenerateSuggestions} disabled={loading} style={{width:"100%",padding:"9px",background:loading?"#d4d4d8":"#16a34a",color:"#fff",border:"none",borderRadius:7,fontSize:12,fontWeight:600,cursor:loading?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>{loading?<><Loader size={12}/>Loading</>:<><Wand2 size={12}/>AI Suggestions</>}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PantryView(){
  return(
    <div>
      <Header title="Pantry Inventory"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:12}}>
        {[["Total Items","8"],["Low Stock","2"],["Expiring","1"]].map(([l,v],i)=>(
          <div key={l} style={card}>
            <div style={lbl}>{l}</div>
            <div style={{fontSize:24,fontWeight:700,color:i===1?"#d97706":i===2?"#ef4444":"#18181b",marginTop:6}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={card}>
        <div style={{...lbl,marginBottom:14}}>Current Stock</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{borderBottom:"1px solid #e4e4e7"}}>
              {["Item","Qty","Unit","Expiry","Status"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"8px",fontSize:10,fontWeight:700,color:"#a1a1aa"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PANTRY.map((item,i)=>(
              <tr key={i} style={{borderBottom:"1px solid #f4f4f5"}}>
                <td style={{padding:"8px",fontWeight:500,color:"#18181b"}}>{item.n}</td>
                <td style={{padding:"8px",color:"#52525b"}}>{item.q}</td>
                <td style={{padding:"8px",color:"#52525b"}}>{item.u}</td>
                <td style={{padding:"8px",color:"#52525b"}}>{item.exp}</td>
                <td style={{padding:"8px"}}><span style={{fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:99,background:item.s==="low"?"#fef3c7":item.s==="expiring"?"#fee2e2":"#f0fdf4",color:item.s==="low"?"#d97706":item.s==="expiring"?"#ef4444":"#16a34a"}}>{item.s==="low"?"Low":item.s==="expiring"?"Expiring":"OK"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BudgetView(){
  return(
    <div>
      <Header title="Budget & Expenses"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:12}}>
        {[["Monthly Budget","₱8,000","June 2025","#18181b"],["Total Spent","₱6,200","77.5% of budget","#d97706"],["Remaining","₱1,800","22.5% left","#16a34a"]].map(([l,v,s,c])=>(
          <div key={l} style={card}>
            <div style={lbl}>{l}</div>
            <div style={{fontSize:26,fontWeight:700,color:c,letterSpacing:"-0.02em",margin:"7px 0 3px"}}>{v}</div>
            <div style={muted}>{s}</div>
          </div>
        ))}
      </div>
      <div style={card}>
        <div style={{...lbl,marginBottom:14}}>Recent Expenses</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
          <thead>
            <tr style={{borderBottom:"1px solid #e4e4e7"}}>
              {["Date","Item","Category","Unit Price","Total"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"8px",fontSize:10,fontWeight:700,color:"#a1a1aa"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EXPENSES.map((e,i)=>(
              <tr key={i} style={{borderBottom:"1px solid #f4f4f5"}}>
                <td style={{padding:"8px",color:"#a1a1aa"}}>{e.date}</td>
                <td style={{padding:"8px",fontWeight:500,color:"#18181b"}}>{e.item}</td>
                <td style={{padding:"8px"}}><span style={{fontSize:10,padding:"2px 8px",background:"#f4f4f5",borderRadius:99,color:"#52525b"}}>{e.cat}</span></td>
                <td style={{padding:"8px",color:"#52525b"}}>{e.unit}</td>
                <td style={{padding:"8px",fontWeight:600,color:"#18181b"}}>₱{e.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{display:"flex",justifyContent:"flex-end",padding:"12px 8px 0",borderTop:"1px solid #f4f4f5"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#18181b"}}>Total: ₱{EXPENSES.reduce((s,e)=>s+e.total,0).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsView(){
  return(
    <div>
      <Header title="Analytics"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <div style={card}>
          <div style={{...lbl,marginBottom:16}}>Spending by Category</div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={CATS} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" paddingAngle={2}>
                  {CATS.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{flex:1}}>
              {CATS.map(({name,value,color})=>(
                <div key={name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:7,height:7,borderRadius:2,background:color,border:color==="#e4e4e7"?"1px solid #d4d4d8":"none"}}/>
                    <span style={{fontSize:11,color:"#52525b"}}>{name}</span>
                  </div>
                  <span style={{fontSize:11,fontWeight:600,color:"#18181b"}}>₱{value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={card}>
          <div style={{...lbl,marginBottom:16}}>Monthly Spending Trend</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={TREND}>
              <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#18181b" stopOpacity={0.1}/><stop offset="100%" stopColor="#18181b" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="m" tick={{fontSize:10,fill:"#a1a1aa"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:"#a1a1aa"}} axisLine={false} tickLine={false} tickFormatter={v=>`₱${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={v=>[`₱${v.toLocaleString()}`,"Spent"]} contentStyle={{fontSize:11,borderRadius:8}}/>
              <Area type="monotone" dataKey="a" stroke="#18181b" strokeWidth={2} fill="url(#g2)" dot={{r:3,fill:"#18181b"}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={card}>
        <div style={{...lbl,marginBottom:16}}>Budget vs Actual</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={TREND.map(d=>({...d,budget:8000}))}>
            <XAxis dataKey="m" tick={{fontSize:10,fill:"#a1a1aa"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:10,fill:"#a1a1aa"}} axisLine={false} tickLine={false} tickFormatter={v=>`₱${(v/1000).toFixed(0)}k`}/>
            <Tooltip formatter={v=>[`₱${v.toLocaleString()}`]} contentStyle={{fontSize:11,borderRadius:8}}/>
            <Bar dataKey="budget" fill="#f4f4f5" radius={[4,4,0,0]} name="Budget"/>
            <Bar dataKey="a" fill="#18181b" radius={[4,4,0,0]} name="Actual"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ForecastingView(){
  const fullData=[...TREND,...FORECAST.map(d=>({m:d.m,a:d.v,forecast:true}))];
  return(
    <div>
      <Header title="Forecasting"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:12}}>
        {FORECAST.map(({m,v})=>(
          <div key={m} style={card}>
            <div style={lbl}>{m} 2025</div>
            <div style={{fontSize:22,fontWeight:700,color:"#18181b",letterSpacing:"-0.02em",margin:"8px 0 4px"}}>₱{v.toLocaleString()}</div>
            <div style={{fontSize:11,color:v<8000?"#16a34a":"#ef4444",fontWeight:500}}>{v<8000?`₱${(8000-v).toLocaleString()} under`:`₱${(v-8000).toLocaleString()} over`} budget</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={card}>
          <div style={{...lbl,marginBottom:16}}>10-Month Overview</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={fullData}>
              <defs><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#18181b" stopOpacity={0.08}/><stop offset="100%" stopColor="#18181b" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="m" tick={{fontSize:10,fill:"#a1a1aa"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:"#a1a1aa"}} axisLine={false} tickLine={false} tickFormatter={v=>`₱${(v/1000).toFixed(0)}k`} domain={[5500,9000]}/>
              <Tooltip formatter={v=>[`₱${v.toLocaleString()}`,"Spending"]} contentStyle={{fontSize:11,borderRadius:8}}/>
              <Area type="monotone" dataKey="a" stroke="#18181b" strokeWidth={2} fill="url(#g3)" dot={{r:3,fill:"#18181b"}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={card}>
          <div style={{...lbl,marginBottom:14}}>Annual Projection</div>
          {[["Expected Monthly Avg","₱7,175"],["Annual Grocery Cost","₱86,100"],["Annual Budget","₱96,000"],["Projected Savings","₱9,900"]].map(([l,v],i)=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<3?"1px solid #f4f4f5":"none"}}>
              <span style={{fontSize:12,color:"#52525b"}}>{l}</span>
              <span style={{fontSize:13,fontWeight:700,color:i===3?"#16a34a":"#18181b"}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsView(){
  return(
    <div>
      <Header title="Settings"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[["Monthly Budget","Set your grocery spending limit","₱8,000"],["Reward Budget","Allocate treats budget","₱500"],["Grocery Cycle","Cycle start days","1st & 15th"],["Household Size","Number of people to plan for","2 people"],["Currency","Display currency","PHP (₱)"],["Notifications","Grocery run reminders","Enabled"]].map(([title,desc,value])=>(
          <div key={title} style={{...card,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:"#18181b"}}>{title}</div>
              <div style={muted}>{desc}</div>
            </div>
            <div style={{fontSize:12,fontWeight:700,color:"#18181b",background:"#f4f4f5",padding:"5px 12px",borderRadius:7,flexShrink:0,marginLeft:12}}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const NAV=[{id:"dashboard",icon:LayoutDashboard,label:"Dashboard"},{id:"meals",icon:Utensils,label:"Meal Planner"},{id:"groceries",icon:ShoppingCart,label:"Grocery Lists"},{id:"pantry",icon:Package,label:"Pantry"},{id:"budget",icon:Wallet,label:"Budget"},{id:"analytics",icon:BarChart2,label:"Analytics"},{id:"forecast",icon:TrendingUp,label:"Forecasting"},{id:"settings",icon:Settings,label:"Settings"}];

const defaultTemplates=[
  {id:1,name:"Chicken Adobo",ingredients:[{item:"Chicken",qty:2,unit:"kg"},{item:"Soy Sauce",qty:1,unit:"bottle"},{item:"Vinegar",qty:"0.5",unit:"bottle"}],instructions:"Marinate chicken in soy sauce and vinegar for 30 mins. Braise in pan until golden. Add water and simmer until tender."},
  {id:2,name:"Sinigang",ingredients:[{item:"Pork",qty:1,unit:"kg"},{item:"Radish",qty:500,unit:"g"},{item:"Spinach",qty:"1",unit:"bunch"}],instructions:"Boil pork with radish and tamarind broth. Add spinach in the last 5 minutes."},
  {id:3,name:"Tinola",ingredients:[{item:"Chicken",qty:1.5,unit:"kg"},{item:"Ginger",qty:100,unit:"g"},{item:"Chayote",qty:"2",unit:"pcs"}],instructions:"Sauté ginger, add chicken, simmer in broth. Add chayote and leafy greens."},
  {id:4,name:"Beef Caldereta",ingredients:[{item:"Beef",qty:1.5,unit:"kg"},{item:"Tomato Sauce",qty:"1",unit:"can"},{item:"Cheese",qty:200,unit:"g"}],instructions:"Brown beef, add tomato sauce and vegetables. Simmer until tender. Add cheese at the end."}
];

const defaultMeals=[
  {b:"Champorado",l:"Chicken Adobo",d:"Sinigang na Baboy"},
  {b:"Pandesal & Eggs",l:"Tinola",d:"Beef Caldereta"},
  {b:"Oatmeal",l:"Sinigang na Bangus",d:"Pork Menudo"}
];

export default function GroceryOS(){
  const [view,setView]=useState("dashboard");
  const [hov,setHov]=useState(false);
  
  // Load from localStorage or use defaults
  const [templates,setTemplates]=useState(()=>{
    const saved=localStorage.getItem("groceryOS_templates");
    return saved?JSON.parse(saved):defaultTemplates;
  });
  
  const [meals,setMeals]=useState(()=>{
    const saved=localStorage.getItem("groceryOS_meals");
    return saved?JSON.parse(saved):defaultMeals;
  });
  
  const [suggestions,setSuggestions]=useState([]);

  // Save to localStorage whenever templates or meals change
  useEffect(()=>{
    localStorage.setItem("groceryOS_templates",JSON.stringify(templates));
  },[templates]);

  useEffect(()=>{
    localStorage.setItem("groceryOS_meals",JSON.stringify(meals));
  },[meals]);

  const addTemplate=t=>setTemplates([...templates,t]);

  const VIEWS={
    dashboard:<DashboardView/>,
    meals:<MealPlannerView templates={templates} addTemplate={addTemplate} meals={meals} setMeals={setMeals}/>,
    groceries:<GroceryListsView templates={templates} meals={meals} suggestions={suggestions} setSuggestions={setSuggestions}/>,
    pantry:<PantryView/>,
    budget:<BudgetView/>,
    analytics:<AnalyticsView/>,
    forecast:<ForecastingView/>,
    settings:<SettingsView/>,
  };

  return(
    <div style={{display:"flex",height:"100vh",background:"#f9fafb",fontFamily:"-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif",overflow:"hidden"}}>
      <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{width:hov?210:60,background:"#111827",height:"100vh",display:"flex",flexDirection:"column",transition:"width 0.2s ease",overflow:"hidden",flexShrink:0}}>
        <div style={{padding:"16px 14px",borderBottom:"1px solid #1f2937",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,background:"#fff",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <ShoppingBag size={15} color="#111827"/>
          </div>
          {hov&&<span style={{fontSize:14,fontWeight:700,color:"#fff",whiteSpace:"nowrap",letterSpacing:"-0.02em"}}>GroceryOS</span>}
        </div>
        <nav style={{flex:1,padding:"10px 7px",display:"flex",flexDirection:"column",gap:2}}>
          {NAV.map(({id,icon:Icon,label})=>(
            <button key={id} onClick={()=>setView(id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 11px",borderRadius:7,border:"none",background:view===id?"#1f2937":"transparent",color:view===id?"#fff":"#9ca3af",cursor:"pointer",width:"100%",textAlign:"left",whiteSpace:"nowrap"}}>
              <Icon size={17} strokeWidth={view===id?2.5:1.5} style={{flexShrink:0}}/>
              {hov&&<span style={{fontSize:12,fontWeight:500}}>{label}</span>}
            </button>
          ))}
        </nav>
        <div style={{padding:"10px 7px",borderTop:"1px solid #1f2937",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,borderRadius:"50%",background:"#374151",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:10,fontWeight:600,color:"#d1d5db"}}>JD</span>
          </div>
          {hov&&<div><div style={{fontSize:11,fontWeight:600,color:"#f9fafb"}}>Juan Dela Cruz</div><div style={{fontSize:10,color:"#6b7280"}}>Santa Rosa, Laguna</div></div>}
        </div>
      </div>
      <main style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
        {VIEWS[view]}
      </main>
    </div>
  );
}