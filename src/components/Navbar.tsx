"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getContactLinks, site } from "@/config/site";
import styles from "./Navbar.module.css";

const NAV = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "focus", label: "Focus" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [tucked, setTucked] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const primaryContact = getContactLinks()[0];

  // Backdrop after scrolling.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Tuck away while reading downwards, return on any upward scroll.
      if (Math.abs(y - last) > 6) {
        setTucked(y > last && y > 400);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active-section indicator.
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const hero = document.getElementById("top");
    const heroIo = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), {
      rootMargin: "-45% 0px -50% 0px",
    });
    if (hero) heroIo.observe(hero);
    return () => {
      io.disconnect();
      heroIo.disconnect();
    };
  }, []);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Mobile menu links: close first, then scroll once the scroll lock has been
  // released (the browser ignores anchor jumps while <html> is overflow:hidden).
  const pendingTarget = useRef<string | null>(null);
  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    pendingTarget.current = id;
    setOpen(false);
  };

  useEffect(() => {
    const id = pendingTarget.current;
    if (open || !id) return;
    pendingTarget.current = null;
    const target = document.getElementById(id);
    if (!target) return;
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ block: "start" });
    history.replaceState(null, "", `#${id}`);
  }, [open]);

  // Mobile menu: Escape to close, focus containment, scroll lock.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a, button") ?? []).concat(
        toggleRef.current ? [toggleRef.current] : [],
      );
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "Tab") {
        const items = focusables();
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => window.innerWidth >= 760 && close(false);

    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.documentElement.style.overflow = "hidden";
    window.__lenis?.stop();
    return () => {
      window.__lenis?.start();
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.documentElement.style.overflow = "";
    };
  }, [open, close]);

  return (
    <header
      className={`${styles.header} ${scrolled || open ? styles.scrolled : ""} ${tucked && !open ? styles.tucked : ""}`}
    >
      <div className={styles.progress} aria-hidden="true" />
      <nav className={`container ${styles.nav}`} aria-label="Primary">
        <a href="#top" className={styles.brand} aria-label={`${site.name} — back to top`}>
          <span className={styles.mark} aria-hidden="true">
            S<span>.</span>
          </span>
          <span className={styles.word}>Shohrux</span>
        </a>

        <ul className={styles.links}>
          {NAV.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={styles.link}
                aria-current={active === item.id ? "location" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.end}>
          {site.availability ? (
            <span className={styles.status}>
              <i aria-hidden="true" />
              {site.availability}
            </span>
          ) : null}
          {primaryContact ? (
            <a
              href={primaryContact.href}
              className={styles.cta}
              {...(primaryContact.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              Get in touch
            </a>
          ) : null}
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
            <span className={styles.burger} data-open={open} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={panelRef}
        className={styles.panel}
        data-open={open}
        hidden={!open}
      >
        <ul className="container">
          {NAV.map((item, i) => (
            <li key={item.id} style={{ "--i": i } as React.CSSProperties}>
              <a href={`#${item.id}`} onClick={(e) => goTo(e, item.id)} data-no-lenis>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
