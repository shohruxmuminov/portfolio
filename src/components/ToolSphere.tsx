"use client";

import { useEffect, useRef } from "react";
import styles from "./Toolkit.module.css";

type Item = { label: string; group: number };

/**
 * A rotating 3D sphere of tool names. Drag to spin it; it keeps the momentum.
 * Purely visual: the same tools are listed as text next to it.
 */
export default function ToolSphere({ items }: { items: Item[] }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ul = ref.current;
    if (!ul) return;
    const els = Array.from(ul.children) as HTMLElement[];
    const n = els.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const base = els.map((_, i) => {
      const y = 1 - (2 * (i + 0.5)) / n;
      const r = Math.sqrt(1 - y * y);
      return [Math.cos(i * golden) * r, y, Math.sin(i * golden) * r];
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fit = () => ul.clientWidth / (ul.clientWidth < 440 ? 3.3 : 2.4);
    let radius = fit();
    let ax = 0.3;
    let ay = 0;
    let vx = 0;
    let vy = reduce ? 0 : 0.0035;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let visible = false;
    let raf = 0;

    const render = () => {
      const cx = Math.cos(ax);
      const sx = Math.sin(ax);
      const cy = Math.cos(ay);
      const sy = Math.sin(ay);
      base.forEach(([x, y, z], i) => {
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const depth = (z2 + 1) / 2; // 0 back, 1 front
        const el = els[i];
        el.style.transform = `translate3d(${x1 * radius}px, ${y2 * radius}px, ${z2 * radius}px) translate(-50%, -50%) scale(${0.65 + depth * 0.55})`;
        el.style.opacity = String(0.18 + depth * 0.82);
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.filter = depth < 0.35 ? `blur(${(0.35 - depth) * 4}px)` : "";
      });
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      if (!dragging) {
        vx *= 0.95;
        vy += ((reduce ? 0 : 0.0035) - vy) * 0.02;
      }
      ax += vx;
      ay += vy;
      ax = Math.max(-1.2, Math.min(1.2, ax));
      render();
    };

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      ul.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      vy = (e.clientX - lastX) * 0.004;
      vx = -(e.clientY - lastY) * 0.004;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const up = () => (dragging = false);
    const onResize = () => {
      radius = fit();
      render();
    };

    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(ul);
    ul.addEventListener("pointerdown", down);
    ul.addEventListener("pointermove", move);
    ul.addEventListener("pointerup", up);
    ul.addEventListener("pointercancel", up);
    window.addEventListener("resize", onResize);
    ul.dataset.ready = "true";
    render();
    loop();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ul.removeEventListener("pointerdown", down);
      ul.removeEventListener("pointermove", move);
      ul.removeEventListener("pointerup", up);
      ul.removeEventListener("pointercancel", up);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <ul ref={ref} className={styles.sphere} aria-hidden="true" data-cursor="Drag">
      {items.map((it) => (
        <li key={it.label} className={styles.tag} data-group={it.group}>
          {it.label}
        </li>
      ))}
    </ul>
  );
}
