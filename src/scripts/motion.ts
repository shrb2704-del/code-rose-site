import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// на телефоне адресная строка прячется при прокрутке — не пересчитываем из-за этого триггеры
ScrollTrigger.config({ ignoreMobileResize: true });
// блоки проявляются заново при каждом проходе сверху вниз, а не один раз за визит
ScrollTrigger.defaults({ toggleActions: "play none none reset" });

// после обновления страницы начинаем сверху, чтобы вступление было видно
if (!location.hash) {
  // ScrollTrigger сам управляет history.scrollRestoration, поэтому задаём режим через него
  ScrollTrigger.clearScrollMemory("manual");
  scrollTo(0, 0);
}

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

// При «уменьшении движения» в настройках устройства оставляем только мягкое проявление.
mm.add("(prefers-reduced-motion: reduce)", () => {
  gsap.utils.toArray<HTMLElement>(".step, .row, .case, section:not(.hero) h2, .lead, .btns > *").forEach((el) =>
    gsap.from(el, { opacity: 0, duration: 0.8, ease: "power1.out", scrollTrigger: { trigger: el, start: "top 90%" } }),
  );
  gsap.set("#fill", { scaleY: 1 });
});

mm.add(
  { motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 901px)", mouse: "(hover: hover) and (pointer: fine)" },
  (ctx) => {
    const { desktop, mouse } = ctx.conditions as { desktop: boolean; mouse: boolean; motion: boolean };
    if (!(ctx.conditions as { motion: boolean }).motion) return;

    // появление первого экрана
    const intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } })
      .from(".hero .bg", { scale: 1.25, duration: 2.8, ease: "power2.out" })
      .from(".top > *", { opacity: 0, y: -18, duration: 0.9, stagger: 0.08 }, 0.2)
      .from(".tag", { opacity: 0, y: 16, duration: 0.8 }, 0.5)
      .from("h1 .l > span", { yPercent: 115, duration: 1.2, stagger: 0.13 }, 0.55)
      .from(".sub, .cta", { opacity: 0, y: 24, duration: 0.9, stagger: 0.1 }, 1)
      .from(".card", { opacity: 0, x: desktop ? 40 : -40, duration: 1 }, 1.1)
      .from(".f", { opacity: 0, y: 30, scale: 0.92, duration: 0.8, stagger: 0.09, ease: "back.out(1.6)" }, 1.2);
    if (desktop) intro.from(".script", { opacity: 0, duration: 1 }, 1.3);

    // вступление стартует, когда главная картина загрузилась (но не позже чем через 1,5 с)
    const heroImg = document.querySelector<HTMLImageElement>(".hero .bg");
    let started = false;
    const start = () => { if (!started) { started = true; intro.play(0); } };
    if (heroImg?.complete) start();
    else { heroImg?.addEventListener("load", start, { once: true }); setTimeout(start, 1500); }
    // возврат на страницу кнопкой «назад» — проигрываем вступление снова
    addEventListener("pageshow", (e) => { if (e.persisted) { scrollTo(0, 0); intro.restart(); ScrollTrigger.refresh(); } });

    // картина медленно «дышит», карточка парит
    gsap.to(".hero .bg", { scale: desktop ? 1.06 : 1.12, duration: desktop ? 14 : 9, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 2.8 });
    gsap.to(".card", { y: -10, duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 2.2 });

    if (mouse) {
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

    if (desktop) {
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
    } else {
      // телефон: картина первого экрана уезжает и темнеет, пока текст поднимается
      gsap.to(".hero .bg", { yPercent: 14, opacity: 0.35, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

      // линия шагов заполняется по мере прокрутки, шаги выезжают по одному
      gsap.to("#fill", { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".steps", start: "top 75%", end: "bottom 60%", scrub: 0.5 } });
      gsap.utils.toArray<HTMLElement>(".step").forEach((el) => {
        gsap.from(el, { opacity: 0, x: 60, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 86%" } });
        gsap.from(el.querySelector("b"), { scale: 0.3, opacity: 0, duration: 0.7, ease: "back.out(2.2)", scrollTrigger: { trigger: el, start: "top 86%" } });
      });

      // картины блоков раскрываются с увеличения
      gsap.utils.toArray<HTMLElement>(".full .pic").forEach((p) =>
        gsap.fromTo(p, { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "bottom 40%", scrub: 0.6 } }),
      );

      // строки системы влетают поочерёдно с разных сторон, иконки «выпрыгивают»
      gsap.utils.toArray<HTMLElement>(".row").forEach((el, i) => {
        gsap.from(el, { opacity: 0, x: i % 2 ? -70 : 70, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
        gsap.from(el.querySelector("i"), { scale: 0, rotation: -90, duration: 0.7, ease: "back.out(2.4)", delay: 0.15, scrollTrigger: { trigger: el, start: "top 90%" } });
      });

      // кейсы: карточка поднимается, фото внутри плывёт, подпись выезжает
      gsap.utils.toArray<HTMLElement>(".case").forEach((el) => {
        gsap.from(el, { opacity: 0, y: 80, scale: 0.92, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
        gsap.fromTo(el.querySelector("img"), { yPercent: -8, scale: 1.18 }, { yPercent: 8, scale: 1.18, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.from(el.querySelector(".cap"), { y: 50, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.25, scrollTrigger: { trigger: el, start: "top 80%" } });
      });
    }

    gsap.utils.toArray<HTMLElement>("section:not(.hero) .eb, section:not(.hero) h2, .lead").forEach((el) =>
      gsap.from(el, { opacity: 0, y: 40, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }),
    );
    gsap.from(".btns > *", { opacity: 0, y: 30, scale: 0.94, duration: 0.7, stagger: 0.1, ease: "back.out(1.5)", scrollTrigger: { trigger: ".btns", start: "top 92%" } });
  },
);
