"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Loader.module.css";

const NAME = "SHOHRUX".split("");

function startIntro() {
  if (window.__introStarted) return;
  window.__introStarted = true;
  window.dispatchEvent(new Event("intro"));
}

/** Short counter intro; full length on first visit, quick on repeat visits. */
export default function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || reduce) {
      startIntro();
      setGone(true);
      return;
    }
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro-seen") === "1";
      sessionStorage.setItem("intro-seen", "1");
    } catch {}

    const counter = { v: 0 };
    const dur = seen ? 0.6 : 1.7;
    const tl = gsap.timeline({ onComplete: () => setGone(true) });
    tl.from(el.querySelectorAll(`.${styles.letter}`), {
      yPercent: 110,
      duration: seen ? 0.5 : 0.9,
      ease: "expo.out",
      stagger: 0.05,
    })
      .to(
        counter,
        {
          v: 100,
          duration: dur,
          ease: "power2.inOut",
          onUpdate: () => {
            if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        },
        0,
      )
      .to(el.querySelector(`.${styles.bar}`), { scaleX: 1, duration: dur, ease: "power2.inOut" }, 0)
      .to(el.querySelectorAll(`.${styles.letter}`), { yPercent: -110, duration: 0.6, ease: "expo.in", stagger: 0.03 })
      .add(startIntro, "-=0.1")
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 1.0, ease: "expo.inOut" }, "-=0.2");

    return () => {
      tl.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={ref} className={styles.loader} aria-hidden="true">
      <div className={styles.name}>
        {NAME.map((c, i) => (
          <span key={i} className={styles.mask}>
            <span className={styles.letter}>{c}</span>
          </span>
        ))}
      </div>
      <div className={styles.foot}>
        <span>Developer · AI Product Builder</span>
        <span ref={countRef} className={styles.count}>
          000
        </span>
      </div>
      <span className={styles.bar} />
    </div>
  );
}
