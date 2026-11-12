"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Wires up the whole motion system from data attributes, so sections can stay
 * server components:
 *
 *   data-split="chars|words"  text rises in, letter or word at a time
 *   data-intro                hero items, played after the loader
 *   data-fade / data-stagger  fade-up for an element / its children
 *   data-highlight            words light up as you scroll (scrubbed)
 *   data-parallax="0.2"       drifts vertically while scrolling
 *   data-draw                 SVG path draws itself with scroll
 *   data-marquee              infinite band that reacts to scroll velocity
 *   data-magnetic             element leans toward the cursor
 *   data-tilt                 3D tilt + glare following the cursor
 *   data-inview               toggles .is-inview (pauses CSS loops offscreen)
 */
export default function Motion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const cleanups: (() => void)[] = [];

    // ---------- Smooth scroll ----------
    let lenis: Lenis | null = null;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, touchMultiplier: 1.4 });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanups.push(() => {
        gsap.ticker.remove(tick);
        lenis?.destroy();
        delete window.__lenis;
      });
    }

    // In-page anchors go through Lenis.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!a || e.defaultPrevented || a.hasAttribute("data-no-lenis")) return;
      const hash = a.getAttribute("href") ?? "";
      const el = hash === "#top" || hash === "#" ? document.body : document.querySelector<HTMLElement>(hash);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el === document.body ? 0 : el, { duration: 1.5 });
      else if (el === document.body) window.scrollTo(0, 0);
      else el.scrollIntoView();
      if (hash.length > 1) history.replaceState(null, "", hash);
      if (hash === "#main") document.getElementById("main")?.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    cleanups.push(() => document.removeEventListener("click", onClick));

    // ---------- Pointer-driven effects (work even with reduced motion off only) ----------
    if (!reduce && finePointer) {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const strength = Number(el.dataset.magnetic) || 0.35;
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * strength);
          yTo((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });

      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        const max = Number(el.dataset.tilt) || 10;
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
        gsap.set(el, { transformPerspective: 900 });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          ry((px - 0.5) * max * 2);
          rx(-(py - 0.5) * max * 2);
          el.style.setProperty("--mx", `${px * 100}%`);
          el.style.setProperty("--my", `${py * 100}%`);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }

    // Toggle .is-inview so CSS loops only run when visible (cheap on battery).
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.target.classList.toggle("is-inview", en.isIntersecting)),
      { rootMargin: "10% 0px" },
    );
    document.querySelectorAll("[data-inview]").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    if (reduce) {
      document.documentElement.classList.add("motion-reduced");
      return () => cleanups.forEach((fn) => fn());
    }

    const ctx = gsap.context(() => {
      // ---------- Hero intro (after loader) ----------
      const introEls = gsap.utils.toArray<HTMLElement>("[data-intro]");
      const heroName = document.querySelector<HTMLElement>("[data-hero-name]");
      let nameSplit: SplitText | null = null;
      if (heroName) {
        nameSplit = SplitText.create(heroName, { type: "chars", charsClass: "char", mask: "chars" });
        gsap.set(nameSplit.chars, { yPercent: 115, rotate: 6 });
      }
      gsap.set(introEls, { autoAlpha: 0, y: 30 });

      let played = false;
      const playIntro = () => {
        if (played) return;
        played = true;
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        if (nameSplit) {
          tl.to(nameSplit.chars, { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.06 }, 0);
        }
        tl.to(introEls, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.09 }, 0.35);
      };
      if (window.__introStarted) playIntro();
      else window.addEventListener("intro", playIntro, { once: true });
      // Never leave the hero hidden if the loader is interrupted.
      const fallback = window.setTimeout(playIntro, 4500);
      cleanups.push(() => window.clearTimeout(fallback));

      // ---------- Split text reveals ----------
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        const mode = el.dataset.split === "words" ? "words" : "chars";
        SplitText.create(el, {
          type: mode === "chars" ? "words,chars" : "words",
          mask: "words",
          autoSplit: true,
          onSplit(self) {
            const targets = mode === "chars" ? self.chars : self.words;
            return gsap.from(targets, {
              yPercent: 120,
              rotate: mode === "chars" ? 8 : 3,
              duration: mode === "chars" ? 1.1 : 0.9,
              ease: "expo.out",
              stagger: mode === "chars" ? 0.022 : 0.04,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          },
        });
      });

      // ---------- Fades ----------
      gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 40,
          duration: 1.1,
          ease: "power3.out",
          delay: Number(el.dataset.fade) || 0,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
        gsap.from(el.children, {
          autoAlpha: 0,
          y: 34,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // ---------- Scrubbed word highlight ----------
      gsap.utils.toArray<HTMLElement>("[data-highlight]").forEach((el) => {
        SplitText.create(el, {
          type: "words",
          autoSplit: true,
          onSplit(self) {
            return gsap.fromTo(
              self.words,
              { opacity: 0.16 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.1,
                scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 50%", scrub: true },
              },
            );
          },
        });
      });

      // ---------- Parallax ----------
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amt = Number(el.dataset.parallax) || 0.2;
        gsap.fromTo(
          el,
          { yPercent: amt * 100 },
          {
            yPercent: -amt * 100,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      // ---------- Image clip reveal ----------
      gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(18% 18% 18% 18% round 40px)", scale: 1.08 },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            scale: 1,
            duration: 1.6,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      });

      // ---------- SVG path drawing ----------
      gsap.utils.toArray<SVGPathElement>("[data-draw]").forEach((path) => {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: path.closest("[data-draw-scope]") ?? path,
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        });
      });

      // Scroll-progress classes (e.g. process steps lighting up)
      gsap.utils.toArray<HTMLElement>("[data-activate]").forEach((el) => {
        ScrollTrigger.create({ trigger: el, start: "top 65%", toggleClass: "is-active" });
      });

      // ---------- Velocity marquees ----------
      gsap.utils.toArray<HTMLElement>("[data-marquee]").forEach((el) => {
        const track = el.firstElementChild as HTMLElement | null;
        if (!track) return;
        const dir = Number(el.dataset.marquee) || 1;
        let x = 0;
        let skew = 0;
        const update = (_t: number, dtMs: number) => {
          if (!el.classList.contains("is-inview")) return;
          const v = lenis?.velocity ?? 0;
          const half = track.scrollWidth / 2;
          const boost = 1 + Math.min(6, Math.abs(v) * 0.25);
          const sign = v < -0.5 ? -1 : 1;
          x -= dir * sign * 0.06 * boost * dtMs;
          if (x <= -half) x += half;
          if (x > 0) x -= half;
          skew += (Math.max(-10, Math.min(10, v * 0.5)) - skew) * 0.1;
          track.style.transform = `translate3d(${x}px,0,0) skewX(${-skew * dir}deg)`;
        };
        gsap.ticker.add(update);
        cleanups.push(() => gsap.ticker.remove(update));
      });
    });

    // Re-measure after fonts settle.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
