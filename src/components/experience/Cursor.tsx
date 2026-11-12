"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Cursor.module.css";

/**
 * Dot + trailing ring. Grows over links/buttons and shows a label for
 * elements with data-cursor="Label". Only on fine pointers, never on touch.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!fine || reduce || !dot || !ring || !label) return;

    document.documentElement.classList.add("cursor-on");
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      ring.classList.add(styles.visible);
      dot.classList.add(styles.visible);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest?.("a, button, [data-cursor]") as HTMLElement | null;
      const text = t?.dataset.cursor ?? "";
      ring.classList.toggle(styles.hover, !!t);
      ring.classList.toggle(styles.labelled, !!text);
      label.textContent = text;
    };
    const down = () => ring.classList.add(styles.press);
    const up = () => ring.classList.remove(styles.press);
    const leave = () => {
      ring.classList.remove(styles.visible);
      dot.classList.remove(styles.visible);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("cursor-on");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className={styles.ring} aria-hidden="true">
        <span ref={labelRef} className={styles.label} />
      </div>
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
    </>
  );
}
