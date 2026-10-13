import type { Dict } from "./ru";

export const en: Dict = {
  lang: "en",
  home: "/en/",
  other: { label: "RU", href: "/" },
  meta: {
    title: "Code&Rose — business management systems run by AI agents",
    description:
      "We study how your business works, find where money and customers slip away, and build a CRM with AI agents and messengers inside. Dushanbe, Khujand.",
  },
  nav: { home: "Home", how: "Approach", system: "System", cases: "Cases", contact: "Contact", cta: "Discuss a project" },
  hero: {
    tag: ["Diagnostics", "AI agents", "Control"],
    title: ["Your whole business", "in one window"],
    sub: "We study how your business works, find where money and customers slip away, and build a CRM with AI agents around it. You see everything and stay in control.",
    primary: "Start with diagnostics",
    secondary: "How it works",
    card: { title: "Already in use", lines: ["FamilyDent, dental clinic", "Matrix, beauty salon"] },
    script: ["More than", "a CRM"],
    feats: [
      { icon: "scan", title: "Diagnostics", text: "We find where money leaks" },
      { icon: "spark", title: "AI agents", text: "They take over routine work" },
      { icon: "chat", title: "Messengers", text: "WhatsApp, Telegram, Instagram" },
      { icon: "chart", title: "Analytics", text: "Numbers for the owner" },
    ],
  },
  marquee: ["Diagnostics", "AI agents", "CRM", "WhatsApp", "Telegram", "Instagram", "Stock", "Bookings", "Analytics"],
  how: {
    eyebrow: "Approach",
    title: ["First we understand.", "Then we build."],
    lead: "We build each system around the processes of one specific business.",
    steps: [
      { title: "Diagnostics", text: "We look at how the business runs and find where money, time and customers are lost." },
      { title: "Solution", text: "We design AI agents and processes for the problems we found." },
      { title: "System", text: "We assemble a CRM with messengers, stock, bookings and analytics." },
      { title: "Support", text: "We stay close, watch the agents and keep improving the system." },
    ],
  },
  system: {
    eyebrow: "System",
    title: ["One system", "instead of ten", "separate tools"],
    rows: [
      { icon: "funnel", title: "CRM and sales pipelines", text: "All customers and deals in one place" },
      { icon: "spark", title: "AI agents", text: "They book, remind and reply around the clock" },
      { icon: "chat", title: "Messengers inside", text: "WhatsApp, Telegram and Instagram in one window" },
      { icon: "box", title: "Stock and bookings", text: "Records without notebooks and spreadsheets" },
      { icon: "chart", title: "Analytics for the owner", text: "Clear numbers across the business" },
    ],
  },
  cases: {
    eyebrow: "Cases",
    title: ["Where the system", "already works"],
    note: "Illustration",
    items: [
      { kind: "Dental clinic · Dushanbe", name: "FamilyDent", text: "We set up AI agents that took routine work off the clinic's administrators." },
      { kind: "Beauty salon", name: "Matrix", text: "We set up AI agents that made the salon's daily work easier." },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: ["Let's start", "with diagnostics"],
    lead: "Tell us about your business and we will show where it loses money and what to do about it.",
    call: "Call us",
    mail: "Email us",
  },
  footer: { place: "Dushanbe, Khujand", line: "AI consulting and management systems" },
};
