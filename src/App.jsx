import React, { useState, useMemo, useRef } from "react";
import {
  QrCode, User, Users, ShieldCheck, LogOut, CheckCircle2, XCircle, Clock3,
  Download, Sparkles, Plus, Trash2, AlertTriangle, ChevronRight, GraduationCap,
  ClipboardList, LayoutGrid, ScanLine, Mail, ArrowRight, RefreshCw, BookOpen
} from "lucide-react";

/* ============================================================
   THEME — "Roll Call": a chalkboard ledger, not a SaaS dashboard.
   Deep chalkboard green-black, brass chalk-gold accent, ledger mono for data.
   ============================================================ */
const T = {
  bg: "#12201C",
  bgSoft: "#16261F",
  panel: "#1B2E27",
  panelRaised: "#213A31",
  border: "#2C453A",
  borderSoft: "#233A31",
  text: "#EEE9DC",
  textMuted: "#9FB3A6",
  textFaint: "#6C8477",
  gold: "#E3B24E",
  goldDim: "#8A6F30",
  sage: "#74AC8B",
  sageDim: "#2C4436",
  clay: "#D98A4E",
  clayDim: "#4A3624",
  red: "#D9614F",
  redDim: "#4A2A26",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
`;

const SUBJECTS = [
  { id: "ds", name: "Data Structures", faculty: "Dr. Rakesh Iyer" },
  { id: "os", name: "Operating Systems", faculty: "Dr. Priya Nair" },
  { id: "dbms", name: "Database Systems", faculty: "Prof. Arjun Verma" },
  { id: "cn", name: "Computer Networks", faculty: "Dr. Rakesh Iyer" },
  { id: "ai", name: "Artificial Intelligence", faculty: "Prof. Sana Sheikh" },
];

const FACULTY = [
  { id: "f1", name: "Dr. Rakesh Iyer", email: "rakesh.iyer@college.edu" },
  { id: "f2", name: "Dr. Priya Nair", email: "priya.nair@college.edu" },
  { id: "f3", name: "Prof. Arjun Verma", email: "arjun.verma@college.edu" },
  { id: "f4", name: "Prof. Sana Sheikh", email: "sana.sheikh@college.edu" },
];

const seedAttendance = () => ({
  ds: { p: 18, t: 20 }, os: { p: 14, t: 20 }, dbms: { p: 19, t: 20 },
  cn: { p: 12, t: 20 }, ai: { p: 17, t: 20 },
});

const INITIAL_STUDENTS = [
  { id: 1, roll: "CS101", name: "Aarav Mehta", email: "aarav.m@college.edu", attendance: { ds:{p:18,t:20}, os:{p:14,t:20}, dbms:{p:19,t:20}, cn:{p:12,t:20}, ai:{p:17,t:20} } },
  { id: 2, roll: "CS102", name: "Diya Kapoor", email: "diya.k@college.edu", attendance: { ds:{p:20,t:20}, os:{p:19,t:20}, dbms:{p:18,t:20}, cn:{p:17,t:20}, ai:{p:20,t:20} } },
  { id: 3, roll: "CS103", name: "Rohan Sharma", email: "rohan.s@college.edu", attendance: { ds:{p:11,t:20}, os:{p:9,t:20}, dbms:{p:13,t:20}, cn:{p:10,t:20}, ai:{p:12,t:20} } },
  { id: 4, roll: "CS104", name: "Ishita Rao", email: "ishita.r@college.edu", attendance: { ds:{p:16,t:20}, os:{p:15,t:20}, dbms:{p:17,t:20}, cn:{p:14,t:20}, ai:{p:16,t:20} } },
  { id: 5, roll: "CS105", name: "Kabir Malhotra", email: "kabir.m@college.edu", attendance: { ds:{p:13,t:20}, os:{p:12,t:20}, dbms:{p:10,t:20}, cn:{p:11,t:20}, ai:{p:14,t:20} } },
  { id: 6, roll: "CS106", name: "Ananya Joshi", email: "ananya.j@college.edu", attendance: { ds:{p:19,t:20}, os:{p:18,t:20}, dbms:{p:20,t:20}, cn:{p:19,t:20}, ai:{p:18,t:20} } },
  { id: 7, roll: "CS107", name: "Vivaan Gupta", email: "vivaan.g@college.edu", attendance: { ds:{p:9,t:20}, os:{p:8,t:20}, dbms:{p:11,t:20}, cn:{p:7,t:20}, ai:{p:10,t:20} } },
  { id: 8, roll: "CS108", name: "Sara Khan", email: "sara.k@college.edu", attendance: { ds:{p:15,t:20}, os:{p:16,t:20}, dbms:{p:15,t:20}, cn:{p:13,t:20}, ai:{p:15,t:20} } },
  { id: 9, roll: "CS109", name: "Yash Patel", email: "yash.p@college.edu", attendance: { ds:{p:17,t:20}, os:{p:11,t:20}, dbms:{p:16,t:20}, cn:{p:15,t:20} , ai:{p:13,t:20} } },
  { id: 10, roll: "CS110", name: "Meera Nambiar", email: "meera.n@college.edu", attendance: { ds:{p:20,t:20}, os:{p:17,t:20}, dbms:{p:19,t:20}, cn:{p:18,t:20}, ai:{p:19,t:20} } },
  { id: 11, roll: "CS111", name: "Devansh Rathi", email: "devansh.r@college.edu", attendance: { ds:{p:10,t:20}, os:{p:13,t:20}, dbms:{p:9,t:20}, cn:{p:12,t:20}, ai:{p:11,t:20} } },
  { id: 12, roll: "CS112", name: "Priya Chatterjee", email: "priya.c@college.edu", attendance: { ds:{p:18,t:20}, os:{p:19,t:20}, dbms:{p:17,t:20}, cn:{p:16,t:20}, ai:{p:18,t:20} } },
];

const pct = (p, t) => (t === 0 ? 0 : Math.round((p / t) * 1000) / 10);
const colorFor = (pc) => (pc < 75 ? T.red : pc < 85 ? T.clay : T.sage);
const bgDimFor = (pc) => (pc < 75 ? T.redDim : pc < 85 ? T.clayDim : T.sageDim);

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/* ---------- pseudo-QR (deterministic decorative grid, no external lib) ---------- */
function PseudoQR({ code, size = 168 }) {
  const n = 17;
  const cell = size / n;
  const seed = hashStr(code);
  const mods = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const inFinder =
        (x < 5 && y < 5) || (x > n - 6 && y < 5) || (x < 5 && y > n - 6);
      if (inFinder) continue;
      const v = (seed * (x + 1) * 31 + (y + 1) * 17 + x * y) % 97;
      if (v % 2 === 0) mods.push([x, y]);
    }
  }
  const Finder = ({ fx, fy }) => (
    <g>
      <rect x={fx * cell} y={fy * cell} width={5 * cell} height={5 * cell} fill={T.text} />
      <rect x={(fx + 1) * cell} y={(fy + 1) * cell} width={3 * cell} height={3 * cell} fill={T.bg} />
      <rect x={(fx + 1.7) * cell} y={(fy + 1.7) * cell} width={1.6 * cell} height={1.6 * cell} fill={T.text} />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 6 }}>
      <rect width={size} height={size} fill={T.text} />
      <rect x={cell} y={cell} width={size - cell * 2} height={size - cell * 2} fill={T.bg} />
      {mods.map(([x, y], i) => (
        <rect key={i} x={x * cell} y={y * cell} width={cell} height={cell} fill={T.text} />
      ))}
      <Finder fx={0} fy={0} />
      <Finder fx={n - 5} fy={0} />
      <Finder fx={0} fy={n - 5} />
    </svg>
  );
}

/* ---------- small UI atoms ---------- */
function Badge({ children, tone = "muted" }) {
  const map = {
    muted: { bg: T.panelRaised, fg: T.textMuted, bd: T.border },
    gold: { bg: "#3A2E15", fg: T.gold, bd: T.goldDim },
    sage: { bg: T.sageDim, fg: T.sage, bd: T.sage },
    red: { bg: T.redDim, fg: T.red, bd: T.red },
  };
  const s = map[tone];
  return (
    <span style={{ background: s.bg, color: s.fg, border: `1px solid ${s.bd}` }}
      className="px-2 py-0.5 rounded-full text-[11px] tracking-wide uppercase font-medium">
      {children}
    </span>
  );
}

function Card({ children, style, className = "" }) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{ background: T.panel, border: `1px solid ${T.border}`, ...style }}
    >
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", icon: Icon, className = "", type = "button", disabled }) {
  const styles = {
    primary: { background: T.gold, color: "#1B160A", border: `1px solid ${T.gold}` },
    ghost: { background: "transparent", color: T.text, border: `1px solid ${T.border}` },
    subtle: { background: T.panelRaised, color: T.text, border: `1px solid ${T.border}` },
    danger: { background: "transparent", color: T.red, border: `1px solid ${T.red}` },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-85 active:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={styles[variant]}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}

/* ============================================================
   LOGIN
   ============================================================ */
function Login({ onEnter }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");

  const roles = [
    { id: "student", label: "Student", icon: GraduationCap, desc: "Track your attendance & scan session QR codes" },
    { id: "faculty", label: "Faculty", icon: ClipboardList, desc: "Take attendance & generate session QR codes" },
    { id: "admin", label: "Admin", icon: ShieldCheck, desc: "Manage users & view college-wide attendance" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10" style={{ background: T.bg }}>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: T.gold }}>
            <BookOpen size={18} color="#1B160A" />
          </div>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", color: T.text }} className="text-lg leading-none font-semibold">Roll Call</div>
            <div style={{ color: T.textFaint }} className="text-[11px] tracking-widest uppercase">Attendance, taken in seconds</div>
          </div>
        </div>

        <Card className="p-6">
          <div style={{ fontFamily: "Fraunces, serif", color: T.text }} className="text-xl font-semibold mb-1">Sign in</div>
          <div style={{ color: T.textMuted }} className="text-sm mb-5">This demo simulates Google sign-in — enter any name to continue.</div>

          <label style={{ color: T.textMuted }} className="text-xs uppercase tracking-wide font-medium mb-1.5 block">Full name</label>
          <input
            value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aarav Mehta"
            className="w-full rounded-lg px-3.5 py-2.5 text-sm mb-4 outline-none"
            style={{ background: T.bgSoft, border: `1px solid ${T.border}`, color: T.text }}
          />
          <label style={{ color: T.textMuted }} className="text-xs uppercase tracking-wide font-medium mb-1.5 block">College email</label>
          <div className="relative mb-5">
            <Mail size={15} style={{ color: T.textFaint }} className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@college.edu"
              className="w-full rounded-lg pl-9 pr-3.5 py-2.5 text-sm outline-none"
              style={{ background: T.bgSoft, border: `1px solid ${T.border}`, color: T.text }}
            />
          </div>

          <div style={{ color: T.textMuted }} className="text-xs uppercase tracking-wide font-medium mb-2">Continue as</div>
          <div className="grid grid-cols-1 gap-2 mb-6">
            {roles.map((r) => (
              <button key={r.id} onClick={() => setRole(r.id)}
                className="text-left rounded-lg px-3.5 py-2.5 flex items-center gap-3 transition-colors"
                style={{
                  background: role === r.id ? "#2A2210" : T.bgSoft,
                  border: `1px solid ${role === r.id ? T.gold : T.border}`,
                }}>
                <r.icon size={18} color={role === r.id ? T.gold : T.textMuted} />
                <div className="flex-1">
                  <div style={{ color: role === r.id ? T.gold : T.text }} className="text-sm font-medium">{r.label}</div>
                  <div style={{ color: T.textFaint }} className="text-xs">{r.desc}</div>
                </div>
                {role === r.id && <CheckCircle2 size={16} color={T.gold} />}
              </button>
            ))}
          </div>

          <Btn className="w-full justify-center" onClick={() => onEnter({ name: name.trim() || "Guest User", email: email.trim() || "guest@college.edu", role })} icon={ArrowRight}>
            Continue
          </Btn>
          <div style={{ color: T.textFaint }} className="text-[11px] text-center mt-3">
            Google OAuth wiring goes here in production — this build swaps in your Firebase config.
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   SHARED: Reports
   ============================================================ */
function ReportsPanel({ sessions, students }) {
  const [subjFilter, setSubjFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      if (subjFilter !== "all" && s.subjectId !== subjFilter) return false;
      if (from && s.date < from) return false;
      if (to && s.date > to) return false;
      return true;
    }).sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [sessions, subjFilter, from, to]);

  const exportCSV = () => {
    const rows = [["Date", "Subject", "Present", "Absent", "Late", "Total", "Attendance %"]];
    filtered.forEach((s) => {
      const vals = Object.values(s.attendance || {});
      const present = vals.filter((v) => v === "present").length;
      const late = vals.filter((v) => v === "late").length;
      const absent = vals.filter((v) => v === "absent").length;
      const total = students.length;
      const p = total ? Math.round(((present + late) / total) * 1000) / 10 : 0;
      const subjName = SUBJECTS.find((sub) => sub.id === s.subjectId)?.name || s.subjectId;
      rows.push([s.date, subjName, present, absent, late, total, p]);
    });
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "attendance-report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3 mb-5">
        <div>
          <label style={{ color: T.textMuted }} className="text-xs uppercase tracking-wide block mb-1">Subject</label>
          <select value={subjFilter} onChange={(e) => setSubjFilter(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm outline-none" style={{ background: T.bgSoft, border: `1px solid ${T.border}`, color: T.text }}>
            <option value="all">All subjects</option>
            {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ color: T.textMuted }} className="text-xs uppercase tracking-wide block mb-1">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm outline-none" style={{ background: T.bgSoft, border: `1px solid ${T.border}`, color: T.text }} />
        </div>
        <div>
          <label style={{ color: T.textMuted }} className="text-xs uppercase tracking-wide block mb-1">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm outline-none" style={{ background: T.bgSoft, border: `1px solid ${T.border}`, color: T.text }} />
        </div>
        <Btn variant="subtle" icon={Download} onClick={exportCSV} className="ml-auto">Export CSV</Btn>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: T.bgSoft, color: T.textMuted }} className="text-left text-xs uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Present</th>
              <th className="px-4 py-3 font-medium">Late</th>
              <th className="px-4 py-3 font-medium">Absent</th>
              <th className="px-4 py-3 font-medium">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center" style={{ color: T.textFaint }}>No sessions in this range yet.</td></tr>
            )}
            {filtered.map((s) => {
              const vals = Object.values(s.attendance || {});
              const present = vals.filter((v) => v === "present").length;
              const late = vals.filter((v) => v === "late").length;
              const absent = vals.filter((v) => v === "absent").length;
              const total = students.length;
              const p = total ? pct(present + late, total) : 0;
              return (
                <tr key={s.id} style={{ borderTop: `1px solid ${T.borderSoft}` }}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: T.text }}>{s.date}</td>
                  <td className="px-4 py-3" style={{ color: T.text }}>{SUBJECTS.find((x) => x.id === s.subjectId)?.name}</td>
                  <td className="px-4 py-3 font-mono" style={{ color: T.sage }}>{present}</td>
                  <td className="px-4 py-3 font-mono" style={{ color: T.clay }}>{late}</td>
                  <td className="px-4 py-3 font-mono" style={{ color: T.red }}>{absent}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ color: colorFor(p), background: bgDimFor(p) }}>{p}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ============================================================
   FACULTY VIEW
   ============================================================ */
function FacultyView({ students, sessions, setSessions, setStudents, activeSession, setActiveSession }) {
  const [tab, setTab] = useState("take"); // take | qr | reports
  const [subject, setSubject] = useState(SUBJECTS[0].id);
  const [marks, setMarks] = useState(() => Object.fromEntries(students.map((s) => [s.id, "present"])));

  const cycle = (id) => {
    setMarks((m) => {
      const order = ["present", "late", "absent"];
      const next = order[(order.indexOf(m[id]) + 1) % order.length];
      return { ...m, [id]: next };
    });
  };

  const saveSession = () => {
    const session = {
      id: `sess-${Date.now()}`,
      subjectId: subject,
      date: todayISO(),
      code: `${subject.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      attendance: { ...marks },
      via: "manual",
    };
    setSessions((prev) => [session, ...prev]);
    setStudents((prev) => prev.map((st) => {
      const status = marks[st.id];
      const cur = st.attendance[subject] || { p: 0, t: 0 };
      const attended = status === "present" || status === "late";
      return { ...st, attendance: { ...st.attendance, [subject]: { p: cur.p + (attended ? 1 : 0), t: cur.t + 1 } } };
    }));
    setMarks(Object.fromEntries(students.map((s) => [s.id, "present"])));
  };

  const genQR = () => {
    const session = {
      id: `sess-${Date.now()}`,
      subjectId: subject,
      date: todayISO(),
      code: `${subject.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      attendance: {},
      via: "qr",
      open: true,
    };
    setSessions((prev) => [session, ...prev]);
    setActiveSession(session);
  };

  const closeSession = () => {
    if (!activeSession) return;
    setSessions((prev) => prev.map((s) => (s.id === activeSession.id ? { ...s, open: false } : s)));
    // finalize into student totals: anyone not scanned is absent
    setStudents((prev) => prev.map((st) => {
      const status = activeSession.attendance[st.id] || "absent";
      const cur = st.attendance[activeSession.subjectId] || { p: 0, t: 0 };
      const attended = status === "present" || status === "late";
      return { ...st, attendance: { ...st.attendance, [activeSession.subjectId]: { p: cur.p + (attended ? 1 : 0), t: cur.t + 1 } } };
    }));
    setActiveSession(null);
  };

  const liveSession = sessions.find((s) => activeSession && s.id === activeSession.id) || activeSession;
  const scannedCount = liveSession ? Object.keys(liveSession.attendance || {}).length : 0;

  return (
    <div>
      <TabRow tab={tab} setTab={setTab} tabs={[
        { id: "take", label: "Take Attendance", icon: ClipboardList },
        { id: "qr", label: "Generate QR", icon: QrCode },
        { id: "reports", label: "Reports", icon: LayoutGrid },
      ]} />

      {tab === "take" && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <div style={{ fontFamily: "Fraunces, serif", color: T.text }} className="text-lg font-semibold">Roll call — {todayISO()}</div>
              <div style={{ color: T.textMuted }} className="text-xs">Tap a student's status to cycle Present → Late → Absent</div>
            </div>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm outline-none" style={{ background: T.bgSoft, border: `1px solid ${T.border}`, color: T.text }}>
              {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="divide-y" style={{ borderColor: T.borderSoft }}>
            {students.map((st) => {
              const status = marks[st.id];
              const conf = {
                present: { icon: CheckCircle2, color: T.sage, bg: T.sageDim, label: "Present" },
                late: { icon: Clock3, color: T.clay, bg: T.clayDim, label: "Late" },
                absent: { icon: XCircle, color: T.red, bg: T.redDim, label: "Absent" },
              }[status];
              return (
                <div key={st.id} className="flex items-center justify-between py-2.5" style={{ borderTop: `1px solid ${T.borderSoft}` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono" style={{ background: T.panelRaised, color: T.textMuted }}>
                      {st.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div style={{ color: T.text }} className="text-sm font-medium">{st.name}</div>
                      <div style={{ color: T.textFaint }} className="text-xs font-mono">{st.roll}</div>
                    </div>
                  </div>
                  <button onClick={() => cycle(st.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: conf.bg, color: conf.color, border: `1px solid ${conf.color}` }}>
                    <conf.icon size={13} /> {conf.label}
                  </button>
                </div>
              );
            })}
          </div>

          <Btn className="mt-5" icon={CheckCircle2} onClick={saveSession}>Save session</Btn>
        </Card>
      )}

      {tab === "qr" && (
        <Card className="p-6">
          {!liveSession || liveSession.open === false ? (
            <div className="text-center py-6">
              <div style={{ fontFamily: "Fraunces, serif", color: T.text }} className="text-lg font-semibold mb-1">Start a self-check-in session</div>
              <div style={{ color: T.textMuted }} className="text-sm mb-5">Students scan the code (or enter it) to self-mark present.</div>
              <select value={subject} onChange={(e) => setSubject(e.target.value)}
                className="rounded-lg px-3 py-2 text-sm outline-none mb-4" style={{ background: T.bgSoft, border: `1px solid ${T.border}`, color: T.text }}>
                {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <div><Btn icon={QrCode} onClick={genQR}>Generate session QR</Btn></div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex flex-col items-center gap-3">
                <PseudoQR code={liveSession.code} />
                <div className="font-mono text-sm px-3 py-1 rounded" style={{ background: T.bgSoft, color: T.gold, border: `1px solid ${T.goldDim}` }}>{liveSession.code}</div>
              </div>
              <div className="flex-1 w-full">
                <div style={{ fontFamily: "Fraunces, serif", color: T.text }} className="text-lg font-semibold">{SUBJECTS.find((s) => s.id === liveSession.subjectId)?.name}</div>
                <div style={{ color: T.textMuted }} className="text-sm mb-4">Session live — {scannedCount} of {students.length} checked in</div>
                <div className="w-full h-2 rounded-full overflow-hidden mb-5" style={{ background: T.bgSoft }}>
                  <div className="h-full" style={{ width: `${(scannedCount / students.length) * 100}%`, background: T.gold }} />
                </div>
                <div className="max-h-40 overflow-auto space-y-1.5 mb-5 pr-1">
                  {students.filter((st) => liveSession.attendance[st.id]).map((st) => (
                    <div key={st.id} className="flex items-center gap-2 text-sm" style={{ color: T.text }}>
                      <CheckCircle2 size={14} color={T.sage} /> {st.name}
                    </div>
                  ))}
                  {scannedCount === 0 && <div style={{ color: T.textFaint }} className="text-sm">Waiting for students to scan…</div>}
                </div>
                <div className="flex gap-2">
                  <Btn variant="danger" onClick={closeSession}>Close session &amp; save</Btn>
                  <Btn variant="ghost" icon={RefreshCw} onClick={() => setActiveSession({ ...liveSession })}>Refresh</Btn>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {tab === "reports" && <ReportsPanel sessions={sessions} students={students} />}
    </div>
  );
}

/* ============================================================
   STUDENT VIEW
   ============================================================ */
function StudentView({ students, currentId, setCurrentId, sessions, setSessions, activeSession, setActiveSession }) {
  const [tab, setTab] = useState("dashboard");
  const [scanCode, setScanCode] = useState("");
  const [scanMsg, setScanMsg] = useState(null);
  const [aiLoading, setAiLoading] = useState(null);
  const [aiMsgs, setAiMsgs] = useState({});

  const student = students.find((s) => s.id === currentId) || students[0];

  const rows = SUBJECTS.map((sub) => {
    const rec = student.attendance[sub.id] || { p: 0, t: 0 };
    return { ...sub, p: rec.p, t: rec.t, pct: pct(rec.p, rec.t) };
  });

  const generateWarning = (row) => {
    setAiLoading(row.id);
    setTimeout(() => {
      const needed = Math.max(0, Math.ceil((0.75 * row.t - row.p) / 0.25));
      const msg = `Hi ${student.name.split(" ")[0]}, your attendance in ${row.name} is currently ${row.pct}% (${row.p}/${row.t} classes) — below the 75% requirement. If you attend the next ${needed} class${needed === 1 ? "" : "es"} in a row without missing any, you'll cross the threshold. Classes are held with ${row.faculty}; try setting a reminder before each session. Reach out to your faculty advisor if something is making it hard to attend — there may be options like makeup sessions.`;
      setAiMsgs((m) => ({ ...m, [row.id]: msg }));
      setAiLoading(null);
    }, 900);
  };

  const submitScan = () => {
    if (!activeSession || activeSession.open === false) {
      setScanMsg({ ok: false, text: "No active session with that code. Ask your faculty to generate a new QR." });
      return;
    }
    if (scanCode.trim().toUpperCase() !== activeSession.code) {
      setScanMsg({ ok: false, text: "That code doesn't match the live session. Double-check and try again." });
      return;
    }
    setSessions((prev) => prev.map((s) => s.id === activeSession.id ? { ...s, attendance: { ...s.attendance, [student.id]: "present" } } : s));
    setActiveSession((prev) => prev && ({ ...prev, attendance: { ...prev.attendance, [student.id]: "present" } }));
    setScanMsg({ ok: true, text: `Marked present for ${SUBJECTS.find((s) => s.id === activeSession.subjectId)?.name}.` });
    setScanCode("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <TabRow tab={tab} setTab={setTab} tabs={[
          { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
          { id: "scan", label: "Scan QR", icon: ScanLine },
        ]} />
        <select value={currentId} onChange={(e) => setCurrentId(Number(e.target.value))}
          className="rounded-lg px-3 py-2 text-sm outline-none" style={{ background: T.bgSoft, border: `1px solid ${T.border}`, color: T.text }}>
          {students.map((s) => <option key={s.id} value={s.id}>Viewing as: {s.name}</option>)}
        </select>
      </div>

      {tab === "dashboard" && (
        <div className="grid gap-4">
          {rows.map((row) => (
            <Card key={row.id} className="p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="min-w-[180px]">
                  <div style={{ color: T.text }} className="text-sm font-semibold">{row.name}</div>
                  <div style={{ color: T.textFaint }} className="text-xs">{row.faculty}</div>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: T.bgSoft }}>
                    <div className="h-full" style={{ width: `${row.pct}%`, background: colorFor(row.pct) }} />
                  </div>
                </div>
                <div className="font-mono text-sm px-2.5 py-1 rounded-md" style={{ color: colorFor(row.pct), background: bgDimFor(row.pct) }}>
                  {row.pct}% <span style={{ color: T.textFaint }}>({row.p}/{row.t})</span>
                </div>
                {row.pct < 75 && (
                  <Btn variant="subtle" icon={Sparkles} onClick={() => generateWarning(row)} disabled={aiLoading === row.id}>
                    {aiLoading === row.id ? "Generating…" : "AI warning"}
                  </Btn>
                )}
              </div>
              {row.pct < 75 && aiMsgs[row.id] && (
                <div className="mt-3 rounded-lg p-3 text-sm flex gap-2" style={{ background: T.redDim, border: `1px solid ${T.red}`, color: T.text }}>
                  <AlertTriangle size={16} color={T.red} className="shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge tone="red">Below 75%</Badge>
                      <span style={{ color: T.textFaint }} className="text-[10px] uppercase tracking-wide">AI-generated · Gemini (demo)</span>
                    </div>
                    {aiMsgs[row.id]}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {tab === "scan" && (
        <Card className="p-6 max-w-md mx-auto text-center">
          <ScanLine size={28} color={T.gold} className="mx-auto mb-3" />
          <div style={{ fontFamily: "Fraunces, serif", color: T.text }} className="text-lg font-semibold mb-1">Self check-in</div>
          <div style={{ color: T.textMuted }} className="text-sm mb-5">Scan your faculty's QR, or type the session code below.</div>
          <input value={scanCode} onChange={(e) => setScanCode(e.target.value)} placeholder="e.g. DS-4821"
            className="w-full text-center font-mono tracking-widest uppercase rounded-lg px-3.5 py-2.5 text-sm mb-3 outline-none"
            style={{ background: T.bgSoft, border: `1px solid ${T.border}`, color: T.text }} />
          <Btn className="w-full justify-center" icon={CheckCircle2} onClick={submitScan}>Mark present</Btn>
          {scanMsg && (
            <div className="mt-4 text-sm rounded-lg px-3 py-2" style={{
              background: scanMsg.ok ? T.sageDim : T.redDim,
              color: scanMsg.ok ? T.sage : T.red,
              border: `1px solid ${scanMsg.ok ? T.sage : T.red}`,
            }}>{scanMsg.text}</div>
          )}
          <div style={{ color: T.textFaint }} className="text-[11px] mt-4">Camera scanning connects here in production — this demo uses manual code entry.</div>
        </Card>
      )}
    </div>
  );
}

/* ============================================================
   ADMIN VIEW
   ============================================================ */
function AdminView({ students, setStudents, sessions }) {
  const [tab, setTab] = useState("users");
  const [newName, setNewName] = useState("");
  const [newRoll, setNewRoll] = useState("");
  const [faculty, setFaculty] = useState(FACULTY);
  const [newFacName, setNewFacName] = useState("");

  const addStudent = () => {
    if (!newName.trim() || !newRoll.trim()) return;
    setStudents((prev) => [...prev, {
      id: Date.now(), name: newName.trim(), roll: newRoll.trim().toUpperCase(),
      email: `${newName.trim().split(" ")[0].toLowerCase()}@college.edu`, attendance: seedZero(),
    }]);
    setNewName(""); setNewRoll("");
  };
  const seedZero = () => Object.fromEntries(SUBJECTS.map((s) => [s.id, { p: 0, t: 0 }]));
  const removeStudent = (id) => setStudents((prev) => prev.filter((s) => s.id !== id));
  const addFaculty = () => {
    if (!newFacName.trim()) return;
    setFaculty((prev) => [...prev, { id: `f${Date.now()}`, name: newFacName.trim(), email: `${newFacName.trim().split(" ")[0].toLowerCase()}@college.edu` }]);
    setNewFacName("");
  };
  const removeFaculty = (id) => setFaculty((prev) => prev.filter((f) => f.id !== id));

  const overallPct = (st) => {
    const vals = Object.values(st.attendance);
    const p = vals.reduce((a, v) => a + v.p, 0);
    const t = vals.reduce((a, v) => a + v.t, 0);
    return pct(p, t);
  };

  return (
    <div>
      <TabRow tab={tab} setTab={setTab} tabs={[
        { id: "users", label: "Manage Users", icon: Users },
        { id: "heatmap", label: "College Heatmap", icon: LayoutGrid },
        { id: "reports", label: "Reports", icon: ClipboardList },
      ]} />

      {tab === "users" && (
        <div className="grid md:grid-cols-2 gap-5">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div style={{ fontFamily: "Fraunces, serif", color: T.text }} className="font-semibold">Students · {students.length}</div>
            </div>
            <div className="flex gap-2 mb-4">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name"
                className="flex-1 rounded-lg px-3 py-2 text-sm outline-none" style={{ background: T.bgSoft, border: `1px solid ${T.border}`, color: T.text }} />
              <input value={newRoll} onChange={(e) => setNewRoll(e.target.value)} placeholder="Roll no."
                className="w-28 rounded-lg px-3 py-2 text-sm outline-none" style={{ background: T.bgSoft, border: `1px solid ${T.border}`, color: T.text }} />
              <Btn icon={Plus} onClick={addStudent}>Add</Btn>
            </div>
            <div className="max-h-80 overflow-auto space-y-1.5 pr-1">
              {students.map((s) => (
                <div key={s.id} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: T.bgSoft }}>
                  <div>
                    <div style={{ color: T.text }} className="text-sm">{s.name}</div>
                    <div style={{ color: T.textFaint }} className="text-xs font-mono">{s.roll}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ color: colorFor(overallPct(s)), background: bgDimFor(overallPct(s)) }}>{overallPct(s)}%</span>
                    <button onClick={() => removeStudent(s.id)}><Trash2 size={15} color={T.textFaint} /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div style={{ fontFamily: "Fraunces, serif", color: T.text }} className="font-semibold mb-3">Faculty · {faculty.length}</div>
            <div className="flex gap-2 mb-4">
              <input value={newFacName} onChange={(e) => setNewFacName(e.target.value)} placeholder="Name"
                className="flex-1 rounded-lg px-3 py-2 text-sm outline-none" style={{ background: T.bgSoft, border: `1px solid ${T.border}`, color: T.text }} />
              <Btn icon={Plus} onClick={addFaculty}>Add</Btn>
            </div>
            <div className="max-h-80 overflow-auto space-y-1.5 pr-1">
              {faculty.map((f) => (
                <div key={f.id} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: T.bgSoft }}>
                  <div>
                    <div style={{ color: T.text }} className="text-sm">{f.name}</div>
                    <div style={{ color: T.textFaint }} className="text-xs">{f.email}</div>
                  </div>
                  <button onClick={() => removeFaculty(f.id)}><Trash2 size={15} color={T.textFaint} /></button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "heatmap" && (
        <Card className="p-5 overflow-x-auto">
          <div style={{ fontFamily: "Fraunces, serif", color: T.text }} className="font-semibold mb-1">College-wide attendance heatmap</div>
          <div style={{ color: T.textMuted }} className="text-xs mb-4">Darker red = further below the 75% threshold</div>
          <table className="text-sm border-separate" style={{ borderSpacing: 4 }}>
            <thead>
              <tr>
                <th className="text-left px-2" style={{ color: T.textFaint }}></th>
                {SUBJECTS.map((s) => <th key={s.id} className="px-2 pb-2 text-xs font-medium" style={{ color: T.textMuted }}>{s.name.split(" ").map(w=>w[0]).join("")}</th>)}
              </tr>
            </thead>
            <tbody>
              {students.map((st) => (
                <tr key={st.id}>
                  <td className="pr-3 whitespace-nowrap text-xs" style={{ color: T.text }}>{st.name}</td>
                  {SUBJECTS.map((sub) => {
                    const rec = st.attendance[sub.id] || { p: 0, t: 0 };
                    const p = pct(rec.p, rec.t);
                    return (
                      <td key={sub.id} className="text-center rounded-md font-mono text-xs w-14 h-9" style={{ background: bgDimFor(p), color: colorFor(p) }} title={`${sub.name}: ${p}%`}>
                        {p}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "reports" && <ReportsPanel sessions={sessions} students={students} />}
    </div>
  );
}

/* ---------- Tabs ---------- */
function TabRow({ tab, setTab, tabs }) {
  return (
    <div className="flex gap-1.5 mb-5 flex-wrap">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => setTab(t.id)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: tab === t.id ? T.gold : T.panel,
            color: tab === t.id ? "#1B160A" : T.textMuted,
            border: `1px solid ${tab === t.id ? T.gold : T.border}`,
          }}>
          <t.icon size={15} /> {t.label}
        </button>
      ))}
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function App() {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [sessions, setSessions] = useState([
    { id: "seed1", subjectId: "cn", date: "2026-06-29", attendance: Object.fromEntries(INITIAL_STUDENTS.map((s,i)=>[s.id, i%4===0?"absent":i%5===0?"late":"present"])), via: "manual" },
    { id: "seed2", subjectId: "os", date: "2026-06-30", attendance: Object.fromEntries(INITIAL_STUDENTS.map((s,i)=>[s.id, i%3===0?"absent":"present"])), via: "manual" },
  ]);
  const [activeSession, setActiveSession] = useState(null);
  const [currentStudentId, setCurrentStudentId] = useState(INITIAL_STUDENTS[0].id);

  if (!user) {
    return (
      <div className="w-full min-h-screen" style={{ background: T.bg }}>
        <style>{FONTS}</style>
        <Login onEnter={(u) => {
          setUser(u);
          if (u.role === "student") {
            const match = students.find((s) => s.name.toLowerCase() === u.name.toLowerCase());
            if (match) setCurrentStudentId(match.id);
            else {
              const created = { id: Date.now(), name: u.name, roll: "NEW", email: u.email, attendance: Object.fromEntries(SUBJECTS.map((s) => [s.id, { p: 0, t: 0 }])) };
              setStudents((prev) => [created, ...prev]);
              setCurrentStudentId(created.id);
            }
          }
        }} />
      </div>
    );
  }

  const roleMeta = {
    student: { icon: GraduationCap, label: "Student" },
    faculty: { icon: ClipboardList, label: "Faculty" },
    admin: { icon: ShieldCheck, label: "Admin" },
  }[user.role];

  return (
    <div className="w-full min-h-screen" style={{ background: T.bg, fontFamily: "Inter, sans-serif" }}>
      <style>{FONTS}</style>
      <header className="sticky top-0 z-10 px-5 py-3.5 flex items-center justify-between flex-wrap gap-3"
        style={{ background: T.bgSoft, borderBottom: `1px solid ${T.border}` }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: T.gold }}>
            <BookOpen size={16} color="#1B160A" />
          </div>
          <div style={{ fontFamily: "Fraunces, serif", color: T.text }} className="font-semibold leading-none">Roll Call</div>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone="gold"><roleMeta.icon size={11} className="inline -mt-0.5 mr-1" />{roleMeta.label}</Badge>
          <div className="text-right hidden sm:block">
            <div style={{ color: T.text }} className="text-sm leading-none">{user.name}</div>
            <div style={{ color: T.textFaint }} className="text-xs">{user.email}</div>
          </div>
          <button onClick={() => setUser(null)} className="p-2 rounded-lg" style={{ border: `1px solid ${T.border}` }}>
            <LogOut size={15} color={T.textMuted} />
          </button>
        </div>
      </header>

      <main className="px-5 py-6 max-w-5xl mx-auto">
        {user.role === "faculty" && (
          <FacultyView students={students} setStudents={setStudents} sessions={sessions} setSessions={setSessions}
            activeSession={activeSession} setActiveSession={setActiveSession} />
        )}
        {user.role === "student" && (
          <StudentView students={students} currentId={currentStudentId} setCurrentId={setCurrentStudentId}
            sessions={sessions} setSessions={setSessions} activeSession={activeSession} setActiveSession={setActiveSession} />
        )}
        {user.role === "admin" && (
          <AdminView students={students} setStudents={setStudents} sessions={sessions} />
        )}
      </main>

      <div className="px-5 pb-6 max-w-5xl mx-auto">
        <div style={{ color: T.textFaint }} className="text-[11px] text-center pt-4" >
          Demo build · role switch is simulated in one session · swap in Firebase Auth + Firestore + Gemini API for production
        </div>
      </div>
    </div>
  );
}
