const{useState,useEffect}=React;
const DEFAULT_GOAL=1300,USER_WEIGHT_START=102,USER_TARGET_WEIGHT=78,CAL_PER_KM=80;
const WALK_PRESETS=[{label:"4 كيلو",km:4,cal:320},{label:"8 كيلو",km:8,cal:640}];
const MEAL_OPTIONS={غداء:[{name:"برياني دجاج",cal:650},{name:"مشوي دجاج + أرز",cal:600},{name:"براتا دجاج",cal:700},{name:"برياني لحم",cal:750},{name:"مشوي لحم + خبز",cal:680}],سناك:[{name:"تفاحة",cal:80},{name:"موزة",cal:90},{name:"لبن قليل الدسم",cal:120},{name:"مكسرات",cal:160},{name:"تمر (3 حبات)",cal:70}],عشاء:[{name:"سندويش دجاج مشوي",cal:450},{name:"براتا لحم",cal:650},{name:"مشوي لحم + خبز",cal:600},{name:"سندويش لحم",cal:550},{name:"براتا دجاج",cal:580}]};
const DRINKS=[{name:"ماء",cal:0},{name:"قهوة سادة",cal:5},{name:"شاي",cal:2},{name:"عصير طازج",cal:120},{name:"غازي",cal:150},{name:"لبن",cal:130}];
const TIPS=["💧 اشرب 8 أكواب ماء يومياً","🚫 تجنب الصلصات الدسمة","✅ برياني الدجاج أفضل من اللحم","🌙 لا تأكل بعد الساعة 9 مساءً","🏃 كلما زادت مسافة المشي زادت السعرات","🍽️ كُل ببطء وامضغ جيداً","📏 وزّن نفسك صباحاً","🥗 أضف سلطة خضراء لوجباتك"];
function todayKey(){return new Date().toISOString().split("T")[0];}
function getLast(n){return Array.from({length:n},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(n-1-i));return d.toISOString().split("T")[0];});}
function App(){
const[log,setLog]=useState(()=>{try{return JSON.parse(localStorage.getItem("kh_log")||"{}");}catch{return{};}});
const[wLog,setWLog]=useState(()=>{try{return JSON.parse(localStorage.getItem("kh_wt")||"{}");}catch{return{};}});
const[goal,setGoal]=useState(()=>+(localStorage.getItem("kh_goal")||DEFAULT_GOAL));
const[tab,setTab]=useState("today");
const[tipIdx]=useState(()=>Math.floor(Math.random()*TIPS.length));
const[customName,setCustomName]=useState("");
const[customCal,setCustomCal]=useState("");
const[weightVal,setWeightVal]=useState("");
const[newGoal,setNewGoal]=useState(goal);
useEffect(()=>{localStorage.setItem("kh_log",JSON.stringify(log));},[log]);
useEffect(()=>{localStorage.setItem("kh_wt",JSON.stringify(wLog));},[wLog]);
useEffect(()=>{localStorage.setItem("kh_goal",goal);},[goal]);
const today=todayKey();
const e=log[today]||{};
const walkCal=e.walk?.cal||0;
const effectiveGoal=goal+walkCal;
const eaten=(e.غداء?.cal||0)+(e.سناك?.cal||0)+(e.عشاء?.cal||0)+(e.custom||[]).reduce((s,x)=>s+x.cal,0)+(e.drinks||[]).reduce((s,x)=>s+x.cal,0);
const pct=Math.min((eaten/effectiveGoal)*100,100);
const remaining=effectiveGoal-eaten;
const color=pct<70?"#4ade80":pct<95?"#facc15":"#f87171";
function upd(patch){setLog(p=>({...p,[today]:{...(p[today]||{}),...patch}}));}
const days14=getLast(14);
const totals14=days14.map(d=>{const x=log[d]||{};return(x.غداء?.cal||0)+(x.سناك?.cal||0)+(x.عشاء?.cal||0)+(x.custom||[]).reduce((s,i)=>s+i.cal,0)+(x.drinks||[]).reduce((s,i)=>s+i.cal,0)-(x.walk?.cal||0);});
const maxT=Math.max(...totals14,goal);
const wVals=Object.values(wLog).filter(Boolean);
const lost=wVals.length?+(USER_WEIGHT_START-wVals[wVals.length-1]).toFixed(1):0;
const latest=wVals[wVals.length-1]||USER_WEIGHT_START;
const daysLeft=latest>USER_TARGET_WEIGHT?Math.ceil(((latest-USER_TARGET_WEIGHT)*7700)/550):0;
const r=54,circ=2*Math.PI*r,offset=circ*(1-pct/100);
return React.createElement("div",{style:{minHeight:"100vh",background:"linear-gradient(160deg,#080e1a,#0d1627,#0a1520)",fontFamily:"Tajawal,sans-serif",color:"#e2e8f0",direction:"rtl",padding:"0 0 60px"}},
React.createElement("style",null,`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}.gc{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:18px}.mb{width:100%;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:11px 14px;color:#94a3b8;cursor:pointer;font-family:inherit;font-size:14px;text-align:right;display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;transition:all .18s}.mb.on{background:linear-gradient(135deg,rgba(14,165,233,.25),rgba(99,102,241,.2));border-color:#38bdf8;color:#fff}.wb{flex:1;padding:10px 6px;border:1.5px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.03);color:#94a3b8;cursor:pointer;font-family:inherit;font-size:13px;font-weight:700;text-align:center;transition:all .2s}.wb.on{background:rgba(16,185,129,.2);border-color:#10b981;color:#6ee7b7}.inp{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:9px 13px;color:#e2e8f0;font-family:inherit;font-size:14px;outline:none}.bp{background:linear-gradient(135deg,#0ea5e9,#3b82f6);border:none;border-radius:10px;padding:10px 18px;color:#fff;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer}`),
React.createElement("div",{style:{maxWidth:430,margin:"0 auto",padding:"18px 14px"}},
React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}},
React.createElement("div",null,React.createElement("h1",{style:{fontSize:19,fontWeight:900}},"خطواتي 🔥"),React.createElement("p",{style:{fontSize:11,color:"#475569",marginTop:2}},new Date().toLocaleDateString("ar-SA",{weekday:"long",day:"numeric",month:"long"}))),
React.createElement("div",{style:{textAlign:"left"}},React.createElement("div",{style:{fontSize:11,color:"#475569"}},"الوزن"),React.createElement("div",{style:{fontSize:17,fontWeight:800,color:"#38bdf8"}},(wLog[today]||latest)+" كغ"))),
React.createElement("div",{style:{display:"flex",gap:5,background:"rgba(255,255,255,.04)",borderRadius:12,padding:3,marginBottom:16}},[{id:"today",l:"☀️ اليوم"},{id:"history",l:"📊 السجل"},{id:"settings",l:"⚙️ الإعدادات"}].map(t=>React.createElement("button",{key:t.id,onClick:()=>setTab(t.id),style:{flex:1,padding:"8px 3px",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,borderRadius:9,background:tab===t.id?"linear-gradient(135deg,#0ea5e9,#3b82f6)":"transparent",color:tab===t.id?"#fff":"#475569"}},t.l))),
tab==="today"&&React.createElement("div",null,
React.createElement("div",{className:"gc",style:{padding:"18px 14px",marginBottom:14,textAlign:"center"}},
React.createElement("svg",{width:140,height:140,viewBox:"0 0 140 140"},
React.createElement("circle",{cx:70,cy:70,r:r,fill:"none",stroke:"rgba(255,255,255,.06)",strokeWidth:10}),
React.createElement("circle",{cx:70,cy:70,r:r,fill:"none",stroke:color,strokeWidth:10,strokeDasharray:circ,strokeDashoffset:offset,strokeLinecap:"round",transform:"rotate(-90 70 70)",style:{transition:"stroke-dashoffset .5s"}}),
React.createElement("text",{x:70,y:65,textAnchor:"middle",fill:"#f1f5f9",fontSize:24,fontWeight:900,fontFamily:"Tajawal"},eaten),
React.createElement("text",{x:70,y:80,textAnchor:"middle",fill:"#64748b",fontSize:11,fontFamily:"Tajawal"},"سعرة"),
React.createElement("text",{x:70,y:97,textAnchor:"middle",fill:color,fontSize:12,fontWeight:700,fontFamily:"Tajawal"},remaining>=0?"متبقي "+remaining:"تجاوزت "+Math.abs(remaining))),
React.createElement("div",{style:{display:"flex",justifyContent:"center",gap:20,marginTop:4}},
React.createElement("div",{style:{textAlign:"center"}},React.createElement("div",{style:{fontSize:14,fontWeight:800,color:"#38bdf8"}},effectiveGoal),React.createElement("div",{style:{fontSize:10,color:"#475569"}},"الهدف")),
React.createElement("div",{style:{textAlign:"center"}},React.createElement("div",{style:{fontSize:14,fontWeight:800,color:"#10b981"}},walkCal),React.createElement("div",{style:{fontSize:10,color:"#475569"}},"محروق مشي"))),
walkCal>0&&React.createElement("div",{style:{marginTop:10,background:"rgba(16,185,129,.08)",borderRadius:10,padding:"7px 12px",fontSize:12,color:"#6ee7b7"}},"🏃 مشيت اليوم! هدفك "+effectiveGoal+" سعرة")),
React.createElement("div",{style:{background:"rgba(14,165,233,.08)",border:"1px solid rgba(14,165,233,.15)",borderRadius:12,padding:"9px 13px",marginBottom:12,fontSize:12,color:"#7dd3fc"}},"💡 "+TIPS[tipIdx]),
React.createElement("div",{className:"gc",style:{padding:14,marginBottom:12,border:"1px solid rgba(16,185,129,.15)"}},
React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:10}},React.createElement("span",{style:{fontSize:18}},"🏃"),React.createElement("span",{style:{fontWeight:800,fontSize:14}},"المشي اليوم"),e.walk&&React.createElement("span",{style:{marginRight:"auto",background:"rgba(16,185,129,.15)",color:"#6ee7b7",border:"1px solid rgba(16,185,129,.2)",borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:700}},"🔥 -"+e.walk.cal+" سعرة")),
React.createElement("div",{style:{display:"flex",gap:8}},WALK_PRESETS.map(p=>React.createElement("button",{key:p.km,className:"wb "+(e.walk?.km===p.km?"on":""),onClick:()=>upd({walk:e.walk?.km===p.km?null:p})},React.createElement("div",null,"🚶"),React.createElement("div",null,p.label),React.createElement("div",{style:{fontSize:10,opacity:.7}},"~"+p.cal+" سعرة"))))),
["غداء","سناك","عشاء"].map((type,ti)=>React.createElement("div",{key:type,className:"gc",style:{padding:14,marginBottom:12}},
React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:10}},React.createElement("span",{style:{fontSize:18}},["☀️","🍎","🌙"][ti]),React.createElement("span",{style:{fontWeight:800,fontSize:14}},type),e[type]&&React.createElement("span",{style:{marginRight:"auto",background:"rgba(74,222,128,.15)",color:"#4ade80",border:"1px solid rgba(74,222,128,.2)",borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:700}},"✓ "+e[type].cal+" سعرة")),
MEAL_OPTIONS[type].map(m=>React.createElement("button",{key:m.name,className:"mb "+(e[type]?.name===m.name?"on":""),onClick:()=>upd({[type]:m})},React.createElement("span",null,m.name),React.createElement("span",{style:{fontSize:11,opacity:.75}},"🔥 "+m.cal))))),
React.createElement("div",{className:"gc",style:{padding:14,marginBottom:12}},
React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:10}},React.createElement("span",{style:{fontSize:18}},"🥤"),React.createElement("span",{style:{fontWeight:800,fontSize:14}},"المشروبات"),(e.drinks||[]).length>0&&React.createElement("span",{style:{marginRight:"auto",background:"rgba(56,189,248,.15)",color:"#38bdf8",border:"1px solid rgba(56,189,248,.2)",borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:700}},(e.drinks||[]).reduce((s,d)=>s+d.cal,0)+" سعرة")),
React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},DRINKS.map(d=>React.createElement("button",{key:d.name,onClick:()=>upd({drinks:[...(e.drinks||[]),d]}),style:{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:20,padding:"5px 11px",color:"#94a3b8",cursor:"pointer",fontSize:12,fontFamily:"inherit"}},d.name+" "+(d.cal>0?"("+d.cal+")":"✓"))))),
React.createElement("div",{className:"gc",style:{padding:14,marginBottom:12}},
React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#64748b",marginBottom:8}},"✏️ وجبة مخصصة"),
React.createElement("div",{style:{display:"flex",gap:7}},
React.createElement("input",{className:"inp",placeholder:"اسم الوجبة",value:customName,onChange:e2=>setCustomName(e2.target.value),style:{flex:2}}),
React.createElement("input",{className:"inp",placeholder:"سعرات",type:"number",value:customCal,onChange:e2=>setCustomCal(e2.target.value),style:{flex:1}}),
React.createElement("button",{className:"bp",onClick:()=>{if(customName&&customCal){upd({custom:[...(e.custom||[]),{name:customName,cal:+customCal}]});setCustomName("");setCustomCal("");}},style:{padding:"9px 12px"}},"+"))),
React.createElement("div",{className:"gc",style:{padding:14,marginBottom:12}},
React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#64748b",marginBottom:8}},"⚖️ تسجيل الوزن"),
React.createElement("div",{style:{display:"flex",gap:7,marginBottom:10}},React.createElement("input",{className:"inp",placeholder:"وزنك اليوم (كغ)",type:"number",value:weightVal,onChange:e2=>setWeightVal(e2.target.value)}),React.createElement("button",{className:"bp",onClick:()=>{if(weightVal){setWLog(p=>({...p,[today]:+weightVal}));upd({weight:+weightVal});setWeightVal("");}}},"حفظ")),
React.createElement("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},
React.createElement("span",{style:{background:"rgba(74,222,128,.15)",color:"#4ade80",border:"1px solid rgba(74,222,128,.2)",borderRadius:20,padding:"3px 9px",fontSize:11,fontWeight:700}},"⬇️ خسرت "+lost+" كغ"),
React.createElement("span",{style:{background:"rgba(56,189,248,.15)",color:"#38bdf8",border:"1px solid rgba(56,189,248,.2)",borderRadius:20,padding:"3px 9px",fontSize:11,fontWeight:700}},"🎯 الهدف "+USER_TARGET_WEIGHT+" كغ"),
daysLeft>0&&React.createElement("span",{style:{background:"rgba(250,204,21,.15)",color:"#facc15",border:"1px solid rgba(250,204,21,.2)",borderRadius:20,padding:"3px 9px",fontSize:11,fontWeight:700}},"📅 ~"+daysLeft+" يوم"))),
Object.keys(e).length>0&&React.createElement("button",{onClick:()=>setLog(p=>({...p,[today]:{}})),style:{width:"100%",padding:"9px",background:"transparent",border:"1px solid rgba(239,68,68,.3)",borderRadius:10,color:"#f87171",cursor:"pointer",fontFamily:"inherit",fontSize:13,marginTop:4}},"🗑️ مسح وجبات اليوم")),
tab==="history"&&React.createElement("div",null,
React.createElement("div",{style:{display:"flex",gap:8,marginBottom:14}},[{v:Math.round(totals14.filter(Boolean).reduce((a,b)=>a+b,0)/(totals14.filter(Boolean).length||1)),l:"متوسط يومي",c:"#38bdf8"},{v:totals14.filter((t)=>t>0&&t<=goal).length,l:"أيام ناجحة",c:"#4ade80"},{v:lost+" كغ",l:"خسرت",c:"#facc15"}].map((s,i)=>React.createElement("div",{key:i,className:"gc",style:{flex:1,padding:"11px 10px"}},React.createElement("div",{style:{fontSize:18,fontWeight:900,color:s.c}},s.v),React.createElement("div",{style:{fontSize:10,color:"#475569",marginTop:2}},s.l)))),
React.createElement("div",{className:"gc",style:{padding:14,marginBottom:14}},
React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#64748b",marginBottom:10}},"📊 آخر 14 يوم"),
React.createElement("div",{style:{display:"flex",alignItems:"flex-end",gap:3,height:80}},days14.map((d,i)=>{const t=totals14[i];const h=t?Math.max((t/maxT)*70,5):4;const c=t===0?"rgba(255,255,255,.07)":t<=goal?"#4ade80":"#f87171";return React.createElement("div",{key:d,style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}},t>0&&React.createElement("div",{style:{fontSize:7,color:"#64748b",marginBottom:1}},t),React.createElement("div",{style:{width:"100%",height:h,background:c,borderRadius:"3px 3px 0 0"}}));})),
React.createElement("div",{style:{display:"flex",gap:3,marginTop:4}},days14.map(d=>React.createElement("div",{key:d,style:{flex:1,textAlign:"center",fontSize:8,color:"#334155"}},new Date(d).toLocaleDateString("ar",{weekday:"narrow"}))))),
React.createElement("div",{className:"gc",style:{padding:14}},
React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#64748b",marginBottom:10}},"🗓️ السجل"),
days14.filter((_,i)=>totals14[i]>0).reverse().map(d=>{const x=log[d]||{};const t=(x.غداء?.cal||0)+(x.سناك?.cal||0)+(x.عشاء?.cal||0)+(x.custom||[]).reduce((s,i)=>s+i.cal,0)+(x.drinks||[]).reduce((s,i)=>s+i.cal,0)-(x.walk?.cal||0);return React.createElement("div",{key:d,style:{padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",justifyContent:"space-between",alignItems:"center"}},React.createElement("div",null,React.createElement("div",{style:{fontWeight:700,fontSize:13}},new Date(d).toLocaleDateString("ar-SA",{weekday:"long",day:"numeric",month:"short"})),React.createElement("div",{style:{fontSize:11,color:"#475569",marginTop:2}},[x.غداء?.name,x.سناك?.name,x.عشاء?.name].filter(Boolean).join(" · ")+(x.walk?" · 🏃"+x.walk.km+"كم":""))),React.createElement("span",{style:{background:t<=goal?"rgba(74,222,128,.15)":"rgba(248,113,113,.15)",color:t<=goal?"#4ade80":"#f87171",border:"1px solid "+(t<=goal?"rgba(74,222,128,.2)":"rgba(248,113,113,.2)"),borderRadius:20,padding:"3px 9px",fontSize:11,fontWeight:700}},t+" 🔥"));}))),
tab==="settings"&&React.createElement("div",null,
React.createElement("div",{className:"gc",style:{padding:16,marginBottom:14}},
React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#64748b",marginBottom:10}},"🎯 الهدف اليومي"),
React.createElement("div",{style:{display:"flex",gap:8,marginBottom:10}},React.createElement("input",{className:"inp",type:"number",value:newGoal,onChange:e2=>setNewGoal(+e2.target.value)}),React.createElement("button",{className:"bp",onClick:()=>setGoal(newGoal)},"حفظ")),
React.createElement("div",{style:{display:"flex",gap:7,flexWrap:"wrap"}},[1200,1300,1500,1800].map(g=>React.createElement("button",{key:g,onClick:()=>{setNewGoal(g);setGoal(g);},style:{background:goal===g?"rgba(14,165,233,.2)":"rgba(255,255,255,.04)",border:"1px solid "+(goal===g?"#38bdf8":"rgba(255,255,255,.08)"),borderRadius:8,padding:"6px 11px",color:goal===g?"#38bdf8":"#64748b",cursor:"pointer",fontSize:13,fontFamily:"inherit"}},g)))),
React.createElement("div",{className:"gc",style:{padding:16}},
React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#64748b",marginBottom:10}},"📋 معلوماتك"),
[["الوزن الابتدائي",USER_WEIGHT_START+" كغ"],["الوزن المستهدف",USER_TARGET_WEIGHT+" كغ"],["الفرق المطلوب",(USER_WEIGHT_START-USER_TARGET_WEIGHT)+" كغ"],["معدل الحرق","2,855 سعرة"],["العجز بدون مشي",(2855-goal)+" سعرة"],["مع مشي 8كم",(2855-goal+640)+" سعرة"]].map(([k,v])=>React.createElement("div",{key:k,style:{display:"flex",justifyContent:"space-between",fontSize:13,padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}},React.createElement("span",{style:{color:"#64748b"}},k),React.createElement("span",{style:{fontWeight:700,color:"#e2e8f0"}},v)))))
));}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
