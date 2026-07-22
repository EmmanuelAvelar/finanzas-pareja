import { useState, useEffect, useMemo, useRef } from "react";

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:#f0f2f8;
      --s1:#ffffff;
      --s2:#ffffff;
      --b1:#e4e7f0;
      --b2:#d0d4e8;
      --txt:#0f1132;
      --txt2:#6b7099;
      --txt3:#adb3cc;
      --yo:#3b6ff5;
      --ella:#e8336d;
      --joint:#00a86b;
      --personal:#e07b00;
      --danger:#e8336d;
      --inc:#00a86b;
      --body:'Plus Jakarta Sans',sans-serif;
      --head:'Space Grotesk',sans-serif;
    }
    html,body{background:var(--bg);font-family:var(--body);color:var(--txt);}
    input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
    input:focus{outline:none;} button{font-family:var(--body);cursor:pointer;}
    ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-thumb{background:var(--b2);border-radius:3px;}
    @keyframes up  {from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes rise{from{transform:translateY(100%)}to{transform:translateY(0)}}
    .up  {animation:up  .3s ease both;}
    .rise{animation:rise .28s cubic-bezier(.32,.72,0,1) both;}

    /* ── NAV: una sola fila, 6 columnas iguales ── */
    .nav{
      display:grid;
      grid-template-columns:repeat(6,1fr);
      background:#fff;
      border-top:1px solid var(--b1);
      position:fixed;bottom:0;left:50%;transform:translateX(-50%);
      width:100%;max-width:430px;z-index:90;
      padding-bottom:env(safe-area-inset-bottom,4px);
      box-shadow:0 -4px 20px #0f11320a;
    }
    .nav-btn{
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      gap:2px;padding:8px 2px 10px;border:none;background:none;
      color:var(--txt3);font-size:8px;font-weight:700;letter-spacing:.2px;transition:color .15s;
      min-width:0;overflow:hidden;
    }
    .nav-btn.active{color:var(--yo);}
    .nav-btn .nav-icon{font-size:18px;line-height:1;margin-bottom:1px;}
    .nav-btn .dot{width:3px;height:3px;border-radius:2px;background:currentColor;opacity:0;transition:opacity .15s;margin-top:1px;}
    .nav-btn.active .dot{opacity:1;}

    /* FAB integrado en la nav — misma altura que los botones */
    .nav-fab{
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      padding:6px 2px 10px;border:none;background:none;
    }
    .nav-fab-circle{
      width:40px;height:40px;border-radius:20px;
      background:linear-gradient(135deg,var(--yo),#6b4fff);
      color:#fff;font-size:22px;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 4px 14px #3b6ff540;
      transition:transform .15s,box-shadow .15s;
    }
    .nav-fab:active .nav-fab-circle{transform:scale(.92);}

    /* Cards */
    .card{background:#fff;border:1px solid var(--b1);border-radius:18px;padding:16px;margin-bottom:10px;box-shadow:0 2px 12px #0f11320a;}
    .card-ghost{border-style:dashed;background:transparent;box-shadow:none;}

    /* Rows */
    .row{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#fff;border:1px solid var(--b1);border-radius:14px;margin-bottom:7px;transition:border-color .15s;box-shadow:0 1px 6px #0f11320a;}
    .row:hover{border-color:var(--b2);}
    .ico{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;}
    .del{background:none;border:none;color:var(--txt3);font-size:18px;line-height:1;padding:2px 6px;border-radius:7px;transition:color .12s,background .12s;}
    .del:hover{color:var(--danger);background:#e8336d12;}
    .lbl{font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:var(--txt3);margin-bottom:6px;}
    .amt{font-family:var(--head);font-weight:800;letter-spacing:-.5px;line-height:1;}
    .pill{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.3px;}
    .cho{border-radius:11px;border:1.5px solid var(--b1);background:#f7f8fc;color:var(--txt2);font-size:12px;font-weight:700;padding:10px 6px;text-align:center;transition:all .12s;}
    .cho:active{transform:scale(.96);}
    .cat{padding:6px 11px;border-radius:20px;border:1.5px solid var(--b1);background:#f7f8fc;color:var(--txt2);font-size:11px;font-weight:700;transition:all .12s;}
    .bar-track{background:var(--b1);border-radius:4px;height:5px;overflow:hidden;margin-top:4px;}
    .bar-fill{height:100%;border-radius:4px;transition:width .6s cubic-bezier(.22,.68,0,1.2);}
    .step-dot{width:6px;height:6px;border-radius:3px;background:var(--b2);transition:all .2s;}
    .step-dot.on{background:var(--yo);width:18px;}

    /* Sync bar */
    .sync-bar{position:fixed;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;z-index:200;padding:8px 16px;display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;transition:all .3s;}
    .sync-bar.loading{background:#eef2ff;color:var(--yo);}
    .sync-bar.error{background:#fff0f3;color:var(--danger);}
    .sync-bar.ok{background:#f0fdf8;color:var(--joint);}
    @keyframes spin{to{transform:rotate(360deg)}}
    .spinner{width:12px;height:12px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0;}

    /* Bottom sheet — ajuste real a pantalla del celular */
    .sheet-overlay{
      position:fixed;inset:0;background:#00000055;z-index:200;
      display:flex;align-items:flex-end;justify-content:center;
      backdrop-filter:blur(4px);
    }
    .sheet-inner{
      background:#fff;
      border-radius:22px 22px 0 0;
      border:1px solid var(--b1);
      border-bottom:none;
      padding:20px 18px 0;
      padding-bottom:max(env(safe-area-inset-bottom,16px),16px);
      width:100%;
      max-width:430px;
      max-height:85dvh;
      max-height:85vh;
      overflow-y:auto;
      -webkit-overflow-scrolling:touch;
    }
    .hero-card{
      background:linear-gradient(135deg,#2952d9 0%,#6b4fff 100%);
      border-radius:24px;
      padding:24px 20px;
      color:#fff;
      margin-bottom:16px;
      box-shadow:0 8px 32px #3b6ff530;
    }

    /* Quick action buttons */
    .qa-btn{
      display:flex;flex-direction:column;align-items:center;gap:6px;
      background:#f0f2f8;border:none;border-radius:14px;padding:12px 8px;
      font-size:10px;font-weight:700;color:var(--txt2);transition:all .15s;flex:1;
    }
    .qa-btn:active{transform:scale(.95);background:var(--b1);}
    .qa-icon{width:38px;height:38px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px #0f11320f;}
  `}</style>
);

const CATS=[
  {id:"casa",e:"🏠",label:"Casa",c:"#4f8aff"},
  {id:"comida",e:"🍔",label:"Comida",c:"#ff8c30"},
  {id:"transporte",e:"🚗",label:"Transporte",c:"#00b37a"},
  {id:"salud",e:"💊",label:"Salud",c:"#b06fff"},
  {id:"entretenimiento",e:"🎬",label:"Entretenim.",c:"#ff5599"},
  {id:"servicios",e:"💡",label:"Servicios",c:"#ffb830"},
  {id:"ropa",e:"👗",label:"Ropa",c:"#ff6060"},
  {id:"amazon",e:"📦",label:"Amazon",c:"#ff9900"},
  {id:"carlo",e:"🧑‍🍳",label:"Carlo",c:"#00c2a8"},
  {id:"diversion",e:"🎉",label:"Diversión",c:"#7c3aed"},
  {id:"otros",e:"📁",label:"Otros",c:"#888aaa"},
];
const WHOS=[
  {id:"personal",e:"👤",label:"Personal",c:"#ffb830",hint:"Solo tuyo"},
  {id:"yo",e:"🧑",label:"Mane",c:"#4f8aff",hint:"Tu parte"},
  {id:"ella",e:"👩",label:"Majo",c:"#ff5599",hint:"Su parte"},
  {id:"compartido",e:"🤝",label:"Compartido",c:"#00d68f",hint:"Mitad y mitad"},
];

// ══ Google Sheets sync ══
const API = "https://script.google.com/macros/s/AKfycbyEgPCpkt7J8YgBS5CFJTnmSIIclBhsVfb8tGwO8vvpHEeQb9tD33-rAP-0RSto_6YJLQ/exec";

async function gsFetch(sheet) {
  const r = await fetch(`${API}?sheet=${sheet}`);
  const data = await r.json();
  // convert numeric strings
  return data.map(row => ({
    ...row,
    amount: row.amount !== "" ? Number(row.amount) : 0,
    id:     row.id !== "" ? Number(row.id) : 0,
    paid:   row.paid === true || row.paid === "TRUE" || row.paid === "true",
    abonos: [], // abonos are loaded separately and merged below
  }));
}

async function gsInsert(sheet, row) {
  await fetch(API, {
    method: "POST",
    body: JSON.stringify({ sheet, action: "insert", row }),
  });
}

async function gsUpdate(sheet, row) {
  await fetch(API, {
    method: "POST",
    body: JSON.stringify({ sheet, action: "update", row }),
  });
}

async function gsDelete(sheet, id) {
  await fetch(API, {
    method: "POST",
    body: JSON.stringify({ sheet, action: "delete", row: { id } }),
  });
}

// ══ LocalStorage fallback (offline cache) ══
const KEY="fw_v4", LKEY="fw_loans_v1", PKEY="fw_pagos_v1";
const load      =()=>{try{return JSON.parse(localStorage.getItem(KEY) ||"[]");}catch{return[];}};
const loadLoans =()=>{try{return JSON.parse(localStorage.getItem(LKEY)||"[]");}catch{return[];}};
const loadPagos =()=>{try{return JSON.parse(localStorage.getItem(PKEY)||"[]");}catch{return[];}};
const persist     =d=>{try{localStorage.setItem(KEY, JSON.stringify(d));}catch{}};
const persistLoans=d=>{try{localStorage.setItem(LKEY,JSON.stringify(d));}catch{}};
const persistPagos=d=>{try{localStorage.setItem(PKEY,JSON.stringify(d));}catch{}};

const $mxn=n=>new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(n);
const $d  =iso=>new Date(iso).toLocaleDateString("es-MX",{day:"2-digit",month:"short"});
const today=()=>new Date().toISOString().split("T")[0];
const MONTHS=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const monthKey=iso=>`${iso.slice(0,4)}-${iso.slice(5,7)}`;
const monthLabel=k=>`${MONTHS[parseInt(k.slice(5,7))-1]} ${k.slice(0,4)}`;

/* ── Shared UI ── */
function Bar({label,value,max,color,delay=0}){
  const pct=max>0?Math.max(3,(value/max)*100):3;
  return(
    <div className="up" style={{marginBottom:9,animationDelay:`${delay}ms`}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
        <span style={{color:"var(--txt2)"}}>{label}</span>
        <span className="amt" style={{fontSize:12}}>{$mxn(value)}</span>
      </div>
      <div className="bar-track"><div className="bar-fill" style={{width:`${pct}%`,background:color}}/></div>
    </div>
  );
}

function Donut({data,sz=110}){
  const total=data.reduce((s,d)=>s+d.v,0);
  if(!total)return<div style={{textAlign:"center",color:"var(--txt3)",fontSize:12,padding:16}}>Sin datos</div>;
  let a=-90;const cx=sz/2,cy=sz/2,r=sz*.43,ir=sz*.27;
  const xy=(deg,rad)=>({x:cx+rad*Math.cos(deg*Math.PI/180),y:cy+rad*Math.sin(deg*Math.PI/180)});
  const sl=data.map(d=>{
    const ang=(d.v/total)*360,s=xy(a,r),e=xy(a+ang,r),si=xy(a,ir),ei=xy(a+ang,ir),lg=ang>180?1:0;
    const path=`M${s.x},${s.y}A${r},${r} 0 ${lg} 1 ${e.x},${e.y}L${ei.x},${ei.y}A${ir},${ir} 0 ${lg} 0 ${si.x},${si.y}Z`;
    a+=ang;return{...d,path,pct:Math.round(d.v/total*100)};
  });
  return(
    <div style={{display:"flex",alignItems:"center",gap:16}}>
      <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} style={{flexShrink:0}}>
        {sl.map((s,i)=><path key={i} d={s.path} fill={s.c} stroke="#07080f" strokeWidth={2}/>)}
      </svg>
      <div style={{flex:1}}>
        {sl.filter(s=>s.pct>0).map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
            <div style={{width:7,height:7,borderRadius:2,background:s.c,flexShrink:0}}/>
            <span style={{fontSize:12,color:"var(--txt2)",flex:1}}>{s.l}</span>
            <span className="amt" style={{fontSize:12}}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RRow({r,onDel,onEdit}){
  const cat=CATS.find(c=>c.id===r.category)||CATS[7];
  const who=WHOS.find(w=>w.id===r.who);
  const ac=r.type==="ingreso"?"var(--inc)":(r.who==="personal"?"var(--personal)":cat.c);
  return(
    <div className="row">
      <div className="ico" style={{background:`${ac}18`}}>{cat.e}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:700,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.description}</div>
        <div style={{display:"flex",gap:5,alignItems:"center",marginTop:3}}>
          <span style={{fontSize:10,color:"var(--txt3)"}}>{$d(r.date)}</span>
          <span style={{fontSize:8,color:"var(--txt3)"}}>·</span>
          <span className="pill" style={{background:`${who?.c}15`,color:who?.c}}>{who?.e} {who?.label}</span>
        </div>
      </div>
      <div style={{textAlign:"right",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
        <div className="amt" style={{fontSize:14,color:r.type==="ingreso"?"var(--inc)":ac}}>
          {r.type==="ingreso"?"+":"−"}{$mxn(r.amount)}
        </div>
        <div style={{display:"flex",gap:4}}>
          <button onClick={()=>onEdit(r)} style={{background:"none",border:"1px solid var(--b1)",color:"var(--txt2)",fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:7,lineHeight:1.4,transition:"all .12s"}}
            onMouseOver={e=>{e.currentTarget.style.borderColor="var(--yo)";e.currentTarget.style.color="var(--yo)"}}
            onMouseOut={e=>{e.currentTarget.style.borderColor="var(--b1)";e.currentTarget.style.color="var(--txt2)"}}>✏️</button>
          <button className="del" onClick={()=>onDel(r.id)}>×</button>
        </div>
      </div>
    </div>
  );
}

/* ── Quick capture stepper ── */
const STEPS=["tipo","monto","quien","categoria","confirmar"];
function QuickForm({onSave,onClose}){
  const [step,setStep]=useState(0);
  const [f,setF]=useState({type:"gasto",amount:"",desc:"",paidBy:"mane",forWhom:"ambos",cat:"otros",date:today()});
  const sf=(k,v)=>setF(p=>({...p,[k]:v}));
  const amtRef=useRef(null);
  useEffect(()=>{if(step===1&&amtRef.current)amtRef.current.focus();},[step]);
  const cat=CATS.find(c=>c.id===f.cat);

  // Derive "who" field and balance impact from paidBy + forWhom
  function deriveWho(){
    if(f.forWhom==="personal") return "personal";
    if(f.forWhom==="ambos")    return "compartido";
    if(f.paidBy==="mane" && f.forWhom==="majo") return "yo";       // Mane pagó gasto de Majo
    if(f.paidBy==="majo" && f.forWhom==="mane") return "ella";     // Majo pagó gasto de Mane
    if(f.paidBy==="mane" && f.forWhom==="mane") return "personal"; // Mane pagó su propio gasto
    if(f.paidBy==="majo" && f.forWhom==="majo") return "personal"; // Majo pagó su propio gasto (no afecta Mane)
    return "compartido";
  }

  function balanceMsg(){
    if(f.type==="ingreso") return "💰 Ingreso registrado";
    if(f.forWhom==="personal") return "👤 Gasto personal · no afecta el balance de pareja";
    if(f.forWhom==="ambos" && f.paidBy==="mane") return `🤝 Gasto compartido · Mane pagó $${f.amount||0} · Majo te debe $${((+f.amount||0)/2).toFixed(0)}`;
    if(f.forWhom==="ambos" && f.paidBy==="majo") return `🤝 Gasto compartido · Majo pagó $${f.amount||0} · Tú le debes $${((+f.amount||0)/2).toFixed(0)}`;
    if(f.paidBy==="mane" && f.forWhom==="majo") return `🧑 Mane pagó gasto de Majo · Majo te debe $${f.amount||0}`;
    if(f.paidBy==="majo" && f.forWhom==="mane") return `👩 Majo pagó gasto de Mane · Tú le debes $${f.amount||0}`;
    if(f.paidBy==="mane" && f.forWhom==="mane") return "👤 Tu propio gasto · no afecta el balance";
    if(f.paidBy==="majo" && f.forWhom==="majo") return "👩 Gasto propio de Majo · no afecta el balance";
    return "";
  }

  function save(){
    if(!f.amount||+f.amount<=0||!f.desc.trim())return;
    const who=deriveWho();
    onSave({id:Date.now(),...f,who,amount:+f.amount,description:f.desc.trim(),category:f.cat});
    onClose();
  }

  const msg=balanceMsg();
  const msgColor=msg.startsWith("🤝")?"var(--joint)":msg.startsWith("🧑")?"var(--yo)":msg.startsWith("👩")?"var(--ella)":"var(--txt2)";

  return(
    <div className="sheet-overlay" style={{zIndex:200}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="rise sheet-inner">
        <div style={{width:34,height:3,borderRadius:2,background:"var(--b1)",margin:"0 auto 16px"}}/>
        <div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:20}}>
          {STEPS.map((_,i)=><div key={i} className={`step-dot${i<=step?" on":""}`}/>)}
        </div>

        {/* STEP 0 — Tipo */}
        {step===0&&(
          <div className="up">
            <div className="lbl" style={{textAlign:"center",marginBottom:14}}>¿Qué es?</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[{id:"gasto",e:"💸",l:"Gasto"},{id:"ingreso",e:"💰",l:"Ingreso"}].map(t=>(
                <button key={t.id} onClick={()=>{sf("type",t.id);setStep(1);}} style={{padding:"22px 8px",borderRadius:16,border:`2px solid ${f.type===t.id?"var(--yo)":"var(--b1)"}`,background:f.type===t.id?"#4f8aff14":"var(--s2)",color:f.type===t.id?"var(--yo)":"var(--txt2)",fontSize:13,fontWeight:700}}>
                  <div style={{fontSize:28,marginBottom:6}}>{t.e}</div>{t.l}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 — Monto */}
        {step===1&&(
          <div className="up">
            <div className="lbl" style={{textAlign:"center",marginBottom:10}}>¿Cuánto y en qué?</div>
            <div style={{position:"relative",marginBottom:10}}>
              <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontFamily:"var(--head)",fontSize:22,fontWeight:800,color:"var(--txt3)"}}>$</span>
              <input ref={amtRef} type="number" value={f.amount} onChange={e=>sf("amount",e.target.value)} placeholder="0" inputMode="numeric"
                style={{width:"100%",background:"#f7f8fc",border:`1.5px solid ${f.amount?"var(--yo)":"var(--b1)"}`,borderRadius:14,padding:"16px 14px 16px 36px",color:"var(--txt)",fontSize:28,fontFamily:"var(--head)",fontWeight:800,letterSpacing:-1}}/>
            </div>
            <input value={f.desc} onChange={e=>sf("desc",e.target.value)} placeholder="¿En qué? (ej: Cena, Uber…)"
              style={{width:"100%",background:"#f7f8fc",border:`1.5px solid ${f.desc?"var(--yo)":"var(--b1)"}`,borderRadius:14,padding:"13px 14px",color:"var(--txt)",fontSize:14,marginBottom:10}}/>
            <input type="date" value={f.date} onChange={e=>sf("date",e.target.value)}
              style={{width:"100%",background:"#f7f8fc",border:"1.5px solid var(--b1)",borderRadius:14,padding:"11px 14px",color:"var(--txt)",fontSize:13,marginBottom:14,colorScheme:"dark"}}/>
            <button onClick={()=>{if(f.amount&&f.desc.trim())setStep(2);}} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:f.amount&&f.desc.trim()?"linear-gradient(135deg,var(--yo),#9b6fff)":"var(--b1)",color:f.amount&&f.desc.trim()?"#fff":"var(--txt3)",fontSize:14,fontWeight:700}}>Siguiente →</button>
          </div>
        )}

        {/* STEP 2 — ¿Quién pagó? + ¿Para quién era? */}
        {step===2&&(
          <div className="up">
            {/* ¿Quién pagó físicamente? */}
            <div className="lbl" style={{textAlign:"center",marginBottom:10}}>¿Quién pagó?</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
              {[{id:"mane",e:"🧑",l:"Mane"},{id:"majo",e:"👩",l:"Majo"}].map(p=>(
                <button key={p.id} onClick={()=>sf("paidBy",p.id)} style={{padding:"14px 8px",borderRadius:14,border:`2px solid ${f.paidBy===p.id?"var(--yo)":"var(--b1)"}`,background:f.paidBy===p.id?"#4f8aff18":"var(--s2)",color:f.paidBy===p.id?"var(--yo)":"var(--txt2)",fontSize:14,fontWeight:700}}>
                  <div style={{fontSize:24,marginBottom:4}}>{p.e}</div>{p.l}
                </button>
              ))}
            </div>

            {/* ¿Para quién era el gasto? */}
            <div className="lbl" style={{textAlign:"center",marginBottom:10}}>¿De quién era el gasto?</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              {[
                {id:"ambos",   e:"🤝", l:"De los dos",  hint:"50% cada quien"},
                {id:"mane",    e:"🧑", l:"De Mane",     hint:"Gasto de Mane"},
                {id:"majo",    e:"👩", l:"De Majo",     hint:"Gasto de Majo"},
                {id:"personal",e:"👤", l:"Personal mío",hint:"No afecta balance"},
              ].map(fw=>(
                <button key={fw.id} onClick={()=>sf("forWhom",fw.id)} style={{padding:"12px 6px",borderRadius:14,border:`2px solid ${f.forWhom===fw.id?"var(--joint)":"var(--b1)"}`,background:f.forWhom===fw.id?"#00d68f18":"var(--s2)",color:f.forWhom===fw.id?"var(--joint)":"var(--txt2)",fontSize:11,fontWeight:700,textAlign:"center"}}>
                  <div style={{fontSize:20,marginBottom:3}}>{fw.e}</div>
                  <div>{fw.l}</div>
                  <div style={{fontSize:9,opacity:.6,marginTop:2}}>{fw.hint}</div>
                </button>
              ))}
            </div>

            {/* Balance preview */}
            {msg&&(
              <div style={{background:"var(--b1)",borderRadius:10,padding:"10px 12px",fontSize:12,color:msgColor,fontWeight:600,marginBottom:12,lineHeight:1.4}}>
                {msg}
              </div>
            )}

            <button onClick={()=>setStep(3)} style={{width:"100%",padding:13,borderRadius:14,border:"none",background:"linear-gradient(135deg,var(--yo),#9b6fff)",color:"#fff",fontSize:14,fontWeight:700}}>Siguiente →</button>
          </div>
        )}

        {/* STEP 3 — Categoría */}
        {step===3&&(
          <div className="up">
            <div className="lbl" style={{textAlign:"center",marginBottom:12}}>Categoría</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {CATS.map(c=>(
                <button key={c.id} onClick={()=>{sf("cat",c.id);setStep(4);}} style={{padding:"12px 4px",borderRadius:12,border:`2px solid ${f.cat===c.id?c.c:"var(--b1)"}`,background:f.cat===c.id?`${c.c}18`:"var(--s2)",color:f.cat===c.id?c.c:"var(--txt2)",fontSize:11,fontWeight:700,textAlign:"center"}}>
                  <div style={{fontSize:20,marginBottom:4}}>{c.e}</div>{c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 — Confirmar */}
        {step===4&&(
          <div className="up">
            <div className="lbl" style={{textAlign:"center",marginBottom:16}}>Confirmar</div>
            <div style={{background:"#f7f8fc",border:"1px solid var(--b1)",borderRadius:16,padding:16,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{color:"var(--txt2)",fontSize:13}}>{f.type==="gasto"?"💸 Gasto":"💰 Ingreso"}</span>
                <span className="amt" style={{fontSize:24,color:"var(--txt)"}}>{$mxn(+f.amount)}</span>
              </div>
              <div style={{fontSize:15,fontWeight:700,marginBottom:10}}>{f.desc}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                <span className="pill" style={{background:`${cat?.c}18`,color:cat?.c}}>{cat?.e} {cat?.label}</span>
                <span className="pill" style={{background:"var(--b1)",color:"var(--txt2)"}}>{$d(f.date)}</span>
              </div>
              {/* Balance impact summary */}
              <div style={{background:"var(--b1)",borderRadius:10,padding:"10px 12px",fontSize:12,color:msgColor,fontWeight:600,lineHeight:1.4}}>
                {msg}
              </div>
            </div>
            <button onClick={save} style={{width:"100%",padding:15,borderRadius:14,border:"none",background:"linear-gradient(135deg,var(--yo),#9b6fff)",color:"#fff",fontSize:15,fontWeight:800,marginBottom:8}}>✓ Guardar</button>
            <button onClick={()=>setStep(0)} style={{width:"100%",padding:11,borderRadius:14,border:"1px solid var(--b1)",background:"none",color:"var(--txt2)",fontSize:13,fontWeight:600}}>Editar</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Edit Form ── */
function EditForm({r,onSave,onClose}){
  const [f,setF]=useState({type:r.type,amount:String(r.amount),description:r.description,who:r.who,category:r.category,date:r.date});
  const sf=(k,v)=>setF(p=>({...p,[k]:v}));
  const who=WHOS.find(w=>w.id===f.who),cat=CATS.find(c=>c.id===f.category);
  function save(){
    if(!f.amount||+f.amount<=0||!f.description.trim())return;
    onSave({...r,...f,amount:+f.amount,description:f.description.trim()});onClose();
  }
  return(
    <div className="sheet-overlay" style={{zIndex:200}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="rise sheet-inner">
        <div style={{width:34,height:3,borderRadius:2,background:"var(--b1)",margin:"0 auto 16px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{fontFamily:"var(--head)",fontSize:18,fontWeight:800}}>✏️ Editar movimiento</div>
          <span className="pill" style={{background:"#4f8aff18",color:"var(--yo)"}}>{$d(r.date)}</span>
        </div>
        <div className="lbl">Tipo</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
          {[{id:"gasto",e:"💸",l:"Gasto"},{id:"ingreso",e:"💰",l:"Ingreso"}].map(t=>(
            <button key={t.id} onClick={()=>sf("type",t.id)} style={{padding:"11px 8px",borderRadius:12,border:`1.5px solid ${f.type===t.id?"var(--yo)":"var(--b1)"}`,background:f.type===t.id?"#4f8aff14":"var(--s2)",color:f.type===t.id?"var(--yo)":"var(--txt2)",fontSize:13,fontWeight:700}}>{t.e} {t.l}</button>
          ))}
        </div>
        <div className="lbl">Monto</div>
        <div style={{position:"relative",marginBottom:12}}>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontFamily:"var(--head)",fontSize:20,fontWeight:800,color:"var(--txt3)"}}>$</span>
          <input type="number" value={f.amount} onChange={e=>sf("amount",e.target.value)} inputMode="numeric"
            style={{width:"100%",background:"#f7f8fc",border:`1.5px solid ${f.amount?"var(--yo)":"var(--b1)"}`,borderRadius:14,padding:"13px 14px 13px 34px",color:"var(--txt)",fontSize:22,fontFamily:"var(--head)",fontWeight:800,letterSpacing:-1}}/>
        </div>
        <div className="lbl">Descripción</div>
        <input value={f.description} onChange={e=>sf("description",e.target.value)}
          style={{width:"100%",background:"#f7f8fc",border:`1.5px solid ${f.description?"var(--yo)":"var(--b1)"}`,borderRadius:14,padding:"12px 14px",color:"var(--txt)",fontSize:14,marginBottom:14}}/>
        <div className="lbl">Fecha</div>
        <input type="date" value={f.date} onChange={e=>sf("date",e.target.value)}
          style={{width:"100%",background:"#f7f8fc",border:"1.5px solid var(--b1)",borderRadius:14,padding:"11px 14px",color:"var(--txt)",fontSize:13,marginBottom:14,colorScheme:"dark"}}/>
        <div className="lbl">¿Quién pagó?</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          {WHOS.map(w=>(
            <button key={w.id} onClick={()=>sf("who",w.id)} style={{padding:"10px 8px",borderRadius:12,border:`1.5px solid ${f.who===w.id?w.c:"var(--b1)"}`,background:f.who===w.id?`${w.c}18`:"var(--s2)",color:f.who===w.id?w.c:"var(--txt2)",fontSize:12,fontWeight:700}}>{w.e} {w.label}</button>
          ))}
        </div>
        <div className="lbl" style={{marginTop:12}}>Categoría</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:18}}>
          {CATS.map(c=>(
            <button key={c.id} onClick={()=>sf("category",c.id)} style={{padding:"11px 4px",borderRadius:11,border:`1.5px solid ${f.category===c.id?c.c:"var(--b1)"}`,background:f.category===c.id?`${c.c}18`:"var(--s2)",color:f.category===c.id?c.c:"var(--txt2)",fontSize:11,fontWeight:700,textAlign:"center"}}>
              <div style={{fontSize:18,marginBottom:3}}>{c.e}</div>{c.label}
            </button>
          ))}
        </div>
        <div style={{background:"#f7f8fc",border:"1px solid var(--b1)",borderRadius:14,padding:"12px 14px",marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,color:"var(--txt3)",marginBottom:8}}>VISTA PREVIA</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:700,fontSize:14}}>{f.description||"—"}</div>
              <div style={{display:"flex",gap:5,marginTop:4,flexWrap:"wrap"}}>
                <span className="pill" style={{background:`${who?.c}18`,color:who?.c}}>{who?.e} {who?.label}</span>
                <span className="pill" style={{background:`${cat?.c}18`,color:cat?.c}}>{cat?.e} {cat?.label}</span>
              </div>
            </div>
            <div className="amt" style={{fontSize:18,color:f.type==="ingreso"?"var(--inc)":who?.c}}>
              {f.type==="ingreso"?"+":"−"}{$mxn(+f.amount||0)}
            </div>
          </div>
        </div>
        <button onClick={save} style={{width:"100%",padding:15,borderRadius:14,border:"none",background:"linear-gradient(135deg,var(--yo),#9b6fff)",color:"#fff",fontSize:15,fontWeight:800}}>Guardar cambios</button>
      </div>
    </div>
  );
}

/* ── Loan Form ── */
function LoanForm({onSave,onClose,existingNames}){
  const [name,setName]=useState(""),[ amount,setAmount]=useState(""),[ note,setNote]=useState(""),[ date,setDate]=useState(today()),[showSug,setShowSug]=useState(false);
  const suggestions=existingNames.filter(n=>n.toLowerCase().includes(name.toLowerCase())&&name.length>0);
  function save(){
    if(!name.trim()||!amount||+amount<=0)return;
    onSave({id:Date.now(),name:name.trim(),amount:+amount,note:note.trim(),date,paid:false,abonos:[]});onClose();
  }
  return(
    <div className="sheet-overlay" style={{zIndex:200}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="rise sheet-inner">
        <div style={{width:34,height:3,borderRadius:2,background:"var(--b2)",margin:"0 auto 18px"}}/>
        <div style={{fontFamily:"var(--head)",fontSize:18,fontWeight:800,marginBottom:18}}>💸 Nuevo préstamo</div>
        <div style={{marginBottom:10,position:"relative"}}>
          <div className="lbl">¿A quién le prestas?</div>
          <input value={name} onChange={e=>{setName(e.target.value);setShowSug(true);}} onFocus={()=>setShowSug(true)}
            placeholder="Nombre de la persona"
            style={{width:"100%",background:"#f7f8fc",border:`1.5px solid ${name?"var(--yo)":"var(--b1)"}`,borderRadius:14,padding:"13px 14px",color:"var(--txt)",fontSize:14}}/>
          {showSug&&suggestions.length>0&&(
            <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#f7f8fc",border:"1px solid var(--b1)",borderRadius:12,zIndex:10,overflow:"hidden",marginTop:4}}>
              {suggestions.map(s=>(
                <button key={s} onClick={()=>{setName(s);setShowSug(false);}} style={{width:"100%",padding:"11px 14px",background:"none",border:"none",borderBottom:"1px solid var(--b1)",color:"var(--txt)",fontSize:13,fontWeight:600,textAlign:"left"}}
                  onMouseOver={e=>e.target.style.background="var(--b1)"} onMouseOut={e=>e.target.style.background="none"}>👤 {s}</button>
              ))}
            </div>
          )}
        </div>
        <div style={{marginBottom:10}}>
          <div className="lbl">¿Cuánto?</div>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontFamily:"var(--head)",fontSize:20,fontWeight:800,color:"var(--txt3)"}}>$</span>
            <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0" inputMode="numeric"
              style={{width:"100%",background:"#f7f8fc",border:`1.5px solid ${amount?"var(--yo)":"var(--b1)"}`,borderRadius:14,padding:"14px 14px 14px 34px",color:"var(--txt)",fontSize:24,fontFamily:"var(--head)",fontWeight:800,letterSpacing:-1}}/>
          </div>
        </div>
        <div style={{marginBottom:10}}>
          <div className="lbl">Nota (opcional)</div>
          <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Ej: para la renta, emergencia…"
            style={{width:"100%",background:"#f7f8fc",border:"1.5px solid var(--b1)",borderRadius:14,padding:"12px 14px",color:"var(--txt)",fontSize:13}}/>
        </div>
        <div style={{marginBottom:18}}>
          <div className="lbl">Fecha</div>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            style={{width:"100%",background:"#f7f8fc",border:"1.5px solid var(--b1)",borderRadius:14,padding:"11px 14px",color:"var(--txt)",fontSize:13,colorScheme:"dark"}}/>
        </div>
        <button onClick={save} style={{width:"100%",padding:15,borderRadius:14,border:"none",background:name.trim()&&amount&&+amount>0?"linear-gradient(135deg,var(--personal),#ff8c00)":"var(--b1)",color:name.trim()&&amount&&+amount>0?"#000":"var(--txt3)",fontSize:15,fontWeight:800}}>Registrar préstamo</button>
      </div>
    </div>
  );
}

/* ── Abono Form (partial payment) ── */
function AbonoForm({deuda,pendiente,onSave,onClose}){
  const [amount,setAmount]=useState("");
  const [note,setNote]=useState("");
  const [date,setDate]=useState(today());
  function save(){
    if(!amount||+amount<=0)return;
    onSave({id:Date.now(),deudaId:deuda,amount:+amount,note:note.trim(),date});onClose();
  }
  return(
    <div className="sheet-overlay" style={{zIndex:210}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="rise sheet-inner">
        <div style={{width:34,height:3,borderRadius:2,background:"var(--b2)",margin:"0 auto 18px"}}/>
        <div style={{fontFamily:"var(--head)",fontSize:18,fontWeight:800,marginBottom:6}}>💵 Registrar abono</div>
        <div style={{fontSize:12,color:"var(--txt2)",marginBottom:18}}>Pendiente: <span style={{color:"var(--personal)",fontWeight:700}}>{$mxn(pendiente)}</span></div>
        <div style={{position:"relative",marginBottom:12}}>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontFamily:"var(--head)",fontSize:20,fontWeight:800,color:"var(--txt3)"}}>$</span>
          <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0" inputMode="numeric"
            style={{width:"100%",background:"#f7f8fc",border:`1.5px solid ${amount?"var(--joint)":"var(--b1)"}`,borderRadius:14,padding:"14px 14px 14px 34px",color:"var(--txt)",fontSize:24,fontFamily:"var(--head)",fontWeight:800,letterSpacing:-1}}/>
        </div>
        {+amount>0&&+amount<pendiente&&(
          <div style={{background:"#ffb83010",border:"1px solid #ffb83030",borderRadius:10,padding:"8px 12px",fontSize:12,color:"var(--personal)",marginBottom:10}}>
            Quedaría pendiente: <strong>{$mxn(pendiente - +amount)}</strong>
          </div>
        )}
        {+amount>=pendiente&&+amount>0&&(
          <div style={{background:"#00d68f10",border:"1px solid #00d68f30",borderRadius:10,padding:"8px 12px",fontSize:12,color:"var(--joint)",marginBottom:10}}>
            ✓ Esto liquida la deuda completa
          </div>
        )}
        <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Nota (opcional)"
          style={{width:"100%",background:"#f7f8fc",border:"1.5px solid var(--b1)",borderRadius:14,padding:"12px 14px",color:"var(--txt)",fontSize:13,marginBottom:10}}/>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)}
          style={{width:"100%",background:"#f7f8fc",border:"1.5px solid var(--b1)",borderRadius:14,padding:"11px 14px",color:"var(--txt)",fontSize:13,marginBottom:18,colorScheme:"dark"}}/>
        <button onClick={save} style={{width:"100%",padding:15,borderRadius:14,border:"none",background:amount&&+amount>0?"linear-gradient(135deg,var(--joint),#00b37a)":"var(--b1)",color:amount&&+amount>0?"#000":"var(--txt3)",fontSize:15,fontWeight:800}}>Confirmar abono</button>
      </div>
    </div>
  );
}

/* ── Pago Pareja Form ── */
function PagoPareja({diff,onSave,onClose}){
  const [amount,setAmount]=useState(String(Math.abs(diff)));
  const [note,setNote]=useState("");
  const [date,setDate]=useState(today());
  const quienPaga=diff>0?"Majo":"Mane";
  const quienRecibe=diff>0?"Mane":"Majo";
  function save(){
    if(!amount||+amount<=0)return;
    onSave({id:Date.now(),amount:+amount,note:note.trim(),date,de:quienPaga,para:quienRecibe});onClose();
  }
  return(
    <div className="sheet-overlay" style={{zIndex:200}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="rise sheet-inner">
        <div style={{width:34,height:3,borderRadius:2,background:"var(--b2)",margin:"0 auto 18px"}}/>
        <div style={{fontFamily:"var(--head)",fontSize:18,fontWeight:800,marginBottom:6}}>✅ Registrar pago</div>
        <div style={{background:"#f7f8fc",border:"1px solid var(--b1)",borderRadius:14,padding:"12px 14px",marginBottom:16,fontSize:13,color:"var(--txt2)"}}>
          <span style={{fontWeight:700,color:"var(--txt)"}}>{quienPaga}</span> le paga a <span style={{fontWeight:700,color:"var(--txt)"}}>{quienRecibe}</span>
        </div>
        <div style={{position:"relative",marginBottom:10}}>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontFamily:"var(--head)",fontSize:20,fontWeight:800,color:"var(--txt3)"}}>$</span>
          <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} inputMode="numeric"
            style={{width:"100%",background:"#f7f8fc",border:`1.5px solid ${amount?"var(--joint)":"var(--b1)"}`,borderRadius:14,padding:"14px 14px 14px 34px",color:"var(--txt)",fontSize:24,fontFamily:"var(--head)",fontWeight:800,letterSpacing:-1}}/>
        </div>
        {+amount>0&&+amount<Math.abs(diff)&&(
          <div style={{background:"#ffb83010",border:"1px solid #ffb83030",borderRadius:10,padding:"8px 12px",fontSize:12,color:"var(--personal)",marginBottom:10}}>
            Abono parcial · queda pendiente: <strong>{$mxn(Math.abs(diff) - +amount)}</strong>
          </div>
        )}
        <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Nota (opcional)"
          style={{width:"100%",background:"#f7f8fc",border:"1.5px solid var(--b1)",borderRadius:14,padding:"12px 14px",color:"var(--txt)",fontSize:13,marginBottom:10}}/>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)}
          style={{width:"100%",background:"#f7f8fc",border:"1.5px solid var(--b1)",borderRadius:14,padding:"11px 14px",color:"var(--txt)",fontSize:13,marginBottom:18,colorScheme:"dark"}}/>
        <button onClick={save} style={{width:"100%",padding:15,borderRadius:14,border:"none",background:amount&&+amount>0?"linear-gradient(135deg,var(--joint),#00b37a)":"var(--b1)",color:amount&&+amount>0?"#000":"var(--txt3)",fontSize:15,fontWeight:800}}>✓ Registrar pago</button>
      </div>
    </div>
  );
}

/* ══ MAIN APP ══ */
export default function App(){
  const [recs,setRecs]=useState(load);
  const [loans,setLoans]=useState(loadLoans);
  const [pagos,setPagos]=useState(loadPagos);
  const [tab,setTab]=useState("home");
  const [form,setForm]=useState(false);
  const [loanForm,setLoanForm]=useState(false);
  const [editRecord,setEditRecord]=useState(null);
  const [abonoTarget,setAbonoTarget]=useState(null);
  const [pagoForm,setPagoForm]=useState(false);
  const [selMonth,setSelMonth]=useState("all");

  // Sync state
  const [syncStatus,setSyncStatus]=useState("idle"); // idle | loading | ok | error
  const [syncMsg,setSyncMsg]=useState("");
  const syncTimer=useRef(null);

  function showSync(status, msg, autohide=true){
    setSyncStatus(status); setSyncMsg(msg);
    if(syncTimer.current) clearTimeout(syncTimer.current);
    if(autohide && status!=="loading"){
      syncTimer.current=setTimeout(()=>setSyncStatus("idle"),3000);
    }
  }

  // ── Load all data from Sheets on mount ──
  useEffect(()=>{
    async function loadAll(){
      showSync("loading","Sincronizando con Google Sheets…",false);
      try{
        const [rawRecs, rawLoans, rawAbonos, rawPagos] = await Promise.all([
          gsFetch("movimientos"),
          gsFetch("prestamos"),
          gsFetch("abonos"),
          gsFetch("pagos_pareja"),
        ]);

        // Merge abonos into loans
        const loansWithAbonos = rawLoans.map(l=>({
          ...l,
          abonos: rawAbonos
            .filter(a=>String(a.deudaId)===String(l.id))
            .map(a=>({...a, amount:Number(a.amount)})),
        }));

        // Parse pagos amounts
        const parsedPagos = rawPagos.map(p=>({...p, amount:Number(p.amount)}));

        setRecs(rawRecs.length>0 ? rawRecs : load());
        setLoans(loansWithAbonos.length>0 ? loansWithAbonos : loadLoans());
        setPagos(parsedPagos.length>0 ? parsedPagos : loadPagos());

        // Update local cache
        persist(rawRecs); persistLoans(loansWithAbonos); persistPagos(parsedPagos);
        showSync("ok","✓ Sincronizado");
      } catch(e){
        showSync("error","Sin conexión — mostrando datos locales");
      }
    }
    loadAll();
  },[]);

  // Keep local cache in sync
  useEffect(()=>persist(recs),[recs]);
  useEffect(()=>persistLoans(loans),[loans]);
  useEffect(()=>persistPagos(pagos),[pagos]);

  // ── CRUD with Sheets sync ──
  async function add(r){
    setRecs(p=>[r,...p]);
    try{ await gsInsert("movimientos",r); }
    catch{ showSync("error","Error al guardar en Sheets"); }
  }
  async function del(id){
    setRecs(p=>p.filter(x=>x.id!==id));
    try{ await gsDelete("movimientos",id); }
    catch{ showSync("error","Error al borrar en Sheets"); }
  }
  async function updateRecord(r){
    setRecs(p=>p.map(x=>x.id===r.id?r:x));
    try{ await gsUpdate("movimientos",r); }
    catch{ showSync("error","Error al actualizar en Sheets"); }
  }
  async function addLoan(l){
    setLoans(p=>[l,...p]);
    try{ await gsInsert("prestamos",{...l,abonos:undefined}); }
    catch{ showSync("error","Error al guardar préstamo"); }
  }
  async function paidLoan(id){
    const pd=today();
    setLoans(p=>p.map(l=>l.id===id?{...l,paid:true,paidDate:pd}:l));
    try{ await gsUpdate("prestamos",{id,paid:true,paidDate:pd}); }
    catch{ showSync("error","Error al actualizar préstamo"); }
  }
  async function delLoan(id){
    setLoans(p=>p.filter(l=>l.id!==id));
    try{ await gsDelete("prestamos",id); }
    catch{ showSync("error","Error al borrar préstamo"); }
  }
  async function addAbono(a){
    setLoans(p=>p.map(l=>{
      if(l.id!==a.deudaId)return l;
      const abonos=[...(l.abonos||[]),a];
      const totalAbonado=abonos.reduce((s,x)=>s+x.amount,0);
      const paid=totalAbonado>=l.amount;
      return{...l,abonos,paid,paidDate:paid?today():undefined};
    }));
    try{
      await gsInsert("abonos",a);
      const loan=loans.find(l=>l.id===a.deudaId);
      if(loan){
        const abonos=[...(loan.abonos||[]),a];
        const totalAbonado=abonos.reduce((s,x)=>s+x.amount,0);
        if(totalAbonado>=loan.amount)
          await gsUpdate("prestamos",{id:loan.id,paid:true,paidDate:today()});
      }
    } catch{ showSync("error","Error al guardar abono"); }
  }
  async function addPago(p){
    setPagos(prev=>[p,...prev]);
    try{ await gsInsert("pagos_pareja",p); }
    catch{ showSync("error","Error al guardar pago"); }
  }

  // Manual refresh button
  async function refresh(){
    showSync("loading","Actualizando…",false);
    try{
      const [rawRecs,rawLoans,rawAbonos,rawPagos]=await Promise.all([
        gsFetch("movimientos"),gsFetch("prestamos"),gsFetch("abonos"),gsFetch("pagos_pareja"),
      ]);
      const loansWithAbonos=rawLoans.map(l=>({
        ...l,abonos:rawAbonos.filter(a=>String(a.deudaId)===String(l.id)).map(a=>({...a,amount:Number(a.amount)})),
      }));
      setRecs(rawRecs); setLoans(loansWithAbonos); setPagos(rawPagos.map(p=>({...p,amount:Number(p.amount)})));
      persist(rawRecs); persistLoans(loansWithAbonos);
      showSync("ok","✓ Actualizado");
    } catch{ showSync("error","Error de conexión"); }
  }

  const loanNames=[...new Set(loans.map(l=>l.name))];

  /* ── Stats ── */
  const S=useMemo(()=>{
    const pg=recs.filter(r=>r.type==="gasto"&&r.who!=="personal");
    const pi=recs.filter(r=>r.type==="ingreso"&&r.who!=="personal");
    const pp=recs.filter(r=>r.type==="gasto"&&r.who==="personal");
    const tg=pg.reduce((s,r)=>s+r.amount,0);
    const ti=pi.reduce((s,r)=>s+r.amount,0);
    const ptg=pp.reduce((s,r)=>s+r.amount,0);

    // ── Lógica correcta de balance ──
    // "yo" pagó gasto de Majo completo → Majo me debe el total
    // "ella" pagó gasto de Mane completo → yo le debo el total
    // "compartido" Mane pagó → Majo me debe la mitad
    // "compartido" Majo pagó → yo le debo la mitad
    //
    // Implementación: cada gasto tiene who=quien_pago y category+desc
    // pero necesitamos saber "para quién era" — usamos los campos who:
    //   who="yo"         → Mane pagó un gasto de MAJO   → Majo debe 100%
    //   who="ella"       → Majo pagó un gasto de MANE   → Mane debe 100%
    //   who="compartido" → gasto entre los dos, quien lo pagó puso el dinero
    //
    // Separamos compartidos por quien los pagó usando el campo "paidBy"
    // Como no tenemos ese campo, usamos la convención:
    //   who="yo"         = Mane pagó algo que es de/para Majo  → Majo debe todo
    //   who="ella"       = Majo pagó algo que es de/para Mane  → Mane debe todo
    //   who="compartido" = gasto 50/50, Mane pagó              → Majo debe mitad
    //
    // Para distinguir "compartido pagado por Majo" necesitamos el campo paidBy
    // que ya guardamos — si no existe, asumimos Mane pagó el compartido.

    let majoMeDebe = 0;  // Majo le debe a Mane
    let yoLeDebo   = 0;  // Mane le debe a Majo

    pg.forEach(r => {
      const paidBy = r.paidBy || "mane"; // quién físicamente pagó
      if (r.who === "yo") {
        // Mane pagó un gasto que era de Majo → Majo debe el total
        majoMeDebe += r.amount;
      } else if (r.who === "ella") {
        // Majo pagó un gasto que era de Mane → Mane debe el total
        yoLeDebo += r.amount;
      } else if (r.who === "compartido") {
        // Gasto 50/50 — quien pagó pone el dinero, el otro debe la mitad
        if (paidBy === "majo") {
          yoLeDebo += r.amount / 2;
        } else {
          // Mane pagó (default)
          majoMeDebe += r.amount / 2;
        }
      }
    });

    // Total pagado por cada uno (para mostrar en UI)
    const yp = pg.filter(r=>r.who==="yo"||r.who==="compartido").reduce((s,r)=>s+r.amount,0);
    const ep = pg.filter(r=>r.who==="ella").reduce((s,r)=>s+r.amount,0);
    const cp = pg.filter(r=>r.who==="compartido").reduce((s,r)=>s+r.amount,0);

    // Balance neto: positivo = Majo me debe, negativo = yo le debo
    const rawDiff = majoMeDebe - yoLeDebo;

    // Descontar pagos ya realizados
    const totalPagado = pagos.reduce((s,p)=>s+p.amount,0);
    const adjDiff = rawDiff > 0
      ? Math.max(0, rawDiff - totalPagado)
      : Math.min(0, rawDiff + totalPagado);

    const cats=CATS.map(c=>({...c,v:pg.filter(r=>r.category===c.id).reduce((s,r)=>s+r.amount,0)})).filter(c=>c.v>0).sort((a,b)=>b.v-a.v);
    const pcats=CATS.map(c=>({...c,v:pp.filter(r=>r.category===c.id).reduce((s,r)=>s+r.amount,0)})).filter(c=>c.v>0).sort((a,b)=>b.v-a.v);
    const allGastos=[...pg,...pp];
    const allCats=CATS.map(c=>({...c,v:allGastos.filter(r=>r.category===c.id).reduce((s,r)=>s+r.amount,0)})).filter(c=>c.v>0).sort((a,b)=>b.v-a.v);
    const allTotal=allGastos.reduce((s,r)=>s+r.amount,0);
    const mc=Math.max(...cats.map(c=>c.v),1),pmc=Math.max(...pcats.map(c=>c.v),1),amc=Math.max(...allCats.map(c=>c.v),1);
    const recent=recs.slice(0,5);
    // available months
    const monthSet=new Set(recs.map(r=>monthKey(r.date)));
    const months=[...monthSet].sort().reverse();
    return{tg,ti,yp,ep,cp,ptg,diff:rawDiff,adjDiff,cats,pcats,allCats,allTotal,mc,pmc,amc,recent,months};
  },[recs,pagos]);

  const bc=S.adjDiff>0?"var(--inc)":S.adjDiff<0?"var(--danger)":"var(--yo)";
  const bt=S.adjDiff>0?`Majo debe a Mane ${$mxn(Math.abs(S.adjDiff))}`:S.adjDiff<0?`Mane debe a Majo ${$mxn(Math.abs(S.adjDiff))}`:"¡A mano! 🎉";

  const pRecs=recs.filter(r=>r.who==="personal");
  const cRecs=recs.filter(r=>r.who!=="personal");

  /* Dashboard filtered stats */
  const dashStats=useMemo(()=>{
    const filtered=selMonth==="all"?recs:recs.filter(r=>monthKey(r.date)===selMonth);
    const gastos=filtered.filter(r=>r.type==="gasto");
    const allTotal=gastos.reduce((s,r)=>s+r.amount,0);
    const allCats=CATS.map(c=>({...c,v:gastos.filter(r=>r.category===c.id).reduce((s,r)=>s+r.amount,0)})).filter(c=>c.v>0).sort((a,b)=>b.v-a.v);
    const amc=Math.max(...allCats.map(c=>c.v),1);
    const pg=gastos.filter(r=>r.who!=="personal");
    const pp=gastos.filter(r=>r.who==="personal");
    const cats=CATS.map(c=>({...c,v:pg.filter(r=>r.category===c.id).reduce((s,r)=>s+r.amount,0)})).filter(c=>c.v>0).sort((a,b)=>b.v-a.v);
    const pcats=CATS.map(c=>({...c,v:pp.filter(r=>r.category===c.id).reduce((s,r)=>s+r.amount,0)})).filter(c=>c.v>0).sort((a,b)=>b.v-a.v);
    const tg=pg.reduce((s,r)=>s+r.amount,0),ptg=pp.reduce((s,r)=>s+r.amount,0);
    return{allTotal,allCats,amc,cats,pcats,tg,ptg,gastos};
  },[recs,selMonth]);

  const NAV_TABS=[
    {id:"home",   e:"⬡", label:"Inicio"},
    {id:"dashboard",e:"📊",label:"Análisis"},
    {id:"balance",e:"⚖",  label:"Balance"},
    {id:"historial",e:"☰",label:"Historial"},
    {id:"prestamos",e:"🤝",label:"Préstamos"},
  ];

  return(
    <>
      <G/>
      <div style={{minHeight:"100vh",background:"var(--bg)",maxWidth:430,margin:"0 auto",paddingBottom:90}}>

        {/* ── Sync status bar ── */}
        {syncStatus!=="idle"&&(
          <div className={`sync-bar ${syncStatus}`}>
            {syncStatus==="loading"&&<div className="spinner"/>}
            {syncStatus==="ok"&&<span>✓</span>}
            {syncStatus==="error"&&<span>⚠️</span>}
            <span>{syncMsg}</span>
          </div>
        )}

        {/* ══ HOME ══ */}
        {tab==="home"&&(
          <div style={{padding:`${syncStatus!=="idle"?"36px":"0"} 0 8px`}}>
            {/* Header */}
            <div style={{padding:"32px 18px 16px",background:"#fff",borderBottom:"1px solid var(--b1)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <div>
                  <div style={{fontSize:12,color:"var(--txt2)",marginBottom:2}}>Bienvenido 👋</div>
                  <div style={{fontFamily:"var(--head)",fontSize:20,fontWeight:800,color:"var(--txt)"}}>Mane & Majo</div>
                </div>
                <button onClick={refresh} style={{width:38,height:38,borderRadius:12,border:"1px solid var(--b1)",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🔄</button>
              </div>

              {/* Hero balance card */}
              <div className="hero-card" onClick={()=>setTab("balance")} style={{cursor:"pointer"}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:2,opacity:.75,marginBottom:8}}>BALANCE DE PAREJA</div>
                <div style={{fontFamily:"var(--head)",fontSize:32,fontWeight:800,marginBottom:4,letterSpacing:-1}}>
                  {$mxn(Math.abs(S.adjDiff))}
                </div>
                <div style={{fontSize:13,opacity:.85,marginBottom:16}}>
                  {S.adjDiff>0?"Majo debe a Mane":S.adjDiff<0?"Mane debe a Majo":"¡Están a mano! 🎉"}
                </div>
                <div style={{display:"flex",gap:12}}>
                  {[
                    {label:"Mane pagó",value:S.yp,color:"#a5c4ff"},
                    {label:"Majo pagó",value:S.ep,color:"#ffb3ce"},
                    {label:"Compartido",value:S.cp,color:"#a7f3d0"},
                  ].map(k=>(
                    <div key={k.label} style={{flex:1,background:"#ffffff18",borderRadius:10,padding:"8px 10px"}}>
                      <div style={{fontSize:9,fontWeight:700,letterSpacing:1,color:k.color,marginBottom:3}}>{k.label.toUpperCase()}</div>
                      <div style={{fontFamily:"var(--head)",fontSize:13,fontWeight:800,color:"#fff"}}>{$mxn(k.value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div style={{display:"flex",gap:8}}>
                {[
                  {icon:"💸",label:"Gasto",action:()=>setForm(true)},
                  {icon:"📊",label:"Análisis",action:()=>setTab("dashboard")},
                  {icon:"⚖️",label:"Balance",action:()=>setTab("balance")},
                  {icon:"🤝",label:"Préstamos",action:()=>setTab("prestamos")},
                ].map(q=>(
                  <button key={q.label} className="qa-btn" onClick={q.action}>
                    <div className="qa-icon">{q.icon}</div>
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{padding:"16px 14px 0"}}>
              {/* Personal summary */}
              <div className="card up" style={{marginBottom:12,borderLeft:`3px solid var(--personal)`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,color:"var(--personal)",marginBottom:3}}>👤 GASTOS PERSONALES</div>
                    <div className="amt" style={{fontSize:22,color:"var(--txt)"}}>{$mxn(S.ptg)}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:9,color:"var(--txt3)",letterSpacing:1,marginBottom:3}}>NETO PAREJA</div>
                    <div className="amt" style={{fontSize:15,color:S.ti-S.tg>=0?"var(--inc)":"var(--danger)"}}>{$mxn(S.ti-S.tg)}</div>
                  </div>
                </div>
                {S.pcats.length>0&&<div style={{marginTop:10}}><Bar label={S.pcats[0].label} value={S.pcats[0].v} max={S.pmc} color={S.pcats[0].c}/></div>}
              </div>

              {/* Recent transactions */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontFamily:"var(--head)",fontSize:15,fontWeight:800,color:"var(--txt)"}}>Movimientos recientes</div>
                {recs.length>5&&<button onClick={()=>setTab("historial")} style={{fontSize:11,color:"var(--yo)",background:"none",border:"none",fontWeight:700}}>Ver todos →</button>}
              </div>
              {S.recent.length===0
                ?<div className="card card-ghost" style={{textAlign:"center",padding:28}}>
                   <div style={{fontSize:32,marginBottom:8}}>✦</div>
                   <div style={{fontSize:13,color:"var(--txt2)"}}>Sin movimientos aún</div>
                   <div style={{fontSize:11,color:"var(--txt3)",marginTop:4}}>Toca + para agregar tu primer gasto</div>
                 </div>
                :S.recent.map(r=><RRow key={r.id} r={r} onDel={del} onEdit={setEditRecord}/>)
              }
            </div>
          </div>
        )}

        {/* ══ DASHBOARD ══ */}
        {tab==="dashboard"&&(
          <div style={{padding:"28px 14px 0"}}>
            <div style={{fontFamily:"var(--head)",fontSize:22,fontWeight:800,marginBottom:2}}>Análisis 📊</div>
            <div style={{fontSize:12,color:"var(--txt2)",marginBottom:14}}>¿En qué se va tu dinero?</div>

            {/* Month selector */}
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:10,marginBottom:6}}>
              {["all",...S.months].map(m=>(
                <button key={m} onClick={()=>setSelMonth(m)} style={{
                  flexShrink:0,padding:"6px 14px",borderRadius:20,border:`1.5px solid ${selMonth===m?"var(--yo)":"var(--b1)"}`,
                  background:selMonth===m?"#3b6ff518":"var(--bg)",color:selMonth===m?"var(--yo)":"var(--txt2)",
                  fontSize:12,fontWeight:700,whiteSpace:"nowrap",
                }}>{m==="all"?"Todo el tiempo":monthLabel(m)}</button>
              ))}
            </div>

            {/* KPIs */}
            <div className="card up" style={{marginBottom:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:0}}>
                {[
                  {label:"Total gastado",value:dashStats.allTotal,color:"var(--danger)",icon:"💸"},
                  {label:"De pareja",value:dashStats.tg,color:"var(--yo)",icon:"💑"},
                  {label:"Personal",value:dashStats.ptg,color:"var(--personal)",icon:"👤"},
                ].map((k,i)=>(
                  <div key={k.label} style={{padding:"10px 8px",borderRight:i<2?"1px solid var(--b1)":"none",textAlign:"center"}}>
                    <div style={{fontSize:15,marginBottom:4}}>{k.icon}</div>
                    <div style={{fontSize:9,fontWeight:700,letterSpacing:1,color:"var(--txt3)",marginBottom:3}}>{k.label.toUpperCase()}</div>
                    <div className="amt" style={{fontSize:15,color:k.color}}>{$mxn(k.value)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* All categories */}
            {dashStats.allCats.length===0
              ?<div className="card card-ghost" style={{textAlign:"center",padding:32,marginBottom:12}}>
                 <div style={{fontSize:36,marginBottom:8}}>📭</div>
                 <div style={{fontSize:13,color:"var(--txt2)"}}>Sin gastos {selMonth!=="all"?`en ${monthLabel(selMonth)}`:"registrados"}</div>
               </div>
              :<div className="card up" style={{marginBottom:12}}>
                 <div className="lbl" style={{marginBottom:14}}>Todas las categorías</div>
                 {dashStats.allCats.map((c,i)=>{
                   const pct=Math.max(4,(c.v/dashStats.allTotal)*100);
                   const share=Math.round((c.v/dashStats.allTotal)*100);
                   return(
                     <div key={c.id} className="up" style={{marginBottom:12,animationDelay:`${i*40}ms`}}>
                       <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                         <div style={{display:"flex",alignItems:"center",gap:8}}>
                           <div style={{width:30,height:30,borderRadius:9,background:`${c.c}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{c.e}</div>
                           <div>
                             <div style={{fontWeight:700,fontSize:13}}>{c.label}</div>
                             <div style={{fontSize:10,color:"var(--txt3)"}}>{share}% del total</div>
                           </div>
                         </div>
                         <div className="amt" style={{fontSize:16,color:c.c}}>{$mxn(c.v)}</div>
                       </div>
                       <div style={{background:"var(--b1)",borderRadius:6,height:8,overflow:"hidden"}}>
                         <div style={{width:`${pct}%`,height:"100%",borderRadius:6,background:c.c,transition:"width .7s cubic-bezier(.22,.68,0,1.2)"}}/>
                       </div>
                     </div>
                   );
                 })}
               </div>
            }

            {/* Pareja vs Personal */}
            {(dashStats.cats.length>0||dashStats.pcats.length>0)&&(
              <div className="card up" style={{marginBottom:12,animationDelay:"100ms"}}>
                <div className="lbl" style={{marginBottom:14}}>Pareja 💑 vs Personal 👤</div>
                {CATS.map(c=>{
                  const vp=dashStats.cats.find(x=>x.id===c.id)?.v||0;
                  const vpe=dashStats.pcats.find(x=>x.id===c.id)?.v||0;
                  if(!vp&&!vpe)return null;
                  const maxV=Math.max(vp,vpe,1);
                  return(
                    <div key={c.id} style={{marginBottom:14}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><span style={{fontSize:14}}>{c.e}</span><span style={{fontWeight:700,fontSize:12}}>{c.label}</span></div>
                      {vp>0&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontSize:10,color:"var(--yo)",width:52,textAlign:"right",flexShrink:0}}>💑 Pareja</span>
                        <div style={{flex:1,background:"var(--b1)",borderRadius:4,height:6,overflow:"hidden"}}><div style={{width:`${Math.max(3,(vp/maxV)*100)}%`,height:"100%",background:"var(--yo)",borderRadius:4,transition:"width .6s"}}/></div>
                        <span className="amt" style={{fontSize:11,color:"var(--yo)",width:58,flexShrink:0}}>{$mxn(vp)}</span>
                      </div>}
                      {vpe>0&&<div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:10,color:"var(--personal)",width:52,textAlign:"right",flexShrink:0}}>👤 Personal</span>
                        <div style={{flex:1,background:"var(--b1)",borderRadius:4,height:6,overflow:"hidden"}}><div style={{width:`${Math.max(3,(vpe/maxV)*100)}%`,height:"100%",background:"var(--personal)",borderRadius:4,transition:"width .6s"}}/></div>
                        <span className="amt" style={{fontSize:11,color:"var(--personal)",width:58,flexShrink:0}}>{$mxn(vpe)}</span>
                      </div>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Mane vs Majo */}
            {(S.yp>0||S.ep>0)&&(
              <div className="card up" style={{marginBottom:12,animationDelay:"140ms"}}>
                <div className="lbl" style={{marginBottom:14}}>Mane 🧑 vs Majo 👩</div>
                {CATS.map(c=>{
                  const filtered=selMonth==="all"?recs:recs.filter(r=>monthKey(r.date)===selMonth);
                  const vm=filtered.filter(r=>r.who==="yo"&&r.type==="gasto"&&r.category===c.id).reduce((s,r)=>s+r.amount,0);
                  const vj=filtered.filter(r=>r.who==="ella"&&r.type==="gasto"&&r.category===c.id).reduce((s,r)=>s+r.amount,0);
                  if(!vm&&!vj)return null;
                  const maxV=Math.max(vm,vj,1);
                  return(
                    <div key={c.id} style={{marginBottom:14}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><span style={{fontSize:14}}>{c.e}</span><span style={{fontWeight:700,fontSize:12}}>{c.label}</span></div>
                      {vm>0&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontSize:10,color:"var(--yo)",width:44,textAlign:"right",flexShrink:0}}>🧑 Mane</span>
                        <div style={{flex:1,background:"var(--b1)",borderRadius:4,height:6,overflow:"hidden"}}><div style={{width:`${Math.max(3,(vm/maxV)*100)}%`,height:"100%",background:"var(--yo)",borderRadius:4,transition:"width .6s"}}/></div>
                        <span className="amt" style={{fontSize:11,color:"var(--yo)",width:58,flexShrink:0}}>{$mxn(vm)}</span>
                      </div>}
                      {vj>0&&<div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:10,color:"var(--ella)",width:44,textAlign:"right",flexShrink:0}}>👩 Majo</span>
                        <div style={{flex:1,background:"var(--b1)",borderRadius:4,height:6,overflow:"hidden"}}><div style={{width:`${Math.max(3,(vj/maxV)*100)}%`,height:"100%",background:"var(--ella)",borderRadius:4,transition:"width .6s"}}/></div>
                        <span className="amt" style={{fontSize:11,color:"var(--ella)",width:58,flexShrink:0}}>{$mxn(vj)}</span>
                      </div>}
                    </div>
                  );
                })}
              </div>
            )}

            {dashStats.allCats.length>0&&(
              <div className="card up" style={{marginBottom:12,animationDelay:"180ms"}}>
                <div className="lbl">Distribución del gasto</div>
                <Donut data={dashStats.allCats.slice(0,6).map(c=>({l:`${c.e} ${c.label}`,v:c.v,c:c.c}))} sz={110}/>
              </div>
            )}
          </div>
        )}

        {/* ══ BALANCE ══ */}
        {tab==="balance"&&(
          <div style={{padding:"28px 14px 0"}}>
            <div style={{fontFamily:"var(--head)",fontSize:22,fontWeight:800,marginBottom:18}}>Balance</div>

            <div className="card up" style={{textAlign:"center",padding:"28px 20px",background:`linear-gradient(135deg,${bc}0a,var(--s2))`,borderColor:`${bc}30`,marginBottom:12}}>
              <div style={{fontSize:40,marginBottom:10}}>⚖️</div>
              <div className="amt" style={{fontSize:20,color:bc,marginBottom:6}}>{bt}</div>
              <div style={{fontSize:11,color:"var(--txt3)",marginBottom:16}}>Incluye pagos ya realizados</div>
              {/* ACTION BUTTON */}
              {S.adjDiff!==0&&(
                <button onClick={()=>setPagoForm(true)} style={{
                  padding:"11px 22px",borderRadius:12,border:"none",
                  background:"linear-gradient(135deg,var(--joint),#00b37a)",
                  color:"#000",fontSize:13,fontWeight:800,boxShadow:"0 4px 18px #00d68f30",
                }}>✅ Registrar pago / abono</button>
              )}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              {[
                {label:"Mane pagó",value:S.yp,color:"var(--yo)",icon:"🧑"},
                {label:"Majo pagó",value:S.ep,color:"var(--ella)",icon:"👩"},
              ].map(k=>(
                <div key={k.label} className="card up" style={{marginBottom:0,textAlign:"center",padding:"18px 12px"}}>
                  <div style={{fontSize:26,marginBottom:6}}>{k.icon}</div>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:1,color:"var(--txt3)",marginBottom:4}}>{k.label.toUpperCase()}</div>
                  <div className="amt" style={{fontSize:18,color:k.color}}>{$mxn(k.value)}</div>
                </div>
              ))}
            </div>

            <div className="card up" style={{marginBottom:12,animationDelay:"80ms"}}>
              <div className="lbl">¿Quién pagó qué?</div>
              <Donut data={[{l:"Mane",v:S.yp,c:"#4f8aff"},{l:"Majo",v:S.ep,c:"#ff5599"},{l:"Compartido",v:S.cp,c:"#00d68f"}].filter(d=>d.v>0)}/>
            </div>

            <div className="card up" style={{animationDelay:"120ms",marginBottom:12}}>
              <div className="lbl">Desglose del balance</div>
              {[
                {label:"🧑 Mane pagó gasto de Majo",value:recs.filter(r=>r.who==="yo"&&r.type==="gasto").reduce((s,r)=>s+r.amount,0),color:"var(--yo)",hint:"Majo debe el total"},
                {label:"🤝 Compartido · Mane pagó",value:recs.filter(r=>r.who==="compartido"&&r.type==="gasto"&&(r.paidBy||"mane")==="mane").reduce((s,r)=>s+r.amount/2,0),color:"var(--joint)",hint:"Majo debe la mitad"},
                {label:"👩 Majo pagó gasto de Mane",value:recs.filter(r=>r.who==="ella"&&r.type==="gasto").reduce((s,r)=>s+r.amount,0),color:"var(--ella)",hint:"Mane debe el total"},
                {label:"🤝 Compartido · Majo pagó",value:recs.filter(r=>r.who==="compartido"&&r.type==="gasto"&&r.paidBy==="majo").reduce((s,r)=>s+r.amount/2,0),color:"var(--ella)",hint:"Mane debe la mitad"},
              ].map(r=>(
                <div key={r.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid var(--b1)"}}>
                  <div>
                    <div style={{fontSize:12,color:"var(--txt2)"}}>{r.label}</div>
                    <div style={{fontSize:10,color:"var(--txt3)",marginTop:1}}>{r.hint}</div>
                  </div>
                  <span className="amt" style={{fontSize:13,color:r.color}}>{$mxn(r.value)}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid var(--b1)"}}>
                <span style={{fontSize:13,color:"var(--txt2)"}}>Ya pagado entre ustedes</span>
                <span className="amt" style={{fontSize:13,color:"var(--joint)"}}>−{$mxn(pagos.reduce((s,p)=>s+p.amount,0))}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10}}>
                <span style={{fontFamily:"var(--head)",fontSize:13,fontWeight:800}}>Pendiente</span>
                <span className="amt" style={{fontSize:16,color:bc}}>{$mxn(Math.abs(S.adjDiff))}</span>
              </div>
            </div>

            {/* Historial de pagos */}
            {pagos.length>0&&(
              <div className="card up" style={{animationDelay:"160ms",marginBottom:12}}>
                <div className="lbl" style={{marginBottom:10}}>Historial de pagos entre ustedes</div>
                {pagos.map(p=>(
                  <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid var(--b1)"}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:"var(--joint)"}}>✅ {p.de} → {p.para}</div>
                      <div style={{fontSize:10,color:"var(--txt3)",marginTop:2}}>{$d(p.date)}{p.note?` · ${p.note}`:""}</div>
                    </div>
                    <span className="amt" style={{fontSize:14,color:"var(--joint)"}}>{$mxn(p.amount)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="card up" style={{borderColor:"#ffb83022",animationDelay:"200ms"}}>
              <div className="lbl">Tu gasto total</div>
              {[
                {label:"👤 Personal",value:S.ptg,color:"var(--personal)"},
                {label:"🧑 Mane (pareja)",value:S.yp,color:"var(--yo)"},
              ].map(r=>(
                <div key={r.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid var(--b1)"}}>
                  <span style={{fontSize:13,color:"var(--txt2)"}}>{r.label}</span>
                  <span className="amt" style={{fontSize:13,color:r.color}}>{$mxn(r.value)}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10}}>
                <span style={{fontFamily:"var(--head)",fontSize:13,fontWeight:800}}>Total</span>
                <span className="amt" style={{fontSize:16}}>{$mxn(S.ptg+S.yp)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ══ HISTORIAL ══ */}
        {tab==="historial"&&(
          <div style={{padding:"28px 14px 0"}}>
            <div style={{fontFamily:"var(--head)",fontSize:22,fontWeight:800,marginBottom:18}}>Historial</div>
            {[
              {key:"personal",list:pRecs,color:"var(--personal)",title:"👤 Personales"},
              {key:"pareja",list:cRecs,color:"var(--yo)",title:"💑 De pareja"},
            ].map(g=>(
              <div key={g.key} style={{marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
                  <div className="lbl" style={{marginBottom:0,color:g.color}}>{g.title}</div>
                  <span className="pill" style={{background:`${g.color}18`,color:g.color}}>{g.list.length}</span>
                </div>
                {g.list.length===0
                  ?<div style={{fontSize:12,color:"var(--txt3)",padding:"4px 2px"}}>Sin movimientos</div>
                  :g.list.map(r=><RRow key={r.id} r={r} onDel={del} onEdit={setEditRecord}/>)
                }
              </div>
            ))}
          </div>
        )}

        {/* ══ PRÉSTAMOS ══ */}
        {tab==="prestamos"&&(()=>{
          const pending=loans.filter(l=>!l.paid);
          const paid=loans.filter(l=>l.paid);
          const totalPending=pending.reduce((s,l)=>{
            const abonado=(l.abonos||[]).reduce((a,x)=>a+x.amount,0);
            return s+(l.amount-abonado);
          },0);
          const byPerson=pending.reduce((acc,l)=>{
            acc[l.name]=acc[l.name]||[];acc[l.name].push(l);return acc;
          },{});
          return(
            <div style={{padding:"28px 14px 0"}}>
              <div style={{fontFamily:"var(--head)",fontSize:22,fontWeight:800,marginBottom:4}}>Préstamos 💸</div>
              <div style={{fontSize:12,color:"var(--txt2)",marginBottom:18}}>Dinero que prestaste y aún no te devuelven</div>
              {totalPending>0&&(
                <div className="card up" style={{background:"linear-gradient(135deg,#1a1000,var(--s2))",borderColor:"#ffb83030",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div className="lbl" style={{color:"var(--personal)"}}>Total pendiente</div>
                    <div className="amt" style={{fontSize:26,color:"var(--personal)"}}>{$mxn(totalPending)}</div>
                  </div>
                  <div style={{fontSize:11,color:"var(--txt3)",textAlign:"right"}}>
                    <div style={{fontSize:22,marginBottom:2}}>🕐</div>
                    {pending.length} préstamo{pending.length!==1?"s":""}
                  </div>
                </div>
              )}
              <button onClick={()=>setLoanForm(true)} style={{width:"100%",padding:"13px",borderRadius:14,border:"1.5px dashed #ffb83055",background:"#ffb83008",color:"var(--personal)",fontSize:13,fontWeight:700,marginBottom:16}}>＋ Nuevo préstamo</button>

              {Object.keys(byPerson).length===0&&paid.length===0&&(
                <div className="card card-ghost" style={{textAlign:"center",padding:32}}>
                  <div style={{fontSize:36,marginBottom:8}}>🤲</div>
                  <div style={{fontSize:13,color:"var(--txt2)"}}>Sin préstamos registrados</div>
                </div>
              )}

              {Object.entries(byPerson).map(([name,lns])=>{
                const totalAbonado=lns.reduce((s,l)=>(l.abonos||[]).reduce((a,x)=>a+x.amount,0)+s,0);
                const totalOriginal=lns.reduce((s,l)=>s+l.amount,0);
                const pendienteTotal=totalOriginal-totalAbonado;
                return(
                  <div key={name} style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,padding:"0 2px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:32,height:32,borderRadius:10,background:"#ffb83020",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>👤</div>
                        <div>
                          <div style={{fontWeight:700,fontSize:14}}>{name}</div>
                          <div style={{fontSize:10,color:"var(--txt3)"}}>{lns.length} préstamo{lns.length!==1?"s":""}</div>
                        </div>
                      </div>
                      <div className="amt" style={{fontSize:17,color:"var(--personal)"}}>{$mxn(pendienteTotal)}</div>
                    </div>
                    {lns.map(l=>{
                      const abonado=(l.abonos||[]).reduce((s,x)=>s+x.amount,0);
                      const pendiente=l.amount-abonado;
                      const pct=abonado>0?Math.min(100,Math.round((abonado/l.amount)*100)):0;
                      return(
                        <div key={l.id} className="row up" style={{borderLeft:"3px solid var(--personal)",marginBottom:6,flexDirection:"column",alignItems:"stretch"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                            <div>
                              <div className="amt" style={{fontSize:16,color:"var(--personal)"}}>{$mxn(l.amount)}</div>
                              {l.note&&<div style={{fontSize:11,color:"var(--txt2)",marginTop:2}}>{l.note}</div>}
                              <div style={{fontSize:10,color:"var(--txt3)",marginTop:2}}>{$d(l.date)}</div>
                            </div>
                            <div style={{display:"flex",gap:6,flexShrink:0,marginLeft:8}}>
                              <button onClick={()=>setAbonoTarget({loanId:l.id,pendiente})} style={{padding:"6px 10px",borderRadius:10,border:"1px solid #ffb83044",background:"#ffb83010",color:"var(--personal)",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>💵 Abonar</button>
                              <button onClick={()=>paidLoan(l.id)} style={{padding:"6px 10px",borderRadius:10,border:"1px solid #00d68f44",background:"#00d68f0f",color:"var(--joint)",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>✓ Pagado</button>
                              <button className="del" onClick={()=>delLoan(l.id)}>×</button>
                            </div>
                          </div>
                          {/* Progress bar if abonos exist */}
                          {abonado>0&&(
                            <div style={{marginTop:10}}>
                              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--txt3)",marginBottom:4}}>
                                <span>Abonado: {$mxn(abonado)}</span>
                                <span>Pendiente: <span style={{color:"var(--personal)",fontWeight:700}}>{$mxn(pendiente)}</span></span>
                              </div>
                              <div style={{background:"var(--b1)",borderRadius:4,height:6,overflow:"hidden"}}>
                                <div style={{width:`${pct}%`,height:"100%",background:"var(--joint)",borderRadius:4,transition:"width .6s"}}/>
                              </div>
                              {/* Abono history */}
                              <div style={{marginTop:8}}>
                                {(l.abonos||[]).map(a=>(
                                  <div key={a.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--txt3)",padding:"3px 0",borderBottom:"1px solid var(--b1)"}}>
                                    <span>💵 {$d(a.date)}{a.note?` · ${a.note}`:""}</span>
                                    <span style={{color:"var(--joint)",fontWeight:700}}>{$mxn(a.amount)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {paid.length>0&&(
                <div style={{marginTop:8}}>
                  <div className="lbl" style={{marginBottom:10,color:"var(--joint)"}}>✓ Ya pagaron ({paid.length})</div>
                  {paid.map(l=>(
                    <div key={l.id} className="row" style={{opacity:.55,borderLeft:"3px solid var(--joint)",marginBottom:6}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <div style={{fontWeight:700,fontSize:13}}>{l.name}</div>
                            {l.note&&<div style={{fontSize:11,color:"var(--txt3)"}}>{l.note}</div>}
                            <div style={{fontSize:10,color:"var(--txt3)"}}>Prestado {$d(l.date)}{l.paidDate?` · Pagado ${$d(l.paidDate)}`:""}</div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <span className="amt" style={{fontSize:14,color:"var(--joint)"}}>{$mxn(l.amount)}</span>
                            <button className="del" onClick={()=>delLoan(l.id)}>×</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* ══ NAV — una sola fila ══ */}
        <nav className="nav">
          {NAV_TABS.slice(0,2).map(t=>(
            <button key={t.id} className={`nav-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
              <span className="nav-icon">{t.e}</span>
              <span>{t.label}</span>
              <div className="dot"/>
            </button>
          ))}
          {/* FAB en el centro */}
          <button className="nav-fab" onClick={()=>setForm(true)}>
            <div className="nav-fab-circle">＋</div>
          </button>
          {NAV_TABS.slice(2).map(t=>(
            <button key={t.id} className={`nav-btn${tab===t.id?" active":""}`}
              onClick={()=>setTab(t.id)}
              style={t.id==="prestamos"&&tab===t.id?{color:"var(--personal)"}:t.id==="prestamos"?{color:"var(--txt3)"}:{}}>
              <span className="nav-icon">{t.e}</span>
              <span>{t.label}</span>
              <div className="dot" style={t.id==="prestamos"?{background:"var(--personal)"}:{}}/>
            </button>
          ))}
        </nav>

        {/* Modals */}
        {form&&<QuickForm onSave={add} onClose={()=>setForm(false)}/>}
        {loanForm&&<LoanForm onSave={addLoan} onClose={()=>setLoanForm(false)} existingNames={loanNames}/>}
        {editRecord&&<EditForm r={editRecord} onSave={r=>{updateRecord(r);setEditRecord(null);}} onClose={()=>setEditRecord(null)}/>}
        {abonoTarget&&<AbonoForm deuda={abonoTarget.loanId} pendiente={abonoTarget.pendiente} onSave={addAbono} onClose={()=>setAbonoTarget(null)}/>}
        {pagoForm&&<PagoPareja diff={S.adjDiff} onSave={addPago} onClose={()=>setPagoForm(false)}/>}
      </div>
    </>
  );
}
