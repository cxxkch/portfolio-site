import { useState, useEffect, useRef } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { createClient } from "@supabase/supabase-js";

const firebaseConfig = {
  apiKey: "AIzaSyBje6u4E1S5p1206S1S-v2WgHnn1pj93j8",
  authDomain: "portfolio-site-2e586.firebaseapp.com",
  projectId: "portfolio-site-2e586",
  storageBucket: "portfolio-site-2e586.firebasestorage.app",
  messagingSenderId: "372022229342",
  appId: "1:372022229342:web:6d7ec0d3fe12e9b62b37cf",
  measurementId: "G-52H42GT49K"
};

// ═══════════════════════════════════════════════════════════════════
// 📦 SUPABASE — ЗАМЕНИ НА СВОИ ДАННЫЕ
// ═══════════════════════════════════════════════════════════════════
const SUPABASE_URL = "https://xhypywgikxwuytcixqvm.supabase.co"; // https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = "sb_publishable_xCQv30fhVzncUo8tyxaCCg_JRMZDips";
const SUPABASE_BUCKET = "portfolio"; // название бакета

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Firebase helpers ────────────────────────────────────────────
const COL = "site";
const loadDoc = async (k, fb) => { try { const s = await getDoc(doc(db, COL, k)); return s.exists() ? s.data().value : fb; } catch { return fb; } };
const saveDoc = async (k, v) => { try { await setDoc(doc(db, COL, k), { value: v }); } catch (e) { console.error(e); } };
const subDoc = (k, cb) => onSnapshot(doc(db, COL, k), s => { if (s.exists()) cb(s.data().value); });

// ─── Supabase upload helper ─────────────────────────────────────
const uploadFile = async (file, folder = "uploads") => {
  const ext = file.name.split(".").pop();
  const name = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).upload(name, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(data.path);
  return urlData.publicUrl;
};

// ─── Defaults ────────────────────────────────────────────────────
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
  { id: 1, name: "Канал «Техно»", before: { subs: "12K", views: "45K" }, after: { subs: "89K", views: "1.2M" }, points: [{ label: "Янв", views: 4500, thumb: "" }, { label: "Фев", views: 6200, thumb: "" }, { label: "Мар", views: 12000, thumb: "" }, { label: "Апр", views: 28000, thumb: "" }, { label: "Май", views: 65000, thumb: "" }, { label: "Июн", views: 120000, thumb: "" }] },
  { id: 2, name: "Канал «Лайфстайл»", before: { subs: "3K", views: "8K" }, after: { subs: "45K", views: "560K" }, points: [{ label: "Янв", views: 800, thumb: "" }, { label: "Фев", views: 1500, thumb: "" }, { label: "Мар", views: 5600, thumb: "" }, { label: "Апр", views: 18000, thumb: "" }, { label: "Май", views: 42000, thumb: "" }, { label: "Июн", views: 56000, thumb: "" }] },
];
const DEFAULT_CONTACTS = { telegram: "@yourstudio", whatsapp: "+7 (999) 123-45-67", email: "hello@studio.com", instagram: "@yourstudio", youtube: "YourStudio", vk: "yourstudio" };
const DEFAULT_REVIEWS = [
  { id: 1, name: "Алексей", rating: 5, text: "Потрясающее качество монтажа! Очень доволен результатом.", date: "2025-12-01" },
  { id: 2, name: "Мария", rating: 5, text: "Ребята сделали крутой шоурил для моего канала.", date: "2025-11-15" },
  { id: 3, name: "Дмитрий", rating: 4, text: "Хорошая работа, рекомендую!", date: "2025-10-20" },
];
const ADMIN_PASSWORD = "admin123";

