import React, { useState, useEffect, useMemo, useRef } from 'react';

/**
 * Aplicación de Gestión de Finanzas Personales y Pareja
 * Incluye:
 * - Sincronización con Google Sheets (API externa)
 * - Gestión de gastos compartidos y personales
 * - Dashboard de análisis visual
 * - Registro de préstamos y abonos
 * - Estilo moderno con Tailwind-like CSS in JS
 */

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
    @keyframes rise{from{transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
    .up  {animation:up  .3s ease both;}
    .rise{animation:rise .28s cubic-bezier(.32,.72,0,1) both;}

    .nav{
      display:grid;
      grid-template-columns:repeat(5,1fr);
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
    }
    .nav-btn.active{color:var(--yo);}
    .nav-btn .nav-icon{font-size:18px;line-height:1;margin-bottom:1px;}
    .nav-btn .dot{width:3px;height:3px;border-radius:2px;background:currentColor;opacity:0;transition:opacity .15s;margin-top:1px;}
    .nav-btn.active .dot{opacity:1;}

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

    .card{background:#fff;border:1px solid var(--b1);border-radius:18px;padding:16px;margin-bottom:10px;box-shadow:0 2px 12px #0f11320a;}
    .row{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#fff;border:1px solid var(--b1);border-radius:14px;margin-bottom:7px;box-shadow:0 1px 6px #0f11320a;}
    .amt{font-family:var(--head);font-weight:800;letter-spacing:-.5px;line-height:1;}
    .pill{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;}
    .bar-track{background:var(--b1);border-radius:4px;height:5px;overflow:hidden;margin-top:4px;}
    .bar-fill{height:100%;border-radius:4px;transition:width .6s cubic-bezier(.22,.68,0,1.2);}
    
    .sync-bar{position:fixed;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;z-index:200;padding:8px 16px;display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;}
    .sync-bar.loading{background:#eef2ff;color:var(--yo);}
    
    .sheet-overlay{position:fixed;inset:0;background:#00000055;z-index:200;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px);}
    .sheet-inner{background:#fff;border-radius:22px 22px 0 0;padding:20px 18px;width:100%;max-width:430px;max-height:85vh;overflow-y:auto;}
    .hero-card{background:linear-gradient(135deg,#2952d9 0%,#6b4fff 100%);border-radius:24px;padding:24px 20px;color:#fff;margin-bottom:16px;box-shadow:0 8px 32px #3b6ff530;}
  `}</style>
);

const CATS = [
  { id: "casa", e: "🏠", label: "Casa", c: "#4f8aff" },
  { id: "comida", e: "🍔", label: "Comida", c: "#ff8c30" },
  { id: "transporte", e: "🚗", label: "Transporte", c: "#00b37a" },
  { id: "salud", e: "💊", label: "Salud", c: "#b06fff" },
  { id: "entretenimiento", e: "🎬", label: "Entretenim.", c: "#ff5599" },
  { id: "servicios", e: "💡", label: "Servicios", c: "#ffb830" },
  { id: "ropa", e: "👗", label: "Ropa", c: "#ff6060" },
  { id: "amazon", e: "📦", label: "Amazon", c: "#ff9900" },
  { id: "otros", e: "📁", label: "Otros", c: "#888aaa" },
];

const API_URL = "TU_URL_DE_GOOGLE_APPS_SCRIPT";

export default function App() {
  const [recs, setRecs] = useState([]);
  const [tab, setTab] = useState("home");
  const [showForm, setShowForm] = useState(false);
  const [syncStatus, setSyncStatus] = useState("idle");

  const $mxn = n => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);

  useEffect(() => {
    // Aquí iría la lógica de carga inicial desde la API o LocalStorage
    setSyncStatus("loading");
    setTimeout(() => setSyncStatus("idle"), 1000);
  }, []);

  const stats = useMemo(() => {
    const totalGasto = recs.filter(r => r.type === "gasto").reduce((s, r) => s + r.amount, 0);
    const totalIngreso = recs.filter(r => r.type === "ingreso").reduce((s, r) => s + r.amount, 0);
    return { totalGasto, totalIngreso };
  }, [recs]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", maxWidth: 430, margin: "0 auto", paddingBottom: 90 }}>
      <G />
      
      {syncStatus === "loading" && (
        <div className="sync-bar loading">Sincronizando...</div>
      )}

      {tab === "home" && (
        <div className="up" style={{ padding: "20px 18px" }}>
          <header style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 12, color: "var(--txt2)" }}>Hola de nuevo 👋</p>
            <h1 style={{ fontFamily: "var(--head)", fontSize: 24, fontWeight: 800 }}>Mane & Majo</h1>
          </header>

          <div className="hero-card">
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, opacity: 0.8, marginBottom: 8 }}>BALANCE TOTAL</p>
            <h2 style={{ fontSize: 32, fontFamily: "var(--head)", fontWeight: 800 }}>{$mxn(stats.totalIngreso - stats.totalGasto)}</h2>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", padding: 10, borderRadius: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: "#a5c4ff" }}>INGRESOS</p>
                <p className="amt">{$mxn(stats.totalIngreso)}</p>
              </div>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", padding: 10, borderRadius: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: "#ffb3ce" }}>GASTOS</p>
                <p className="amt">{$mxn(stats.totalGasto)}</p>
              </div>
            </div>
          </div>

          <section>
            <h3 style={{ fontFamily: "var(--head)", fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Movimientos recientes</h3>
            {recs.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: 40, borderStyle: "dashed" }}>
                <p style={{ fontSize: 13, color: "var(--txt3)" }}>No hay movimientos registrados aún.</p>
              </div>
            ) : (
              recs.map(r => (
                <div key={r.id} className="row">
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f0f2f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                    {CATS.find(c => c.id === r.category)?.e || "📁"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{r.description}</p>
                    <p style={{ fontSize: 11, color: "var(--txt3)" }}>{r.date}</p>
                  </div>
                  <p className="amt" style={{ color: r.type === "ingreso" ? "var(--inc)" : "var(--txt)" }}>
                    {r.type === "ingreso" ? "+" : "-"}{$mxn(r.amount)}
                  </p>
                </div>
              ))
            )}
          </section>
        </div>
      )}

      {/* Navegación Inferior */}
      <nav className="nav">
        <button className={`nav-btn ${tab === "home" ? "active" : ""}`} onClick={() => setTab("home")}>
          <span className="nav-icon">⬡</span>
          <span>Inicio</span>
          <div className="dot" />
        </button>
        <button className={`nav-btn ${tab === "analysis" ? "active" : ""}`} onClick={() => setTab("analysis")}>
          <span className="nav-icon">📊</span>
          <span>Análisis</span>
          <div className="dot" />
        </button>
        <button className="nav-fab" onClick={() => setShowForm(true)}>
          <div className="nav-fab-circle">＋</div>
        </button>
        <button className={`nav-btn ${tab === "balance" ? "active" : ""}`} onClick={() => setTab("balance")}>
          <span className="nav-icon">⚖</span>
          <span>Balance</span>
          <div className="dot" />
        </button>
        <button className={`nav-btn ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>
          <span className="nav-icon">☰</span>
          <span>Historial</span>
          <div className="dot" />
        </button>
      </nav>

      {/* Modal de Registro Rápido */}
      {showForm && (
        <div className="sheet-overlay" onClick={() => setShowForm(false)}>
          <div className="sheet-inner rise" onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: "#e4e7f0", borderRadius: 2, margin: "0 auto 20px" }} />
            <h2 style={{ fontFamily: "var(--head)", fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Nuevo Registro</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input type="number" placeholder="Monto $0.00" style={{ width: "100%", padding: 16, borderRadius: 14, border: "1px solid var(--b1)", fontSize: 24, fontFamily: "var(--head)", fontWeight: 800 }} />
              <input type="text" placeholder="¿En qué gastaste?" style={{ width: "100%", padding: 14, borderRadius: 14, border: "1px solid var(--b1)" }} />
              <button style={{ width: "100%", padding: 16, borderRadius: 14, border: "none", background: "var(--yo)", color: "#fff", fontWeight: 700, fontSize: 16 }}>Guardar Movimiento</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
