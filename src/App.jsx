import { useState, useEffect } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

// ─── STORAGE HELPERS (localStorage) ──────────────────────────────
const STORAGE_KEYS = {
  reviews: "portfolio-reviews",
  works: "portfolio-works",
  channels: "portfolio-channels",
  contacts: "portfolio-contacts",
  logo: "portfolio-logo",
  siteName: "portfolio-sitename",
};

const loadData = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const saveData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
};

// ─── DEFAULT DATA ────────────────────────────────────────────────
const DEFAULT_WORKS = {
  reels: [
    { id: 1, title: "Reels #1", video: "", price: "5 000 ₽" },
    { id: 2, title: "Reels #2", video: "", price: "5 000 ₽" },
    { id: 3, title: "Reels #3", video: "", price: "5 000 ₽" },
    { id: 4, title: "Reels #4", video: "", price: "5 000 ₽" },
    { id: 5, title: "Reels #5", video: "", price: "5 000 ₽" },
  ],
  motion: [
    { id: 1, title: "Motion #1", video: "", price: "10 000 ₽" },
    { id: 2, title: "Motion #2", video: "", price: "10 000 ₽" },
    { id: 3, title: "Motion #3", video: "", price: "10 000 ₽" },
    { id: 4, title: "Motion #4", video: "", price: "10 000 ₽" },
    { id: 5, title: "Motion #5", video: "", price: "10 000 ₽" },
  ],
  youtube: [
    { id: 1, title: "YouTube #1", video: "", price: "15 000 ₽" },
    { id: 2, title: "YouTube #2", video: "", price: "15 000 ₽" },
    { id: 3, title: "YouTube #3", video: "", price: "15 000 ₽" },
  ],
};

const DEFAULT_CHANNELS = [
  {
    id: 1,
    name: "Канал «Техно»",
    before: { subs: "12K", views: "45K" },
    after: { subs: "89K", views: "1.2M" },
    points: [
      { label: "Янв", views: 4500, thumb: "" },
      { label: "Фев", views: 6200, thumb: "" },
      { label: "Мар", views: 12000, thumb: "" },
      { label: "Апр", views: 28000, thumb: "" },
      { label: "Май", views: 65000, thumb: "" },
      { label: "Июн", views: 120000, thumb: "" },
    ],
  },
  {
    id: 2,
    name: "Канал «Лайфстайл»",
    before: { subs: "3K", views: "8K" },
    after: { subs: "45K", views: "560K" },
    points: [
      { label: "Янв", views: 800, thumb: "" },
      { label: "Фев", views: 1500, thumb: "" },
      { label: "Мар", views: 5600, thumb: "" },
      { label: "Апр", views: 18000, thumb: "" },
      { label: "Май", views: 42000, thumb: "" },
      { label: "Июн", views: 56000, thumb: "" },
    ],
  },
];

const DEFAULT_CONTACTS = {
  telegram: "@yourstudio",
  whatsapp: "+7 (999) 123-45-67",
  email: "hello@studio.com",
  instagram: "@yourstudio",
  youtube: "YourStudio",
  vk: "yourstudio",
};

const DEFAULT_REVIEWS = [
  { id: 1, name: "Алексей", rating: 5, text: "Потрясающее качество монтажа! Очень доволен результатом.", date: "2025-12-01" },
  { id: 2, name: "Мария", rating: 5, text: "Ребята сделали крутой шоурил для моего канала.", date: "2025-11-15" },
  { id: 3, name: "Дмитрий", rating: 4, text: "Хорошая работа, рекомендую!", date: "2025-10-20" },
];

const ADMIN_PASSWORD = "admin123";