// ─── CSS ─────────────────────────────────────────────────────────
const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#08080c;--surface:#111118;--surface2:#1a1a24;--border:#2a2a3a;--text:#eeeef0;--text2:#8888a0;--accent:#6c5ce7;--accent2:#a29bfe;--gradient1:linear-gradient(135deg,#6c5ce7,#a29bfe,#fd79a8);--radius:16px;--radius-sm:10px}
html{scroll-behavior:smooth}body{background:var(--bg);color:var(--text);font-family:'Manrope',sans-serif;overflow-x:hidden}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes rotate{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.anim-fade-up{animation:fadeUp .7s ease-out both}
.anim-scale-in{animation:scaleIn .6s ease-out both}
.anim-slide-down{animation:slideDown .5s ease-out both}
.gradient-text{background:var(--gradient1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.glass{background:rgba(17,17,24,.7);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.06)}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--accent);border-radius:3px}
input,textarea,select{font-family:'Manrope',sans-serif}
`;

// ─── Components ──────────────────────────────────────────────────
const Stars = ({ rating, onRate, size = 18 }) => (<div style={{ display: "flex", gap: 4 }}>{[1, 2, 3, 4, 5].map(i => (<span key={i} onClick={() => onRate && onRate(i)} style={{ cursor: onRate ? "pointer" : "default", fontSize: size, color: i <= rating ? "#ffd700" : "#333", transition: "color .2s,transform .2s", display: "inline-block" }} onMouseEnter={e => onRate && (e.target.style.transform = "scale(1.3)")} onMouseLeave={e => onRate && (e.target.style.transform = "scale(1)")}>★</span>))}</div>);
const SectionTitle = ({ children, id }) => (<h2 id={id} style={{ fontFamily: "'Unbounded',sans-serif", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 700, marginBottom: 40, textAlign: "center", letterSpacing: "-.02em" }}><span className="gradient-text">{children}</span></h2>);

const Btn = ({ children, onClick, variant = "primary", style: s = {}, disabled = false }) => {
  const base = { fontFamily: "'Unbounded',sans-serif", fontWeight: 500, fontSize: 14, padding: "14px 32px", borderRadius: 50, border: "none", cursor: disabled ? "not-allowed" : "pointer", transition: "all .35s cubic-bezier(.4,0,.2,1)", letterSpacing: ".01em", opacity: disabled ? .5 : 1 };
  const vars = { primary: { background: "var(--gradient1)", backgroundSize: "200% 200%", animation: "gradientShift 4s ease infinite", color: "#fff", boxShadow: "0 4px 24px rgba(108,92,231,.35)" }, secondary: { background: "transparent", color: "var(--text)", border: "1px solid var(--border)" }, ghost: { background: "rgba(108,92,231,.1)", color: "var(--accent2)", border: "1px solid rgba(108,92,231,.2)" } };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...vars[variant], ...s }} onMouseEnter={e => { if (disabled) return; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 32px rgba(108,92,231,.45)"; }} onMouseLeave={e => { if (disabled) return; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = variant === "primary" ? "0 4px 24px rgba(108,92,231,.35)" : "none"; }}>{children}</button>;
};

// ─── File Upload Button ──────────────────────────────────────────
const FileUploadBtn = ({ onUpload, accept = "video/*,image/*", label = "Загрузить файл" }) => {
  const ref = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");

  const handle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(`Загрузка: ${file.name}...`);
    try {
      const url = await uploadFile(file, accept.includes("video") ? "videos" : "images");
      onUpload(url);
      setProgress("Готово!");
      setTimeout(() => setProgress(""), 2000);
    } catch (err) {
      console.error(err);
      setProgress("Ошибка загрузки");
      setTimeout(() => setProgress(""), 3000);
    }
    setUploading(false);
    if (ref.current) ref.current.value = "";
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <input ref={ref} type="file" accept={accept} onChange={handle} style={{ display: "none" }} />
      <button
        onClick={() => ref.current?.click()}
        disabled={uploading}
        style={{
          padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
          fontFamily: "'Manrope',sans-serif", cursor: uploading ? "wait" : "pointer",
          background: "rgba(108,92,231,.12)", color: "var(--accent2)",
          border: "1px solid rgba(108,92,231,.25)", transition: "all .3s",
          opacity: uploading ? .6 : 1,
        }}
      >
        {uploading ? "⏳" : "📁"} {label}
      </button>
      {progress && <span style={{ fontSize: 11, color: progress === "Готово!" ? "#25d366" : progress.includes("Ошибка") ? "#ff6b6b" : "var(--text2)" }}>{progress}</span>}
    </div>
  );
};

// ─── Styles ──────────────────────────────────────────────────────
const inputStyle = { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", color: "var(--text)", fontSize: 14, outline: "none", width: "100%", transition: "border-color .3s" };
const labelStyle = { display: "block", fontSize: 11, fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 };
const iconBtnStyle = { background: "transparent", border: "none", cursor: "pointer", fontSize: 16, padding: 6, fontFamily: "'Manrope',sans-serif" };

// ─── MAIN APP ────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwdInput, setPwdInput] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => { (async () => { try { const [r, w, ch, co, sn, lg] = await Promise.all([loadDoc("reviews", DEFAULT_REVIEWS), loadDoc("works", DEFAULT_WORKS), loadDoc("channels", DEFAULT_CHANNELS), loadDoc("contacts", DEFAULT_CONTACTS), loadDoc("siteName", "STUDIO"), loadDoc("logo", "")]); setReviews(r); setWorks(w); setChannels(ch); setContacts(co); setSiteName(sn); setLogoUrl(lg); } catch (e) { console.error(e); } setLoaded(true); })(); }, []);
  useEffect(() => { const u = [subDoc("reviews", setReviews), subDoc("works", setWorks), subDoc("channels", setChannels), subDoc("contacts", setContacts), subDoc("siteName", setSiteName), subDoc("logo", setLogoUrl)]; return () => u.forEach(f => f()); }, []);

  const saveReviews = async r => { setReviews(r); await saveDoc("reviews", r); };
  const saveWorks = async w => { setWorks(w); await saveDoc("works", w); };
  const saveChannels = async c => { setChannels(c); await saveDoc("channels", c); };
  const saveContacts = async c => { setContacts(c); await saveDoc("contacts", c); };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0";
  const totalWorks = works.reels.length + works.motion.length + works.youtube.length;
  const scrollTo = id => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const submitReview = async () => { if (!reviewName.trim() || !reviewText.trim()) return; setSaving(true); const newR = [{ id: Date.now(), name: reviewName, rating: reviewRating, text: reviewText, date: new Date().toISOString().slice(0, 10) }, ...reviews]; await saveReviews(newR); setReviewName(""); setReviewRating(5); setReviewText(""); setSaving(false); };
  const handleLogin = () => { if (pwdInput === ADMIN_PASSWORD) { setIsAdmin(true); setShowPasswordModal(false); setPwdInput(""); setPwdError(false); } else setPwdError(true); };

  if (!loaded) return (<div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><style>{globalStyles}</style><div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "rotate .8s linear infinite" }} /></div>);

  // ════════════════════════════════════════════════════════════════
  // ADMIN
  // ════════════════════════════════════════════════════════════════
  if (isAdmin) return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "30px 20px" }}><style>{globalStyles}</style><div style={{ maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 24 }} className="gradient-text">Админ-панель</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: 11, color: "#25d366" }}>● Online</span><Btn variant="secondary" onClick={() => setIsAdmin(false)}>← На сайт</Btn></div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
        {[["works", "Работы"], ["reviews", "Отзывы"], ["channels", "Каналы"], ["contacts", "Контакты"], ["settings", "Настройки"]].map(([k, l]) => (<button key={k} onClick={() => setAdminTab(k)} style={{ padding: "10px 20px", borderRadius: 50, border: "1px solid", borderColor: adminTab === k ? "var(--accent)" : "var(--border)", background: adminTab === k ? "rgba(108,92,231,.15)" : "transparent", color: adminTab === k ? "var(--accent2)" : "var(--text2)", cursor: "pointer", fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 13, transition: "all .3s" }}>{l}</button>))}
      </div>

      {/* ── Works ── */}
      {adminTab === "works" && <div className="anim-fade-up">
        {["reels", "motion", "youtube"].map(cat => (<div key={cat} style={{ marginBottom: 40 }}>
          <h3 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 18, marginBottom: 16 }}>{cat === "youtube" ? "YouTube" : cat === "reels" ? "Reels" : "Моушн"}</h3>
          {works[cat].map((item, idx) => (<div key={item.id} style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: 16, marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
              <input placeholder="Название" value={item.title} onChange={e => { const nw = { ...works }; nw[cat] = [...nw[cat]]; nw[cat][idx] = { ...nw[cat][idx], title: e.target.value }; saveWorks(nw); }} style={inputStyle} />
              <input placeholder="Цена" value={item.price} onChange={e => { const nw = { ...works }; nw[cat] = [...nw[cat]]; nw[cat][idx] = { ...nw[cat][idx], price: e.target.value }; saveWorks(nw); }} style={{ ...inputStyle, width: 120 }} />
              <button onClick={() => { const nw = { ...works }; nw[cat] = nw[cat].filter((_, i) => i !== idx); saveWorks(nw); }} style={{ ...iconBtnStyle, color: "#ff6b6b" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <FileUploadBtn
                accept="video/*"
                label="Загрузить видео"
                onUpload={url => { const nw = { ...works }; nw[cat] = [...nw[cat]]; nw[cat][idx] = { ...nw[cat][idx], video: url }; saveWorks(nw); }}
              />
              {item.video && <span style={{ fontSize: 11, color: "#25d366" }}>✓ Видео загружено</span>}
              {item.video && <button onClick={() => { const nw = { ...works }; nw[cat] = [...nw[cat]]; nw[cat][idx] = { ...nw[cat][idx], video: "" }; saveWorks(nw); }} style={{ ...iconBtnStyle, color: "#ff6b6b", fontSize: 11 }}>Удалить видео</button>}
            </div>
            {item.video && <div style={{ marginTop: 8 }}><video src={item.video} style={{ maxWidth: 200, maxHeight: 120, borderRadius: 8, border: "1px solid var(--border)" }} controls /></div>}
          </div>))}
          <button onClick={() => { const nw = { ...works }; nw[cat] = [...nw[cat], { id: Date.now(), title: "", video: "", price: "" }]; saveWorks(nw); }} style={{ ...iconBtnStyle, color: "var(--accent2)", fontSize: 13, padding: "8px 16px", border: "1px dashed var(--border)", borderRadius: 8 }}>+ Добавить</button>
        </div>))}
      </div>}

      {/* ── Reviews ── */}
      {adminTab === "reviews" && <div className="anim-fade-up">
        {reviews.length === 0 && <p style={{ color: "var(--text2)", textAlign: "center", padding: 40 }}>Отзывов пока нет</p>}
        {reviews.map((r, idx) => (<div key={r.id} style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: 16, marginBottom: 10, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: "var(--text2)", fontSize: 13, minWidth: 80 }}>{r.name}</span>
          <Stars rating={r.rating} size={14} />
          <span style={{ color: "var(--text2)", fontSize: 12, flex: 1 }}>{r.text.slice(0, 60)}...</span>
          <span style={{ color: "#444", fontSize: 11 }}>{r.date}</span>
          <button onClick={() => saveReviews(reviews.filter((_, i) => i !== idx))} style={{ ...iconBtnStyle, color: "#ff6b6b" }}>✕</button>
        </div>))}
      </div>}

      {/* ── Channels ── */}
      {adminTab === "channels" && <div className="anim-fade-up">
        {channels.map((ch, chIdx) => (<div key={ch.id} style={{ background: "var(--surface)", borderRadius: "var(--radius)", padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
            <input value={ch.name} onChange={e => { const nc = [...channels]; nc[chIdx] = { ...nc[chIdx], name: e.target.value }; saveChannels(nc); }} style={{ ...inputStyle, fontFamily: "'Unbounded',sans-serif", fontWeight: 600, fontSize: 16, flex: 1 }} placeholder="Название канала" />
            <button onClick={() => saveChannels(channels.filter((_, i) => i !== chIdx))} style={{ ...iconBtnStyle, color: "#ff6b6b", fontSize: 18 }}>✕</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div><label style={labelStyle}>До — Подписчики</label><input value={ch.before.subs} onChange={e => { const nc = [...channels]; nc[chIdx] = { ...nc[chIdx], before: { ...nc[chIdx].before, subs: e.target.value } }; saveChannels(nc); }} style={inputStyle} /></div>
            <div><label style={labelStyle}>До — Просмотры</label><input value={ch.before.views} onChange={e => { const nc = [...channels]; nc[chIdx] = { ...nc[chIdx], before: { ...nc[chIdx].before, views: e.target.value } }; saveChannels(nc); }} style={inputStyle} /></div>
            <div><label style={labelStyle}>После — Подписчики</label><input value={ch.after.subs} onChange={e => { const nc = [...channels]; nc[chIdx] = { ...nc[chIdx], after: { ...nc[chIdx].after, subs: e.target.value } }; saveChannels(nc); }} style={inputStyle} /></div>
            <div><label style={labelStyle}>После — Просмотры</label><input value={ch.after.views} onChange={e => { const nc = [...channels]; nc[chIdx] = { ...nc[chIdx], after: { ...nc[chIdx].after, views: e.target.value } }; saveChannels(nc); }} style={inputStyle} /></div>
          </div>
          <h4 style={{ color: "var(--text2)", fontSize: 13, marginBottom: 10 }}>Точки графика</h4>
          {ch.points.map((pt, ptIdx) => (<div key={ptIdx} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center", flexWrap: "wrap" }}>
            <input placeholder="Метка" value={pt.label} onChange={e => { const nc = [...channels]; const pts = [...nc[chIdx].points]; pts[ptIdx] = { ...pts[ptIdx], label: e.target.value }; nc[chIdx] = { ...nc[chIdx], points: pts }; saveChannels(nc); }} style={{ ...inputStyle, width: 80 }} />
            <input placeholder="Просмотры" type="number" value={pt.views} onChange={e => { const nc = [...channels]; const pts = [...nc[chIdx].points]; pts[ptIdx] = { ...pts[ptIdx], views: Number(e.target.value) }; nc[chIdx] = { ...nc[chIdx], points: pts }; saveChannels(nc); }} style={{ ...inputStyle, width: 120 }} />
            <FileUploadBtn
              accept="image/*"
              label="Превью"
              onUpload={url => { const nc = [...channels]; const pts = [...nc[chIdx].points]; pts[ptIdx] = { ...pts[ptIdx], thumb: url }; nc[chIdx] = { ...nc[chIdx], points: pts }; saveChannels(nc); }}
            />
            {pt.thumb && <img src={pt.thumb} alt="" style={{ width: 50, height: 30, objectFit: "cover", borderRadius: 4, border: "1px solid var(--border)" }} />}
            <button onClick={() => { const nc = [...channels]; nc[chIdx] = { ...nc[chIdx], points: nc[chIdx].points.filter((_, i) => i !== ptIdx) }; saveChannels(nc); }} style={{ ...iconBtnStyle, color: "#ff6b6b" }}>✕</button>
          </div>))}
          <button onClick={() => { const nc = [...channels]; nc[chIdx] = { ...nc[chIdx], points: [...nc[chIdx].points, { label: "", views: 0, thumb: "" }] }; saveChannels(nc); }} style={{ ...iconBtnStyle, color: "var(--accent2)", fontSize: 12, marginTop: 6 }}>+ Точка</button>
        </div>))}
        <button onClick={() => saveChannels([...channels, { id: Date.now(), name: "Новый канал", before: { subs: "0", views: "0" }, after: { subs: "0", views: "0" }, points: [{ label: "Янв", views: 0, thumb: "" }] }])} style={{ ...iconBtnStyle, color: "var(--accent2)", fontSize: 13, padding: "10px 20px", border: "1px dashed var(--border)", borderRadius: 10 }}>+ Добавить канал</button>
      </div>}

      {/* ── Contacts ── */}
      {adminTab === "contacts" && <div className="anim-fade-up" style={{ background: "var(--surface)", borderRadius: "var(--radius)", padding: 24 }}>
        {Object.keys(contacts).map(key => (<div key={key} style={{ marginBottom: 14 }}><label style={labelStyle}>{key}</label><input value={contacts[key]} onChange={e => saveContacts({ ...contacts, [key]: e.target.value })} style={inputStyle} /></div>))}
      </div>}

      {/* ── Settings ── */}
      {adminTab === "settings" && <div className="anim-fade-up" style={{ background: "var(--surface)", borderRadius: "var(--radius)", padding: 24 }}>
        <div style={{ marginBottom: 14 }}><label style={labelStyle}>Название студии</label><input value={siteName} onChange={e => { setSiteName(e.target.value); saveDoc("siteName", e.target.value); }} style={inputStyle} /></div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Логотип</label>
          <FileUploadBtn accept="image/*" label="Загрузить логотип" onUpload={url => { setLogoUrl(url); saveDoc("logo", url); }} />
          {logoUrl && <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <img src={logoUrl} alt="logo" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
            <button onClick={() => { setLogoUrl(""); saveDoc("logo", ""); }} style={{ ...iconBtnStyle, color: "#ff6b6b", fontSize: 12 }}>Удалить</button>
          </div>}
        </div>
      </div>}
    </div></div>
  );

  // ════════════════════════════════════════════════════════════════
  // PUBLIC SITE
  // ════════════════════════════════════════════════════════════════
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", position: "relative", overflow: "hidden" }}><style>{globalStyles}</style>
      <div style={{ position: "fixed", top: -200, right: -200, width: 600, height: 600, background: "radial-gradient(circle,rgba(108,92,231,.08),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -300, left: -200, width: 700, height: 700, background: "radial-gradient(circle,rgba(253,121,168,.05),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Nav */}
      <button onClick={() => setMenuOpen(!menuOpen)} style={{ position: "fixed", top: 20, left: 20, zIndex: 1000, width: 44, height: 44, borderRadius: 12, background: "rgba(17,17,24,.8)", backdropFilter: "blur(20px)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, transition: "all .3s" }}>{[0, 1, 2].map(i => (<div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent2)", transition: "all .3s", transform: menuOpen ? `rotate(${i * 45}deg)` : "none" }} />))}</button>
      {menuOpen && <div className="anim-slide-down glass" style={{ position: "fixed", top: 72, left: 20, zIndex: 999, borderRadius: "var(--radius-sm)", padding: 8, minWidth: 200 }}>{[["reviews-section", "Отзывы"], ["channels-section", "Статистика каналов"], ["portfolio-section", "Портфолио"]].map(([id, label]) => (<button key={id} onClick={() => scrollTo(id)} style={{ display: "block", width: "100%", padding: "12px 16px", background: "transparent", border: "none", color: "var(--text)", textAlign: "left", cursor: "pointer", borderRadius: 8, fontFamily: "'Manrope',sans-serif", fontSize: 14, fontWeight: 500, transition: "background .2s" }} onMouseEnter={e => e.target.style.background = "rgba(108,92,231,.1)"} onMouseLeave={e => e.target.style.background = "transparent"}>{label}</button>))}</div>}

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px 60px", position: "relative", zIndex: 1 }}>
        <div className="anim-scale-in" style={{ width: 130, height: 130, borderRadius: "50%", background: logoUrl ? `url(${logoUrl}) center/cover` : "var(--gradient1)", backgroundSize: logoUrl ? "cover" : "200% 200%", animation: logoUrl ? "none" : "gradientShift 4s ease infinite", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 60px rgba(108,92,231,.3)", marginBottom: 24, fontSize: logoUrl ? 0 : 36, fontFamily: "'Unbounded',sans-serif", fontWeight: 800, color: "#fff" }}>{!logoUrl && siteName[0]}</div>
        <h1 className="anim-fade-up" style={{ fontFamily: "'Unbounded',sans-serif", fontSize: "clamp(2rem,6vw,3.4rem)", fontWeight: 800, textAlign: "center", marginBottom: 16, letterSpacing: "-.03em", animationDelay: ".15s" }}><span className="gradient-text">{siteName}</span></h1>
        <div className="anim-fade-up" style={{ animationDelay: ".3s", textAlign: "center", marginBottom: 8 }}><div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}><span style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Unbounded',sans-serif" }}>{avgRating}</span><Stars rating={Math.round(Number(avgRating))} size={22} /></div><p style={{ color: "var(--text2)", fontSize: 13 }}>на основе {reviews.length} отзывов</p></div>
        <p className="anim-fade-up" style={{ animationDelay: ".4s", color: "var(--text2)", fontSize: 15, marginBottom: 32 }}>{totalWorks} выполненных работ</p>
        <div className="anim-fade-up" style={{ animationDelay: ".5s", display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}><Btn onClick={() => scrollTo("portfolio-section")}>Портфолио</Btn><Btn variant="secondary" onClick={() => scrollTo("contacts-section")}>Заказать</Btn></div>
        <div style={{ position: "absolute", bottom: 30, animation: "float 2.5s ease-in-out infinite" }}><div style={{ width: 24, height: 40, borderRadius: 12, border: "2px solid var(--border)", display: "flex", justifyContent: "center", paddingTop: 8 }}><div style={{ width: 3, height: 8, borderRadius: 2, background: "var(--accent)", animation: "pulse 1.5s ease-in-out infinite" }} /></div></div>
      </section>

      {/* Portfolio */}
      <section id="portfolio-section" style={{ padding: "80px 20px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <SectionTitle>Портфолио</SectionTitle>
        {[{ key: "reels", label: "Reels" }, { key: "motion", label: "Моушн" }, { key: "youtube", label: "YouTube" }].map(({ key, label }) => (<div key={key} style={{ marginBottom: 56 }}>
          <h3 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 20, fontWeight: 600, marginBottom: 20 }}>{label}</h3>
          <div style={{ display: "grid", gridTemplateColumns: key === "youtube" ? "repeat(auto-fill,minmax(300px,1fr))" : "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
            {works[key].map((item, i) => (<div key={item.id} className="anim-fade-up" style={{ animationDelay: `${i * .08}s`, background: "var(--surface)", borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)", transition: "transform .35s cubic-bezier(.4,0,.2,1),box-shadow .35s" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(108,92,231,.15)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ aspectRatio: key === "youtube" ? "16/9" : "9/16", background: item.video ? "#000" : "linear-gradient(135deg,var(--surface2),var(--surface))", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {item.video ? <video src={item.video} style={{ width: "100%", height: "100%", objectFit: "cover" }} controls playsInline /> : <div style={{ color: "var(--text2)", fontSize: 13, textAlign: "center", padding: 20 }}><div style={{ fontSize: 32, marginBottom: 8, opacity: .3 }}>▶</div><span>Видео</span></div>}
              </div>
              <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{item.title}</span>
                {item.price && <span style={{ fontSize: 12, fontWeight: 700, background: "rgba(108,92,231,.12)", color: "var(--accent2)", padding: "4px 10px", borderRadius: 20 }}>{item.price}</span>}
              </div>
            </div>))}
          </div>
        </div>))}
      </section>

      {/* Channels */}
      <section id="channels-section" style={{ padding: "80px 20px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <SectionTitle>Статистика каналов</SectionTitle>
        {channels.map((ch, idx) => (<div key={ch.id} className="anim-fade-up" style={{ animationDelay: `${idx * .12}s`, background: "var(--surface)", borderRadius: "var(--radius)", padding: "28px 24px", marginBottom: 32, border: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 20 }}>{ch.name}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            <div style={{ background: "rgba(255,107,107,.06)", borderRadius: "var(--radius-sm)", padding: 16, border: "1px solid rgba(255,107,107,.1)" }}><p style={{ color: "#ff6b6b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>До</p><p style={{ fontSize: 13, color: "var(--text2)" }}>Подписчики: <strong style={{ color: "var(--text)" }}>{ch.before.subs}</strong></p><p style={{ fontSize: 13, color: "var(--text2)" }}>Просмотры: <strong style={{ color: "var(--text)" }}>{ch.before.views}</strong></p></div>
            <div style={{ background: "rgba(108,92,231,.06)", borderRadius: "var(--radius-sm)", padding: 16, border: "1px solid rgba(108,92,231,.15)" }}><p style={{ color: "var(--accent2)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>После</p><p style={{ fontSize: 13, color: "var(--text2)" }}>Подписчики: <strong style={{ color: "var(--text)" }}>{ch.after.subs}</strong></p><p style={{ fontSize: 13, color: "var(--text2)" }}>Просмотры: <strong style={{ color: "var(--text)" }}>{ch.after.views}</strong></p></div>
          </div>
          <div style={{ height: 260, marginBottom: 16 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={ch.points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><defs><linearGradient id={`grad-${ch.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6c5ce7" stopOpacity={.4} /><stop offset="100%" stopColor="#6c5ce7" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="label" tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 13, color: "var(--text)" }} formatter={v => [v.toLocaleString(), "Просмотры"]} /><Area type="monotone" dataKey="views" stroke="#6c5ce7" strokeWidth={2.5} fill={`url(#grad-${ch.id})`} dot={{ r: 5, fill: "#6c5ce7", stroke: "#1a1a24", strokeWidth: 2 }} activeDot={{ r: 7 }} /></AreaChart></ResponsiveContainer></div>
          {ch.points.some(p => p.thumb) && <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>{ch.points.filter(p => p.thumb).map((p, i) => (<div key={i} style={{ minWidth: 80, textAlign: "center" }}><img src={p.thumb} alt="" style={{ width: 80, height: 45, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }} /><p style={{ fontSize: 10, color: "var(--text2)", marginTop: 4 }}>{p.label}</p></div>))}</div>}
        </div>))}
      </section>

      {/* Reviews */}
      <section id="reviews-section" style={{ padding: "80px 20px", maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <SectionTitle>Отзывы</SectionTitle>
        <div className="glass" style={{ borderRadius: "var(--radius)", padding: 24, marginBottom: 40 }}>
          <h4 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 15, marginBottom: 16 }}>Оставить отзыв</h4>
          <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}><input placeholder="Ваше имя" value={reviewName} onChange={e => setReviewName(e.target.value)} style={{ ...inputStyle, flex: 1, minWidth: 150 }} /><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 13, color: "var(--text2)" }}>Оценка:</span><Stars rating={reviewRating} onRate={setReviewRating} size={22} /></div></div>
          <textarea placeholder="Напишите отзыв..." value={reviewText} onChange={e => setReviewText(e.target.value)} rows={3} style={{ ...inputStyle, width: "100%", resize: "vertical", marginBottom: 12 }} />
          <Btn onClick={submitReview} disabled={saving} style={{ fontSize: 13, padding: "10px 24px" }}>{saving ? "Отправка..." : "Отправить"}</Btn>
        </div>
        <div style={{ display: "grid", gap: 14 }}>{reviews.map((r, i) => (<div key={r.id} className="anim-fade-up" style={{ animationDelay: `${i * .06}s`, background: "var(--surface)", borderRadius: "var(--radius)", padding: "20px 24px", border: "1px solid var(--border)", transition: "border-color .3s" }} onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(108,92,231,.3)"} onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--gradient1)", backgroundSize: "200% 200%", animation: "gradientShift 4s ease infinite", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>{r.name[0]?.toUpperCase()}</div><span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span></div><Stars rating={r.rating} size={14} /></div>
          <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6 }}>{r.text}</p>
          <p style={{ color: "#444", fontSize: 11, marginTop: 8 }}>{r.date}</p>
        </div>))}</div>
      </section>

      {/* Contacts */}
      <section id="contacts-section" style={{ padding: "80px 20px 120px", maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <SectionTitle>Контакты</SectionTitle>
        <div className="glass" style={{ borderRadius: "var(--radius)", padding: 32 }}>
          <p style={{ color: "var(--text2)", textAlign: "center", marginBottom: 28, fontSize: 15, lineHeight: 1.6 }}>Свяжитесь с нами для заказа или консультации</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginBottom: 32 }}>
            {[{ icon: "✈", label: "Telegram", value: contacts.telegram, color: "#0088cc" }, { icon: "✆", label: "WhatsApp", value: contacts.whatsapp, color: "#25d366" }, { icon: "✉", label: "Email", value: contacts.email, color: "#6c5ce7" }, { icon: "📸", label: "Instagram", value: contacts.instagram, color: "#e1306c" }, { icon: "▶", label: "YouTube", value: contacts.youtube, color: "#ff0000" }, { icon: "💬", label: "VK", value: contacts.vk, color: "#4a76a8" }].map(c => (<div key={c.label} style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: "16px 20px", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 14, transition: "transform .3s,border-color .3s", cursor: "pointer" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = c.color + "44"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: c.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{c.icon}</div>
              <div><p style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: .5 }}>{c.label}</p><p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{c.value}</p></div>
            </div>))}
          </div>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>{["Telegram", "WhatsApp"].map(label => (<div key={label} style={{ textAlign: "center" }}><div style={{ width: 120, height: 120, borderRadius: 12, background: "var(--surface2)", border: "1px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--text2)", marginBottom: 6 }}>QR-код</div><p style={{ fontSize: 11, color: "var(--text2)" }}>{label}</p></div>))}</div>
        </div>
      </section>

      {/* Admin btn */}
      <div style={{ textAlign: "center", paddingBottom: 30, position: "relative", zIndex: 1 }}><button onClick={() => setShowPasswordModal(true)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,.08)", fontSize: 10, cursor: "pointer", fontFamily: "'Manrope',sans-serif", transition: "color .3s" }} onMouseEnter={e => e.target.style.color = "rgba(255,255,255,.2)"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.08)"}>admin</button></div>

      {/* Password modal */}
      {showPasswordModal && <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,.7)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn .3s ease" }} onClick={() => { setShowPasswordModal(false); setPwdError(false); setPwdInput(""); }}>
        <div className="anim-scale-in" onClick={e => e.stopPropagation()} style={{ background: "var(--surface)", borderRadius: "var(--radius)", padding: 32, width: 340, border: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 18, marginBottom: 20, textAlign: "center" }}><span className="gradient-text">Вход в админ-панель</span></h3>
          <input type="password" placeholder="Пароль" value={pwdInput} onChange={e => { setPwdInput(e.target.value); setPwdError(false); }} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ ...inputStyle, width: "100%", textAlign: "center", fontSize: 16, marginBottom: 12 }} autoFocus />
          {pwdError && <p style={{ color: "#ff6b6b", fontSize: 12, textAlign: "center", marginBottom: 10 }}>Неверный пароль</p>}
          <Btn onClick={handleLogin} style={{ width: "100%", textAlign: "center" }}>Войти</Btn>
        </div>
      </div>}
    </div>
  );
}
