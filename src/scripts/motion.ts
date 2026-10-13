import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// шапка: стеклянная подложка после начала прокрутки
const top = document.getElementById("top")!;
const onScroll = () => top.classList.toggle("stuck", scrollY > 40);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// мобильное меню
const burger = document.getElementById("burger")!;
const nav = document.getElementById("nav")!;
const setMenu = (open: boolean) => {
  nav.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
};
burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.addEventListener("click", (e) => (e.target as HTMLElement).closest("a") && setMenu(false));

const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => {
  // появление первого экрана
  gsap.timeline({ defaults: { ease: "expo.out" } })
    .from(".hero .bg", { scale: 1.18, duration: 2.6, ease: "power2.out" })
    .from(".top > *", { opacity: 0, y: -18, duration: 0.9, stagger: 0.08 }, 0.2)
    .from(".tag", { opacity: 0, y: 16, duration: 0.8 }, 0.5)
    .from("h1 .l > span", { yPercent: 115, duration: 1.2, stagger: 0.13 }, 0.55)
    .from(".sub, .cta", { opacity: 0, y: 20, duration: 0.9, stagger: 0.1 }, 1)
    .from(".card", { opacity: 0, x: 40, duration: 1 }, 1.1)
    .from(".script", { opacity: 0, duration: 1 }, 1.3)
    .from(".f", { opacity: 0, y: 22, duration: 0.8, stagger: 0.07 }, 1.2);

  // картина медленно «дышит», карточка парит
  gsap.to(".hero .bg", { scale: 1.06, duration: 14, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 2.6 });
  gsap.to(".card", { y: -10, duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 2.2 });

  // параллакс за курсором, только там, где есть мышь
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const bgX = gsap.quickTo(".hero .bg", "x", { duration: 1.4, ease: "power2.out" });
    const bgY = gsap.quickTo(".hero .bg", "y", { duration: 1.4, ease: "power2.out" });
    const cardX = gsap.quickTo(".card", "x", { duration: 1.4, ease: "power2.out" });
    addEventListener("pointermove", (e) => {
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;
      bgX(-x * 34);
      bgY(-y * 22);
      cardX(x * 22);
    });
  }

  // первый экран уходит при прокрутке
  gsap.to(".hero .copy, .hero .script", {
    opacity: 0, yPercent: -8, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "70% top", scrub: true },
  });

  // картины секций плывут медленнее прокрутки
  gsap.utils.toArray<HTMLElement>(".full .pic").forEach((p) =>
    gsap.fromTo(p, { yPercent: -7 }, {
      yPercent: 7, ease: "none",
      scrollTrigger: { trigger: p.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    }),
  );

  gsap.utils.toArray<HTMLElement>("section:not(.hero) .eb, h2, .lead").forEach((el) =>
    gsap.from(el, { opacity: 0, y: 36, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }),
  );

  const wave = document.querySelector<SVGPathElement>("#wp");
  if (wave) {
    const len = wave.getTotalLength();
    gsap.fromTo(wave, { strokeDasharray: len, strokeDashoffset: len }, {
      strokeDashoffset: 0, ease: "none",
      scrollTrigger: { trigger: ".steps", start: "top 85%", end: "top 30%", scrub: 0.8 },
    });
  }
  gsap.from(".step", { opacity: 0, y: 60, duration: 0.9, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".steps", start: "top 82%" } });
  gsap.from(".row", { opacity: 0, x: 70, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".rows", start: "top 80%" } });
  gsap.from(".case", { opacity: 0, y: 70, scale: 0.95, duration: 1, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".two", start: "top 82%" } });
  gsap.from(".btns > *", { opacity: 0, y: 24, duration: 0.7, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ".btns", start: "top 92%" } });
});