// ─── GLOBAL CSS ──────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&display=swap');

  * { margin:0; padding:0; box-sizing:border-box; }

  :root {
    --bg: #08080c;
    --surface: #111118;
    --surface2: #1a1a24;
    --border: #2a2a3a;
    --text: #eeeef0;
    --text2: #8888a0;
    --accent: #6c5ce7;
    --accent2: #a29bfe;
    --gradient1: linear-gradient(135deg, #6c5ce7, #a29bfe, #fd79a8);
    --gradient2: linear-gradient(135deg, #0c0c14, #1a1a2e);
    --gradient-glow: linear-gradient(135deg, rgba(108,92,231,0.3), rgba(253,121,168,0.15));
    --radius: 16px;
    --radius-sm: 10px;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: 'Manrope', sans-serif; overflow-x: hidden; }

  @keyframes fadeUp {
    from { opacity:0; transform: translateY(30px); }
    to { opacity:1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; }
    to { opacity:1; }
  }
  @keyframes scaleIn {
    from { opacity:0; transform: scale(0.9); }
    to { opacity:1; transform: scale(1); }
  }
  @keyframes slideDown {
    from { opacity:0; transform: translateY(-20px); }
    to { opacity:1; transform: translateY(0); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes pulse {
    0%,100% { opacity:0.4; }
    50% { opacity:1; }
  }
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .anim-fade-up { animation: fadeUp 0.7s ease-out both; }
  .anim-scale-in { animation: scaleIn 0.6s ease-out both; }
  .anim-slide-down { animation: slideDown 0.5s ease-out both; }

  .gradient-text {
    background: var(--gradient1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glass {
    background: rgba(17,17,24,0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.06);
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 3px; }

  input, textarea, select { font-family: 'Manrope', sans-serif; }
`;

// ─── HELPER COMPONENTS ───────────────────────────────────────────
const Stars = ({ rating, onRate, size = 18 }) => (
  <div style={{ display: "flex", gap: 4 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        onClick={() => onRate && onRate(i)}
        style={{
          cursor: onRate ? "pointer" : "default",
          fontSize: size,
          color: i <= rating ? "#ffd700" : "#333",
          transition: "color 0.2s, transform 0.2s",
          display: "inline-block",
        }}
        onMouseEnter={(e) => onRate && (e.target.style.transform = "scale(1.3)")}
        onMouseLeave={(e) => onRate && (e.target.style.transform = "scale(1)")}
      >
        ★
      </span>
    ))}
  </div>
);

const SectionTitle = ({ children, id }) => (
  <h2
    id={id}
    style={{
      fontFamily: "'Unbounded', sans-serif",
      fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
      fontWeight: 700,
      marginBottom: 40,
      textAlign: "center",
      letterSpacing: "-0.02em",
    }}
  >
    <span className="gradient-text">{children}</span>
  </h2>
);

const Btn = ({ children, onClick, variant = "primary", style: s = {} }) => {
  const base = {
    fontFamily: "'Unbounded', sans-serif",
    fontWeight: 500,
    fontSize: 14,
    padding: "14px 32px",
    borderRadius: 50,
    border: "none",
    cursor: "pointer",
    transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
    letterSpacing: "0.01em",
  };
  const variants = {
    primary: {
      background: "var(--gradient1)",
      backgroundSize: "200% 200%",
      animation: "gradientShift 4s ease infinite",
      color: "#fff",
      boxShadow: "0 4px 24px rgba(108,92,231,0.35)",
    },
    secondary: {
      background: "transparent",
      color: "var(--text)",
      border: "1px solid var(--border)",
    },
    ghost: {
      background: "rgba(108,92,231,0.1)",
      color: "var(--accent2)",
      border: "1px solid rgba(108,92,231,0.2)",
    },
  };
  return (
    <button
      onClick={onClick}
      style={{ ...base, ...variants[variant], ...s }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = "0 8px 32px rgba(108,92,231,0.45)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow =
          variant === "primary"
            ? "0 4px 24px rgba(108,92,231,0.35)"
            : "none";
      }}
    >
      {children}
    </button>
  );
};

// ─── SHARED STYLES ───────────────────────────────────────────────
const inputStyle = {
  background: "var(--surface2)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  padding: "10px 14px",
  color: "var(--text)",
  fontSize: 14,
  outline: "none",
  width: "100%",
  transition: "border-color 0.3s",
};

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "var(--text2)",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  marginBottom: 6,
};

const iconBtnStyle = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: 16,
  padding: 6,
  fontFamily: "'Manrope', sans-serif",
};

// ─── MAIN APP ────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwdInput, setPwdInput] = useState("");
  const [pwdError, setPwdError] = useState(false);

  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [works, setWorks] = useState(DEFAULT_WORKS);
  const [channels, setChannels] = useState(DEFAULT_CHANNELS);
  const [contacts, setContacts] = useState(DEFAULT_CONTACTS);
  const [siteName, setSiteName] = useState("STUDIO");
  const [logoUrl, setLogoUrl] = useState("");

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const [adminTab, setAdminTab] = useState("works");

  // Load from localStorage
  useEffect(() => {
    setReviews(loadData(STORAGE_KEYS.reviews, DEFAULT_REVIEWS));
    setWorks(loadData(STORAGE_KEYS.works, DEFAULT_WORKS));
    setChannels(loadData(STORAGE_KEYS.channels, DEFAULT_CHANNELS));
    setContacts(loadData(STORAGE_KEYS.contacts, DEFAULT_CONTACTS));
    setSiteName(loadData(STORAGE_KEYS.siteName, "STUDIO"));
    setLogoUrl(loadData(STORAGE_KEYS.logo, ""));
    setTimeout(() => setLoaded(true), 300);
  }, []);

  const saveReviews = (r) => { setReviews(r); saveData(STORAGE_KEYS.reviews, r); };
  const saveWorks = (w) => { setWorks(w); saveData(STORAGE_KEYS.works, w); };
  const saveChannels = (c) => { setChannels(c); saveData(STORAGE_KEYS.channels, c); };
  const saveContacts = (c) => { setContacts(c); saveData(STORAGE_KEYS.contacts, c); };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
  const totalWorks = works.reels.length + works.motion.length + works.youtube.length;

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const submitReview = () => {
    if (!reviewName.trim() || !reviewText.trim()) return;
    const newR = [
      {
        id: Date.now(),
        name: reviewName,
        rating: reviewRating,
        text: reviewText,
        date: new Date().toISOString().slice(0, 10),
      },
      ...reviews,
    ];
    saveReviews(newR);
    setReviewName("");
    setReviewRating(5);
    setReviewText("");
  };

  const handleLogin = () => {
    if (pwdInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowPasswordModal(false);
      setPwdInput("");
      setPwdError(false);
    } else {
      setPwdError(true);
    }
  };

  // ── Loading screen ──
  if (!loaded) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{globalStyles}</style>
        <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "rotate 0.8s linear infinite" }} />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // ADMIN PANEL
  // ════════════════════════════════════════════════════════════════
  if (isAdmin) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "30px 20px" }}>
        <style>{globalStyles}</style>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 12 }}>
            <h1 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 24 }} className="gradient-text">Админ-панель</h1>
            <Btn variant="secondary" onClick={() => setIsAdmin(false)}>← На сайт</Btn>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
            {[["works","Работы"],["reviews","Отзывы"],["channels","Каналы"],["contacts","Контакты"],["settings","Настройки"]].map(([key, label]) => (
              <button key={key} onClick={() => setAdminTab(key)} style={{
                padding: "10px 20px", borderRadius: 50, border: "1px solid",
                borderColor: adminTab === key ? "var(--accent)" : "var(--border)",
                background: adminTab === key ? "rgba(108,92,231,0.15)" : "transparent",
                color: adminTab === key ? "var(--accent2)" : "var(--text2)",
                cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 13, transition: "all 0.3s",
              }}>{label}</button>
            ))}
          </div>

          {/* Works */}
          {adminTab === "works" && (
            <div className="anim-fade-up">
              {["reels","motion","youtube"].map(cat => (
                <div key={cat} style={{ marginBottom: 40 }}>
                  <h3 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 18, marginBottom: 16 }}>
                    {cat === "youtube" ? "YouTube" : cat === "reels" ? "Reels" : "Моушн"}
                  </h3>
                  {works[cat].map((item, idx) => (
                    <div key={item.id} style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: 16, marginBottom: 10, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                      <input placeholder="Название" value={item.title} onChange={e => { const nw = {...works}; nw[cat][idx].title = e.target.value; saveWorks(nw); }} style={inputStyle} />
                      <input placeholder="URL видео (embed)" value={item.video} onChange={e => { const nw = {...works}; nw[cat][idx].video = e.target.value; saveWorks(nw); }} style={{...inputStyle, flex: 2}} />
                      <input placeholder="Цена" value={item.price} onChange={e => { const nw = {...works}; nw[cat][idx].price = e.target.value; saveWorks(nw); }} style={{...inputStyle, width: 120}} />
                      <button onClick={() => { const nw = {...works}; nw[cat] = nw[cat].filter((_,i)=>i!==idx); saveWorks(nw); }} style={{...iconBtnStyle, color: "#ff6b6b"}}>✕</button>
                    </div>
                  ))}
                  <button onClick={() => { const nw = {...works}; nw[cat] = [...nw[cat], {id: Date.now(), title: "", video: "", price: ""}]; saveWorks(nw); }} style={{...iconBtnStyle, color: "var(--accent2)", fontSize: 13, padding: "8px 16px", border: "1px dashed var(--border)", borderRadius: 8}}>+ Добавить</button>
                </div>
              ))}
            </div>
          )}

          {/* Reviews */}
          {adminTab === "reviews" && (
            <div className="anim-fade-up">
              {reviews.map((r, idx) => (
                <div key={r.id} style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: 16, marginBottom: 10, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ color: "var(--text2)", fontSize: 13, minWidth: 80 }}>{r.name}</span>
                  <Stars rating={r.rating} size={14} />
                  <span style={{ color: "var(--text2)", fontSize: 12, flex: 1 }}>{r.text.slice(0,60)}...</span>
                  <button onClick={() => saveReviews(reviews.filter((_,i)=>i!==idx))} style={{...iconBtnStyle, color: "#ff6b6b"}}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Channels */}
          {adminTab === "channels" && (
            <div className="anim-fade-up">
              {channels.map((ch, chIdx) => (
                <div key={ch.id} style={{ background: "var(--surface)", borderRadius: "var(--radius)", padding: 20, marginBottom: 20 }}>
                  <input value={ch.name} onChange={e => { const nc=[...channels]; nc[chIdx].name=e.target.value; saveChannels(nc); }} style={{...inputStyle, fontFamily: "'Unbounded', sans-serif", fontWeight: 600, fontSize: 16, marginBottom: 12}} placeholder="Название канала" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                    <div><label style={labelStyle}>До — Подписчики</label><input value={ch.before.subs} onChange={e => { const nc=[...channels]; nc[chIdx].before.subs=e.target.value; saveChannels(nc); }} style={inputStyle} /></div>
                    <div><label style={labelStyle}>До — Просмотры</label><input value={ch.before.views} onChange={e => { const nc=[...channels]; nc[chIdx].before.views=e.target.value; saveChannels(nc); }} style={inputStyle} /></div>
                    <div><label style={labelStyle}>После — Подписчики</label><input value={ch.after.subs} onChange={e => { const nc=[...channels]; nc[chIdx].after.subs=e.target.value; saveChannels(nc); }} style={inputStyle} /></div>
                    <div><label style={labelStyle}>После — Просмотры</label><input value={ch.after.views} onChange={e => { const nc=[...channels]; nc[chIdx].after.views=e.target.value; saveChannels(nc); }} style={inputStyle} /></div>
                  </div>
                  <h4 style={{ color: "var(--text2)", fontSize: 13, marginBottom: 10 }}>Точки графика</h4>
                  {ch.points.map((pt, ptIdx) => (
                    <div key={ptIdx} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                      <input placeholder="Метка" value={pt.label} onChange={e => { const nc=[...channels]; nc[chIdx].points[ptIdx].label=e.target.value; saveChannels(nc); }} style={{...inputStyle, width: 80}} />
                      <input placeholder="Просмотры" type="number" value={pt.views} onChange={e => { const nc=[...channels]; nc[chIdx].points[ptIdx].views=Number(e.target.value); saveChannels(nc); }} style={{...inputStyle, width: 120}} />
                      <input placeholder="URL превью" value={pt.thumb} onChange={e => { const nc=[...channels]; nc[chIdx].points[ptIdx].thumb=e.target.value; saveChannels(nc); }} style={{...inputStyle, flex: 1}} />
                      <button onClick={() => { const nc=[...channels]; nc[chIdx].points=nc[chIdx].points.filter((_,i)=>i!==ptIdx); saveChannels(nc); }} style={{...iconBtnStyle, color: "#ff6b6b"}}>✕</button>
                    </div>
                  ))}
                  <button onClick={() => { const nc=[...channels]; nc[chIdx].points=[...nc[chIdx].points,{label:"",views:0,thumb:""}]; saveChannels(nc); }} style={{...iconBtnStyle, color: "var(--accent2)", fontSize: 12, marginTop: 6}}>+ Точка</button>
                </div>
              ))}
              <button onClick={() => { saveChannels([...channels, { id: Date.now(), name: "Новый канал", before:{subs:"0",views:"0"}, after:{subs:"0",views:"0"}, points:[{label:"Янв",views:0,thumb:""}] }]); }} style={{...iconBtnStyle, color: "var(--accent2)", fontSize: 13, padding: "10px 20px", border: "1px dashed var(--border)", borderRadius: 10}}>+ Добавить канал</button>
            </div>
          )}

          {/* Contacts */}
          {adminTab === "contacts" && (
            <div className="anim-fade-up" style={{ background: "var(--surface)", borderRadius: "var(--radius)", padding: 24 }}>
              {Object.keys(contacts).map(key => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>{key}</label>
                  <input value={contacts[key]} onChange={e => saveContacts({...contacts, [key]: e.target.value})} style={inputStyle} />
                </div>
              ))}
            </div>
          )}

          {/* Settings */}
          {adminTab === "settings" && (
            <div className="anim-fade-up" style={{ background: "var(--surface)", borderRadius: "var(--radius)", padding: 24 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Название студии</label>
                <input value={siteName} onChange={e => { setSiteName(e.target.value); saveData(STORAGE_KEYS.siteName, e.target.value); }} style={inputStyle} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>URL логотипа</label>
                <input value={logoUrl} onChange={e => { setLogoUrl(e.target.value); saveData(STORAGE_KEYS.logo, e.target.value); }} style={inputStyle} placeholder="https://example.com/logo.png" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // PUBLIC SITE
  // ════════════════════════════════════════════════════════════════
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{globalStyles}</style>

      {/* Ambient blobs */}
      <div style={{ position: "fixed", top: -200, right: -200, width: 600, height: 600, background: "radial-gradient(circle, rgba(108,92,231,0.08), transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -300, left: -200, width: 700, height: 700, background: "radial-gradient(circle, rgba(253,121,168,0.05), transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* ── NAV DOTS ── */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          position: "fixed", top: 20, left: 20, zIndex: 1000,
          width: 44, height: 44, borderRadius: 12,
          background: "rgba(17,17,24,0.8)", backdropFilter: "blur(20px)",
          border: "1px solid var(--border)", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
          transition: "all 0.3s",
        }}
      >
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent2)", transition: "all 0.3s", transform: menuOpen ? `rotate(${i*45}deg)` : "none" }} />
        ))}
      </button>

      {menuOpen && (
        <div className="anim-slide-down glass" style={{ position: "fixed", top: 72, left: 20, zIndex: 999, borderRadius: "var(--radius-sm)", padding: 8, minWidth: 200 }}>
          {[["reviews-section","Отзывы"],["channels-section","Статистика каналов"],["portfolio-section","Портфолио"]].map(([id,label]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              display: "block", width: "100%", padding: "12px 16px",
              background: "transparent", border: "none", color: "var(--text)",
              textAlign: "left", cursor: "pointer", borderRadius: 8,
              fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 500, transition: "background 0.2s",
            }}
            onMouseEnter={e => e.target.style.background = "rgba(108,92,231,0.1)"}
            onMouseLeave={e => e.target.style.background = "transparent"}
            >{label}</button>
          ))}
        </div>
      )}

      {/* ─── HERO ─── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px 60px", position: "relative", zIndex: 1 }}>
        <div className="anim-scale-in" style={{
          width: 130, height: 130, borderRadius: "50%",
          background: logoUrl ? `url(${logoUrl}) center/cover` : "var(--gradient1)",
          backgroundSize: logoUrl ? "cover" : "200% 200%",
          animation: logoUrl ? "none" : "gradientShift 4s ease infinite",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 60px rgba(108,92,231,0.3)", marginBottom: 24,
          fontSize: logoUrl ? 0 : 36, fontFamily: "'Unbounded', sans-serif", fontWeight: 800, color: "#fff",
        }}>
          {!logoUrl && siteName[0]}
        </div>

        <h1 className="anim-fade-up" style={{
          fontFamily: "'Unbounded', sans-serif", fontSize: "clamp(2rem, 6vw, 3.4rem)",
          fontWeight: 800, textAlign: "center", marginBottom: 16, letterSpacing: "-0.03em", animationDelay: "0.15s",
        }}>
          <span className="gradient-text">{siteName}</span>
        </h1>

        <div className="anim-fade-up" style={{ animationDelay: "0.3s", textAlign: "center", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Unbounded', sans-serif" }}>{avgRating}</span>
            <Stars rating={Math.round(Number(avgRating))} size={22} />
          </div>
          <p style={{ color: "var(--text2)", fontSize: 13 }}>на основе {reviews.length} отзывов</p>
        </div>

        <p className="anim-fade-up" style={{ animationDelay: "0.4s", color: "var(--text2)", fontSize: 15, marginBottom: 32 }}>
          {totalWorks} выполненных работ
        </p>

        <div className="anim-fade-up" style={{ animationDelay: "0.5s", display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <Btn onClick={() => scrollTo("portfolio-section")}>Портфолио</Btn>
          <Btn variant="secondary" onClick={() => scrollTo("contacts-section")}>Заказать</Btn>
        </div>

        <div style={{ position: "absolute", bottom: 30, animation: "float 2.5s ease-in-out infinite" }}>
          <div style={{ width: 24, height: 40, borderRadius: 12, border: "2px solid var(--border)", display: "flex", justifyContent: "center", paddingTop: 8 }}>
            <div style={{ width: 3, height: 8, borderRadius: 2, background: "var(--accent)", animation: "pulse 1.5s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ─── PORTFOLIO ─── */}
      <section id="portfolio-section" style={{ padding: "80px 20px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <SectionTitle>Портфолио</SectionTitle>
        {[{key:"reels",label:"Reels"},{key:"motion",label:"Моушн"},{key:"youtube",label:"YouTube"}].map(({key,label}) => (
          <div key={key} style={{ marginBottom: 56 }}>
            <h3 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 20, fontWeight: 600, marginBottom: 20 }}>{label}</h3>
            <div style={{ display: "grid", gridTemplateColumns: key==="youtube" ? "repeat(auto-fill, minmax(300px, 1fr))" : "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {works[key].map((item,i) => (
                <div key={item.id} className="anim-fade-up" style={{
                  animationDelay: `${i*0.08}s`, background: "var(--surface)", borderRadius: "var(--radius)",
                  overflow: "hidden", border: "1px solid var(--border)", transition: "transform 0.35s cubic-bezier(.4,0,.2,1), box-shadow 0.35s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(108,92,231,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
                >
                  <div style={{ aspectRatio: key==="youtube" ? "16/9" : "9/16", background: item.video ? "transparent" : "linear-gradient(135deg, var(--surface2), var(--surface))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.video ? (
                      <iframe src={item.video} style={{ width: "100%", height: "100%", border: "none" }} allow="autoplay; encrypted-media" allowFullScreen />
                    ) : (
                      <div style={{ color: "var(--text2)", fontSize: 13, textAlign: "center", padding: 20 }}>
                        <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>▶</div><span>Видео</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{item.title}</span>
                    {item.price && <span style={{ fontSize: 12, fontWeight: 700, background: "rgba(108,92,231,0.12)", color: "var(--accent2)", padding: "4px 10px", borderRadius: 20 }}>{item.price}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ─── CHANNELS ─── */}
      <section id="channels-section" style={{ padding: "80px 20px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <SectionTitle>Статистика каналов</SectionTitle>
        {channels.map((ch,idx) => (
          <div key={ch.id} className="anim-fade-up" style={{ animationDelay: `${idx*0.12}s`, background: "var(--surface)", borderRadius: "var(--radius)", padding: "28px 24px", marginBottom: 32, border: "1px solid var(--border)" }}>
            <h3 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 20 }}>{ch.name}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              <div style={{ background: "rgba(255,107,107,0.06)", borderRadius: "var(--radius-sm)", padding: 16, border: "1px solid rgba(255,107,107,0.1)" }}>
                <p style={{ color: "#ff6b6b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>До</p>
                <p style={{ fontSize: 13, color: "var(--text2)" }}>Подписчики: <strong style={{ color: "var(--text)" }}>{ch.before.subs}</strong></p>
                <p style={{ fontSize: 13, color: "var(--text2)" }}>Просмотры: <strong style={{ color: "var(--text)" }}>{ch.before.views}</strong></p>
              </div>
              <div style={{ background: "rgba(108,92,231,0.06)", borderRadius: "var(--radius-sm)", padding: 16, border: "1px solid rgba(108,92,231,0.15)" }}>
                <p style={{ color: "var(--accent2)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>После</p>
                <p style={{ fontSize: 13, color: "var(--text2)" }}>Подписчики: <strong style={{ color: "var(--text)" }}>{ch.after.subs}</strong></p>
                <p style={{ fontSize: 13, color: "var(--text2)" }}>Просмотры: <strong style={{ color: "var(--text)" }}>{ch.after.views}</strong></p>
              </div>
            </div>
            <div style={{ height: 260, marginBottom: 16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ch.points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`grad-${ch.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6c5ce7" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#6c5ce7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 13, color: "var(--text)" }} formatter={(v) => [v.toLocaleString(), "Просмотры"]} />
                  <Area type="monotone" dataKey="views" stroke="#6c5ce7" strokeWidth={2.5} fill={`url(#grad-${ch.id})`} dot={{ r: 5, fill: "#6c5ce7", stroke: "#1a1a24", strokeWidth: 2 }} activeDot={{ r: 7 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {ch.points.some(p => p.thumb) && (
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
                {ch.points.filter(p => p.thumb).map((p,i) => (
                  <div key={i} style={{ minWidth: 80, textAlign: "center" }}>
                    <img src={p.thumb} alt="" style={{ width: 80, height: 45, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }} />
                    <p style={{ fontSize: 10, color: "var(--text2)", marginTop: 4 }}>{p.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* ─── REVIEWS ─── */}
      <section id="reviews-section" style={{ padding: "80px 20px", maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <SectionTitle>Отзывы</SectionTitle>
        <div className="glass" style={{ borderRadius: "var(--radius)", padding: 24, marginBottom: 40 }}>
          <h4 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 15, marginBottom: 16 }}>Оставить отзыв</h4>
          <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
            <input placeholder="Ваше имя" value={reviewName} onChange={e => setReviewName(e.target.value)} style={{...inputStyle, flex: 1, minWidth: 150}} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, color: "var(--text2)" }}>Оценка:</span>
              <Stars rating={reviewRating} onRate={setReviewRating} size={22} />
            </div>
          </div>
          <textarea placeholder="Напишите отзыв..." value={reviewText} onChange={e => setReviewText(e.target.value)} rows={3} style={{...inputStyle, width: "100%", resize: "vertical", marginBottom: 12}} />
          <Btn onClick={submitReview} style={{ fontSize: 13, padding: "10px 24px" }}>Отправить</Btn>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {reviews.map((r,i) => (
            <div key={r.id} className="anim-fade-up" style={{
              animationDelay: `${i*0.06}s`, background: "var(--surface)", borderRadius: "var(--radius)",
              padding: "20px 24px", border: "1px solid var(--border)", transition: "border-color 0.3s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor="rgba(108,92,231,0.3)"}
            onMouseLeave={e => e.currentTarget.style.borderColor="var(--border)"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--gradient1)", backgroundSize: "200% 200%", animation: "gradientShift 4s ease infinite", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>
                    {r.name[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span>
                </div>
                <Stars rating={r.rating} size={14} />
              </div>
              <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6 }}>{r.text}</p>
              <p style={{ color: "#444", fontSize: 11, marginTop: 8 }}>{r.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CONTACTS ─── */}
      <section id="contacts-section" style={{ padding: "80px 20px 120px", maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <SectionTitle>Контакты</SectionTitle>
        <div className="glass" style={{ borderRadius: "var(--radius)", padding: 32 }}>
          <p style={{ color: "var(--text2)", textAlign: "center", marginBottom: 28, fontSize: 15, lineHeight: 1.6 }}>Свяжитесь с нами для заказа или консультации</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              {icon:"✈",label:"Telegram",value:contacts.telegram,color:"#0088cc"},
              {icon:"✆",label:"WhatsApp",value:contacts.whatsapp,color:"#25d366"},
              {icon:"✉",label:"Email",value:contacts.email,color:"#6c5ce7"},
              {icon:"📸",label:"Instagram",value:contacts.instagram,color:"#e1306c"},
              {icon:"▶",label:"YouTube",value:contacts.youtube,color:"#ff0000"},
              {icon:"💬",label:"VK",value:contacts.vk,color:"#4a76a8"},
            ].map(c => (
              <div key={c.label} style={{
                background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: "16px 20px",
                border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 14,
                transition: "transform 0.3s, border-color 0.3s", cursor: "pointer",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.borderColor=c.color+"44"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.borderColor="var(--border)"; }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: c.color+"15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{c.icon}</div>
                <div>
                  <p style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{c.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{c.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {["Telegram","WhatsApp"].map(label => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ width: 120, height: 120, borderRadius: 12, background: "var(--surface2)", border: "1px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--text2)", marginBottom: 6 }}>QR-код</div>
                <p style={{ fontSize: 11, color: "var(--text2)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ADMIN BTN ─── */}
      <div style={{ textAlign: "center", paddingBottom: 30, position: "relative", zIndex: 1 }}>
        <button onClick={() => setShowPasswordModal(true)} style={{
          background: "transparent", border: "none", color: "rgba(255,255,255,0.08)",
          fontSize: 10, cursor: "pointer", fontFamily: "'Manrope', sans-serif", transition: "color 0.3s",
        }}
        onMouseEnter={e => e.target.style.color="rgba(255,255,255,0.2)"}
        onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.08)"}
        >admin</button>
      </div>

      {/* ─── PASSWORD MODAL ─── */}
      {showPasswordModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)",
          display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.3s ease",
        }}
        onClick={() => { setShowPasswordModal(false); setPwdError(false); setPwdInput(""); }}
        >
          <div className="anim-scale-in" onClick={e => e.stopPropagation()} style={{
            background: "var(--surface)", borderRadius: "var(--radius)", padding: 32, width: 340, border: "1px solid var(--border)",
          }}>
            <h3 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 18, marginBottom: 20, textAlign: "center" }}>
              <span className="gradient-text">Вход в админ-панель</span>
            </h3>
            <input type="password" placeholder="Пароль" value={pwdInput}
              onChange={e => { setPwdInput(e.target.value); setPwdError(false); }}
              onKeyDown={e => e.key==="Enter" && handleLogin()}
              style={{...inputStyle, width: "100%", textAlign: "center", fontSize: 16, marginBottom: 12}} autoFocus
            />
            {pwdError && <p style={{ color: "#ff6b6b", fontSize: 12, textAlign: "center", marginBottom: 10 }}>Неверный пароль</p>}
            <Btn onClick={handleLogin} style={{ width: "100%", textAlign: "center" }}>Войти</Btn>
          </div>
        </div>
      )}
    </div>
  );
}
