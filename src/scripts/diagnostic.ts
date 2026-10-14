import { gsap } from "gsap";

// Онлайн-диагностика: быстрые вопросы → чат с ИИ (через n8n) → контакты → результат.
// Ответы ИИ выводятся только через textContent.

type Quick = { id: string; title: string; multi: boolean; options: string[]; other?: string; hint?: string; max?: number };
type Msg = { role: "assistant" | "user"; content: string };
type Summary = { strength: string; points: { title: string; text: string }[]; first_step: string; invite: string };

const root = document.getElementById("dg");
const dataEl = document.getElementById("dg-data");
if (root && dataEl) init(root, JSON.parse(dataEl.textContent || "{}"));

function init(root: HTMLElement, data: { t: any; lang: string; endpoint: string; enabled: boolean; whatsapp: string }) {
  // пока сценарий n8n не запущен, диагностика включается только по адресу с ?diag
  if (!data.enabled && !new URLSearchParams(location.search).has("diag")) return;
  document.documentElement.classList.add("diag-on");
  const t = data.t;
  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const steps = [...root.querySelectorAll<HTMLElement>(".dg-step")];
  const questions: Quick[] = t.quick;
  const session = Math.random().toString(36).slice(2, 12);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let qi = 0;
  let quick: Record<string, string | string[]> = {};
  let chat: Msg[] = [];
  let busy = false;
  let lastFocus: Element | null = null;

  const show = (name: string) => {
    steps.forEach((s) => (s.hidden = s.dataset.step !== name));
    $("dg-back").hidden = !(name === "quick" && qi > 0);
    const total = questions.length + 2;
    const pos = name === "intro" ? 0 : name === "quick" ? qi + 1 : name === "chat" ? questions.length + 1 : total;
    $("dg-progress").style.width = (pos / total) * 100 + "%";
    const cur = steps.find((s) => s.dataset.step === name);
    if (cur && !reduce) gsap.fromTo(cur.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" });
    $("dg-body").scrollTop = 0;
  };

  const open = () => {
    lastFocus = document.activeElement;
    qi = 0; quick = {}; chat = []; $("dg-msgs").textContent = "";
    root.hidden = false;
    document.body.style.overflow = "hidden";
    show("intro");
    if (!reduce) gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    $("dg-start").focus();
  };
  const close = () => {
    root.hidden = true;
    document.body.style.overflow = "";
    (lastFocus as HTMLElement | null)?.focus?.();
  };

  document.querySelectorAll("[data-diag-open]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); open(); }));
  root.querySelectorAll("[data-dg-close]").forEach((b) => b.addEventListener("click", close));
  $("dg-close").addEventListener("click", close);
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !root.hidden) close(); });
  $("dg-start").addEventListener("click", () => { qi = 0; renderQuick(); });
  $("dg-back").addEventListener("click", () => { if (qi > 0) { qi--; renderQuick(); } });

  // ---------- быстрые вопросы ----------
  function renderQuick() {
    const q = questions[qi];
    $("dg-qcount").textContent = `${qi + 1} / ${questions.length}`;
    $("dg-qtitle").textContent = q.title;
    $("dg-qhint").textContent = q.hint || "";
    const box = $("dg-opts");
    box.textContent = "";
    const other = $<HTMLInputElement>("dg-other");
    other.hidden = true;
    other.placeholder = t.otherPlaceholder;
    const prev = quick[q.id];
    const selected = new Set<string>(Array.isArray(prev) ? prev : prev ? [String(prev).split(": ")[0]] : []);
    if (typeof prev === "string" && prev.includes(": ")) other.value = prev.split(": ").slice(1).join(": ");
    else other.value = "";

    q.options.forEach((label) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dg-opt" + (selected.has(label) ? " on" : "");
      b.textContent = label;
      b.setAttribute("aria-pressed", String(selected.has(label)));
      b.addEventListener("click", () => {
        if (q.multi) {
          if (selected.has(label)) selected.delete(label);
          else if (!q.max || selected.size < q.max) selected.add(label);
          [...box.children].forEach((c) => {
            const on = selected.has(c.textContent || "");
            c.classList.toggle("on", on);
            c.setAttribute("aria-pressed", String(on));
          });
          $("dg-qnext").hidden = selected.size === 0;
        } else {
          selected.clear(); selected.add(label);
          [...box.children].forEach((c) => c.classList.toggle("on", c === b));
          if (q.other && label === q.other) {
            other.hidden = false; other.focus();
            $("dg-qnext").hidden = false;
          } else {
            quick[q.id] = label;
            setTimeout(advance, reduce ? 0 : 220);
          }
        }
      });
      box.appendChild(b);
    });
    if (q.other && selected.has(q.other)) other.hidden = false;
    $("dg-qnext").hidden = q.multi ? selected.size === 0 : !(q.other && selected.has(q.other));
    $("dg-qnext").onclick = () => {
      if (q.multi) quick[q.id] = [...selected];
      else {
        const v = other.value.trim();
        quick[q.id] = v ? `${q.other}: ${v}` : String([...selected][0]);
      }
      advance();
    };
    show("quick");
  }

  function advance() {
    if (qi < questions.length - 1) { qi++; renderQuick(); }
    else { show("chat"); askNext(); }
  }

  // ---------- чат ----------
  const addMsg = (m: Msg) => {
    const d = document.createElement("div");
    d.className = "dg-msg " + (m.role === "assistant" ? "ai" : "me");
    d.textContent = m.content;
    $("dg-msgs").appendChild(d);
    if (!reduce) gsap.from(d, { opacity: 0, y: 14, duration: 0.4, ease: "power3.out" });
    d.scrollIntoView({ block: "end", behavior: reduce ? "auto" : "smooth" });
    return d;
  };
  const typing = () => {
    const d = document.createElement("div");
    d.className = "dg-msg ai dg-typing";
    d.setAttribute("aria-label", t.chat.typing);
    d.innerHTML = "<b></b><b></b><b></b>";
    $("dg-msgs").appendChild(d);
    d.scrollIntoView({ block: "end" });
    return d;
  };
  const setBusy = (v: boolean) => {
    busy = v;
    $<HTMLButtonElement>("dg-sendbtn").disabled = v;
    $<HTMLTextAreaElement>("dg-answer").disabled = v;
  };

  async function post(payload: object) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 90000);
    try {
      const r = await fetch(data.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session, lang: data.lang, quick: quickPayload(), chat, ...payload }),
        signal: ctrl.signal,
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "http " + r.status);
      return j;
    } finally { clearTimeout(timer); }
  }

  const quickPayload = () => ({
    niche: quick.niche, team: quick.team, channels: quick.channels || [], records: quick.records, goals: quick.goals || [],
  });

  async function askNext() {
    setBusy(true);
    const dots = typing();
    try {
      const j = await post({ action: "next" });
      dots.remove();
      chat.push({ role: "assistant", content: String(j.reply || "") });
      addMsg(chat[chat.length - 1]);
      if (j.done) setTimeout(() => show("contact"), reduce ? 300 : 1600);
      else { setBusy(false); $("dg-answer").focus(); }
    } catch (e) {
      dots.remove();
      fail(e);
    }
  }

  $("dg-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const box = $<HTMLTextAreaElement>("dg-answer");
    const v = box.value.trim();
    if (!v || busy) return;
    chat.push({ role: "user", content: v.slice(0, 600) });
    addMsg(chat[chat.length - 1]);
    box.value = "";
    askNext();
  });
  $("dg-answer").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $<HTMLFormElement>("dg-form").requestSubmit(); }
  });
  $("dg-skip").addEventListener("click", () => show("contact"));

  // ---------- контакты и результат ----------
  $("dg-contact").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = new FormData(e.target as HTMLFormElement);
    const contact = { name: String(f.get("name") || ""), business: String(f.get("business") || ""), whatsapp: String(f.get("whatsapp") || "") };
    show("loading");
    try {
      const j = await post({ action: "finish", contact, website: String(f.get("website") || "") });
      renderResult(j.summary as Summary, contact.business);
    } catch (err) {
      fail(err, contact);
    }
  });

  function renderResult(s: Summary, business: string) {
    $("dg-strength").textContent = s.strength;
    const list = $("dg-points");
    list.textContent = "";
    s.points.forEach((p) => {
      const li = document.createElement("li");
      li.className = "glass";
      const h = document.createElement("strong"); h.textContent = p.title;
      const tx = document.createElement("p"); tx.textContent = p.text;
      li.append(h, tx);
      list.appendChild(li);
    });
    $("dg-firststep").textContent = s.first_step;
    $("dg-invite").textContent = s.invite;
    const text = `${t.waIntro} ${business ? business + ". " : ""}${s.points.map((p) => p.title).join(", ")}.`;
    $<HTMLAnchorElement>("dg-wa").href = waLink(text);
    show("result");
    if (!reduce) gsap.from("#dg-points li", { opacity: 0, x: 40, duration: 0.6, stagger: 0.12, delay: 0.3, ease: "power3.out" });
  }

  function fail(err: unknown, contact?: { name: string; business: string; whatsapp: string }) {
    const limit = err instanceof Error && err.message === "limit";
    $("dg-errtext").textContent = limit ? t.error.limit : t.error.text;
    const q = quickPayload();
    const lines = [
      t.waIntro,
      contact ? `${contact.name}${contact.business ? ", " + contact.business : ""}` : "",
      `${q.niche || ""} · ${q.team || ""}`,
      (q.channels as string[]).join(", "),
      String(q.records || ""),
      (q.goals as string[]).join(", "),
      ...chat.filter((m) => m.role === "user").map((m) => "— " + m.content),
    ].filter(Boolean);
    $<HTMLAnchorElement>("dg-errwa").href = waLink(lines.join("\n").slice(0, 1800));
    setBusy(false);
    show("error");
  }

  const waLink = (text: string) => `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(text)}`;
}
